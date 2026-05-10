# ✅ Message API Implementation Checklist

Checklist lengkap untuk implementasi Message API (Direct Messaging).

## 📋 Phase 1: Database Setup

- [ ] Add `DirectMessage` model ke `prisma/schema.prisma`
- [ ] Update `User` model dengan relations
- [ ] Create migration: `npx prisma migrate dev --name add_direct_messages`
- [ ] Verify schema in Prisma Studio: `npx prisma studio`

**Files to modify:**
- `backend/prisma/schema.prisma`

---

## 📋 Phase 2: Controller Implementation

- [ ] Create `src/controllers/messageController.ts`
- [ ] Implement `getAllMessages()` method
- [ ] Implement `getConversation()` method
- [ ] Implement `sendMessage()` method
- [ ] Implement `markAsRead()` method
- [ ] Implement `markAllAsRead()` method
- [ ] Implement `deleteMessage()` method
- [ ] Implement `getUnreadCount()` method
- [ ] Add input validation in all methods
- [ ] Add error handling with proper status codes
- [ ] Add authorization checks (owner validation)

**Files to create:**
- `backend/src/controllers/messageController.ts`

**Validation to implement:**
- [ ] receiverId must exist and be different from senderId
- [ ] Message must be non-empty string
- [ ] Message max length: 10,000 characters
- [ ] Only receivers can mark messages as read
- [ ] Only senders can delete messages

---

## 📋 Phase 3: Routes Implementation

- [ ] Create `src/routes/message.ts`
- [ ] Add route: `GET /` - getAllMessages
- [ ] Add route: `GET /unread/count` - getUnreadCount
- [ ] Add route: `GET /:userId` - getConversation
- [ ] Add route: `POST /` - sendMessage
- [ ] Add route: `PUT /:messageId/read` - markAsRead
- [ ] Add route: `PUT /user/:userId/read-all` - markAllAsRead
- [ ] Add route: `DELETE /:messageId` - deleteMessage
- [ ] Apply `authMiddleware` to all routes
- [ ] Test route ordering (specific routes before dynamic)

**Files to create:**
- `backend/src/routes/message.ts`

---

## 📋 Phase 4: Server Integration

- [ ] Import message routes in `src/index.ts`
- [ ] Register message routes: `app.use('/api/messages', messageRoutes)`
- [ ] Verify TypeScript compilation: `npm run build`
- [ ] No errors should appear

**Files to modify:**
- `backend/src/index.ts`

---

## 📋 Phase 5: Testing Setup

- [ ] Add test examples to `client.http`
- [ ] Include all 7 endpoint examples
- [ ] Add example with valid Bearer token
- [ ] Add example with invalid token
- [ ] Add error case examples

**Files to modify:**
- `client.http`

**Examples to add:**
```
### 19-25: Message API examples
```

---

## 📋 Phase 6: Validation & Security

### Input Validation
- [ ] receiverId: integer, exists in DB
- [ ] message: non-empty string, max 10k chars
- [ ] userId: valid integer
- [ ] messageId: valid integer

### Authorization Checks
- [ ] Verify receiver exists
- [ ] Verify sender doesn't send to self
- [ ] Verify only receiver can mark as read
- [ ] Verify only sender can delete
- [ ] Check conversation belongs to requester

### Error Handling
- [ ] 400: Validation errors (invalid input)
- [ ] 401: Unauthorized (no token)
- [ ] 403: Forbidden (no permission)
- [ ] 404: Not found (user/message/conversation)
- [ ] 500: Server errors (DB, API)

---

## 📋 Phase 7: Database Testing

- [ ] Connect to database
- [ ] Create test users (admin + testuser)
- [ ] Send test message between users
- [ ] Verify message saved in DB
- [ ] Verify relationships working
- [ ] Test queries in Prisma Studio

**Test Data:**
```sql
-- Verify message saved
SELECT * FROM DirectMessage WHERE senderId = 1;

-- Verify user relationship
SELECT * FROM DirectMessage 
  WHERE senderId = 1 
  INCLUDE sender, receiver;
```

---

## 📋 Phase 8: API Testing

### Test Endpoint: Send Message
- [ ] Endpoint: `POST /api/messages`
- [ ] Headers: `Authorization: Bearer <token>`
- [ ] Body: `{ "receiverId": 2, "message": "Hello" }`
- [ ] Expected: 201 Created
- [ ] Response includes message ID

### Test Endpoint: Get All Messages
- [ ] Endpoint: `GET /api/messages`
- [ ] Expected: 200 OK
- [ ] Response is array of messages
- [ ] Includes sender/receiver info

### Test Endpoint: Get Conversation
- [ ] Endpoint: `GET /api/messages/:userId`
- [ ] Expected: 200 OK
- [ ] Messages sorted by date
- [ ] Correct pagination

### Test Endpoint: Mark as Read
- [ ] Endpoint: `PUT /api/messages/:messageId/read`
- [ ] Expected: 200 OK
- [ ] isRead field set to true

### Test Endpoint: Get Unread Count
- [ ] Endpoint: `GET /api/messages/unread/count`
- [ ] Expected: 200 OK
- [ ] Returns unreadCount and unreadFrom

