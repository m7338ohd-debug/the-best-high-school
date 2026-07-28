import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { AuthRepository } from './auth.repository.js';
import { RegisterSchoolRequestDTO, LoginRequestDTO, AuthResponseDTO } from './dto/auth.dto.js';
import { UserRole } from '../users/models/user.model.js';
import { jwtConfig } from '../../config/jwt.config.js';
import { securityConfig } from '../../config/security.config.js';
import { ConflictError, UnauthorizedError } from '../../shared/errors/api.error.js';
import { LoggerService } from '../../shared/logger/logger.service.js';

export class AuthService {
  private authRepository: AuthRepository;

  constructor(authRepository?: AuthRepository) {
    this.authRepository = authRepository || new AuthRepository();
  }

  /**
   * Registers a new tenant school along with its initial School Admin user.
   */
  async registerSchool(dto: RegisterSchoolRequestDTO): Promise<AuthResponseDTO> {
    const existingSchool = await this.authRepository.findSchoolByCode(dto.schoolCode);
    if (existingSchool) {
      throw new ConflictError(`School code '${dto.schoolCode}' is already registered`);
    }

    const tenantId = uuidv4();

    // Create Tenant School
    const school = await this.authRepository.createSchool({
      tenantId,
      name: dto.schoolName,
      code: dto.schoolCode,
      email: dto.schoolEmail,
      phone: dto.phone,
      isActive: true,
    });

    // Hash admin password
    const passwordHash = await bcrypt.hash(dto.password, securityConfig.bcryptSaltRounds);

    // Create Initial School Admin User
    const adminUser = await this.authRepository.create({
      tenantId,
      firstName: dto.adminFirstName,
      lastName: dto.adminLastName,
      email: dto.adminEmail,
      passwordHash,
      role: UserRole.SCHOOL_ADMIN,
      isActive: true,
    });

    LoggerService.audit('SCHOOL_REGISTERED', adminUser.id, tenantId, { schoolName: school.name, schoolCode: school.code });

    const signOptions: SignOptions = { expiresIn: jwtConfig.expiresIn as SignOptions['expiresIn'] };
    const refreshSignOptions: SignOptions = { expiresIn: jwtConfig.refreshExpiresIn as SignOptions['expiresIn'] };

    // Generate JWT Access & Refresh Tokens
    const token = jwt.sign(
      { id: adminUser.id, tenantId, email: adminUser.email, role: adminUser.role },
      jwtConfig.secret,
      signOptions
    );

    const refreshToken = jwt.sign(
      { id: adminUser.id, tenantId },
      jwtConfig.refreshSecret,
      refreshSignOptions
    );

    return {
      token,
      refreshToken,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        role: adminUser.role,
        tenantId,
      },
    };
  }

  /**
   * Authenticates user against tenant credentials.
   */
  async login(dto: LoginRequestDTO, tenantId: string): Promise<AuthResponseDTO> {
    const user = await this.authRepository.findByEmail(dto.email, tenantId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid credentials or inactive account');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const signOptions: SignOptions = { expiresIn: jwtConfig.expiresIn as SignOptions['expiresIn'] };
    const refreshSignOptions: SignOptions = { expiresIn: jwtConfig.refreshExpiresIn as SignOptions['expiresIn'] };

    const token = jwt.sign(
      { id: user.id, tenantId: user.tenantId, email: user.email, role: user.role },
      jwtConfig.secret,
      signOptions
    );

    const refreshToken = jwt.sign(
      { id: user.id, tenantId: user.tenantId },
      jwtConfig.refreshSecret,
      refreshSignOptions
    );

    LoggerService.audit('USER_LOGIN', user.id, user.tenantId);

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }
}
