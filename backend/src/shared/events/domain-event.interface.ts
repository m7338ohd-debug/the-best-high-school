export interface IDomainEvent<T = unknown> {
  eventId: string;
  eventName: string;
  domain: 'auth' | 'school' | 'user' | 'student' | 'finance' | 'receipt' | 'notification' | 'audit' | 'settings' | 'report';
  tenantId: string;
  actorId?: string;
  correlationId: string;
  timestamp: string;
  payload: T;
}

export class BaseDomainEvent<T = unknown> implements IDomainEvent<T> {
  public readonly eventId: string;
  public readonly eventName: string;
  public readonly domain: IDomainEvent['domain'];
  public readonly tenantId: string;
  public readonly actorId?: string;
  public readonly correlationId: string;
  public readonly timestamp: string;
  public readonly payload: T;

  constructor(
    eventName: string,
    domain: IDomainEvent['domain'],
    tenantId: string,
    payload: T,
    actorId?: string,
    correlationId?: string
  ) {
    this.eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    this.eventName = eventName;
    this.domain = domain;
    this.tenantId = tenantId;
    this.actorId = actorId;
    this.correlationId = correlationId || `corr_${Date.now()}`;
    this.timestamp = new Date().toISOString();
    this.payload = payload;
  }
}
