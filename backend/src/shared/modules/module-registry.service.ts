export interface ModuleDescriptor {
  name: string;
  version: string;
  routesPrefix: string;
  permissions: string[];
  eventsPublished: string[];
  dependencies: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'DEGRADED';
}

export class ModuleRegistryService {
  private static modules = new Map<string, ModuleDescriptor>();

  public static register(descriptor: ModuleDescriptor): void {
    this.modules.set(descriptor.name, descriptor);
  }

  public static get(name: string): ModuleDescriptor | undefined {
    return this.modules.get(name);
  }

  public static getAll(): ModuleDescriptor[] {
    return Array.from(this.modules.values());
  }

  public static getHealthReport(): Record<string, string> {
    const report: Record<string, string> = {};
    for (const [name, desc] of this.modules.entries()) {
      report[name] = desc.status;
    }
    return report;
  }
}

// Initial Registration of Core System Modules
ModuleRegistryService.register({
  name: 'AuthModule',
  version: '1.0.0',
  routesPrefix: '/api/v1/auth',
  permissions: ['school.create', 'user.create'],
  eventsPublished: ['user.registered', 'school.registered'],
  dependencies: [],
  status: 'ACTIVE',
});

ModuleRegistryService.register({
  name: 'AuditModule',
  version: '1.0.0',
  routesPrefix: '/api/v1/audit-logs',
  permissions: ['audit.view'],
  eventsPublished: ['audit_log.recorded'],
  dependencies: ['AuthModule'],
  status: 'ACTIVE',
});
