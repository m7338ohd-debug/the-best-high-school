export interface IBaseRepository<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> {
  findById(id: string): Promise<T | null>;
  findAll(filter?: Record<string, unknown>): Promise<T[]>;
  findAndCountAll(options: { page: number; limit: number; search?: string; filter?: Record<string, unknown> }): Promise<{ items: T[]; total: number }>;
  create(data: CreateDTO): Promise<T>;
  update(id: string, data: UpdateDTO): Promise<T | null>;
  softDelete(id: string): Promise<boolean>;
}
