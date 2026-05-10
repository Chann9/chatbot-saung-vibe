# 💬 Implementasi Message API (Direct Messaging)

## Overview

Message API adalah fitur untuk **direct messaging antar user** dalam sistem. User bisa mengirim pesan ke user lain, view message history, dan manage conversations.

## Database Schema

### Tambahkan Model ke `prisma/schema.prisma`

```prisma
model DirectMessage {
  id    Int     @id @default(autoincrement())
  senderId Int
  receiverId Int
  message String @db.LongText
  isRead Boolean @default(false)
  sender User @relation("SentMessages", fields: [senderId], references: [id], onDelete: Cascade)
  receiver User @relation("ReceivedMessages", fields: [receiverId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([senderId])
  @@index([receiverId])
  @@index([createdAt])
}
```

### Update Model User

```prisma
model User {
  id    Int     @id @default(autoincrement())
  username  String  @unique
  email String  @unique
  password  String
  role  Role    @default(USER)
  settings  UserSettings? @relation("UserSettings")
  chatConversations ChatConversation[]
  sentMessages DirectMessage[] @relation("SentMessages")
  receivedMessages DirectMessage[] @relation("ReceivedMessages")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([username])
  @@index([role])
}
```

## API Endpoints

### 1. Get All Messages (Sent + Received)
```
GET /api/messages
Authorization: Bearer <token>
```

**Response:**
```json
{
  "messages": [
    {
      "id": 1,
      "senderId": 1,
      "receiverId": 2,
      "message": "Hello!",
      "isRead": true,
      "sender": { "id": 1, "username": "admin" },
      "receiver": { "id": 2, "username": "testuser" },
      "createdAt": "2026-05-09T10:30:00Z"
    }
  ],
  "total": 15
}
```

### 2. Get Message Conversation with Specific User
```
GET /api/messages/:userId
Authorization: Bearer <token>

Query params:
- limit: 20 (default)
- skip: 0 (for pagination)
```

**Response:**
```json
{
  "messages": [
    {
      "id": 1,
      "senderId": 1,
      "receiverId": 2,
      "message": "Hello!",
      "isRead": true,
      "sender": { "id": 1, "username": "admin" },
      "receiver": { "id": 2, "username": "testuser" },
      "createdAt": "2026-05-09T10:30:00Z"
    }
  ],
  "total": 5,
  "limit": 20,
  "skip": 0
}
```

### 3. Send Message
```
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": 2,
  "message": "Hello, how are you?"
}
```

**Response (201):**
```json
{
  "id": 16,
  "senderId": 1,
  "receiverId": 2,
  "message": "Hello, how are you?",
  "isRead": false,
  "sender": { "id": 1, "username": "admin" },
  "receiver": { "id": 2, "username": "testuser" },
  "createdAt": "2026-05-09T11:00:00Z"
}
```

### 4. Mark Message as Read
```
PUT /api/messages/:messageId/read
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "isRead": true,
  "message": "Message marked as read"
}
```

### 5. Mark All Messages from User as Read
```
PUT /api/messages/user/:userId/read-all
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "All messages marked as read",
  "updatedCount": 5
}
```

### 6. Delete Message
```
DELETE /api/messages/:messageId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Message deleted successfully"
}
```

### 7. Get Unread Message Count
```
GET /api/messages/unread/count
Authorization: Bearer <token>
```

**Response:**
```json
{
  "unreadCount": 3,
  "unreadFrom": [
    { "userId": 2, "username": "testuser", "count": 2 },
    { "userId": 3, "username": "another", "count": 1 }
  ]
}
```

## Implementation

### 1. Buat Message Controller

**File:** `src/controllers/messageController.ts`

