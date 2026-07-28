import { Request, Response, NextFunction } from 'express';
import { SectionService } from './section.service.js';
import { ApiResponse } from '../../shared/responses/api.response.js';

export class SectionController {
  private service: SectionService;

  constructor(service?: SectionService) {
    this.service = service || new SectionService();
  }

  getSectionsByClass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sections = await this.service.getSectionsByClass(req.params.classId);
      ApiResponse.ok(res, 'Sections retrieved successfully', sections);
    } catch (error) {
      next(error);
    }
  };

  createSection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const section = await this.service.createSection(req.body);
      ApiResponse.created(res, 'Section created successfully', section);
    } catch (error) {
      next(error);
    }
  };
}
