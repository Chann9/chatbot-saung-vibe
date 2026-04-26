# Admin API Documentation

## Base URL
`/api/admin`

All endpoints require:
1. Authentication with JWT token in header
2. Admin role (ADMIN)

```
Authorization: Bearer <token>
```

## Endpoints

### 1. Get All Users
**GET** `/admin/users`

Dapatkan list semua user di sistem dengan settings mereka.

**Response (200):**
```json
{
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@saungvibe.com",
      "role": "ADMIN",
      "createdAt": "2026-04-05T10:00:00Z",
      "updatedAt": "2026-04-05T10:00:00Z",
      "settings": {
        "chatLimit": 100,
        "currentChatCount": 5
      }
    },
    {
      "id": 2,
      "username": "testuser",
      "email": "test@example.com",
      "role": "USER",
      "createdAt": "2026-04-05T11:00:00Z",
      "updatedAt": "2026-04-05T11:00:00Z",
      "settings": {
        "chatLimit": 10,
        "currentChatCount": 2
      }
    }
  ]
}
```

---

### 2. Get Single User
**GET** `/admin/users/:userId`

Dapatkan detail user spesifik beserta settings.

**Response (200):**
```json
{
  "message": "User retrieved successfully",
  "data": {
    "id": 2,
    "username": "testuser",
    "email": "test@example.com",
    "role": "USER",
    "createdAt": "2026-04-05T11:00:00Z",
    "updatedAt": "2026-04-05T11:00:00Z",
    "settings": {
      "chatLimit": 10,
      "currentChatCount": 2
    }
  }
}
```

**Error Responses:**
- `404`: User not found

---

### 3. Update User Chat Limit
**PUT** `/admin/users/:userId/settings`

Ubah chat limit untuk user spesifik.

**Request Body:**
```json
{
  "chatLimit": 20
}
```

**Response (200):**
```json
{
  "message": "User settings updated successfully",
  "data": {
    "id": 1,
    "userId": 2,
    "chatLimit": 20,
    "currentChatCount": 2,
    "createdAt": "2026-04-05T11:00:00Z",
    "updatedAt": "2026-04-05T14:00:00Z"
  }
}
```

**Error Responses:**
- `400`: Invalid chat limit
- `404`: User not found

---

### 4. Delete User
**DELETE** `/admin/users/:userId`

Hapus user dari sistem. Semua data (conversations, messages) akan dihapus otomatis.

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `400`: Cannot delete admin user
- `404`: User not found

---

### 5. Get System Statistics
**GET** `/admin/statistics`

Dapatkan statistik sistem keseluruhan.

**Response (200):**
```json
{
  "message": "Statistics retrieved successfully",
  "data": {
    "totalUsers": 25,
    "adminCount": 1,
    "userCount": 24,
    "totalConversations": 156,
    "totalMessages": 2341
  }
}
```

---

## Protection

- Semua endpoint dilindungi oleh `authMiddleware` (perlu token valid)
- Semua endpoint dilindungi oleh `adminMiddleware` (perlu role ADMIN)
- Jika user bukan admin, akan mendapat response 403 Forbidden

---

## Error Handling

Semua error response mengikuti format:

```json
{
  "message": "Error description"
}
```

HTTP Status Codes:
- `200 OK` - Request berhasil
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Token tidak valid
- `403 Forbidden` - Admin access required
- `404 Not Found` - Resource tidak ditemukan
- `500 Internal Server Error` - Server error

---

## Notes

- Admin user tidak bisa dihapus (untuk safety)
- Chat limit bisa set ke 0 untuk prevent user membuat conversation baru
- Ketika user dihapus, semua conversationnya ikut terhapus (cascade)
