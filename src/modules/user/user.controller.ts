import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ConflictException,
  UnauthorizedException,
  Req,
  Res,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import * as authInterface from '../../auth/auth.interface';
import { appConfig } from 'src/config/app.config';
import { UserMessage } from './user.costant';

@ApiTags('Users')
@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const existingUser = await this.userService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException(UserMessage.Error.USER_ALREADY_EXISTS);
    }

    const user = await this.userService.create(createUserDto);

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload, {
      expiresIn: appConfig.jwtExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: appConfig.jwtRefreshExpiresIn,
    });

    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      statuscode: HttpStatus.CREATED,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
    };
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const user = await this.userService.findByEmail(loginDto.email);
      if (!user) {
        throw new UnauthorizedException(
          UserMessage.Error.USER_INVALID_CREDENTIALS,
        );
      }

      const isPasswordValid = await this.userService.validatePassword(
        user,
        loginDto.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException(
          UserMessage.Error.USER_INVALID_CREDENTIALS,
        );
      }

      const payload = { id: user.id, email: user.email, role: user.role };
      const token = this.jwtService.sign(payload, {
        expiresIn: appConfig.jwtExpiresIn,
      });

      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: appConfig.jwtRefreshExpiresIn,
      });

      res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      return {
        statuscode: HttpStatus.OK,
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    res.clearCookie('refreshToken');

    return {
      statuscode: HttpStatus.OK,
      message: 'Logout successful',
    };
  }

  @Get('users')
  async findAll(@Req() req: authInterface.AuthRequest): Promise<User[]> {
    try {
      console.log(req.user);
      return this.userService.findAll();
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to get users: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Get('users/:id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    try {
      return this.userService.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Patch('users/:id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      return this.userService.update(id, updateUserDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete('users/:id')
  async remove(@Param('id') id: string) {
    try {
      const deleted = await this.userService.remove(id);
      return {
        statuscode: HttpStatus.OK,
        message: deleted
          ? UserMessage.Info.DELETE_USER
          : UserMessage.Error.USER_NOT_FOUND_TO_DELETE,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('me')
  getProfile(@Req() req: authInterface.AuthRequest) {
    try {
      return {
        statuscode: HttpStatus.OK,
        data: {
          user: req.user,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
