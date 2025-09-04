import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from './user.type';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.USER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'newpassword123', minLength: 6 })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}

export class LoginUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  password: string;
}

export class UserQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ example: 'project' })
  @IsOptional()
  @IsString()
  search?: string;
}
