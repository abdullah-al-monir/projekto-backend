# Projekto Backend - Node.js + Express + TypeScript

## Overview
Projekto is a role-based admin and project management system with invitation-based user onboarding. This backend handles authentication, user management, and project operations with strict role-based access control.

## 🚀 Quick Start

### Prerequisites

* Node.js 18+ and npm/yarn
* MongoDB (local or cloud)
* EmailJS account (for email notifications)

### Installation

```bash
// Install dependencies
npm install
```

## Create .env file from example
cp .env.example .env

## Configure environment variables in .env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_super_secret_key_here
PORT=5000

## Seed database with sample data
```
npm run seed
```

# Start development server
```
npm run dev
```
## 📁 Project Structure
```
src/
├── config/          # Configuration files
│   ├── database.ts  # MongoDB connection
│   ├── env.ts       # Environment variables
│   └── email.ts     # EmailJS setup
├── models/          # Mongoose schemas
│   ├── User.ts
│   ├── Invite.ts
│   └── Project.ts
├── routes/          # API route handlers
│   ├── auth.ts
│   ├── users.ts
│   └── projects.ts
├── controllers/     # Business logic
│   ├── authController.ts
│   ├── userController.ts
│   └── projectController.ts
├── middleware/      # Express middleware
│   ├── auth.ts      # JWT verification
│   ├── roleCheck.ts # Role-based access
│   ├── errorHandler.ts
│   └── validation.ts
├── utils/           # Utility functions
│   ├── jwt.ts
│   ├── password.ts
│   ├── email.ts
│   └── errors.ts
└── app.ts           # Express app setup
```
## 🔐 Authentication Flow
1. Invite-Based Registration
* Admin creates invite
  ↓
* User receives email with invite link
  ↓
* User clicks link and registers
  ↓
* Account created with invited role
2. JWT Authentication

* All protected endpoints require Authorization: Bearer <token> header
* Tokens expire after 7 days (configurable)
* Token format: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

## 📊 Database Schemas
#### User

* id: ObjectId (auto-generated)
* name: String
* email: String (unique)
* password: String (bcrypt hashed)
* role: ADMIN | MANAGER | STAFF
* status: ACTIVE | INACTIVE
* invitedAt: Date
* createdAt: Date
* updatedAt: Date

### Invite

* id: ObjectId
* email: String
* role: MANAGER | STAFF
* token: String (unique, 64 hex characters)
* expiresAt: Date (auto-deletes after expiry)
* acceptedAt: Date (null until used)
* createdAt: Date

### Project

* id: ObjectId
* name: String
* description: String
* status: ACTIVE | ARCHIVED | DELETED
* isDeleted: Boolean (soft delete flag)
* createdBy: ObjectId (User reference)
* createdAt: Date
* updatedAt: Date

## 🔌 API Endpoints
### Authentication
```
POST /api/auth/login
// Login with email and password.
bashcurl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@projekto.com",
    "password": "admin@123"
  }'
POST /api/auth/invite (ADMIN ONLY)
// Send invite to new user.
bashcurl -X POST http://localhost:5000/api/auth/invite \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "role": "MANAGER"
  }'
POST /api/auth/register-via-invite
// Register using invite token.
bashcurl -X POST http://localhost:5000/api/auth/register-via-invite \
  -H "Content-Type: application/json" \
  -d '{
    "token": "invite_token_here",
    "name": "John Doe",
    "password": "secure_password"
  }'
GET /api/auth/me (PROTECTED)
// Get current user profile.
Users
GET /api/users (ADMIN ONLY)
// Get all users with pagination.
bashcurl "http://localhost:5000/api/users?page=1&search=john" \
  -H "Authorization: Bearer <token>"
PATCH /api/users/:id/role (ADMIN ONLY)
Update user role.
bashcurl -X PATCH http://localhost:5000/api/users/user_id/role \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"role": "MANAGER"}'
PATCH /api/users/:id/status (ADMIN ONLY)
Activate or deactivate user.
bashcurl -X PATCH http://localhost:5000/api/users/user_id/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "INACTIVE"}'
Projects
POST /api/projects (AUTHENTICATED)
Create new project.
bashcurl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Project",
    "description": "Project description"
  }'
GET /api/projects
Get all projects with pagination.
bashcurl "http://localhost:5000/api/projects?page=1&search=web&status=ACTIVE" \
  -H "Authorization: Bearer <token>"
GET /api/projects/:id
Get project by ID.
PATCH /api/projects/:id (ADMIN ONLY)
Update project.
DELETE /api/projects/:id (ADMIN ONLY)
Soft delete project.
```
## 🔑 Role-Based Access Control
#### ADMIN

* Invite users
* Manage all users (change roles, activate/deactivate)
* Create projects
* Edit/delete any project

#### MANAGER

* Create projects
* View all projects
* Cannot manage other users

#### STAFF

* Create projects
* View all projects
* Most restricted role

## 📧 Email Integration
#### Emails are sent via EmailJS for:

* User invitations with registration links
* Invite expiration: 7 days (configurable)

#### Setup EmailJS:

* Create account at emailjs.com
* Create email service and template
* Add credentials to .env

## 🧪 Seeding Database
```bash
npm run seed
```

#### Creates:

* 1 Admin user
* 1 Manager user
* 1 Staff user
* 4 sample projects

## Test credentials:
* Admin: admin@projekto.com / admin@123
* Manager: manager@projekto.com / manager@123
* Staff: staff@projekto.com / staff@123

## 🚢 Deployment
#### Environment Setup
bashNODE_ENV=production
MONGODB_URI=<production_uri>
JWT_SECRET=<strong_random_key>
PORT=5000
CORS_ORIGIN=https://yourdomain.com

#### Platforms

Vercel: npm run build && push the code to github. then connect with the repo (Don't forget to add env's in vercel)


📝 Git Workflow
bash# Feature branch
git checkout -b feature/auth-system
git add .
git commit -m "feat: implement JWT authentication"
git push origin feature/auth-system


### 🔄 Key Features
* ✅ Invitation-based registration
* ✅ JWT-based authentication
* ✅ Role-based access control
* ✅ Soft delete for projects
* ✅ Email notifications via EmailJS
* ✅ Comprehensive error handling
* ✅ Request validation with Joi
* ✅ MongoDB indexing for performance
* ✅ Password hashing with bcryptjs
* ✅ CORS and security headers

## 📚 Technologies

* Framework: Express.js
* Database: MongoDB + Mongoose
* Authentication: JWT
* Validation: Joi
* Security: bcryptjs, helmet
* Email: EmailJS
* Language: TypeScript

## 🐛 Troubleshooting
#### MongoDB Connection Failed

* Check MONGODB_URI in .env
* Ensure MongoDB is running
* Verify network access (if using Atlas)

#### Email Not Sending

* Verify EmailJS credentials
* Check email template ID
* Review service logs on emailjs.com

#### JWT Token Invalid

* Ensure JWT_SECRET matches between server restarts
* Check token expiration
* Verify Authorization header format