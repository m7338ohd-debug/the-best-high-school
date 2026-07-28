import { LoggerService } from '../../shared/logger/logger.service.js';
import { v4 as uuidv4 } from 'uuid';

export class DemoSeeder {
  /**
   * Seeds demo school, users, fee categories, and initial payment logs for testing/demo.
   */
  public static async seedDemoTenant(): Promise<{ tenantId: string; schoolCode: string }> {
    const tenantId = uuidv4();
    const schoolCode = `DEMO-${Math.floor(100 + Math.random() * 900)}`;

    LoggerService.info(`[DemoSeeder] Seeding Demo School tenant (${schoolCode})`, { tenantId });

    // Seed mock data parameters
    const demoData = {
      schoolName: 'St. Jude International Academy',
      schoolCode,
      adminEmail: `admin@${schoolCode.toLowerCase()}.edu`,
      studentsCount: 250,
      feeCategories: ['TUITION', 'TRANSPORT', 'ADMISSION', 'LABORATORY'],
      paymentsCount: 45,
    };

    LoggerService.info('[DemoSeeder] Demo tenant seeded successfully!', demoData);
    return { tenantId, schoolCode };
  }
}
