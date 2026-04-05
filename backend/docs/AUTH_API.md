# Authentication API Documentation

## Endpoints

### 1. Register User
**POST** `/api/auth/register`

Register user baru ke sistem.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Validation Rules:**
- `username`: Minimal 3 karakter, hanya huruf/angka/underscore
- `email`: Format email yang valid
- `password`: Minimal 6 karakter
- `confirmPassword`: Harus sama dengan password

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Validation failed (missing fields, invalid format)
- `409`: Username atau email sudah terdaftar
- `500`: Internal server error

---

### 2. Login User
**POST** `/api/auth/login`

Login dengan username dan password.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Username atau password tidak diberikan
- `401`: Username atau password salah
- `500`: Internal server error

---

### 3. Refresh Token
**POST** `/api/auth/refresh-token`

Refresh JWT token untuk memperpanjang session.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Token refreshed successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401`: Token tidak valid atau expired
- `404`: User tidak ditemukan
- `500`: Internal server error

---

### 4. Get Profile
**GET** `/api/auth/profile`

Dapatkan informasi profile user yang sedang login.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER",
    "settings": {
      "id": 1,
      "userId": 1,
      "chatLimit": 10,
      "currentChatCount": 0,
      "createdAt": "2026-04-05T10:00:00Z",
      "updatedAt": "2026-04-05T10:00:00Z"
    }
  }
}
```

**Error Responses:**
- `401`: Token tidak valid
- `404`: User tidak ditemukan
- `500`: Internal server error

---

## Authentication

Semua endpoint yang membutuhkan authentication harus menyertakan JWT token di header:

```
Authorization: Bearer <token>
```

Token dihasilkan saat register atau login dan berlaku selama 24 jam.

## Default Admin Account

Saat database di-seed, akun admin default akan dibuat:

- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@saungvibe.com`
- **Role**: `ADMIN`

⚠️ **PENTING**: Ubah password admin di production environment!

## Error Handling

Semua error response mengikuti format:

```json
{
  "message": "Error description"
}
```

atau untuk validation errors:

```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```
