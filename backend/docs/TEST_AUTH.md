# Testing Authentication API

Gunakan file ini untuk test auth endpoints menggunakan cURL atau Postman.

## Persiapan

1. Pastikan server sudah berjalan:
```bash
npm run dev
```

2. Database sudah di-setup dan seed
3. Token akan di-extract dari response untuk test endpoint berikutnya

## Test Scenarios

### Scenario 1: Register User Baru

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 2,
    "username": "testuser",
    "email": "test@example.com",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcxNzU4MzIyMCwiZXhwIjoxNzE3NjY5NjIwfQ.example"
}
```

---

### Scenario 2: Login with Admin Account

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@saungvibe.com",
    "role": "ADMIN"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MTc1ODMyMjAsImV4cCI6MTcxNzY2OTYyMH0.example"
}
```

Save token untuk test selanjutnya:
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example..."
```

---

### Scenario 3: Get Profile (Protected Route)

**cURL:**
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@saungvibe.com",
    "role": "ADMIN",
    "settings": {
      "id": 1,
      "userId": 1,
      "chatLimit": 100,
      "currentChatCount": 0,
      "createdAt": "2026-04-05T10:00:00.000Z",
      "updatedAt": "2026-04-05T10:00:00.000Z"
    }
  }
}
```

---

### Scenario 4: Refresh Token

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200):**
```json
{
  "message": "Token refreshed successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new_token..."
}
```

---

## Error Test Cases

### Test 1: Invalid Username/Password

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "wronguser",
    "password": "wrongpass"
  }'
```

**Response (401):**
```json
{
  "message": "Invalid username or password"
}
```

---

### Test 2: Duplicate Username

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "another@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Response (409):**
```json
{
  "message": "Username or email already exists"
}
```

---

### Test 3: Invalid Email Format

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "invalid-email",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Response (400):**
```json
{
  "errors": [
    {
      "location": "body",
      "msg": "Valid email is required",
      "param": "email"
    }
  ]
}
```

---

### Test 4: Missing Authorization Header

```bash
curl -X GET http://localhost:5000/api/auth/profile
```

**Response (401):**
```json
{
  "message": "Unauthorized: No token provided"
}
```

---

### Test 5: Invalid Token

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer invalid.token.here"
```

**Response (401):**
```json
{
  "message": "Unauthorized: Invalid token"
}
```

---

## Postman Collection

Jika menggunakan Postman, import collection berikut:

```json
{
  "info": {
    "name": "Chatbot Saung Vibe - Auth API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/auth/register",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"username\": \"testuser\", \"email\": \"test@example.com\", \"password\": \"password123\", \"confirmPassword\": \"password123\"}"
        }
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/auth/login",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"username\": \"admin\", \"password\": \"admin123\"}"
        }
      }
    },
    {
      "name": "Get Profile",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/auth/profile",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ]
      }
    },
    {
      "name": "Refresh Token",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/auth/refresh-token",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ]
      }
    }
  ]
}
```

Di Postman, set variable `token` dari response Login/Register untuk testing protected routes.
