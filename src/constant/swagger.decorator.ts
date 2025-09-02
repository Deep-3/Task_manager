// src/constant/swagger.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

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

export function ApiCustomErrorResponse(...errors: ErrorConfig[]) {
  return createErrorResponseDecorator([...defaultErrors, ...errors]);
}

export function ApiOnlyTheseErrors(...errors: ErrorConfig[]) {
  return createErrorResponseDecorator([...errors]);
}

function createErrorResponseDecorator(errors: ErrorConfig[]) {
  const uniqueErrors = Array.from(
    new Map(errors.map((error) => [error.status, error])).values(),
  );

  const responses = uniqueErrors.map(({ status, message }) => {
    return ApiResponse({
      status,
      schema: {
        type: 'object',
        properties: {
          statuscode: { type: 'number', example: status },
          message: { type: 'string', example: message },
        },
      },
    });
  });

  return applyDecorators(...responses);
}
