import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface SchoolAttributes {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  email: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
  isActive: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class SchoolModel extends BaseModel<SchoolAttributes, Partial<SchoolAttributes>> implements SchoolAttributes {
  declare name: string;
  declare code: string;
  declare email: string;
  declare phone?: string;
  declare address?: string;
  declare logoUrl?: string;
  declare isActive: boolean;
}

SchoolModel.init(
  {
    ...baseModelAttributes,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'logo_url',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    tableName: 'schools',
    modelName: 'School',
    indexes: [
      { fields: ['tenant_id'] },
      { fields: ['code'], unique: true },
    ],
  }
);
