# Chatbot Saung Vibe - Backend API

Backend untuk aplikasi chatbot AI menggunakan Express.js, TypeScript, Prisma, dan Google Gemini API.

## Tech Stack
- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** MySQL + Prisma ORM
- **Authentication:** JWT
- **AI Model:** Google Gemini API
- **Validation:** express-validator
- **Security:** bcryptjs untuk password hashing

## Project Structure
```
backend/
├── src/
│   ├── index.ts                 # Entry point
│   ├── controllers/
│   │   └── authController.ts    # Auth logic
│   ├── middleware/
│   │   └── auth.ts              # Auth & admin middleware
│   ├── routes/
│   │   ├── auth.ts              # Auth endpoints
│   │   ├── chat.ts              # Chat endpoints (WIP)
│   │   └── admin.ts             # Admin endpoints (WIP)
│   ├── services/
│   │   └── geminiService.ts     # Gemini API integration
│   ├── utils/
│   │   ├── jwt.ts               # JWT utilities
│   │   ├── password.ts          # Password hashing
│   │   └── validators.ts        # Input validation
│   └── lib/
│       └── prisma.ts            # Prisma client
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Database seeding
├── docs/
│   ├── AUTH_API.md              # Auth API documentation
│   ├── DATABASE_SETUP.md        # Database setup guide
│   └── TEST_AUTH.md             # Auth testing guide
├── package.json
├── tsconfig.json
└── .env.example
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
# Edit .env dengan konfigurasi Anda
```

**Required Variables:**
```
DATABASE_URL=mysql://root:password@localhost:3306/chatbot_saung_vibe
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

### 3. Setup Database
```bash
# Complete setup (generate + db push + seed)
npm run seed

# atau step by step:
npm run prisma:generate
npm run prisma:db-push
npm run prisma:seed
```

### 4. Run Development Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

## API Endpoints

### Authentication ✅ (Implemented)
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh JWT token
- `GET /api/auth/profile` - Get user profile (protected)

### Chat (WIP)
- `GET /api/chat` - Get semua conversations
- `POST /api/chat` - Create conversation baru
- `GET /api/chat/:id` - Get specific conversation
- `PUT /api/chat/:id` - Rename conversation
- `DELETE /api/chat/:id` - Delete conversation
- `POST /api/chat/:id/message` - Send message & get AI response
- `GET /api/chat/:id/messages` - Get messages

### Admin (WIP)
- `GET /api/admin/users` - Get semua users
- `GET /api/admin/users/:id` - Get user detail
- `PUT /api/admin/users/:id/settings` - Update user chat limit
- `DELETE /api/admin/users/:id` - Delete user

## Available Scripts

### Development
```bash
npm run dev              # Run with hot reload
npm run build            # Build for production
npm start                # Run production build
```

### Prisma
```bash
npm run prisma:generate   # Generate Prisma Client
npm run prisma:migrate    # Run migrations
npm run prisma:db-push    # Push schema (no migration)
npm run prisma:seed       # Seed database
npm run prisma:studio     # Open Prisma Studio GUI
```

### Utility
```bash
npm run seed              # Complete database setup
npm run lint              # ESLint checking
npm run format            # Format code with Prettier
```

## Authentication

Endpoints yang membutuhkan authentication harus menyertakan JWT token:

```
Authorization: Bearer <token>
```

Token berlaku selama 24 jam dan bisa di-refresh dengan `/api/auth/refresh-token`

## Default Admin Account

Username: `admin`  
Password: `admin123`  
Email: `admin@saungvibe.com`

⚠️ **PENTING**: Ubah password admin di production!

## Documentation

- [Authentication API](./docs/AUTH_API.md) - Detailed auth endpoints
- [Database Setup](./docs/DATABASE_SETUP.md) - Database configuration
- [Testing Auth](./docs/TEST_AUTH.md) - cURL & Postman examples
- [Main Setup Guide](./SETUP.md) - Complete setup instructions

## Implementation Status

- ✅ Project setup & configuration
- ✅ Authentication (Register, Login, Token Refresh)
- ✅ User profile endpoint
- ✅ Password hashing & validation
- ✅ JWT token management
- ✅ Admin middleware
- ✅ Error handling middleware
- ⏳ Chat endpoints (in progress)
- ⏳ Admin management endpoints (in progress)
- ⏳ Gemini API integration (in progress)
- ⏳ Typing indicator system (in progress)
- ⏳ File upload/attachment support (planned)

## Environment Variables

```
DATABASE_URL        - MySQL connection string
PORT               - Server port (default: 5000)
NODE_ENV           - development | production
JWT_SECRET         - Secret key untuk JWT signing
GEMINI_API_KEY     - Google Gemini API key
FRONTEND_URL       - Frontend URL (for CORS)
```

## Error Handling

Semua error response mengikuti format standar:

```json
{
  "message": "Error description"
}
```

HTTP Status Codes:
- `200 OK` - Successful request
- `201 Created` - Resource created
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Auth required or invalid token
- `403 Forbidden` - Admin access required
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

## Testing

Gunakan file [TEST_AUTH.md](./docs/TEST_AUTH.md) untuk test endpoints dengan cURL atau Postman.

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
Pastikan MySQL Server berjalan dan DATABASE_URL di `.env` benar.

### Prisma Client Error
```bash
npm run prisma:generate
```

### Reset Database
```bash
npx prisma migrate reset
npm run prisma:seed
```

## Development Workflow

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Make your changes
3. Run tests: `npm run lint`
4. Format code: `npm run format`
5. Commit and push
6. Create a Pull Request

## Support & Contact

Untuk pertanyaan atau masalah, buat issue di repository.

---

**Last Updated:** April 5, 2026

