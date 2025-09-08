import { Response } from 'express';
import { appConfig } from 'src/config/app.config';
import { requireEnv } from 'src/utils/env';
import { JwtService } from '@nestjs/jwt';
import { payload } from 'src/modules/user/user.type';

export const pagination = function (page: number, limit: number) {
  const offset = (page - 1) * limit;

  return offset;
};

export const generateToken = function (
  payload: payload,
  jwtService: JwtService,
) {
  const token = jwtService.sign(payload, {
    expiresIn: appConfig.jwtExpiresIn,
  });

  const refreshToken = jwtService.sign(payload, {
    expiresIn: appConfig.jwtRefreshExpiresIn,
  });

  return { token, refreshToken };
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

export const generateOtp = function () {
  return Math.floor(100000 + Math.random() * 900000);
};