### Test Endpoint: Delete Message
- [ ] Endpoint: `DELETE /api/messages/:messageId`
- [ ] Expected: 200 OK
- [ ] Message removed from DB

---

## 📋 Phase 9: Error Case Testing

### Test Invalid Input
- [ ] Send message without receiverId - expect 400
- [ ] Send message with empty message - expect 400
- [ ] Send message to non-existent user - expect 404
- [ ] Send message to self - expect 400

### Test Authorization
- [ ] Mark other user's message as read - expect 403
- [ ] Delete other user's message - expect 403
- [ ] Get messages without token - expect 401
- [ ] Use expired token - expect 401

### Test Edge Cases
- [ ] Very long message (9,999 chars) - expect 201
- [ ] Message with special characters - expect 201
- [ ] Rapid fire messages (concurrency) - expect all saved
- [ ] Message with emojis/unicode - expect 201

---

## 📋 Phase 10: Documentation

- [ ] API documentation for all endpoints
- [ ] Include request/response examples
- [ ] Document error cases
- [ ] Add validation rules
- [ ] Include usage examples
- [ ] Add to main API reference

**Files to create/update:**
- `docs/MESSAGE_API.md` (optional)
- `docs/API_REFERENCE.md` (update)

---

## 📋 Phase 11: Code Quality

- [ ] TypeScript compilation: `npm run build` ✓
- [ ] No TypeScript errors
- [ ] Code formatting consistent
- [ ] Comments added for complex logic
- [ ] Error messages are clear and helpful
- [ ] No console.logs left in code

**Commands:**
```bash
npm run build          # Check TypeScript
npm run format         # Format code (if available)
npm run lint          # Lint code (if available)
```

---

## 📋 Phase 12: Integration Testing

- [ ] Start server: `npm run dev`
- [ ] Test all 7 endpoints with client.http
- [ ] Verify responses match documentation
- [ ] Test pagination works
- [ ] Test sorting (by date)
- [ ] Test filtering (unread messages)
- [ ] Verify no N+1 queries
- [ ] Check database queries are efficient

---

## 📋 Phase 13: Deployment Prep

- [ ] Add GEMINI_API_KEY to .env if needed
- [ ] Database migrations ready
- [ ] Environment variables documented
- [ ] Logs configured
- [ ] Error monitoring ready
- [ ] Performance metrics available

**Files to review:**
- `.env.example`
- `.env` (ensure not committed)
- `backend/package.json` (check dependencies)

---

## 📋 Phase 14: Documentation Update

- [ ] Update `README.md` with new endpoints
- [ ] Add message API to feature list
- [ ] Update IMPLEMENTATION_STATUS.md
- [ ] Add to API_REFERENCE.md
- [ ] Update client.http with examples

---

## 📊 Completion Matrix

| Phase | Task | Status | Notes |
|-------|------|--------|-------|
| 1 | Database Setup | ⏳ Pending | Add DirectMessage model |
| 2 | Controller | ⏳ Pending | Implement 7 methods |
| 3 | Routes | ⏳ Pending | Create message.ts |
| 4 | Integration | ⏳ Pending | Update index.ts |
| 5 | Testing | ⏳ Pending | Add to client.http |
| 6 | Validation | ⏳ Pending | Implement checks |
| 7 | DB Testing | ⏳ Pending | Test with real DB |
| 8 | API Testing | ⏳ Pending | Test all endpoints |
| 9 | Error Testing | ⏳ Pending | Test error cases |
| 10 | Documentation | ⏳ Pending | Create docs |
| 11 | Code Quality | ⏳ Pending | Check build |
| 12 | Integration | ⏳ Pending | Full flow test |
| 13 | Deployment | ⏳ Pending | Prep for deploy |
| 14 | Final Docs | ⏳ Pending | Update all docs |

---

## 🎯 Success Criteria

✅ All 7 endpoints implemented
✅ All validation rules enforced
✅ All error cases handled
✅ Authorization checks in place
✅ Database migrations applied
✅ TypeScript builds without errors
✅ All tests passing
✅ Documentation complete
✅ Examples in client.http
✅ Ready for frontend integration

---

## 📝 Notes

**Important Reminders:**
- Message API is for direct user-to-user messaging
- Different from ChatMessage (which is user-to-AI)
- Sender can delete, receiver can mark as read
- Implement read status tracking
- Consider unread count in future notifications

**Performance Tips:**
- Index on senderId and receiverId
- Index on createdAt for sorting
- Limit query results for pagination
- Consider caching unread counts

**Security Tips:**
- Always verify ownership before modify/delete
- Validate user exists before message creation
- Sanitize input to prevent XSS
- Rate limit message sends if needed

---

## 🔗 References

- Implementation guide: `05-MESSAGE_API_IMPLEMENTATION.md`
- Database schema: `04-DATABASE_SCHEMA.md`
- API documentation: `02-API_DOCUMENTATION.md`
- Code documentation: `03-CODE_DOCUMENTATION.md`

---

**Last Updated:** May 9, 2026
**Version:** 1.0
**Status:** Ready for Implementation

