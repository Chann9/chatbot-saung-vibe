# Chat API Documentation

## Base URL
`/api/chat`

All endpoints require authentication with JWT token in header:
```
Authorization: Bearer <token>
```

## Endpoints

### 1. Get All Conversations
**GET** `/api/chat`

Dapatkan semua conversation untuk user yang sedang login.

**Response (200):**
```json
{
  "message": "Conversations retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "First Chat",
      "createdAt": "2026-04-05T10:00:00Z",
      "updatedAt": "2026-04-05T12:00:00Z",
      "messages": [
        {
          "message": "Last message preview..."
        }
      ]
    }
  ]
}
```

---

### 2. Create New Conversation
**POST** `/api/chat`

Buat conversation baru. User tidak bisa membuat conversation lebih dari chat limit.

**Request Body:**
```json
{
  "title": "My Chat Topic"
}
```

Title optional, jika tidak diberikan akan default "New Chat"

**Response (201):**
```json
{
  "message": "Conversation created successfully",
  "data": {
    "id": 2,
    "userId": 1,
    "title": "My Chat Topic",
    "createdAt": "2026-04-05T10:00:00Z",
    "updatedAt": "2026-04-05T10:00:00Z"
  }
}
```

**Error Responses:**
- `400`: Chat limit reached
- `404`: User settings not found

---

### 3. Get Single Conversation
**GET** `/api/chat/:conversationId`

Dapatkan conversation spesifik beserta semua messages.

**Response (200):**
```json
{
  "message": "Conversation retrieved successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "title": "First Chat",
    "createdAt": "2026-04-05T10:00:00Z",
    "updatedAt": "2026-04-05T12:00:00Z",
    "messages": [
      {
        "id": 1,
        "conversationId": 1,
        "sender": "USER",
        "message": "Halo, apa itu AI?",
        "createdAt": "2026-04-05T10:01:00Z",
        "updatedAt": "2026-04-05T10:01:00Z"
      },
      {
        "id": 2,
        "conversationId": 1,
        "sender": "AI",
        "message": "AI adalah Artificial Intelligence...",
        "createdAt": "2026-04-05T10:02:00Z",
        "updatedAt": "2026-04-05T10:02:00Z"
      }
    ]
  }
}
```

**Error Responses:**
- `404`: Conversation not found

---

### 4. Rename Conversation
**PUT** `/api/chat/:conversationId`

Ubah title conversation.

**Request Body:**
```json
{
  "title": "New Title"
}
```

**Response (200):**
```json
{
  "message": "Conversation renamed successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "title": "New Title",
    "createdAt": "2026-04-05T10:00:00Z",
    "updatedAt": "2026-04-05T12:00:00Z"
  }
}
```

**Error Responses:**
- `400`: Title is empty
- `404`: Conversation not found

---

### 5. Delete Conversation
**DELETE** `/api/chat/:conversationId`

Hapus conversation dan semua messages.

**Response (200):**
```json
{
  "message": "Conversation deleted successfully"
}
```

**Error Responses:**
- `404`: Conversation not found

---

### 6. Send Message & Get AI Response
**POST** `/api/chat/:conversationId/message`

Kirim message dari user dan dapatkan response dari AI Gemini.

**Request Body:**
```json
{
  "message": "Apa itu machine learning?"
}
```

**Response (200):**
```json
{
  "message": "Message sent successfully",
  "data": {
    "userMessage": {
      "id": 10,
      "conversationId": 1,
      "sender": "USER",
      "message": "Apa itu machine learning?",
      "createdAt": "2026-04-05T12:00:00Z",
      "updatedAt": "2026-04-05T12:00:00Z"
    },
    "aiMessage": {
      "id": 11,
      "conversationId": 1,
      "sender": "AI",
      "message": "Machine learning adalah cabang AI yang memungkinkan komputer belajar dari data...",
      "createdAt": "2026-04-05T12:00:01Z",
      "updatedAt": "2026-04-05T12:00:01Z"
    }
  }
}
```

**Error Responses:**
- `400`: Message is empty
- `404`: Conversation not found
- `500`: AI service error (akan mengembalikan error message)

---

### 7. Get Messages for Conversation
**GET** `/api/chat/:conversationId/messages`

Dapatkan semua messages dalam conversation tertentu.

**Response (200):**
```json
{
  "message": "Messages retrieved successfully",
  "data": [
    {
      "id": 1,
      "conversationId": 1,
      "sender": "USER",
      "message": "Halo",
      "createdAt": "2026-04-05T10:01:00Z",
      "updatedAt": "2026-04-05T10:01:00Z"
    },
    {
      "id": 2,
      "conversationId": 1,
      "sender": "AI",
      "message": "Halo! Ada yang bisa saya bantu?",
      "createdAt": "2026-04-05T10:02:00Z",
      "updatedAt": "2026-04-05T10:02:00Z"
    }
  ]
}
```

**Error Responses:**
- `404`: Conversation not found

---

## Message Sender Types

- `USER` - Message dari user
- `AI` - Message dari AI Gemini

---

## Chat Limit System

Setiap user memiliki limit chat yang bisa dibuat:
- Default user: 10 conversations
- Admin: 100 conversations

Limit dapat diubah oleh admin melalui admin API.

**Kondisi:**
- User tidak bisa membuat conversation baru jika sudah mencapai limit
- Ketika conversation dihapus, counter akan berkurang
- Counter tidak reset otomatis

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
- `201 Created` - Resource dibuat
- `400 Bad Request` - Validation error atau chat limit tercapai
- `401 Unauthorized` - Token tidak valid
- `404 Not Found` - Resource tidak ditemukan
- `500 Internal Server Error` - Server error
