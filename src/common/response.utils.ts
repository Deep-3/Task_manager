import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
export interface commonResponseArgs<T> {
  res: Response;
  statuscode: number;
  data?: T | T[];
}

export interface SuccessCommonResponse<T> {
  statuscode: number;
  data: T | T[];
  message?: string;
}

export interface ErrorCommonResponse {
  res: Response;
  error: AnyType;
}
export class ResponseHandler {
  static success<T>({
    res,
    statuscode = HttpStatus.OK,
    data,
  }: commonResponseArgs<T>): Response<SuccessCommonResponse<T>> {
    return res.status(statuscode).json({
      statuscode: statuscode,
      data,
    });
  }

  static error({
    res,
    error: { statuscode = HttpStatus.INTERNAL_SERVER_ERROR, message },
  }: ErrorCommonResponse) {
    return res.status(statuscode).json({
      statuscode,
      message,
    });
  }
}
