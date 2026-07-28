export interface CreateAcademicYearDTO {
  yearName: string;
  startDate: string;
  endDate: string;
  makeActive?: boolean;
}

export interface UpdateAcademicYearDTO {
  yearName?: string;
  startDate?: string;
  endDate?: string;
}
