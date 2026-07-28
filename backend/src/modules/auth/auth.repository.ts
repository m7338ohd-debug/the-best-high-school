import { UserModel, UserAttributes } from '../users/models/user.model.js';
import { SchoolModel, SchoolAttributes } from '../schools/models/school.model.js';
import { IBaseRepository } from '../../shared/interfaces/base-repository.interface.js';

export class AuthRepository implements IBaseRepository<UserModel> {
  async findById(id: string): Promise<UserModel | null> {
    return UserModel.findByPk(id);
  }

  async findByEmail(email: string, tenantId?: string): Promise<UserModel | null> {
    const whereClause: Record<string, unknown> = { email };
    if (tenantId) whereClause.tenantId = tenantId;
    return UserModel.findOne({ where: whereClause });
  }

  async findSchoolByCode(code: string): Promise<SchoolModel | null> {
    return SchoolModel.findOne({ where: { code } });
  }

  async findAll(filter?: Record<string, unknown>): Promise<UserModel[]> {
    return UserModel.findAll({ where: filter });
  }

  async findAndCountAll(options: { page: number; limit: number; search?: string; filter?: Record<string, unknown> }): Promise<{ items: UserModel[]; total: number }> {
    const { count, rows } = await UserModel.findAndCountAll({
      where: options.filter,
      limit: options.limit,
      offset: (options.page - 1) * options.limit,
    });
    return { items: rows, total: count };
  }

  async create(data: Partial<UserAttributes>): Promise<UserModel> {
    return UserModel.create(data as UserAttributes);
  }

  async createSchool(data: Partial<SchoolAttributes>): Promise<SchoolModel> {
    return SchoolModel.create(data as SchoolAttributes);
  }

  async update(id: string, data: Partial<UserAttributes>): Promise<UserModel | null> {
    const user = await this.findById(id);
    if (!user) return null;
    return user.update(data);
  }

  async softDelete(id: string): Promise<boolean> {
    const deleted = await UserModel.destroy({ where: { id } });
    return deleted > 0;
  }
}
