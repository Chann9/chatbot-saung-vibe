# 🏗️ Prompt Template: Code Documentation

## Context
Digunakan untuk mendokumentasikan struktur kode, data flow, architecture patterns, dan penjelasan logic bisnis.

---

## Template Prompt

```
Buatkan dokumentasi kode untuk [COMPONENT/MODULE_NAME]:

**File Structure:**
```
src/
├── controllers/
│   └── [xxxController.ts] - [Deskripsi]
├── routes/
│   └── [xxx.ts] - [Deskripsi]
├── services/
│   └── [xxxService.ts] - [Deskripsi]
├── middleware/
│   └── [xxxMiddleware.ts] - [Deskripsi]
└── utils/
    └── [xxxUtils.ts] - [Deskripsi]
```

**Class/Interface Documentation:**
Untuk setiap class, function, atau interface penting:
- Apa tujuannya
- Input parameters (type, description)
- Return value (type, description)
- Error/exception yang bisa throw
- Usage example

**Data Flow:**
- Request masuk dari mana
- Flow melalui middleware mana
- Controller mana yang handle
- Database query apa yang dijalankan
- Response kembali ke mana

**Database Relationships:**
- Model mana yang digunakan
- Relationship antar models
- Query optimization notes
- N+1 query considerations

**Type Definitions:**
- Custom types yang digunakan
- Enum values dan meanings
- Request/response shapes
- Error response format

**Error Handling:**
- Apa error yang bisa terjadi
- Bagaimana error di-handle
- Error status codes yang di-return
- Logging strategy

**Security Considerations:**
- Input validation dilakukan di mana
- Authorization check dilakukan di mana
- Sensitive data handling
- Injection/XSS prevention

**Performance Notes:**
- Query optimization
- Caching strategy jika ada
- Potential bottlenecks
- Scaling considerations

**Dependencies:**
- External packages yang digunakan
- Internal modules yang di-import
- Version compatibility notes

**Testing Strategy:**
- Unit test coverage
- Integration test coverage
- Mock data yang digunakan
```

---

## Contoh Penggunaan

```
Buatkan dokumentasi kode untuk Chat Controller:

**File Structure:**
```
src/
├── controllers/
│   └── chatController.ts - Chat conversation & messaging logic
├── routes/
│   └── chat.ts - Chat API routes
├── services/
│   └── geminiService.ts - AI response generation
├── middleware/
│   └── auth.ts - Authentication & authorization
└── utils/
    └── validators.ts - Input validation
```

**Class/Interface Documentation:**

`ChatController.getConversations()`
- Purpose: Retrieve semua conversations milik user
- Input: req (Express Request dengan user dari token), res (Express Response)
- Return: JSON array of ChatConversation objects
- Error: 401 (Unauthorized), 500 (Server Error)
- Usage: GET /api/chat with valid Bearer token

`ChatController.sendMessage()`
- Purpose: Send message ke AI dan get response
- Input: 
  - req.params.id: conversation ID (number)
  - req.body.message: user message (string)
  - req.user.id: user ID dari JWT token
- Return: { user_message, ai_response, timestamp }
- Error: 400 (Validation), 401 (Unauthorized), 404 (Conversation not found), 429 (Chat limit exceeded)
- Usage: POST /api/chat/:id/message

**Data Flow:**

1. Request masuk ke `POST /api/chat/:id/message`
2. Express middleware: body parser parse JSON
3. Middleware `authMiddleware` - validate JWT token
4. Middleware validator - check message field
5. Controller `sendMessage()`:
   - Get conversation by ID dari database
   - Check conversation belongs to user
   - Check chat limit dari UserSettings
   - Save user message ke ChatMessage table
   - Call `geminiService.generateAIResponse()`
   - Get AI response
   - Save AI message ke ChatMessage table
   - Return both messages
6. Response kembali ke client

**Database Relationships:**

\`\`\`
User (1) -----> (Many) ChatConversation
  |                           |
  |                           |---> (Many) ChatMessage
  |
User (1) -----> (1) UserSettings (chat limits)
\`\`\`

Models digunakan:
- User: id, username, email, role
- UserSettings: id, userId, chatLimit, currentChatCount
- ChatConversation: id, userId, title, createdAt
- ChatMessage: id, conversationId, sender (USER|AI), message, createdAt

Queries:
- findUnique: Get single conversation by ID
- findMany: Get all conversations for user
- create: Save new message
- update: Update chat count

**Type Definitions:**

\`\`\`typescript
interface ChatMessage {
  id: number;
  conversationId: number;
  sender: 'USER' | 'AI';
  message: string;
  createdAt: Date;
}

interface ChatConversation {
  id: number;
  userId: number;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
}

enum MessageSender {
  USER = 'USER',
  AI = 'AI'
}
\`\`\`

**Error Handling:**

Error | Status Code | When | How to Handle
---|---|---|---
Unauthorized | 401 | No valid JWT token | Check Bearer token
Chat Limit Exceeded | 429 | User sudah mencapai limit | Check UserSettings.chatLimit
Conversation Not Found | 404 | ID tidak valid atau milik user lain | Validate ID
Validation Error | 400 | Message field kosong | Check input validation
Server Error | 500 | Database error, API error | Log error, retry later

**Security Considerations:**

- ✅ Input validation: Message harus non-empty string
- ✅ Authorization: Check user ownership of conversation
- ✅ SQL Injection prevention: Menggunakan Prisma ORM
- ✅ XSS prevention: Message di-store as-is, sanitize di frontend
- ✅ Rate limiting: Chat limit berdasarkan UserSettings
- ✅ Sensitive data: Password tidak pernah di-return

**Performance Notes:**

- Query optimization: Use indexes on userId, conversationId
- N+1 query: Include relations dalam findMany
- Caching: Tidak ada, setiap request fresh dari DB
- Bottleneck: Gemini API call bisa slow
- Scaling: Database indexing penting untuk many conversations

**Dependencies:**

- prisma: Database ORM
- @google/generative-ai: Gemini API client
- express: Web framework
- express-validator: Input validation
- jsonwebtoken: JWT handling

**Testing Strategy:**

Unit tests:
- ✓ Valid message format
- ✓ Chat limit enforcement
- ✓ Authorization checks
- ✓ Error cases

Integration tests:
- ✓ Full flow: send message → get AI response → save to DB
- ✓ Concurrent requests
- ✓ Chat limit increment
```

