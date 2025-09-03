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
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import * as authInterface from '../../auth/auth.interface';
import { appConfig } from 'src/config/app.config';
import { UserMessage } from './user.costant';
import { ApiErrorResponse } from '../../constant/swagger.decorator';
import { Successdata, SuccessResponseDto } from 'src/common/response.dto';
import { JwtAuthGuard, RoleGuard } from 'src/middleware/auth.middleware';
import { Roles } from 'src/constant/role.decorator';
import { UserRole } from './user.type';
import {
  UserResponseDto,
  UserListResponseDto,
  UserDto,
} from './user.response.dto';
import {
  ResponseHandler,
  SuccessCommonResponse,
} from 'src/common/response.utils';

@ApiTags('Users')
@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 200,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiErrorResponse()
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
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

      return ResponseHandler.success({
        res,
        statuscode: HttpStatus.CREATED,
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      return ResponseHandler.error({
        res,
        error,
      });
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: UserMessage.Info.LOGIN_USER,
    type: SuccessResponseDto,
  })
  @ApiErrorResponse()
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

      return ResponseHandler.success({
        res,
        statuscode: HttpStatus.OK,
        data: {
          message: UserMessage.Info.LOGIN_USER,
        },
      });
    } catch (error) {
      return ResponseHandler.error({
        res,
        error,
      });
    }
  }

  @Post('logout')
  @ApiResponse({
    status: HttpStatus.OK,
    description: UserMessage.Info.LOGOUT_USER,
    type: SuccessResponseDto,
  })
  logout(
    @Res({ passthrough: true }) res: Response,
  ): Response<SuccessCommonResponse<Successdata>> {
    try {
      res.clearCookie('token');
      res.clearCookie('refreshToken');

      return ResponseHandler.success({
        res,
        statuscode: HttpStatus.OK,
        data: {
          message: UserMessage.Info.LOGOUT_USER,
        },
      });
    } catch (error) {
      return ResponseHandler.error({
        res,
        error,
      });
    }
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: UserMessage.Info.RETRIEVE_USERS,
    type: UserListResponseDto,
  })
  @ApiErrorResponse()
  async findAll(
    @Req() req: authInterface.AuthRequest,
    @Res() res: Response,
  ): Promise<Response<SuccessCommonResponse<User>>> {
    try {
      const users = await this.userService.findAll();
      return ResponseHandler.success({
        res,
        statuscode: HttpStatus.OK,
        data: users,
      });
    } catch (error) {
      return ResponseHandler.error({
        res,
        error,
      });
    }
  }

  @Get('users/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: UserMessage.Info.RETRIEVE_USERS,
    type: UserResponseDto,
  })
  @ApiErrorResponse()
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<SuccessCommonResponse<{ user: User }>>> {
    try {
      const user = await this.userService.findById(id);
      return ResponseHandler.success({
        res,
        statuscode: HttpStatus.OK,
        data: {
          user,
        },
      });
    } catch (error) {
      return ResponseHandler.error({
        res,
        error,
      });
    }
  }

  @Patch('users/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: UserMessage.Info.RETRIEVE_USERS,
    type: UserResponseDto,
  })
  @ApiErrorResponse()
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ): Promise<Response<SuccessCommonResponse<Successdata>>> {
    try {
      await this.userService.update(id, updateUserDto);

      return ResponseHandler.success({
        res,
        statuscode: HttpStatus.OK,
        data: {
          message: UserMessage.Info.UPDATE_USER,
        },
      });
    } catch (error) {
      return ResponseHandler.error({
        res,
        error,
      });
    }
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: UserMessage.Info.DELETE_USER,
    type: SuccessResponseDto,
  })
  @ApiErrorResponse()
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<SuccessCommonResponse<SuccessResponseDto>>> {
    try {
      const deleted = await this.userService.remove(id);
      return ResponseHandler.success({
        res,
        statuscode: HttpStatus.OK,
        data: {
          message: deleted
            ? UserMessage.Info.DELETE_USER
            : UserMessage.Error.USER_NOT_FOUND_TO_DELETE,
        },
      });
    } catch (error) {
      return ResponseHandler.error({
        res,
        error,
      });
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: UserMessage.Info.RETRIEVE_USERS,
    type: UserResponseDto,
  })
  @ApiErrorResponse()
  getProfile(
    @Req() req: authInterface.AuthRequest,
    @Res() res: Response,
  ): Response<SuccessCommonResponse<{ user: UserDto }>> {
    try {
      return ResponseHandler.success({
        res,
        statuscode: HttpStatus.OK,
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      return ResponseHandler.error({
        res,
        error,
      });
    }
  }
}
