import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/sequelize.js';
import { BaseModel, baseModelAttributes } from '../../../database/base.model.js';

export interface SectionAttributes {
  id: string;
  tenantId: string;
  classId: string;
  sectionName: string; // e.g. "A", "B", "Blue"
  capacity: number;
  roomNumber?: string;
  displayOrder: number;
  isActive: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class SectionModel extends BaseModel<SectionAttributes, Partial<SectionAttributes>> implements SectionAttributes {
  declare classId: string;
  declare sectionName: string;
  declare capacity: number;
  declare roomNumber?: string;
  declare displayOrder: number;
  declare isActive: boolean;
}

SectionModel.init(
  {
    ...baseModelAttributes,
    classId: { type: DataTypes.UUID, allowNull: false, field: 'class_id' },
    sectionName: { type: DataTypes.STRING, allowNull: false, field: 'section_name' },
    capacity: { type: DataTypes.INTEGER, defaultValue: 40 },
    roomNumber: { type: DataTypes.STRING, allowNull: true, field: 'room_number' },
    displayOrder: { type: DataTypes.INTEGER, defaultValue: 1, field: 'display_order' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
  },
  {
    sequelize,
    tableName: 'sections',
    modelName: 'Section',
    indexes: [{ fields: ['tenant_id'] }, { fields: ['class_id'] }],
  }
);
