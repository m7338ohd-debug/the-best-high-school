import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';

export interface TenantAttributes {
  id: string;
  schoolName: string;
  board: string;
  plan: 'TRIAL' | 'BASIC' | 'PRO' | 'ENTERPRISE';
  licenseKey: string;
  adminName: string;
  adminEmail: string;
  maxStudents: number;
  status: 'ACTIVE' | 'DEACTIVATED';
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type TenantCreationAttributes = Optional<TenantAttributes, 'id' | 'status' | 'deletedAt'>;

export class TenantModel extends Model<TenantAttributes, TenantCreationAttributes> implements TenantAttributes {
  public id!: string;
  public schoolName!: string;
  public board!: string;
  public plan!: 'TRIAL' | 'BASIC' | 'PRO' | 'ENTERPRISE';
  public licenseKey!: string;
  public adminName!: string;
  public adminEmail!: string;
  public maxStudents!: number;
  public status!: 'ACTIVE' | 'DEACTIVATED';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

TenantModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    schoolName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'school_name',
    },
    board: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'board',
    },
    plan: {
      type: DataTypes.ENUM('TRIAL', 'BASIC', 'PRO', 'ENTERPRISE'),
      allowNull: false,
      defaultValue: 'ENTERPRISE',
      field: 'plan',
    },
    licenseKey: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'license_key',
    },
    adminName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'admin_name',
    },
    adminEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'admin_email',
    },
    maxStudents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2500,
      field: 'max_students',
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'DEACTIVATED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
      field: 'status',
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at',
    },
  },
  {
    sequelize,
    tableName: 'tenants',
    timestamps: true,
    paranoid: false,
    underscored: true,
  }
);
