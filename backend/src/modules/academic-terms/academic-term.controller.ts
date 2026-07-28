import { Request, Response, NextFunction } from 'express';
import { AcademicTermService } from './academic-term.service.js';
import { ApiResponse } from '../../shared/responses/api.response.js';

export class AcademicTermController {
  private service: AcademicTermService;

  constructor(service?: AcademicTermService) {
    this.service = service || new AcademicTermService();
  }

  getAllTerms = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const terms = await this.service.getAllTerms();
      ApiResponse.ok(res, 'Academic terms retrieved successfully', terms);
    } catch (error) {
      next(error);
    }
  };

  createTerm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const term = await this.service.createTerm(req.body);
      ApiResponse.created(res, 'Academic term created successfully', term);
    } catch (error) {
      next(error);
    }
  };

  setCurrentTerm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const term = await this.service.setCurrentTerm(req.params.id);
      ApiResponse.ok(res, 'Current academic term updated successfully', term);
    } catch (error) {
      next(error);
    }
  };
}
