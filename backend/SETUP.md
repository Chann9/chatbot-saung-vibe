# Setup Backend - Panduan Instalasi

## Prasyarat
- Node.js (v18 atau lebih tinggi)
- MySQL Server
- Gemini API Key

## Langkah-langkah Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment Variables
```bash
# Copy file .env.example menjadi .env
cp .env.example .env

# Edit .env dan sesuaikan konfigurasi:
# - DATABASE_URL: koneksi MySQL
# - JWT_SECRET: secret key untuk JWT
# - GEMINI_API_KEY: API key dari Google Gemini
# - FRONTEND_URL: URL frontend (default: http://localhost:5173)
```

### 3. Setup Database
```bash
# Generate Prisma Client
npm run prisma:generate

# Jalankan migration (jika menggunakan database baru)
npm run prisma:migrate

# Atau jika ingin push schema tanpa migration
npx prisma db push
```

### 4. Setup Admin User
Database sudah memiliki user admin default:
- Username: `admin`
- Password: `admin123` (harus diubah di production)

## Development

### Menjalankan Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

### Build untuk Production
```bash
npm run build
npm start
```

## Struktur Project

```
backend/
├── src/
│   ├── index.ts                 # Entry point aplikasi
│   ├── lib/
│   │   └── prisma.ts           # Prisma client instance
│   ├── middleware/
│   │   └── auth.ts             # Authentication & authorization middleware
│   ├── routes/
│   │   ├── auth.ts             # Auth endpoints
│   │   ├── chat.ts             # Chat endpoints
│   │   └── admin.ts            # Admin endpoints
│   ├── controllers/             # (Akan ditambahkan - business logic)
│   ├── services/
│   │   └── geminiService.ts    # Gemini API integration
│   └── utils/
│       ├── validators.ts        # Input validation functions
│       ├── jwt.ts              # JWT token functions
│       └── password.ts         # Password hashing functions
├── prisma/
│   └── schema.prisma           # Prisma schema (database models)
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore
```

## Available Scripts

- `npm run dev` - Start development server dengan hot reload
- `npm run build` - Build untuk production
- `npm start` - Run production build
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run lint` - Run ESLint
- `npm run format` - Format code dengan Prettier

## Next Steps

Setelah setup selesai, implementasi fitur berikut:
- [ ] Authentication Controller & Routes (register, login)
- [ ] Chat Controller & Routes
- [ ] Admin Controller & Routes
- [ ] Error handling yang lebih comprehensive
- [ ] Input validation dengan express-validator
- [ ] Logging system
- [ ] Tests

## Environment Variables Reference

```
DATABASE_URL        - MySQL connection string
PORT               - Server port (default: 5000)
NODE_ENV           - Environment (development/production)
JWT_SECRET         - Secret key untuk JWT signing
GEMINI_API_KEY     - Google Gemini API key
FRONTEND_URL       - Frontend URL untuk CORS
```
