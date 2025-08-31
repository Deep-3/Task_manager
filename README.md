# Task Manager API - NestJS

A comprehensive Task Manager API built with NestJS, TypeORM, and PostgreSQL. This project is a converted version of the original Express.js application, now using modern NestJS architecture with proper authentication, validation, and API documentation.

## Features

- **User Management**: Registration, login, logout with JWT authentication
- **Task Management**: CRUD operations for tasks with pagination and search
- **Role-based Access Control**: User and Admin roles
- **Database**: PostgreSQL with TypeORM
- **API Documentation**: Swagger/OpenAPI integration
- **Validation**: Request validation using class-validator
- **Authentication**: JWT tokens with cookie support
- **Security**: Password hashing with bcrypt

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

## Project Structure

```bash
src/
├── auth/                    # Authentication module
│   ├── decorators/         # Custom decorators
│   ├── guards/             # Auth guards
│   ├── interfaces/         # Auth interfaces
│   └── strategies/         # Passport strategies
├── config/                 # Configuration files
│   └── database.config.ts  # Database configuration
├── modules/
│   ├── user/              # User module
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── entities/      # TypeORM entities
│   │   ├── enums/         # User enums
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.module.ts
│   └── task/              # Task module
│       ├── dto/           # Data Transfer Objects
│       ├── entities/      # TypeORM entities
│       ├── enums/         # Task enums
│       ├── task.controller.ts
│       ├── task.service.ts
│       └── task.module.ts
├── app.module.ts          # Root module
└── main.ts               # Application entry point
```

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd nestjs-task-manager
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_manage
DB_USER=postgres
DB_PASSWORD=your_password

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
