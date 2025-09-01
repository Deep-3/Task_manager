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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto, } from './user.dto';
import { UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import * as authInterface from '../../auth/auth.interface';

@ApiTags('Users')
@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const existingUser = await this.userService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = await this.userService.create(createUserDto);

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload, {
      expiresIn: '1d',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
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
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() loginDto: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const user = await this.userService.findByEmail(loginDto.email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await this.userService.validatePassword(
        user,
        loginDto.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { id: user.id, email: user.email, role: user.role };
      const token = this.jwtService.sign(payload, {
        expiresIn: '1d',
      });

      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
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
      throw new Error(
        `Failed to login user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    res.clearCookie('refreshToken');

    return {
      statuscode: HttpStatus.OK,
      message: 'Logout successful',
    };
  }

  @Get('users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async findAll(@Req() req:authInterface.AuthRequest): Promise<User[]> {
    try {
        console.log(req.user);
      return this.userService.findAll();
    } catch (error) {
      throw new Error(
        `Failed to get users: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Get('users/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<User | null> {
    try {
      return this.userService.findById(id);
    } catch (error) {
      throw new Error(
        `Failed to get user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Patch('users/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      return this.userService.update(id, updateUserDto);
    } catch (error) {
      throw new Error(
        `Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Delete('users/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string) {
    try {
      const deleted = await this.userService.remove(id);
      return {
        statuscode: HttpStatus.OK,
        message: deleted ? 'User deleted successfully' : 'User not found',
      };
    } catch (error) {
      throw new Error(
        `Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  getProfile(@Req() req:authInterface.AuthRequest) {  
    try {
    return {
      statuscode: HttpStatus.OK,
      data: {
        user: req.user,
      },
    };
    } catch (error) {
      throw new Error(
        `Failed to get profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
