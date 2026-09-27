# Complaint Management System

A complete full-stack complaint management application built with Spring Boot, JPA/Hibernate, MySQL, Spring Security/JWT and React/Vite/Bootstrap. It includes role-based workflows for ADMIN, SUPPORT and USER.

## Features
- JWT login/register and BCrypt passwords
- Role-based authorization with backend ownership checks
- Complaint lifecycle: SUBMITTED → UNDER_REVIEW → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED, with REOPENED support
- Categories, priorities, comments, activity timeline and attachment metadata
- Admin user/category management and dashboard statistics
- Support dashboard and assigned complaint workflow
- User dashboard, complaint creation/editing and profile
- Bean Validation, global exception handling and CORS
- Responsive Bootstrap UI

## Structure
```text
complaint-management-system/
├── backend/
├── frontend/
├── database/
└── README.md
```

## Requirements
- Java 17+
- Maven 3.9+
- MySQL 8+
- Node.js 20+ and npm

## MySQL
The backend uses `complaint_management` and creates it automatically with `createDatabaseIfNotExist=true`. Default configuration is root/root. Change `backend/src/main/resources/application.properties` for your local credentials.

## Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
API: http://localhost:8080

## Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend: http://localhost:3000

## Demo accounts
The backend creates these automatically on an empty database. Passwords are BCrypt encoded; they are never stored as plain text.
- ADMIN: `admin` / `admin123`
- SUPPORT: `support` / `support123`
- SUPPORT: `support2` / `support123`
- USER: `user` / `user123`
- USER: `sara` / `user123`
- USER: `ali` / `user123`

These are development/demo credentials only. Change them for any real deployment.

## API overview
See `backend/API_DOCUMENTATION.md`.

## Database sample data
`database/sample-data.sql` contains repeat-safe example categories and complaints. The application seeder creates demo users/categories on an empty database because passwords must be generated with BCrypt.

## Architecture
Backend uses controller → service → repository layers, DTOs and mappers, JPA entities, security filters, global exception handling and service-level authorization. Frontend uses pages, reusable components, Axios service, React Router and AuthContext.

## Troubleshooting
- If login fails, confirm MySQL is running and credentials in `application.properties` are correct.
- If the browser reports CORS errors, use http://localhost:3000 for Vite and keep `app.cors.allowed-origin=http://localhost:3000`.
- If a JWT expires, the frontend clears the session and returns to login.
- If the database already contains users, the automatic demo seed will not overwrite them.

## Screenshots
Add screenshots of login, dashboards, complaint details, user management and category management here when documenting a deployment.
