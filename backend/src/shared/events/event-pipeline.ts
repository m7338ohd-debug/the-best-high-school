import { IDomainEvent } from './domain-event.interface.js';
import { LoggerService } from '../logger/logger.service.js';

export interface RetryPolicy {
  maxRetries: number;
  backoffMs: number;
}

export class DeadLetterQueue {
  private static dlqStore: Array<{ event: IDomainEvent; error: string; timestamp: string }> = [];

  public static push(event: IDomainEvent, error: Error | unknown): void {
    const errMessage = error instanceof Error ? error.message : String(error);
    this.dlqStore.push({
      event,
      error: errMessage,
      timestamp: new Date().toISOString(),
    });
    LoggerService.error(`[DLQ] Event moved to Dead Letter Queue: ${event.eventName}`, error, { eventId: event.eventId });
  }

  public static getDLQEvents() {
    return [...this.dlqStore];
  }
}

export class EventPipeline {
  private static defaultRetryPolicy: RetryPolicy = {
    maxRetries: 3,
    backoffMs: 1000,
  };

  /**
   * Executes an event handler with exponential backoff retry and DLQ fallback.
   */
  public static async executeWithRetry<T>(
    event: IDomainEvent<T>,
    handler: (event: IDomainEvent<T>) => Promise<void>,
    policy: RetryPolicy = this.defaultRetryPolicy
  ): Promise<void> {
    let attempt = 0;
    while (attempt < policy.maxRetries) {
      try {
        await handler(event);
        return;
      } catch (error) {
        attempt++;
        LoggerService.warn(`[EventPipeline] Retry attempt ${attempt}/${policy.maxRetries} for ${event.eventName}`, { eventId: event.eventId });
        if (attempt >= policy.maxRetries) {
          DeadLetterQueue.push(event, error);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, policy.backoffMs * Math.pow(2, attempt - 1)));
      }
    }
  }
}
