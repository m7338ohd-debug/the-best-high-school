import { Model, DataTypes } from 'sequelize';

export abstract class BaseModel<TModelAttributes extends object, TCreationAttributes extends object> extends Model<
  TModelAttributes,
  TCreationAttributes
> {
  declare id: string;
  declare tenantId: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare createdBy: string | null;
  declare updatedBy: string | null;
  declare deletedAt: Date | null;
}

export const baseModelAttributes = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tenantId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'tenant_id',
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'created_by',
  },
  updatedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'updated_by',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updated_at',
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_at',
  },
};
