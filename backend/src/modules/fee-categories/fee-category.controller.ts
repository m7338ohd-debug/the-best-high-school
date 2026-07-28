import { Request, Response, NextFunction } from 'express';
import { FeeCategoryService } from './fee-category.service.js';
import { ApiResponse } from '../../shared/responses/api.response.js';

export class FeeCategoryController {
  private service: FeeCategoryService;

  constructor(service?: FeeCategoryService) {
    this.service = service || new FeeCategoryService();
  }

  getAllCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.service.getAllCategories();
      ApiResponse.ok(res, 'Fee categories retrieved successfully', categories);
    } catch (error) {
      next(error);
    }
  };

  createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await this.service.createCategory(req.body);
      ApiResponse.created(res, 'Fee category created successfully', category);
    } catch (error) {
      next(error);
    }
  };
}
