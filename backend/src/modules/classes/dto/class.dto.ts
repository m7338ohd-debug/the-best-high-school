export interface CreateClassDTO {
  className: string;
  displayName?: string;
  displayOrder?: number;
  description?: string;
}

export interface UpdateClassDTO {
  className?: string;
  displayName?: string;
  displayOrder?: number;
  description?: string;
  isActive?: boolean;
}
