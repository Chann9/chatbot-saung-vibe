# 🗄️ Prompt Template: Database Schema Documentation

## Context
Digunakan untuk mendokumentasikan database schema, models, relationships, indexes, dan migration strategies.

---

## Template Prompt

```
Buatkan dokumentasi lengkap database schema untuk [FEATURE_NAME]:

**Models Overview:**
- [ModelName] - [Deskripsi]
- [ModelName] - [Deskripsi]

**Detailed Model Specifications:**

Model: [ModelName]
- Purpose: [Apa tujuan model ini]
- Lifecycle: [Kapan created, kapan updated, kapan deleted]

Fields:
- id (PK): primary key, auto increment
- [fieldName] ([type]): [Deskripsi], [Constraints]
- [fieldName] ([type]): [Deskripsi], [Constraints]

Relationships:
- One-to-Many: [Model 1] → [Model 2]
- Many-to-One: [Model 1] ← [Model 2]
- One-to-One: [Model 1] ↔ [Model 2]

Indexes:
- [@index([field])] - [Alasan indexing]
- [@unique([field])] - [Alasan unique]

Constraints:
- Foreign Key: [fieldName] references [TableName](id) on Delete [CASCADE/SET NULL]
- Unique: [fieldName]
- Check: [Condition]

**Sample Data:**
\`\`\`json
{
  "id": 1,
  "field": "value",
  "createdAt": "2026-05-09T10:30:00Z"
}
\`\`\`

**Relationships Diagram:**
\`\`\`
[Diagram showing all model relationships]
\`\`\`

**Query Examples:**
- Create: [How to create new record]
- Read: [How to fetch data]
- Update: [How to update data]
- Delete: [How to delete data]
- Join queries: [Complex queries]

**Validation Rules:**
- [Field] must be: [Constraints]
- [Field] must be unique: [Scope]
- [Field] cannot be null: [Always/When]

**Migration Strategy:**
- Initial schema: [Models v1]
- Future migrations: [What might change]
- Backward compatibility: [How to handle]

**Performance Considerations:**
- Indexing strategy: [Indexes yang diperlukan]
- Query optimization: [Tips]
- Data growth estimates: [Expected scale]
- Archive/cleanup strategy: [If needed]

**Backup & Recovery:**
- Backup frequency: [Schedule]
- Recovery procedure: [Steps]
- Data retention policy: [Duration]

**Access Control:**
- User permissions per model
- Data visibility rules
- Admin-only models

**Documentation Tools:**
- Want: ER Diagram, Prisma schema, SQL schema, or all?
```

---

## Contoh Penggunaan