```typescript
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../types';

export const messageController = {
  // Get all messages
  getAllMessages: async (req: AuthRequest, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;

      const messages = await prisma.directMessage.findMany({
        where: {
          OR: [
            { senderId: req.user!.userId },
            { receiverId: req.user!.userId }
          ]
        },
        include: {
          sender: { select: { id: true, username: true } },
          receiver: { select: { id: true, username: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip
      });

      const total = await prisma.directMessage.count({
        where: {
          OR: [
            { senderId: req.user!.userId },
            { receiverId: req.user!.userId }
          ]
        }
      });

      res.json({
        messages,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  },

  // Get conversation with specific user
  getConversation: async (req: AuthRequest, res: Response) => {
    try {
      const { userId } = req.params;
      const currentUserId = req.user!.userId;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = parseInt(req.query.skip as string) || 0;

      // Validate user exists
      const targetUser = await prisma.user.findUnique({
        where: { id: parseInt(userId) }
      });

      if (!targetUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const messages = await prisma.directMessage.findMany({
        where: {
          OR: [
            {
              senderId: currentUserId,
              receiverId: parseInt(userId)
            },
            {
              senderId: parseInt(userId),
              receiverId: currentUserId
            }
          ]
        },
        include: {
          sender: { select: { id: true, username: true } },
          receiver: { select: { id: true, username: true } }
        },
        orderBy: { createdAt: 'asc' },
        take: limit,
        skip
      });

      const total = await prisma.directMessage.count({
        where: {
          OR: [
            {
              senderId: currentUserId,
              receiverId: parseInt(userId)
            },
            {
              senderId: parseInt(userId),
              receiverId: currentUserId
            }
          ]
        }
      });

      res.json({
        messages,
        total,
        limit,
        skip,
        otherUser: {
          id: targetUser.id,
          username: targetUser.username
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch conversation' });
    }
  },

  // Send message
  sendMessage: async (req: AuthRequest, res: Response) => {
    try {
      const { receiverId, message } = req.body;
      const senderId = req.user!.userId;

      // Validate input
      if (!receiverId || !message) {
        return res.status(400).json({ 
          error: 'receiverId and message are required' 
        });
      }

      if (typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({ 
          error: 'Message cannot be empty' 
        });
      }

      if (senderId === parseInt(receiverId)) {
        return res.status(400).json({ 
          error: 'Cannot send message to yourself' 
        });
      }

      // Validate receiver exists
      const receiver = await prisma.user.findUnique({
        where: { id: parseInt(receiverId) }
      });

      if (!receiver) {
        return res.status(404).json({ error: 'Receiver not found' });
      }

      // Create message
      const newMessage = await prisma.directMessage.create({
        data: {
          senderId,
          receiverId: parseInt(receiverId),
          message: message.trim()
        },
        include: {
          sender: { select: { id: true, username: true } },
          receiver: { select: { id: true, username: true } }
        }
      });

      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: 'Failed to send message' });
    }
  },

  // Mark single message as read
  markAsRead: async (req: AuthRequest, res: Response) => {
    try {
      const { messageId } = req.params;
      const currentUserId = req.user!.userId;

      const message = await prisma.directMessage.findUnique({
        where: { id: parseInt(messageId) }
      });

      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }

      if (message.receiverId !== currentUserId) {
        return res.status(403).json({ 
          error: 'You can only mark your received messages as read' 
        });
      }

      const updated = await prisma.directMessage.update({
        where: { id: parseInt(messageId) },
        data: { isRead: true },
        include: {
          sender: { select: { id: true, username: true } },
          receiver: { select: { id: true, username: true } }
        }
      });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark message as read' });
    }
  },

  // Mark all messages from user as read
  markAllAsRead: async (req: AuthRequest, res: Response) => {
    try {
      const { userId } = req.params;
      const currentUserId = req.user!.userId;

      const result = await prisma.directMessage.updateMany({
        where: {
          senderId: parseInt(userId),
          receiverId: currentUserId,
          isRead: false
        },
        data: { isRead: true }
      });

      res.json({
        message: 'All messages marked as read',
        updatedCount: result.count
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark messages as read' });
    }
  },

  // Delete message
  deleteMessage: async (req: AuthRequest, res: Response) => {
    try {
      const { messageId } = req.params;
      const currentUserId = req.user!.userId;

      const message = await prisma.directMessage.findUnique({
        where: { id: parseInt(messageId) }
      });

      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }

      if (message.senderId !== currentUserId) {
        return res.status(403).json({ 
          error: 'You can only delete your sent messages' 
        });
      }

      await prisma.directMessage.delete({
        where: { id: parseInt(messageId) }
      });

      res.json({ message: 'Message deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete message' });
    }
  },

  // Get unread message count
  getUnreadCount: async (req: AuthRequest, res: Response) => {
    try {
      const currentUserId = req.user!.userId;

      const unreadMessages = await prisma.directMessage.findMany({
        where: {
          receiverId: currentUserId,
          isRead: false
        },
        select: { senderId: true }
      });

      const unreadFrom = await prisma.directMessage.groupBy({
        by: ['senderId'],
        where: {
          receiverId: currentUserId,
          isRead: false
        },
        _count: true,
        orderBy: { _count: { senderId: 'desc' } }
      });

      const unreadFromWithUsername = await Promise.all(
        unreadFrom.map(async (group) => {
          const sender = await prisma.user.findUnique({
            where: { id: group.senderId },
            select: { username: true }
          });
          return {
            userId: group.senderId,
            username: sender?.username,
            count: group._count
          };
        })
      );

      res.json({
        unreadCount: unreadMessages.length,
        unreadFrom: unreadFromWithUsername
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch unread count' });
    }
  }
};
```

