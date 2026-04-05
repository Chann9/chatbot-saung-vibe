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
│   ├── index.ts
│   ├── lib/
│   ├── middleware/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   └── utils/
├── prisma/
├── package.json
├── tsconfig.json
└── .env.example
```

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env dengan konfigurasi Anda
   ```

3. **Setup database:**
   ```bash
   npm run prisma:migrate
   # atau
   npx prisma db push
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

Server akan berjalan di `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh JWT token

### Chat
- `GET /api/chat` - Get semua conversations
- `POST /api/chat` - Create conversation baru
- `GET /api/chat/:id` - Get specific conversation
- `PUT /api/chat/:id` - Rename conversation
- `DELETE /api/chat/:id` - Delete conversation
- `POST /api/chat/:id/message` - Send message
- `GET /api/chat/:id/messages` - Get messages

### Admin
- `GET /api/admin/users` - Get semua users
- `GET /api/admin/users/:id` - Get user detail
- `PUT /api/admin/users/:id/settings` - Update user settings
- `DELETE /api/admin/users/:id` - Delete user

## Development

- `npm run dev` - Development dengan hot reload
- `npm run build` - Build untuk production
- `npm start` - Run production build
- `npm run lint` - ESLint checking
- `npm run format` - Format code dengan Prettier
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:studio` - Buka Prisma Studio

## Environment Variables

```
DATABASE_URL=mysql://user:password@localhost:3306/chatbot_saung_vibe
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
```

## Default Admin Account
- **Username:** admin
- **Password:** admin123
- **Role:** admin

> ⚠️ Ubah password admin di production!

## Documentation
Lihat [SETUP.md](./SETUP.md) untuk panduan setup lebih detail.
