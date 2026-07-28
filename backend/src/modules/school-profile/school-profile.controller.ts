import { Request, Response, NextFunction } from 'express';
import { SchoolProfileService } from './school-profile.service.js';
import { ApiResponse } from '../../shared/responses/api.response.js';

export class SchoolProfileController {
  private service: SchoolProfileService;

  constructor(service?: SchoolProfileService) {
    this.service = service || new SchoolProfileService();
  }

  getProfile = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profile = await this.service.getProfile();
      ApiResponse.ok(res, 'School profile retrieved successfully', profile);
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.service.updateProfile(req.body);
      ApiResponse.ok(res, 'School profile updated successfully', updated);
    } catch (error) {
      next(error);
    }
  };
}
