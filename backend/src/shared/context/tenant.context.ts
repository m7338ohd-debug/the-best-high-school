import { AsyncLocalStorage } from 'async_hooks';

export interface ITenantContext {
  tenantId: string;
  userId?: string;
  role?: string;
  schoolName?: string;
}

export class TenantContext {
  private static readonly storage = new AsyncLocalStorage<ITenantContext>();

  /**
   * Run a function with the specified tenant context bound to the async execution scope.
   */
  public static run<R>(context: ITenantContext, fn: () => R): R {
    return this.storage.run(context, fn);
  }

  /**
   * Get the current request's tenant context.
   */
  public static get(): ITenantContext | undefined {
    return this.storage.getStore();
  }

  /**
   * Get the current active tenant ID or throw if context is uninitialized.
   */
  public static getTenantId(): string {
    const store = this.storage.getStore();
    if (!store || !store.tenantId) {
      throw new Error('Tenant context is not initialized for the current request scope');
    }
    return store.tenantId;
  }
}
