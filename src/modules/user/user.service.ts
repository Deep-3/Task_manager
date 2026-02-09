import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserPagination, UserRole } from './user.type';
import { pagination } from 'src/common/app.contant';
import { UserMessage } from './user.costant';
import { Cron } from '@nestjs/schedule';
import { MailQueueService } from '../mail-queue/mail-queue.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailQueueService: MailQueueService,
  ) {}

  @Cron('13 17 * * *')
  async sendmail(): Promise<void> {
    const users = await this.userRepository.find({ select: ['email'] });
    if (!users || users.length === 0) {
      throw new NotFoundException(UserMessage.Error.USER_NOT_FOUND);
    }

    console.log('Adding emails to queue...');

    await Promise.all(
      users.map((user) =>
        this.mailQueueService.addToMailQueue({
          to: user.email,
          subject: 'Welcome to our app',
          text: 'Thank you for joining our platform!',
        }),
      ),
    );
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role ?? UserRole.USER,
    });

    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.role',
        'user.password',
        'user.createdAt',
      ])
      .where('user.email = :email', { email })
      .getOne();
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  async findAll(
    page: number,
    limit: number,
    search: string,
  ): Promise<UserPagination> {
    const offset = pagination(page, limit);
    const [users, total] = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email ILIKE :search', { search: `%${search}%` })
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      users,
      page,
      total,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(UserMessage.Error.USER_NOT_FOUND);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);

    return this.userRepository.save(user);
  }

  async remove(ids: string[]): Promise<boolean> {
    const result = await this.userRepository.update(
      { id: In(ids) },
      { deletedAt: new Date() },
    );
    return (result.affected ?? 0) > 0;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