---

## Struktur Dokumentasi Output

```markdown
# [Component/Module Name] Documentation

## Overview
[Penjelasan umum component/module]

## Architecture Diagram
\`\`\`
[ASCII art atau text description dari architecture]
\`\`\`

## File Structure
\`\`\`
[Tree structure dari files]
\`\`\`

## Classes & Functions

### ClassName / functionName()
**Purpose:** [Apa yang dilakukan]

**Signature:**
\`\`\`typescript
functionName(param1: type, param2: type): returnType
\`\`\`

**Parameters:**
| Name | Type | Description | Required |
|------|------|-------------|----------|
| param1 | string | [Deskripsi] | Yes |
| param2 | number | [Deskripsi] | No |

**Return Value:**
- Type: [Type]
- Description: [Deskripsi]

**Throws:**
- [ErrorType]: [Deskripsi error]

**Example:**
\`\`\`typescript
const result = functionName('value', 123);
console.log(result);
\`\`\`

### Data Flow

\`\`\`
[Request] → [Middleware] → [Controller] → [Service] → [Database]
                                                            ↓
[Response] ← [Formatting] ← [Processing] ← [Result]
\`\`\`

### Type Definitions

\`\`\`typescript
interface [InterfaceName] {
  field1: type;
  field2: type;
}

enum [EnumName] {
  VALUE1 = 'value1',
  VALUE2 = 'value2'
}
\`\`\`

### Error Handling

| Error | Status | When | Solution |
|-------|--------|------|----------|
| [Error1] | 400 | [Condition] | [How to fix] |
| [Error2] | 401 | [Condition] | [How to fix] |

### Security

- [ ] Input validation: [Apa divalidasi]
- [ ] Authorization: [Bagaimana check auth]
- [ ] SQL Injection: [Prevention method]
- [ ] XSS Prevention: [Prevention method]
- [ ] Sensitive Data: [How handled]

### Performance

- **Optimizations:** [List]
- **Bottlenecks:** [List]
- **Scaling Considerations:** [List]

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| prisma | ^5.0.0 | Database ORM |
| express | ^4.0.0 | Web framework |

### Testing

**Unit Tests:**
- [ ] [Test case 1]
- [ ] [Test case 2]

**Integration Tests:**
- [ ] [Test case 1]
- [ ] [Test case 2]

### Related Components
- [Component 1]
- [Component 2]
```

---

## Best Practices

1. **Diagram & Visuals**
   - ASCII diagrams untuk data flow
   - Architecture diagram
   - Entity relationship diagram

2. **Code Examples**
   - Real examples dari codebase
   - Common usage patterns
   - Error cases

3. **Type Safety**
   - Include TypeScript interfaces
   - Type definitions jelas
   - Generic types explained

4. **Performance Notes**
   - Database query optimization
   - Caching strategy
   - Potential bottlenecks

5. **Security**
   - Input validation approach
   - Authorization checks
   - Sensitive data handling

6. **Maintenance**
   - Known issues
   - Future improvements
   - Technical debt

