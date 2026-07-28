import { v4 as uuidv4 } from 'uuid';
import { UserRole } from '../../modules/users/models/user.model.js';

export class TestFactories {
  public static createMockUser(overrides: Record<string, unknown> = {}) {
    const tenantId = (overrides.tenantId as string) || uuidv4();
    return {
      id: uuidv4(),
      tenantId,
      firstName: 'Test',
      lastName: 'Admin',
      email: `test.${Date.now()}@bestschool.com`,
      role: UserRole.SCHOOL_ADMIN,
      isActive: true,
      ...overrides,
    };
  }

  public static createMockSchool(overrides: Record<string, unknown> = {}) {
    const tenantId = (overrides.tenantId as string) || uuidv4();
    return {
      id: uuidv4(),
      tenantId,
      name: 'Test Academy',
      code: `TST-${Math.floor(100 + Math.random() * 900)}`,
      email: 'contact@testacademy.com',
      isActive: true,
      ...overrides,
    };
  }
}