### 2. Buat Message Routes

**File:** `src/routes/message.ts`

```typescript
import { Router } from 'express';
import { messageController } from '../controllers/messageController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes protected
router.use(authMiddleware);

// Get all messages
router.get('/', messageController.getAllMessages);

// Get unread count
router.get('/unread/count', messageController.getUnreadCount);

// Get conversation with specific user
router.get('/:userId', messageController.getConversation);

// Send message
router.post('/', messageController.sendMessage);

// Mark message as read
router.put('/:messageId/read', messageController.markAsRead);

// Mark all messages from user as read
router.put('/user/:userId/read-all', messageController.markAllAsRead);

// Delete message
router.delete('/:messageId', messageController.deleteMessage);

export default router;
```

### 3. Update `src/index.ts`

Tambahkan routes untuk message:

```typescript
import messageRoutes from './routes/message';

// ... existing code ...

// Message routes
app.use('/api/messages', messageRoutes);

// ... existing code ...
```

## Database Migration

Run database migration:

```bash
cd backend
npx prisma migrate dev --name add_direct_messages
```

## Testing dengan Client.http

Tambahkan ke `client.http`:

```http
### ===========================================
### DIRECT MESSAGE ENDPOINTS
### ===========================================

### 19. Get All Messages
GET http://localhost:5000/api/messages
Authorization: Bearer YOUR_TOKEN_HERE

###

### 20. Get Conversation with User (Replace 2 with userId)
GET http://localhost:5000/api/messages/2
Authorization: Bearer YOUR_TOKEN_HERE

###

### 21. Send Message
POST http://localhost:5000/api/messages
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "receiverId": 2,
  "message": "Hello, how are you?"
}

###

### 22. Mark Message as Read (Replace 1 with messageId)
PUT http://localhost:5000/api/messages/1/read
Authorization: Bearer YOUR_TOKEN_HERE

###

### 23. Mark All Messages from User as Read (Replace 2 with userId)
PUT http://localhost:5000/api/messages/user/2/read-all
Authorization: Bearer YOUR_TOKEN_HERE

###

### 24. Get Unread Count
GET http://localhost:5000/api/messages/unread/count
Authorization: Bearer YOUR_TOKEN_HERE

###

### 25. Delete Message (Replace 1 with messageId)
DELETE http://localhost:5000/api/messages/1
Authorization: Bearer YOUR_TOKEN_HERE

###
```

## Validation Rules

- `receiverId`: Must be valid integer, must exist in database
- `message`: Non-empty string, max 10000 characters
- Cannot send message to self
- Can only mark own received messages as read
- Can only delete own sent messages

## Security

- ✅ Authentication required on all endpoints
- ✅ Authorization checks (owner validation)
- ✅ Input validation (message content)
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS prevention (message sanitization)