```
Buatkan dokumentasi lengkap database schema untuk Chat System:

**Models Overview:**
- User - Menyimpan informasi user (credentials, role)
- UserSettings - Menyimpan settings per user (chat limits)
- ChatConversation - Menyimpan percakapan/session chat
- ChatMessage - Menyimpan individual messages

**Detailed Model Specifications:**

Model: User
- Purpose: Menyimpan data user, authentication, dan role management
- Lifecycle: Created saat register, Updated saat profile changes, Deleted saat admin delete

Fields:
- id (PK): int, auto increment, primary key
- username: string, unique constraint, indexed, required
- email: string, unique constraint, required
- password: string, bcrypt hashed, required
- role: enum(ADMIN|USER), default USER
- createdAt: datetime, auto set saat created
- updatedAt: datetime, auto update saat modified

Relationships:
- One-to-Many: User → ChatConversation (user memiliki banyak conversations)
- One-to-One: User → UserSettings (user memiliki satu settings record)

Indexes:
- [@index([username])] - Untuk quick lookup saat login
- [@index([role])] - Untuk filter by admin/user
- [@unique([username])] - Prevent duplicate usernames
- [@unique([email])] - Prevent duplicate emails

Constraints:
- Foreign Key: UserSettings.userId references User.id on Delete CASCADE
- Foreign Key: ChatConversation.userId references User.id on Delete CASCADE
- Unique: username, email

Model: UserSettings
- Purpose: Menyimpan per-user settings seperti chat limit
- Lifecycle: Created saat user register, Updated saat admin ubah settings, Deleted saat user delete

Fields:
- id (PK): int, auto increment, primary key
- userId (FK): int, unique, required, references User(id)
- chatLimit: int, default 10, minimum 0
- currentChatCount: int, default 0, increments saat new conversation
- createdAt: datetime
- updatedAt: datetime

Relationships:
- Many-to-One: UserSettings → User (setiap settings belongs to one user)

Indexes:
- [@index([userId])] - Untuk quick lookup by user
- [@unique([userId])] - Ensure one settings per user

Constraints:
- Foreign Key: userId references User(id) on Delete CASCADE
- Unique: userId

Model: ChatConversation
- Purpose: Menyimpan session/conversation chat dengan AI
- Lifecycle: Created saat user buat conversation baru, Updated saat rename, Deleted saat user/admin delete

Fields:
- id (PK): int, auto increment, primary key
- userId (FK): int, required, references User(id)
- title: string, default "New Chat", max 255 chars
- createdAt: datetime
- updatedAt: datetime

Relationships:
- Many-to-One: ChatConversation → User (many conversations per user)
- One-to-Many: ChatConversation → ChatMessage (one conversation has many messages)

Indexes:
- [@index([userId])] - Untuk get all conversations for user
- [@index([createdAt])] - Untuk sorting by date

Constraints:
- Foreign Key: userId references User(id) on Delete CASCADE

Model: ChatMessage
- Purpose: Menyimpan individual messages dalam conversation (user atau AI)
- Lifecycle: Created saat message dikirim, immutable setelah created

Fields:
- id (PK): int, auto increment, primary key
- conversationId (FK): int, required, references ChatConversation(id)
- sender: enum(USER|AI), required, indicates who sent message
- message: longtext, required, bisa very long
- createdAt: datetime
- updatedAt: datetime

Relationships:
- Many-to-One: ChatMessage → ChatConversation (many messages per conversation)

Indexes:
- [@index([conversationId])] - Untuk get all messages in conversation
- [@index([sender])] - Untuk filter by user/ai messages
- [@index([createdAt])] - Untuk sorting by date

Constraints:
- Foreign Key: conversationId references ChatConversation(id) on Delete CASCADE

**Sample Data:**

User:
\`\`\`json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "password": "$2b$10$...(hashed)...",
  "role": "ADMIN",
  "createdAt": "2026-05-09T10:30:00Z",
  "updatedAt": "2026-05-09T10:30:00Z"
}
\`\`\`

ChatConversation:
\`\`\`json
{
  "id": 1,
  "userId": 1,
  "title": "REST API Discussion",
  "createdAt": "2026-05-09T11:00:00Z",
  "updatedAt": "2026-05-09T11:00:00Z"
}
\`\`\`

ChatMessage:
\`\`\`json
{
  "id": 1,
  "conversationId": 1,
  "sender": "USER",
  "message": "Apa itu REST API?",
  "createdAt": "2026-05-09T11:05:00Z",
  "updatedAt": "2026-05-09T11:05:00Z"
}
\`\`\`

**Relationships Diagram:**

\`\`\`
┌─────────────┐
│   User      │
│ id (PK)     │
│ username    │─────┐
│ email       │     │
│ password    │     │
│ role        │     │ (1:1)
│ createdAt   │     │
└─────────────┘     │
       │            │
       │ (1:Many)   │
       │            ├──→ ┌──────────────┐
       │            │    │UserSettings  │
       │            │    │ id (PK)      │
       │            │    │ userId (FK)  │
       │            │    │ chatLimit    │
       │            └──→ │ currentCount │
       │                 │ createdAt    │
       │                 └──────────────┘
       │
       │ (1:Many)
       │
       └──→ ┌──────────────────┐
            │ChatConversation  │
            │ id (PK)          │
            │ userId (FK)      │
            │ title            │
            │ createdAt        │
            └──────────────────┘
                     │
                     │ (1:Many)
                     │
                     └──→ ┌──────────────┐
                          │ ChatMessage  │
                          │ id (PK)      │
                          │ convId (FK)  │
                          │ sender       │
                          │ message      │
                          │ createdAt    │
                          └──────────────┘
\`\`\`

**Query Examples:**

Create User:
\`\`\`sql
INSERT INTO User (username, email, password, role)
VALUES ('testuser', 'test@example.com', '<hashed_password>', 'USER');
\`\`\`

Get User with Settings:
\`\`\`sql
SELECT u.*, us.chatLimit, us.currentChatCount
FROM User u
LEFT JOIN UserSettings us ON u.id = us.userId
WHERE u.id = 1;
\`\`\`

Get All Conversations for User:
\`\`\`sql
SELECT * FROM ChatConversation
WHERE userId = 1
ORDER BY createdAt DESC;
\`\`\`

Get All Messages in Conversation:
\`\`\`sql
SELECT * FROM ChatMessage
WHERE conversationId = 1
ORDER BY createdAt ASC;
\`\`\`

Complex: Get Latest Message from Each User Conversation:
\`\`\`sql
SELECT c.*, cm.message, cm.sender, cm.createdAt
FROM ChatConversation c
LEFT JOIN ChatMessage cm ON c.id = cm.conversationId
WHERE c.userId = 1 AND cm.id IN (
  SELECT MAX(id) FROM ChatMessage
  GROUP BY conversationId
)
ORDER BY c.createdAt DESC;
\`\`\`

**Validation Rules:**
- username: min 3 chars, max 50 chars, alphanumeric + underscore only
- email: valid email format, unique across system
- password: min 6 chars, bcrypt hashed before store
- role: only ADMIN or USER values
- title: min 1 char, max 255 chars, cannot be empty
- message: cannot be empty, max 10000 chars
- chatLimit: must be positive integer, default 10
- currentChatCount: auto managed, should not exceed chatLimit

**Migration Strategy:**

Current Version: v1 (5 May 2026)
- Initial schema with User, UserSettings, ChatConversation, ChatMessage

Future Migrations:
- v2: Add soft deletes (deleted_at field)
- v3: Add message reactions/likes system
- v4: Add conversation categories/folders
- v5: Add message search/full-text indexing

Backward Compatibility:
- Always add columns with default values
- Never remove columns without deprecation period
- Use migrations for schema changes

**Performance Considerations:**

Indexing Strategy:
- Index userId on ChatConversation (high cardinality)
- Index conversationId on ChatMessage (high cardinality)
- Index role on User (low cardinality, but used in joins)
- Index createdAt for sorting and date range queries

Query Optimization:
- Use SELECT specific columns, not SELECT *
- Use JOIN instead of N+1 queries
- Paginate large result sets (messages)
- Cache frequently accessed data (user settings)

Data Growth Estimates:
- 10,000 users → ~500MB
- 100,000 conversations → ~50MB
- 1,000,000 messages → ~1GB
- Monitor database size monthly

Archive Strategy:
- Archive old conversations after 1 year
- Keep last 50 conversations per user active
- Implement soft deletes for recovery

**Backup & Recovery:**
- Frequency: Daily full backup, hourly incremental
- Retention: 30 days backup history
- Recovery: Point-in-time recovery available
- Test recovery monthly

**Access Control:**
- All Users: Can read own conversations/messages
- Admins: Can read all user data
- Admins: Can modify user settings
- Admins: Can delete users and all related data

```

