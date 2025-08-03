## Description

This is the backend service for a Task Management application built with NestJS. It provides RESTful APIs for employee registration, authentication, task management, and email notifications.

## Technology Stack

- **Framework**: [NestJS](https://nestjs.com/) (TypeScript)
- **Database**: PostgreSQL with [TypeORM](https://typeorm.io/)
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: Nodemailer with Gmail
- **File Uploads**: Multer
- **Task Scheduling**: @nestjs/schedule
- **Validation**: class-validator and class-transformer

## Project Structure

```
src/
├── auth/              # Authentication module (JWT)
├── employee/          # Employee management module
├── employee-task/     # Employee task management module
├── employeeactivitylog/ # Employee activity logging module
├── entity/            # Database entities
├── mailer/            # Email service
├── manager/           # Manager task assignment module
├── app.controller.ts  # Main application controller
├── app.module.ts      # Main application module
├── app.service.ts     # Main application service
└── main.ts            # Application entry point
```

## Database Schema

The application uses PostgreSQL with the following main entities:

### Employee
- `id` (Primary Key)
- `name` (String)
- `email` (String, Unique)
- `jobTitle` (String, Nullable)
- `phone` (String, Unique, Nullable)
- `address` (String, Nullable)
- `password` (String, Hidden from selection)
- `otp` (String, Nullable)
- `lastOtpResend` (Timestamp, Nullable)
- `otpExpiry` (Timestamp, Nullable)
- `isEmailVerified` (Boolean, Default: false)
- `isOtpVerified` (Boolean, Default: false)
- `tasks` (OneToMany relationship with Task)

### Task
- `id` (Primary Key)
- `title` (String)
- `description` (String)
- `projectType` (String)
- `status` (Enum: 'pending', 'in_progress', 'completed', Default: 'pending')
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)
- `dueDate` (Timestamp)
- `assignee` (ManyToOne relationship with Employee)
- `assigneeId` (Foreign Key)
- `attachments` (Array of Strings)

### EmployeeTask
- `id` (Primary Key)
- `assignedTask` (ManyToOne relationship with Task)
- `assignedTaskId` (Foreign Key)
- `employee` (ManyToOne relationship with Employee)
- `employeeId` (Foreign Key)
- `createdAt` (Timestamp)
- `assignedAt` (Timestamp, Nullable)
- `startAt` (Timestamp, Nullable)
- `completedAt` (Timestamp, Nullable)
- `priority` (Enum: 'low', 'medium', 'high', Default: 'low')

### EmployeeActivityLog
- `id` (Primary Key)
- `employeeEmail` (String)
- `action` (String)
- `description` (String, Nullable)
- `timestamp` (Timestamp)

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. Employees register with email and password
2. Email verification is required for account activation
3. Login returns a JWT token for authenticated requests
4. Protected routes require a valid JWT token in the Authorization header

JWT Configuration:
- Secret Key: `secretkey123` (should be moved to environment variables in production)
- Token is extracted from Authorization header as Bearer token

## API Endpoints

### Employee Management

#### Public Routes
- `POST /employee/registration` - Register a new employee
- `POST /employee/verify-email` - Verify email with OTP
- `POST /employee/resend-otp` - Resend OTP for email verification
- `POST /employee/login` - Login with email and password
- `POST /employee/forgot-password` - Request password reset
- `POST /employee/verify-otp` - Verify OTP for password reset
- `POST /employee/google-login` - Login with Google token

#### Protected Routes
- `GET /employee/dashboard/accInfo` - Get employee account information
- `PATCH /employee/dashboard/updateInfo` - Update employee information
- `DELETE /employee/dashboard/deleteAcc` - Delete employee account
- `POST /employee/dashboard/change-password` - Change password after OTP verification

### Task Management (Employee)

All employee task routes are protected and require authentication.

- `GET /employee/tasks/assignedTasks` - Get all assigned tasks
- `GET /employee/tasks/taskDates` - Get dates of in-progress tasks
- `GET /employee/tasks/pendingTasks` - Get pending tasks
- `GET /employee/tasks/completedTasks` - Get completed tasks
- `GET /employee/tasks/inProgressTasks` - Get in-progress tasks
- `GET /employee/tasks/monthlyTaskCount` - Get monthly task count
- `GET /employee/tasks/weeklyTaskCount` - Get weekly task count
- `GET /employee/tasks/sixMonthTaskCount` - Get six-month task count
- `GET /employee/tasks/overdueTasks` - Get overdue tasks
- `GET /employee/tasks/download/:fileName` - Download attachment file
- `POST /employee/tasks/updateStatus/:taskId` - Update task status
- `POST /employee/tasks/filter` - Filter tasks by project type
- `POST /employee/tasks/search` - Search tasks by title
- `POST /employee/tasks/uploadAttachments` - Upload task attachments

### Manager Task Assignment

- `POST /manager/tasks` - Create and assign a new task

### Activity Logging

The application automatically logs employee activities such as:
- Account creation
- Login/logout
- Task status updates
- Profile updates

## Email Service

The application uses Nodemailer with Gmail to send emails:
- OTP for email verification
- OTP for password reset
- Task assignment notifications

Email Configuration:
- Service: Gmail
- Sender: tracklyn.team@gmail.com

## File Uploads

Employees can upload attachments to tasks:
- Supported formats: PDF, PNG, JPG
- Maximum file size: 10MB
- Maximum 5 files per upload
- Files are stored in the `uploads/` directory

## Project Setup

```bash
$ npm install
```

## Compile and Run the Project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3030
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=root
DATABASE_NAME=task_management
JWT_SECRET=secretkey123
GMAIL_USER=tracklyn.team@gmail.com
GMAIL_PASS=auuh eqqh russ zpss
```
