# Virtual Event Management Platform

A backend API for managing virtual events with authentication, role-based access control, event management, attendee registration, email notifications, filtering, pagination, deployment, and automated testing.

---

# Features

## Authentication & Authorization

* User registration
* User login
* JWT authentication
* Role-based access control (Organizer / Attendee)
* Protected routes

## Event Management

* Create events
* Update events
* Delete events
* Fetch all events
* Fetch single event
* Event ownership validation

## Event Registration

* Attendees can register for events
* Prevent duplicate registrations
* Organizer restrictions

## Filtering & Pagination

* Search by title
* Filter by location
* Filter upcoming/past events
* Pagination support

## Email Notifications

* Welcome email after registration
* Event registration confirmation emails

## Testing

* Jest integration testing
* Supertest API testing
* Separate test environment
* Automated cleanup after tests

## Deployment

* Deployed on Render
* MongoDB Atlas integration
* Auto deployment from GitHub dev branch

---

# Tech Stack

## Backend

* Node.js
* Express.js

## Database

* MongoDB Atlas
* Mongoose

## Authentication

* JWT (jsonwebtoken)
* bcryptjs

## Validation

* express-validator

## Email Service

* Nodemailer
* Gmail SMTP / App Password

## Development Tools

* Nodemon
* ESLint
* Prettier

## Testing

* Jest
* Supertest

## Deployment

* Render

---

# Project Structure

```plaintext
Virtual-Event-Management-Platform/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── utils/
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── api.test.js
│   └── setup.js
│
├── postman/
│
├── .env
├── .env.test
├── .gitignore
├── eslint.config.mjs
├── package.json
└── README.md
```

---

# Environment Variables

Create a `.env` file in the root directory.

## .env

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

---

# Test Environment

Create a separate `.env.test` file.

## .env.test

```env
NODE_ENV=test

PORT=5001

MONGO_URI=your_test_database_connection_string

JWT_SECRET=testsecret
```

---

# Installation & Setup

## Clone Repository

```bash
git clone https://github.com/2001Aswin89/Virtual-Event-Management-Platform.git
```

## Navigate Into Project

```bash
cd Virtual-Event-Management-Platform
```

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

Server runs on:

```plaintext
http://localhost:5000
```

---

# Available Scripts

## Start Development Server

```bash
npm run dev
```

## Start Production Server

```bash
npm start
```

## Run ESLint

```bash
npm run lint
```

## Fix ESLint Issues

```bash
npm run lint:fix
```

## Format With Prettier

```bash
npm run format
```

## Run Tests

```bash
npm test
```

---

# API Base URL

## Local

```plaintext
http://localhost:5000/api
```

## Production

```plaintext
https://virtual-event-management-platform-irfs.onrender.com/api
```

---

# Authentication

Protected routes require JWT token.

## Authorization Header

```plaintext
Authorization: Bearer <token>
```

---

# API Endpoints

# Auth Routes

## Register User

### POST

```plaintext
/api/auth/register
```

### Request Body

```json
{
    "name": "Aswin",
    "email": "aswin@test.com",
    "password": "123456",
    "role": "organizer"
}
```

---

## Login User

### POST

```plaintext
/api/auth/login
```

### Request Body

```json
{
    "email": "aswin@test.com",
    "password": "123456"
}
```

---

# Event Routes

## Create Event

### POST

```plaintext
/api/events
```

### Access

* Organizer only

### Request Body

```json
{
    "title": "React Summit",
    "description": "Advanced React Conference",
    "date": "2026-12-10",
    "time": "10:00 AM",
    "location": "Online"
}
```

---

## Get All Events

### GET

```plaintext
/api/events
```

### Query Parameters

| Parameter | Description        |
| --------- | ------------------ |
| page      | Pagination page    |
| limit     | Items per page     |
| search    | Search by title    |
| location  | Filter by location |
| upcoming  | true / false       |

### Example

```plaintext
/api/events?page=1&limit=10&search=react&location=online&upcoming=true
```

---

## Get Single Event

### GET

```plaintext
/api/events/:id
```

---

## Update Event

### PUT

```plaintext
/api/events/:id
```

### Access

* Organizer only
* Event owner only

---

## Delete Event

### DELETE

```plaintext
/api/events/:id
```

### Access

* Organizer only
* Event owner only

---

# Registration Routes

## Register For Event

### POST

```plaintext
/api/events/:id/register
```

### Access

* Attendee only

---

# Role-Based Access Control

## Organizer

Can:

* Create events
* Update own events
* Delete own events

Cannot:

* Register for events

---

## Attendee

Can:

* View events
* Register for events

Cannot:

* Create events
* Update events
* Delete events

---

# Error Handling

Global error middleware handles:

* Validation errors
* Authentication errors
* Authorization errors
* Database errors
* Route not found errors

---

# Testing

## Test Stack

* Jest
* Supertest

## Test Coverage

* Authentication
* Duplicate registration prevention
* Login validation
* Event creation
* Role restrictions
* Event updates
* Event deletion
* Event registration

## Run Tests

```bash
npm test
```

---

# Postman Collection

Postman collection available inside:

```plaintext
/postman
```

Import collection into Postman to test APIs.

---

# Deployment

## Render Deployment

Production API:

```plaintext
https://virtual-event-management-platform-irfs.onrender.com
```

## Deployment Flow

```plaintext
feature/*
    ↓
dev
    ↓
Render Auto Deploy
```

---

# Git Branching Strategy

## Main Branches

```plaintext
main
```

* Stable branch

```plaintext
dev
```

* Active development branch
* Connected to Render deployment

---

## Feature Branches

```plaintext
feature/authentication
feature/event-management
feature/event-registration
feature/testing
feature/project-documentation
```

---

# Security Practices

* JWT authentication
* Password hashing using bcrypt
* Environment variable protection
* Separate test environment
* Sensitive files ignored using `.gitignore`

---

# Future Improvements

* Refresh tokens
* Password reset
* OAuth authentication
* Event image uploads
* Event categories
* Real-time notifications
* Docker support
* CI/CD pipeline
* Swagger API documentation
* Rate limiting
* Caching

---

# Author

Aswin Sivadas

GitHub Repository:

[https://github.com/2001Aswin89/Virtual-Event-Management-Platform](https://github.com/2001Aswin89/Virtual-Event-Management-Platform)
