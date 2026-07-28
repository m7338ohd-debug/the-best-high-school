import { Request, Response, NextFunction } from 'express';
import { StudentService } from './student.service.js';
import { ApiResponse } from '../../shared/responses/api.response.js';

export class StudentController {
  private service: StudentService;

  constructor(service?: StudentService) {
    this.service = service || new StudentService();
  }

  admitStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.admitStudent(req.body);
      ApiResponse.created(res, 'Student admitted successfully', result);
    } catch (error) {
      next(error);
    }
  };

  getStudentProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profile = await this.service.getStudentProfile(req.params.id);
      ApiResponse.ok(res, 'Student profile retrieved successfully', profile);
    } catch (error) {
      next(error);
    }
  };

  bulkPromote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.bulkPromoteStudents(req.body);
      ApiResponse.ok(res, 'Students promoted successfully', result);
    } catch (error) {
      next(error);
    }
  };
}
