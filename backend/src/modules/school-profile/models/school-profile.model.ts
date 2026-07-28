import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface SchoolProfileAttributes {
  id: string;
  tenantId: string;
  schoolName: string;
  schoolCode: string;
  registrationNumber?: string;
  affiliationNumber?: string;
  board?: string;
  schoolType?: string;
  establishedYear?: number;
  principalName?: string;
  contactPerson?: string;
  phone?: string;
  alternatePhone?: string;
  email: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  logoUrl?: string;
  bannerUrl?: string;
  faviconUrl?: string;
  schoolStatus: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  subscriptionStatus: 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class SchoolProfileModel extends BaseModel<SchoolProfileAttributes, Partial<SchoolProfileAttributes>> implements SchoolProfileAttributes {
  declare schoolName: string;
  declare schoolCode: string;
  declare registrationNumber?: string;
  declare affiliationNumber?: string;
  declare board?: string;
  declare schoolType?: string;
  declare establishedYear?: number;
  declare principalName?: string;
  declare contactPerson?: string;
  declare phone?: string;
  declare alternatePhone?: string;
  declare email: string;
  declare website?: string;
  declare address?: string;
  declare city?: string;
  declare state?: string;
  declare country?: string;
  declare postalCode?: string;
  declare latitude?: number;
  declare longitude?: number;
  declare logoUrl?: string;
  declare bannerUrl?: string;
  declare faviconUrl?: string;
  declare schoolStatus: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  declare subscriptionStatus: 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
}

SchoolProfileModel.init(
  {
    ...baseModelAttributes,
    schoolName: { type: DataTypes.STRING, allowNull: false, field: 'school_name' },
    schoolCode: { type: DataTypes.STRING, allowNull: false, field: 'school_code' },
    registrationNumber: { type: DataTypes.STRING, allowNull: true, field: 'registration_number' },
    affiliationNumber: { type: DataTypes.STRING, allowNull: true, field: 'affiliation_number' },
    board: { type: DataTypes.STRING, allowNull: true },
    schoolType: { type: DataTypes.STRING, allowNull: true, field: 'school_type' },
    establishedYear: { type: DataTypes.INTEGER, allowNull: true, field: 'established_year' },
    principalName: { type: DataTypes.STRING, allowNull: true, field: 'principal_name' },
    contactPerson: { type: DataTypes.STRING, allowNull: true, field: 'contact_person' },
    phone: { type: DataTypes.STRING, allowNull: true },
    alternatePhone: { type: DataTypes.STRING, allowNull: true, field: 'alternate_phone' },
    email: { type: DataTypes.STRING, allowNull: false },
    website: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: true },
    country: { type: DataTypes.STRING, allowNull: true },
    postalCode: { type: DataTypes.STRING, allowNull: true, field: 'postal_code' },
    latitude: { type: DataTypes.FLOAT, allowNull: true },
    longitude: { type: DataTypes.FLOAT, allowNull: true },
    logoUrl: { type: DataTypes.STRING, allowNull: true, field: 'logo_url' },
    bannerUrl: { type: DataTypes.STRING, allowNull: true, field: 'banner_url' },
    faviconUrl: { type: DataTypes.STRING, allowNull: true, field: 'favicon_url' },
    schoolStatus: { type: DataTypes.ENUM('ACTIVE', 'SUSPENDED', 'INACTIVE'), defaultValue: 'ACTIVE', field: 'school_status' },
    subscriptionStatus: { type: DataTypes.ENUM('TRIAL', 'ACTIVE', 'EXPIRED', 'CANCELLED'), defaultValue: 'TRIAL', field: 'subscription_status' },
  },
  {
    sequelize,
    tableName: 'school_profiles',
    modelName: 'SchoolProfile',
    indexes: [{ fields: ['tenant_id'] }, { fields: ['school_code'] }],
  }
);
