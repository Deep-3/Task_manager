import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
  import { UserRole } from 'src/modules/user/user.type';
import { AuthRequest } from 'src/auth/auth.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: AuthRequest, res: Response, next: NextFunction): Response | void {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'secretKey',
      });
      req.user = payload;
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: error.message });
    }
  }
}

export function RoleMiddleware(
  requiredRole: UserRole,
): new () => NestMiddleware {
  @Injectable()
  class RoleCheckMiddleware implements NestMiddleware {
    use(req: AuthRequest, res: Response, next: NextFunction): Response | void {
      if (!req.user || req.user.role !== requiredRole) {
        return res
          .status(403)
          .json({ error: 'Forbidden: Insufficient role' });
      }
      next();
    }
  }

  return RoleCheckMiddleware;
}
