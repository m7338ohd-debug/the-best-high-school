import { EventEmitter } from 'events';
import { LoggerService } from '../logger/logger.service.js';

export enum DomainEvents {
  USER_REGISTERED = 'user.registered',
  USER_LOGGED_IN = 'user.logged_in',
  USER_UPDATED = 'user.updated',
  SCHOOL_REGISTERED = 'school.registered',
  SCHOOL_UPDATED = 'school.updated',
  STUDENT_CREATED = 'student.created',
  STUDENT_UPDATED = 'student.updated',
  FEE_COLLECTED = 'fee.collected',
  RECEIPT_GENERATED = 'receipt.generated',
  NOTIFICATION_SENT = 'notification.sent',
  AUDIT_LOG_RECORDED = 'audit_log.recorded',
}

export interface DomainEventPayload<T = unknown> {
  eventId: string;
  eventName: string;
  tenantId: string;
  actorId?: string;
  timestamp: string;
  data: T;
}

export class EventBus {
  private static instance: EventBus;
  private emitter: EventEmitter;

  private constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(100);
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Publishes an asynchronous event to all registered subscribers without blocking the caller.
   */
  public publish<T>(eventName: string, payload: DomainEventPayload<T>): void {
    setImmediate(() => {
      try {
        LoggerService.debug(`[EventBus] Publishing event: ${eventName}`, { eventId: payload.eventId });
        this.emitter.emit(eventName, payload);
      } catch (error) {
        LoggerService.error(`[EventBus] Error publishing event ${eventName}:`, error);
      }
    });
  }

  /**
   * Subscribes a handler function to a specific event.
   */
  public subscribe<T>(eventName: string, handler: (payload: DomainEventPayload<T>) => Promise<void> | void): void {
    this.emitter.on(eventName, async (payload: DomainEventPayload<T>) => {
      try {
        await handler(payload);
      } catch (error) {
        LoggerService.error(`[EventBus] Error executing subscriber for ${eventName}:`, error, { eventId: payload.eventId });
      }
    });
  }
}

export const eventBus = EventBus.getInstance();
