# Task Management Frontend

This is the frontend application for the Task Management system, built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Build](#build)
- [Application Overview](#application-overview)
  - [Authentication](#authentication)
  - [Dashboard](#dashboard)
  - [Task Management](#task-management)
  - [Profile Management](#profile-management)
- [Components](#components)
- [Styling](#styling)
- [API Integration](#api-integration)

## Features

- User authentication (email/password and Google OAuth)
- Dashboard with task statistics and visualizations
- Task management (view assigned, overdue, and completed tasks)
- Profile management (view, edit, and change password)
- Responsive design for all device sizes
- Calendar integration for task tracking
- Real-time data visualization with charts

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [React Icons](https://react-icons.github.io/react-icons/), [Framer Motion](https://www.framer.com/motion/)
- **State Management**: React Hooks
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Authentication**: [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- **Charts**: [Recharts](https://recharts.org/)
- **Calendar**: [React Calendar](https://github.com/wojtekmaj/react-calendar)
- **Fonts**: [Geist Font](https://vercel.com/font)

## Project Structure

```
frontend/
├── public/                 # Static assets
│   ├── svg/               # SVG icons and images
│   └── *.svg              # Other SVG files
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── createAccount/  # Account creation page
│   │   ├── dashboard/     # Dashboard page
│   │   ├── home/          # Home page
│   │   ├── my-tasks/      # Task management pages
│   │   │   ├── assigned/  # Assigned tasks
│   │   │   ├── completed/ # Completed tasks
│   │   │   └── due/       # Overdue tasks
│   │   ├── pages/         # Additional pages
│   │   ├── profile/       # Profile management pages
│   │   │   ├── edit/      # Edit profile
│   │   │   │   └── change-password/ # Change password
│   │   │   └── view/      # View profile
│   │   ├── verifyEmail/   # Email verification page
│   │   ├── favicon.ico    # Favicon
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Main page (login)
│   ├── components/        # Reusable components
│   └── ...
├── .gitignore             # Git ignore file
├── next.config.ts         # Next.js configuration
├── package.json           # NPM dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── ...
```

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

### Build

To create a production build:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start
# or
yarn start
```

## Application Overview

### Authentication

The application provides two authentication methods:
1. Email/Password login
2. Google OAuth login

The login page (`src/app/page.tsx`) handles both authentication methods and stores the JWT token in localStorage upon successful login.

### Dashboard

The dashboard (`src/app/dashboard/page.tsx`) is the main application page that displays:
- Welcome banner with user name
- Task statistics cards (total, in progress, pending, completed)
- Calendar widget
- Data visualization charts
- Working status progress
- In-progress tasks list

### Task Management

The task management section includes:
- Assigned tasks (`src/app/my-tasks/assigned/page.tsx`)
- Overdue tasks (`src/app/my-tasks/due/page.tsx`)
- Completed tasks (`src/app/my-tasks/completed/page.tsx`)

### Profile Management

Users can manage their profile through:
- View profile (`src/app/profile/view/page.tsx`)
- Edit profile (`src/app/profile/edit/page.tsx`)
- Change password (`src/app/profile/edit/change-password/page.tsx`)

## Components

The application uses several reusable components:

- `AlertModal` - For displaying alert messages
- `CalendarWidget` - Interactive calendar component
- `ChartsSection` - Data visualization charts
- `DeleteAccountModal` - Account deletion confirmation
- `InProgressTasks` - Display of in-progress tasks
- `Modal` - Generic modal component
- `Sidebar` - Navigation sidebar with menu items
- `StatsCards` - Task statistics display
- `Topbar` - Top navigation bar
- `WelcomeBanner` - Welcome message for dashboard
- `WorkingStatus` - Work progress visualization

## Styling

The application uses Tailwind CSS for styling with a custom configuration. Key styling features include:

- Responsive design for all screen sizes
- Dark mode support
- Custom animations and transitions
- Consistent color scheme using Tailwind's color palette
- Custom spinner animations
- Calendar component styling

Global styles are defined in `src/app/globals.css`.

## API Integration

The frontend integrates with a backend API running on `http://localhost:3030`. Key API endpoints used:

- `/employee/login` - User authentication
- `/employee/google-login` - Google OAuth authentication
- `/employee/{id}` - User profile information
- `/employee/tasks/*` - Task management endpoints

All API calls are made using Axios with JWT token authentication in the request headers.
