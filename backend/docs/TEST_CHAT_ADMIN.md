# Testing Chat & Admin API

Complete testing guide untuk Chat dan Admin endpoints.

## Prerequisites

1. Server sudah berjalan: `npm run dev`
2. Database sudah setup: `npm run seed`
3. Ada token dari login admin atau user

## Test Flow

### Step 1: Login untuk mendapat token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Response:
```json
{
  "message": "Login successful",
  "user": {"id":1,"username":"admin","email":"admin@saungvibe.com","role":"ADMIN"},
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Save token:
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Chat API Tests

### 1. Create New Conversation

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Programming Discussion"}'
```

Response:
```json
{
  "message": "Conversation created successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "title": "Programming Discussion",
    "createdAt": "2026-04-05T10:00:00Z",
    "updatedAt": "2026-04-05T10:00:00Z"
  }
}
```

Save conversation ID:
```bash
CONV_ID=1
```

---

### 2. Get All Conversations

```bash
curl -X GET http://localhost:5000/api/chat \
  -H "Authorization: Bearer $TOKEN"
```

Response:
```json
{
  "message": "Conversations retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Programming Discussion",
      "createdAt": "2026-04-05T10:00:00Z",
      "updatedAt": "2026-04-05T10:00:00Z",
      "messages": []
    }
  ]
}
```

---

### 3. Send Message & Get AI Response

```bash
curl -X POST http://localhost:5000/api/chat/$CONV_ID/message \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Apa itu REST API?"}'
```

Response:
```json
{
  "message": "Message sent successfully",
  "data": {
    "userMessage": {
      "id": 1,
      "conversationId": 1,
      "sender": "USER",
      "message": "Apa itu REST API?",
      "createdAt": "2026-04-05T10:01:00Z"
    },
    "aiMessage": {
      "id": 2,
      "conversationId": 1,
      "sender": "AI",
      "message": "REST API adalah arsitektur untuk web services...",
      "createdAt": "2026-04-05T10:01:01Z"
    }
  }
}
```

---

### 4. Get Single Conversation with Messages

```bash
curl -X GET http://localhost:5000/api/chat/$CONV_ID \
  -H "Authorization: Bearer $TOKEN"
```

Response:
```json
{
  "message": "Conversation retrieved successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "title": "Programming Discussion",
    "createdAt": "2026-04-05T10:00:00Z",
    "updatedAt": "2026-04-05T10:01:01Z",
    "messages": [
      {
        "id": 1,
        "conversationId": 1,
        "sender": "USER",
        "message": "Apa itu REST API?"
      },
      {
        "id": 2,
        "conversationId": 1,
        "sender": "AI",
        "message": "REST API adalah arsitektur untuk web services..."
      }
    ]
  }
}
```

---

### 5. Get All Messages

```bash
curl -X GET http://localhost:5000/api/chat/$CONV_ID/messages \
  -H "Authorization: Bearer $TOKEN"
```

---

### 6. Rename Conversation

```bash
curl -X PUT http://localhost:5000/api/chat/$CONV_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Web Development Guide"}'
```

---

### 7. Delete Conversation

```bash
curl -X DELETE http://localhost:5000/api/chat/$CONV_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## Admin API Tests

### 1. Get All Users

```bash
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer $TOKEN"
```

Response:
```json
{
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@saungvibe.com",
      "role": "ADMIN",
      "settings": {"chatLimit": 100, "currentChatCount": 0}
    },
    {
      "id": 2,
      "username": "testuser",
      "email": "test@example.com",
      "role": "USER",
      "settings": {"chatLimit": 10, "currentChatCount": 1}
    }
  ]
}
```

---

### 2. Get Single User

```bash
curl -X GET http://localhost:5000/api/admin/users/2 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 3. Update User Chat Limit

```bash
curl -X PUT http://localhost:5000/api/admin/users/2/settings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"chatLimit":20}'
```

---

### 4. Get System Statistics

```bash
curl -X GET http://localhost:5000/api/admin/statistics \
  -H "Authorization: Bearer $TOKEN"
```

Response:
```json
{
  "message": "Statistics retrieved successfully",
  "data": {
    "totalUsers": 2,
    "adminCount": 1,
    "userCount": 1,
    "totalConversations": 1,
    "totalMessages": 2
  }
}
```

---

### 5. Delete User

```bash
curl -X DELETE http://localhost:5000/api/admin/users/2 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Error Test Cases

### Test: Chat Limit Exceeded

Create 10+ conversations dengan user biasa, maka akan error:

```bash
# Attempt to create 11th conversation as regular user
curl -X POST http://localhost:5000/api/chat \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Conversation 11"}'
```

Response:
```json
{
  "message": "Chat limit reached. Current: 10/10"
}
```

---

### Test: Access Denied (Non-Admin trying to access Admin API)

```bash
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer $USER_TOKEN"
```

Response:
```json
{
  "message": "Forbidden: Admin access required"
}
```

---

### Test: Unauthorized (No Token)

```bash
curl -X GET http://localhost:5000/api/chat
```

Response:
```json
{
  "message": "Unauthorized: No token provided"
}
```

---

## Postman Collection

Import sebagai environment variables:
```
TOKEN = <your_token_here>
CONV_ID = <conversation_id_here>
BASE_URL = http://localhost:5000
```

Then use dalam requests:
```
{{BASE_URL}}/api/chat
Authorization: Bearer {{TOKEN}}
```

---

## Notes

- Semua chat endpoint memerlukan token
- Semua admin endpoint memerlukan token + admin role
- Chat limit default untuk user adalah 10
- Ketika conversation dihapus, chat count berkurang
- Message tidak bisa dihapus individual, hanya bisa dengan delete conversation
