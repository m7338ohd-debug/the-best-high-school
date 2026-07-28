import { Model, ModelStatic, Transaction, WhereOptions, FindOptions } from 'sequelize';
import { TenantContext } from '../context/tenant.context.js';
import { sequelize } from '../../database/sequelize.js';

export abstract class BaseRepository<M extends Model> {
  protected model: ModelStatic<M>;

  constructor(model: ModelStatic<M>) {
    this.model = model;
  }

  /**
   * Helper to ensure tenant context is bound if column exists on model
   */
  protected withTenant(where: WhereOptions = {}): WhereOptions {
    const tenantId = TenantContext.getTenantId();
    return {
      ...(where as object),
      tenantId,
    } as WhereOptions;
  }

  async findById(id: string, options?: FindOptions): Promise<M | null> {
    return this.model.findOne({
      where: this.withTenant({ id }),
      ...options,
    });
  }

  async findOne(options: FindOptions): Promise<M | null> {
    return this.model.findOne({
      ...options,
      where: this.withTenant(options.where || {}),
    });
  }

  async findOneBy(where: WhereOptions): Promise<M | null> {
    return this.model.findOne({
      where: this.withTenant(where),
    });
  }

  async findAll(options?: FindOptions): Promise<M[]> {
    return this.model.findAll({
      ...options,
      where: this.withTenant(options?.where || {}),
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.model.count({
      where: this.withTenant({ id }),
    });
    return count > 0;
  }

  async existsBy(where: WhereOptions): Promise<boolean> {
    const count = await this.model.count({
      where: this.withTenant(where),
    });
    return count > 0;
  }

  async create(data: Partial<M['_creationAttributes']>, transaction?: Transaction): Promise<M> {
    const tenantId = TenantContext.getTenantId();
    return this.model.create(
      {
        ...(data as object),
        tenantId,
      } as M['_creationAttributes'],
      { transaction }
    );
  }

  async bulkCreate(data: Array<Partial<M['_creationAttributes']>>, transaction?: Transaction): Promise<M[]> {
    const tenantId = TenantContext.getTenantId();
    const records = data.map((d) => ({
      ...(d as object),
      tenantId,
    }));
    return this.model.bulkCreate(records as M['_creationAttributes'][], { transaction });
  }

  async update(id: string, data: Partial<M['_attributes']>, transaction?: Transaction): Promise<M | null> {
    const record = await this.findById(id);
    if (!record) return null;
    return record.update(data as object, { transaction });
  }

  async bulkUpdate(where: WhereOptions, data: Partial<M['_attributes']>, transaction?: Transaction): Promise<number> {
    const [affectedCount] = await this.model.update(data as object, {
      where: this.withTenant(where),
      transaction,
    });
    return affectedCount;
  }

  async delete(id: string, transaction?: Transaction): Promise<boolean> {
    const deletedCount = await this.model.destroy({
      where: this.withTenant({ id }),
      force: true, // hard delete
      transaction,
    });
    return deletedCount > 0;
  }

  async bulkDelete(where: WhereOptions, transaction?: Transaction): Promise<number> {
    return this.model.destroy({
      where: this.withTenant(where),
      force: true,
      transaction,
    });
  }

  async softDelete(id: string, transaction?: Transaction): Promise<boolean> {
    const deletedCount = await this.model.destroy({
      where: this.withTenant({ id }),
      transaction,
    });
    return deletedCount > 0;
  }

  async restore(id: string, transaction?: Transaction): Promise<boolean> {
    const record = await this.model.findOne({
      where: this.withTenant({ id }),
      paranoid: false,
    });
    if (!record) return false;
    await record.restore({ transaction });
    return true;
  }

  async count(where: WhereOptions = {}): Promise<number> {
    return this.model.count({
      where: this.withTenant(where),
    });
  }

  async paginate(page = 1, limit = 10, where: WhereOptions = {}, options?: FindOptions) {
    const offset = (page - 1) * limit;
    const { count, rows } = await this.model.findAndCountAll({
      where: this.withTenant(where),
      limit,
      offset,
      ...options,
    });
    return { items: rows, totalRecords: count, page, pageSize: limit };
  }

  async search(searchQuery: string, searchFields: string[], page = 1, limit = 10) {
    const { Op } = await import('sequelize');
    const orConditions = searchFields.map((field) => ({
      [field]: { [Op.iLike]: `%${searchQuery}%` },
    }));

    const where: WhereOptions = {
      [Op.or]: orConditions,
    };

    return this.paginate(page, limit, where);
  }

  async upsert(data: Partial<M['_creationAttributes']>, transaction?: Transaction) {
    const tenantId = TenantContext.getTenantId();
    return this.model.upsert(
      {
        ...(data as object),
        tenantId,
      } as M['_creationAttributes'],
      { transaction }
    );
  }

  async transaction<T>(autoCallback: (t: Transaction) => Promise<T>): Promise<T> {
    return sequelize.transaction(autoCallback);
  }

  async lockRow(id: string, transaction: Transaction): Promise<M | null> {
    return this.model.findOne({
      where: this.withTenant({ id }),
      transaction,
      lock: Transaction.LOCK.UPDATE,
    });
  }
}