---

## Struktur Dokumentasi Output

```markdown
# Database Schema Documentation

## Overview
[General overview of database]

## Entity Relationship Diagram (ERD)
\`\`\`
[ASCII or visual ER diagram]
\`\`\`

## Models

### [ModelName]

**Purpose**
[Apa purpose dari model]

**Lifecycle**
- Create: [When created]
- Update: [When updated]
- Delete: [When deleted]

**Fields**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | int | PK, Auto | Primary key |
| field1 | string | Unique | [Description] |
| field2 | int | FK | References [Table]([Field]) |

**Relationships**
- [Relationship 1]
- [Relationship 2]

**Indexes**
\`\`\`
@index([field1]) - For quick lookups
@unique([field2]) - Ensure uniqueness
\`\`\`

**Example Record**
\`\`\`json
{
  "id": 1,
  "field1": "value",
  "createdAt": "2026-05-09T10:30:00Z"
}
\`\`\`

## Relationships

\`\`\`
[Relationship diagram]
\`\`\`

## Common Queries

### Query Name
\`\`\`sql
SELECT ...
\`\`\`

## Validation Rules

| Field | Rule |
|-------|------|
| field1 | [Constraint] |
| field2 | [Constraint] |

## Performance Optimization

**Indexes:**
- [Index 1] - [Reason]
- [Index 2] - [Reason]

**N+1 Query Prevention:**
- [Strategy]

**Query Optimization:**
- [Optimization]

## Migration History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-05-09 | Initial schema |
| 1.1 | [Date] | [Changes] |

## Backup & Recovery

- Backup Frequency: [Schedule]
- Recovery Time Objective (RTO): [Duration]
- Recovery Point Objective (RPO): [Duration]
```

---

## Best Practices

1. **Include Diagrams**
   - ER Diagram (Entity Relationship)
   - Data flow diagrams
   - Relationship visualizations

2. **Document All Constraints**
   - Primary keys
   - Foreign keys
   - Unique constraints
   - Check constraints

3. **Sample Data**
   - Real examples dari aplikasi
   - Include edge cases
   - Show actual data types

4. **Query Examples**
   - CRUD operations
   - Complex joins
   - Pagination examples
   - Performance tips

5. **Migration Planning**
   - Version history
   - Future schema changes
   - Backward compatibility strategy

6. **Performance**
   - Index strategy dengan reasoning
   - Query optimization tips
   - Growth estimates
   - Archive strategy

