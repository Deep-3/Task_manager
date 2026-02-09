// src/constant/swagger.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from '.././common/response.dto';
type ErrorConfig = {
  status: number;
  message: string;
};

const defaultErrors: ErrorConfig[] = [
  { status: 400, message: 'Bad Request' },
  { status: 401, message: 'Unauthorized' },
  { status: 403, message: 'Forbidden' },
  { status: 404, message: 'Not Found' },
  { status: 500, message: 'Internal Server Error' },
];

export function ApiErrorResponse() {
  return createErrorResponseDecorator(defaultErrors);
}

function createErrorResponseDecorator(errors: ErrorConfig[]) {
  const uniqueErrors = Array.from(
    new Map(errors.map((error) => [error.status, error])).values(),
  );

  const responses = uniqueErrors.map(({ status, message }) => {
    // return ApiResponse({
    //   status,
    //   schema: {
    //     type: ErrorResponseDto,
    //     properties: {
    //       statuscode: { type: 'number', example: status },
    //       message: { type: 'string', example: message },
    //     },
    //   },
    // });

    return ApiResponse({
      status,
      description: message,
      type: ErrorResponseDto,
    });
  });

  return applyDecorators(...responses);
}
