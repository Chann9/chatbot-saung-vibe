# API Quick Reference

## Base URL
```
http://localhost:5000
```

## Authentication Header
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login user |
| POST | `/api/auth/refresh-token` | ✅ | Refresh token |
| GET | `/api/auth/profile` | ✅ | Get user profile |

---

## Chat Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/chat` | ✅ | Get all conversations |
| POST | `/api/chat` | ✅ | Create conversation |
| GET | `/api/chat/:id` | ✅ | Get conversation |
| PUT | `/api/chat/:id` | ✅ | Rename conversation |
| DELETE | `/api/chat/:id` | ✅ | Delete conversation |
| POST | `/api/chat/:id/message` | ✅ | Send message + AI response |
| GET | `/api/chat/:id/messages` | ✅ | Get all messages |

---

## Admin Endpoints

| Method | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| GET | `/api/admin/users` | ✅ | ✅ | List all users |
| GET | `/api/admin/users/:id` | ✅ | ✅ | Get user |
| PUT | `/api/admin/users/:id/settings` | ✅ | ✅ | Update chat limit |
| DELETE | `/api/admin/users/:id` | ✅ | ✅ | Delete user |
| GET | `/api/admin/statistics` | ✅ | ✅ | Get statistics |

---

## Default Credentials

| Field | Value |
|-------|-------|
| Username | admin |
| Password | admin123 |
| Email | admin@saungvibe.com |
| Role | ADMIN |

---

## Default Settings

| Setting | Value |
|---------|-------|
| User Chat Limit | 10 |
| Admin Chat Limit | 100 |
| Token Expiration | 24 hours |
| Salt Rounds (Password) | 10 |

---

## Common Request Examples

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "user@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Create Conversation
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "My Conversation"}'
```

### Send Message
```bash
curl -X POST http://localhost:5000/api/chat/1/message \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'
```

---

## Error Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Success |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Auth required |
| 403 | Forbidden - Admin required |
| 404 | Not Found - Resource not found |
| 500 | Server Error |

---

## Message Senders

- `USER` - Message from user
- `AI` - Message from AI (Gemini)

---

## User Roles

- `ADMIN` - Administrator (can manage users, see statistics)
- `USER` - Regular user (can chat, limited features)

---

## Chat Limit Rules

1. Default for new users: 10 conversations
2. Default for admin: 100 conversations
3. Admin can change user limits
4. Count increases when conversation created
5. Count decreases when conversation deleted
6. Cannot create if at limit

---

## Documentation Links

- [Auth API](./docs/AUTH_API.md)
- [Chat API](./docs/CHAT_API.md)
- [Admin API](./docs/ADMIN_API.md)
- [Testing Guide](./docs/TEST_CHAT_ADMIN.md)
- [Setup Guide](./docs/DATABASE_SETUP.md)
