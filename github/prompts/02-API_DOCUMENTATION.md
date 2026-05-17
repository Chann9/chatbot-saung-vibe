# 📚 Prompt Template: API Documentation

## Context
Digunakan untuk membuat atau mengupdate dokumentasi lengkap API endpoints, termasuk request/response format, error handling, dan examples.

---

## Template Prompt

```
Buatkan dokumentasi lengkap untuk API [FEATURE_NAME]:

**Endpoints Overview:**
- [METHOD] /api/[route] - [Deskripsi endpoint]
- [METHOD] /api/[route]/:id - [Deskripsi endpoint]

**Feature Details:**
- Tujuan fitur: [Penjelasan]
- User role yang bisa akses: [ADMIN, USER, PUBLIC]
- Authentication required: [true/false]
- Rate limit: [jika ada]

**Endpoints yang perlu didokumentasi:**
1. [METHOD] /api/[route]
   - Purpose: [Apa yang endpoint ini lakukan]
   - Request body: [Contoh request]
   - Response: [Contoh response sukses]
   - Error cases: [List error yang mungkin terjadi]
   - Status codes: [200, 201, 400, 404, 500, dll]

**Technical Details:**
- Controller file: [src/controllers/xxxController.ts]
- Database models: [Model1, Model2]
- Validation rules: [Apa yang divalidasi]
- Special logic: [Business logic khusus]

**Documentation Format:**
- Include request/response examples
- List semua status codes yang mungkin
- Jelaskan error cases dan cara handle
- Include pagination jika ada
- Include timestamps dan metadata

**Integration Notes:**
- Endpoint ini digunakan oleh: [frontend page/component]
- Dependencies ke endpoints lain: [Jika ada]
- Known limitations: [Jika ada]
```

---

## Contoh Penggunaan

```
Buatkan dokumentasi lengkap untuk API Chat Features:

**Endpoints Overview:**
- POST /api/chat - Buat conversation baru
- GET /api/chat - Get semua conversations
- GET /api/chat/:id - Get single conversation
- PUT /api/chat/:id - Rename conversation
- DELETE /api/chat/:id - Delete conversation
- POST /api/chat/:id/message - Send message & get AI response
- GET /api/chat/:id/messages - Get semua messages dalam conversation

**Feature Details:**
- Tujuan fitur: Manage chat conversations dengan Gemini AI
- User role yang bisa akses: USER, ADMIN
- Authentication required: true
- Rate limit: Per user berdasarkan chat limit

**Endpoints yang perlu didokumentasi:**
1. POST /api/chat
   - Purpose: Membuat conversation baru
   - Request body: { "title": "string" }
   - Response: { "id": 1, "userId": 1, "title": "string", "createdAt": "ISO8601", "updatedAt": "ISO8601" }
   - Error cases: Unauthorized (401), Chat limit exceeded (429), Validation error (400)
   - Status codes: 201, 400, 401, 429, 500

**Technical Details:**
- Controller file: src/controllers/chatController.ts
- Database models: ChatConversation, ChatMessage, User, UserSettings
- Validation rules: Title harus string 1-255 chars, User harus authenticated
- Special logic: Check chat limit dari UserSettings sebelum create

**Documentation Format:**
- Include cURL examples
- List semua 7 status codes
- Jelaskan error: "Chat limit exceeded - User sudah mencapai limit conversations"
- Include timestamp fields
- Include user ownership validation

**Integration Notes:**
- Digunakan oleh: Chat page di frontend
- Dependencies: AUTH API untuk token, Admin API untuk manage limits
- Known limitations: Maximum 10 conversations untuk USER, 100 untuk ADMIN
```

---
## Struktur Dokumentasi Output

```markdown
## [ENDPOINT_NAME]

### Endpoint
\`\`\`
[METHOD] /api/[route]
\`\`\`

### Description
[Deskripsi endpoint]

### Authentication
- Required: true/false
- Type: Bearer Token
- Role required: [ADMIN/USER]

### Request

#### Headers
\`\`\`
Authorization: Bearer <token>
Content-Type: application/json
\`\`\`

#### Body
\`\`\`json
{
  "field": "type",
  "field2": "type"
}
\`\`\`

#### Query Parameters (if any)
- `param1`: type - description
- `param2`: type - description

### Response

#### Success (Status 200/201)
\`\`\`json
{
  "id": 1,
  "field": "value",
  "createdAt": "2026-05-09T10:30:00Z"
}
\`\`\`

#### Error Cases

**Status 400 - Bad Request**
\`\`\`json
{
  "error": "Validation failed",
  "details": "Title is required"
}
\`\`\`

**Status 401 - Unauthorized**
\`\`\`json
{
  "error": "Invalid token or not authenticated"
}
\`\`\`

**Status 403 - Forbidden**
\`\`\`json
{
  "error": "Insufficient permissions"
}
\`\`\`

**Status 404 - Not Found**
\`\`\`json
{
  "error": "Resource not found"
}
\`\`\`

**Status 429 - Too Many Requests**
\`\`\`json
{
  "error": "Chat limit exceeded"
}
\`\`\`

**Status 500 - Internal Server Error**
\`\`\`json
{
  "error": "Internal server error"
}
\`\`\`

### Examples

#### cURL
\`\`\`bash
curl -X [METHOD] http://localhost:5000/api/[route] \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "field": "value"
  }'
\`\`\`

#### JavaScript/Node.js
\`\`\`javascript
const response = await fetch('http://localhost:5000/api/[route]', {
  method: '[METHOD]',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    field: 'value'
  })
});
const data = await response.json();
\`\`\`

### Validation Rules
- [Rule 1]
- [Rule 2]

### Business Logic
- [Logic 1]
- [Logic 2]

### Related Endpoints
- [Endpoint 1]
- [Endpoint 2]
```

---
## Best Practices

1. **Include Code Examples**
   - cURL untuk testing
   - JavaScript untuk frontend
   - Jika bisa, include Python, PHP, dll

2. **Dokumentasi Error yang Jelas**
   - Setiap status code harus dijelaskan
   - Include contoh response untuk setiap error case
   - Jelaskan penyebab dan cara handle error

3. **Contoh Request/Response Real**
   - Jangan generic, gunakan data real dari aplikasi
   - Include timestamps, IDs, fields yang aktual

4. **API Versioning**
   - Jika ada, dokumentasikan version compatibility
   - Dokumentasikan deprecated endpoints

5. **Security Notes**
   - Catat security considerations
   - Jelaskan rate limiting jika ada
   - Dokumentasikan yang bisa diakses public vs private

---
## Tools untuk Generate Dokumentasi

- **Swagger/OpenAPI**: Generate interactive documentation
- **Postman**: Export collection sebagai dokumentasi
- **.http files**: VS Code REST Client untuk quick reference
- **Markdown**: Untuk dokumentasi umum dan GitHub