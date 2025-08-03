# Full-Stack Task Management Application

This repository contains a full-stack task management application with a NestJS backend and Next.js frontend.

## Project Structure

```
.
├── backend/          # NestJS backend application
└── frontend/         # Next.js frontend application
```

## Backend

The backend is built with [NestJS](https://nestjs.com/), a progressive Node.js framework for building efficient and scalable server-side applications.

### Key Features

- **Authentication System**: JWT-based authentication with password reset functionality
- **Employee Management**: CRUD operations for employee records
- **Task Management**: Employee task assignment and tracking
- **Activity Logging**: Tracking of employee activities
- **Mailer Service**: Email notifications for various events
- **Manager Functionality**: Administrative features for managers

### Backend Structure

```
backend/
├── src/
│   ├── auth/           # Authentication module
│   ├── employee/       # Employee management module
│   ├── employee-task/  # Task management module
│   ├── employeeactivitylog/ # Activity logging module
│   ├── entity/         # Database entities
│   ├── mailer/         # Email service
│   ├── manager/       # Manager functionality
│   └── ...
├── uploads/            # Uploaded files storage
└── ...
```

For detailed backend documentation, see [backend/README.md](backend/README.md).

## Frontend

The frontend is built with [Next.js](https://nextjs.org/), a React-based framework for production-ready applications.

### Key Features

- **User Authentication**: Login and registration pages
- **Dashboard**: Overview of tasks and statistics
- **Task Management**: View assigned, completed, and due tasks
- **Profile Management**: User profile editing and password changes
- **Responsive Design**: Works on various device sizes

### Frontend Structure

```
frontend/
├── src/
│   ├── app/            # Application pages and routing
│   ├── components/     # Reusable UI components
│   └── ...
├── public/             # Static assets
└── ...
```

For detailed frontend documentation, see [frontend/README.md](frontend/README.md).

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Setup

1. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start the Backend**:
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

The backend will typically run on `http://localhost:3000` and the frontend on `http://localhost:3001` (or similar ports).

## Development

### Backend Development

The backend follows NestJS conventions with modules organized by feature:
- Auth module for authentication
- Employee module for employee management
- Employee-task module for task management
- Manager module for administrative functions

### Frontend Development

The frontend uses Next.js app directory structure with:
- Pages organized by route
- Components for reusable UI elements
- Global styles and layout components

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
