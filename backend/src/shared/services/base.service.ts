import { ZodSchema } from 'zod';
import { BaseRepository } from '../repositories/base.repository.js';
import { Model } from 'sequelize';
import { PaginationFormatter, PaginatedResponseDTO } from '../pagination/paginated-response.dto.js';
import { TenantContext } from '../context/tenant.context.js';
import { LoggerService } from '../logger/logger.service.js';
import { BadRequestError, NotFoundError } from '../errors/api.error.js';
import { eventBus, DomainEvents } from '../events/event-bus.js';

export abstract class BaseService<M extends Model, R extends BaseRepository<M>> {
  protected repository: R;

  constructor(repository: R) {
    this.repository = repository;
  }

  /**
   * Helper to validate input DTO against a Zod schema.
   */
  protected validate<T>(schema: ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new BadRequestError('Validation failed', result.error.flatten().fieldErrors);
    }
    return result.data;
  }

  /**
   * Ensures active tenant context exists before performing domain actions.
   */
  protected ensureTenant(): string {
    return TenantContext.getTenantId();
  }

  /**
   * Helper to publish audit events across the platform.
   */
  protected publishAudit(action: string, entity: string, entityId: string, details?: Record<string, unknown>): void {
    const tenantId = this.ensureTenant();
    const context = TenantContext.get();

    eventBus.publish(DomainEvents.AUDIT_LOG_RECORDED, {
      eventId: `audit_${Date.now()}`,
      eventName: DomainEvents.AUDIT_LOG_RECORDED,
      tenantId,
      actorId: context?.userId,
      timestamp: new Date().toISOString(),
      data: {
        action,
        entity,
        entityId,
        actorName: context?.userId || 'System',
        actorRole: context?.role || 'SYSTEM',
        details,
      },
    });

    LoggerService.audit(action, context?.userId || 'SYSTEM', tenantId, { entity, entityId, ...details });
  }

  /**
   * Universal Paginated Query Runner.
   */
  public async getPaginated(
    page = 1,
    limit = 10,
    filter: Record<string, unknown> = {},
    sorting?: { field: string; direction: 'ASC' | 'DESC' }
  ): Promise<PaginatedResponseDTO<M>> {
    const { items, totalRecords } = await this.repository.paginate(page, limit, filter);
    return PaginationFormatter.format(items, totalRecords, page, limit, sorting, filter);
  }

  /**
   * Fetch entity by ID or throw NotFoundError.
   */
  public async getByIdOrThrow(id: string, entityName = 'Resource'): Promise<M> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundError(`${entityName} with ID '${id}' not found`);
    }
    return entity;
  }
}
