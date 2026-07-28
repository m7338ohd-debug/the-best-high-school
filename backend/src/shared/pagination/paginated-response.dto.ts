export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  sorting?: {
    field: string;
    direction: 'ASC' | 'DESC';
  };
  appliedFilters?: Record<string, unknown>;
}

export interface PaginatedResponseDTO<T> {
  items: T[];
  pagination: PaginationMeta;
}

export class PaginationFormatter {
  public static format<T>(
    items: T[],
    totalRecords: number,
    page: number,
    pageSize: number,
    sorting?: { field: string; direction: 'ASC' | 'DESC' },
    appliedFilters?: Record<string, unknown>
  ): PaginatedResponseDTO<T> {
    const totalPages = Math.ceil(totalRecords / pageSize) || 1;
    return {
      items,
      pagination: {
        currentPage: page,
        pageSize,
        totalRecords,
        totalPages,
        hasPrevious: page > 1,
        hasNext: page < totalPages,
        sorting,
        appliedFilters,
      },
    };
  }
}
