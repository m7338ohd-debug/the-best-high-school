import { UserRole } from '../../users/models/user.model.js';

export interface RegisterSchoolRequestDTO {
  schoolName: string;
  schoolCode: string;
  schoolEmail: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  password: string;
  phone?: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    tenantId: string;
  };
}
