import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface BrandingAttributes {
  id: string;
  tenantId: string;
  logoUrl?: string;
  bannerUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  schoolMotto?: string;
  receiptHeader?: string;
  receiptFooter?: string;
  emailHeader?: string;
  emailFooter?: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class BrandingModel extends BaseModel<BrandingAttributes, Partial<BrandingAttributes>> implements BrandingAttributes {
  declare logoUrl?: string;
  declare bannerUrl?: string;
  declare faviconUrl?: string;
  declare primaryColor?: string;
  declare secondaryColor?: string;
  declare accentColor?: string;
  declare schoolMotto?: string;
  declare receiptHeader?: string;
  declare receiptFooter?: string;
  declare emailHeader?: string;
  declare emailFooter?: string;
}

BrandingModel.init(
  {
    ...baseModelAttributes,
    logoUrl: { type: DataTypes.STRING, allowNull: true, field: 'logo_url' },
    bannerUrl: { type: DataTypes.STRING, allowNull: true, field: 'banner_url' },
    faviconUrl: { type: DataTypes.STRING, allowNull: true, field: 'favicon_url' },
    primaryColor: { type: DataTypes.STRING, defaultValue: '#4f46e5', field: 'primary_color' },
    secondaryColor: { type: DataTypes.STRING, defaultValue: '#0f172a', field: 'secondary_color' },
    accentColor: { type: DataTypes.STRING, defaultValue: '#10b981', field: 'accent_color' },
    schoolMotto: { type: DataTypes.TEXT, allowNull: true, field: 'school_motto' },
    receiptHeader: { type: DataTypes.TEXT, allowNull: true, field: 'receipt_header' },
    receiptFooter: { type: DataTypes.TEXT, allowNull: true, field: 'receipt_footer' },
    emailHeader: { type: DataTypes.TEXT, allowNull: true, field: 'email_header' },
    emailFooter: { type: DataTypes.TEXT, allowNull: true, field: 'email_footer' },
  },
  {
    sequelize,
    tableName: 'school_brandings',
    modelName: 'Branding',
    indexes: [{ fields: ['tenant_id'] }],
  }
);
