import { Response } from 'express';

export interface ApiResponsePayload<T> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

export class ApiResponse {
  /**
   * Sends a standardized HTTP success response.
   */
  public static success<T>(
    res: Response,
    statusCode: number,
    message: string,
    data: T,
    meta?: Record<string, unknown>
  ): Response {
    const payload: ApiResponsePayload<T> = {
      success: true,
      message,
      data,
      ...(meta && { meta }),
    };
    return res.status(statusCode).json(payload);
  }

  public static ok<T>(res: Response, message: string, data: T, meta?: Record<string, unknown>): Response {
    return ApiResponse.success(res, 200, message, data, meta);
  }

  public static created<T>(res: Response, message: string, data: T): Response {
    return ApiResponse.success(res, 201, message, data);
  }

  public static noContent(res: Response): Response {
    return res.status(204).send();
  }
}
