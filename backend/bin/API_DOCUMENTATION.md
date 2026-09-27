# API Documentation

Base URL: `http://localhost:8080/api`

All protected endpoints use `Authorization: Bearer <JWT>`.

| Method | Endpoint | Role | Purpose |
|---|---|---|---|
| POST | /auth/register | Public | Register USER |
| POST | /auth/login | Public | Login |
| GET | /auth/me | Auth | Current user |
| GET | /complaints | Auth | List permitted complaints; q/status/priority/categoryId filters |
| POST | /complaints | USER/ADMIN | Create complaint |
| GET | /complaints/{id} | Auth | Details with ownership checks |
| PUT | /complaints/{id} | Owner | Edit submitted/reopened complaint |
| DELETE | /complaints/{id} | Owner | Delete submitted complaint |
| PUT | /complaints/{id}/status | Auth | Change status according to role/state |
| PUT | /complaints/{id}/assign | ADMIN | Assign SUPPORT user |
| GET/POST | /complaints/{id}/comments | Auth | View/add comments |
| GET | /complaints/{id}/activities | Auth | Timeline |
| GET/POST/PUT/DELETE | /categories[/id] | Auth/ADMIN | Category management |
| GET/POST/PUT/DELETE | /users[/id] | ADMIN | User management |
| GET | /admin/dashboard | ADMIN | System statistics |
| GET | /dashboard | Auth | Dashboard data |
| GET/POST | /complaints/{id}/attachments | Auth | Attachment metadata |

## Login example
`POST /api/auth/login`
```json
{"username":"admin","password":"admin123"}
```

## Create complaint
```json
{"title":"Unable to login","description":"The login page rejects valid credentials.","categoryId":1,"priority":"HIGH"}
```

## Status
```json
{"status":"IN_PROGRESS","resolutionNote":"Investigating the issue."}
```

## Assign
```json
{"supportUserId":2}
```

Validation errors return HTTP 400. Missing resources return 404. Authentication/authorization are enforced by Spring Security and service-level ownership checks.
