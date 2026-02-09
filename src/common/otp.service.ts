import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class OtpService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setOtp(userId: string, otp: string): Promise<void> {
    await this.redis.set(userId, otp, 'EX', 300);
  }

  async getOtp(userId: string): Promise<string | null> {
    return this.redis.get(userId);
  }

  async deleteOtp(userId: string): Promise<void> {
    await this.redis.del(userId);
  }
}
