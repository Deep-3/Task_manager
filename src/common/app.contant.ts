import { Response } from 'express';
import { requireEnv } from 'src/utils/env';

export const pagination = function (page: number, limit: number) {
  const offset = (page - 1) * limit;

  return offset;
};

export const setCookie = function (
  res: Response,
  token: string,
  refreshToken: string,
): void {
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + Number(requireEnv('TOKEN_EXPIRES_IN'))),
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: new Date(
      Date.now() + Number(requireEnv('TOKEN_REFRESH_EXPIRES_IN')),
    ),
  });
};
