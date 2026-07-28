import { Request, Response, NextFunction } from 'express';
import { ClassService } from './class.service.js';
import { ApiResponse } from '../../shared/responses/api.response.js';

export class ClassController {
  private service: ClassService;

  constructor(service?: ClassService) {
    this.service = service || new ClassService();
  }

  getAllClasses = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const classes = await this.service.getAllClasses();
      ApiResponse.ok(res, 'Classes retrieved successfully', classes);
    } catch (error) {
      next(error);
    }
  };

  createClass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newClass = await this.service.createClass(req.body);
      ApiResponse.created(res, 'Class created successfully', newClass);
    } catch (error) {
      next(error);
    }
  };
}
