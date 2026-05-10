# 📋 Prompt Templates Directory

Direktori ini berisi template prompt yang dapat digunakan untuk berbagai tugas development seperti troubleshooting, dokumentasi, dan implementasi fitur.

## 📂 File-file yang Tersedia

### 1. **01-SOLVING_PROBLEM.md**
Template untuk **debugging dan solving issues** dalam project.

**Gunakan ketika:**
- Menghadapi error atau bug
- Server error saat development
- Npm/dependency issues
- TypeScript compilation errors
- Database connection problems

**Mencakup:**
- Format error reporting
- Checklist sebelum asking
- Best practices untuk debugging
- Contoh penggunaan nyata

---

### 2. **02-API_DOCUMENTATION.md**
Template untuk **membuat dokumentasi API** yang lengkap dan profesional.

**Gunakan ketika:**
- Membuat docs untuk new endpoints
- Update existing API documentation
- Need to document error cases
- Membuat integration guide
- Creating OpenAPI/Swagger documentation

**Mencakup:**
- API endpoint structure
- Request/response format
- Error codes dan handling
- Code examples (cURL, JavaScript)
- Security considerations

---

### 3. **03-CODE_DOCUMENTATION.md**
Template untuk **mendokumentasikan code structure dan logic**.

**Gunakan ketika:**
- Documenting complex functions
- Explaining architecture patterns
- Recording data flow
- Type definitions explanation
- Performance optimization notes
- Security implementation details

**Mencakup:**
- Class/function documentation
- Data flow diagrams
- Type definitions
- Error handling strategy
- Performance considerations
- Testing strategy

---

### 4. **04-DATABASE_SCHEMA.md**
Template untuk **database schema dan model documentation**.

**Gunakan ketika:**
- Designing new database models
- Documenting schema changes
- Creating migration guides
- Recording relationships
- Performance tuning
- Backup strategy documentation

**Mencakup:**
- Model definitions
- Field specifications
- Relationships & constraints
- Entity Relationship Diagram (ERD)
- Query examples
- Migration strategy
- Performance optimization

---

### 5. **05-MESSAGE_API_IMPLEMENTATION.md**
**Implementation guide untuk Direct Messaging API**.

Fitur untuk user-to-user direct messaging:
- Send/receive messages
- Message history
- Read status tracking
- Unread message count
- Delete/archive messages

**Mencakup:**
- Complete database schema
- 7 API endpoints implementation
- Full controller code
- Routes configuration
- Testing examples
- Validation & security

---

## 🎯 Cara Menggunakan

### Quick Start

1. **Pilih template** sesuai dengan kebutuhan
2. **Copy-paste template** ke dalam prompt ke AI assistant
3. **Fill in** bagian yang relevan dengan project Anda
4. **Submit** dan dapatkan dokumentasi/solusi lengkap

### Contoh Workflow

#### Scenario 1: Debugging Error
```
1. Buka: 01-SOLVING_PROBLEM.md
2. Copy template
3. Fill: error message, konteks, stack trace
4. Submit ke AI
5. Terima: diagnosis + solusi lengkap
```

#### Scenario 2: Dokumentasi API Baru
```
1. Buka: 02-API_DOCUMENTATION.md
2. Copy template
3. Fill: endpoint details, response format
4. Submit ke AI
5. Terima: complete API documentation
```

#### Scenario 3: Dokumentasi Database
```
1. Buka: 04-DATABASE_SCHEMA.md
2. Copy template
3. Fill: model details, relationships
4. Submit ke AI
5. Terima: schema documentation + diagrams
```

---

## 📊 Template Selection Guide

| Kebutuhan | Template | Waktu |
|-----------|----------|-------|
| Ada error | 01-SOLVING_PROBLEM.md | 5 min |
| Document API | 02-API_DOCUMENTATION.md | 10 min |
| Document Code | 03-CODE_DOCUMENTATION.md | 10 min |
| Document DB | 04-DATABASE_SCHEMA.md | 15 min |
| Implement Message API | 05-MESSAGE_API_IMPLEMENTATION.md | 20 min |

---

## 💡 Best Practices

### 1. **Be Specific**
- Jangan generic
- Include actual file paths
- Use real data/examples

### 2. **Provide Context**
- Jelaskan tech stack
- Mention project setup
- Include relevant files

### 3. **Include Constraints**
- What you've tried
- What must be avoided
- Performance requirements

### 4. **Request Format**
- Clear and structured
- Use checkpoints/checklists
- Include acceptance criteria

### 5. **Review Output**
- Validate generated content
- Test examples jika applicable
- Update if needed

---

## 🔄 Workflow Integration

### Development Cycle

```
Problem Identified
        ↓
Select Template (01)
        ↓
Fill Template
        ↓
Get Solution
        ↓
Implement
        ↓
API Endpoint Ready
        ↓
Document API (02)
        ↓
Get Documentation
        ↓
Document Code (03)
        ↓
Get Code Docs
        ↓
Feature Complete
```

---

## 📝 Notes

### When to Use Templates

✅ **Use templates when you need:**
- Consistent documentation format
- Quick access to prompt structure
- Best practices guidance
- Comprehensive coverage

❌ **Don't need templates for:**
- Simple questions
- Quick fixes
- One-off tasks
- Simple code snippets

### Template Customization

Templates dapat di-customize sesuai kebutuhan:
- Add/remove sections
- Adjust level of detail
- Include project-specific info
- Combine multiple templates

---

## 📚 Additional Resources

### Project Documentation
- [PROJECT_ROOT]/README.md - Project overview
- [PROJECT_ROOT]/docs/ - Additional docs
- [PROJECT_ROOT]/backend/README.md - Backend specific

### API Examples
- client.http - REST Client examples
- API_REFERENCE.md - Quick API reference
- AUTH_API.md - Authentication docs
- CHAT_API.md - Chat features docs
- ADMIN_API.md - Admin features docs

### Code Documentation
- IMPLEMENTATION_CHAT_ADMIN.md - Feature implementation details
- chatController.ts - Chat logic implementation
- authController.ts - Auth logic implementation
- adminController.ts - Admin logic implementation

---

## 🔗 Quick Links

- [Solving Problem Template](01-SOLVING_PROBLEM.md)
- [API Documentation Template](02-API_DOCUMENTATION.md)
- [Code Documentation Template](03-CODE_DOCUMENTATION.md)
- [Database Schema Template](04-DATABASE_SCHEMA.md)
- [Message API Implementation](05-MESSAGE_API_IMPLEMENTATION.md)

---

## ✨ Recent Additions

- ✅ Template 01: Solving Problem
- ✅ Template 02: API Documentation
- ✅ Template 03: Code Documentation
- ✅ Template 04: Database Schema
- ✅ Template 05: Message API Implementation (NEW)

---

**Last Updated:** May 9, 2026
**Author:** Development Team
**Version:** 1.0

