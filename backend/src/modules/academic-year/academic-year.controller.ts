import { Request, Response, NextFunction } from 'express';
import { AcademicYearService } from './academic-year.service.js';
import { ApiResponse } from '../../shared/responses/api.response.js';

export class AcademicYearController {
  private service: AcademicYearService;

  constructor(service?: AcademicYearService) {
    this.service = service || new AcademicYearService();
  }

  getAllYears = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const years = await this.service.getAllYears();
      ApiResponse.ok(res, 'Academic years retrieved successfully', years);
    } catch (error) {
      next(error);
    }
  };

  getActiveYear = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const activeYear = await this.service.getActiveYear();
      ApiResponse.ok(res, 'Active academic year retrieved successfully', activeYear);
    } catch (error) {
      next(error);
    }
  };

  createYear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const year = await this.service.createYear(req.body);
      ApiResponse.created(res, 'Academic year created successfully', year);
    } catch (error) {
      next(error);
    }
  };

  activateYear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const year = await this.service.activateYear(req.params.id);
      ApiResponse.ok(res, 'Academic year activated successfully', year);
    } catch (error) {
      next(error);
    }
  };

  closeYear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const year = await this.service.closeYear(req.params.id);
      ApiResponse.ok(res, 'Academic year closed successfully', year);
    } catch (error) {
      next(error);
    }
  };
}
