# Setup Database

## Prerequisites
- MySQL Server sudah berjalan
- Database `chatbot_saung_vibe` sudah dibuat

## Langkah-langkah

### 1. Update `.env` dengan Database URL
```env
DATABASE_URL="mysql://root:password@localhost:3306/chatbot_saung_vibe"
```

Sesuaikan:
- `root` → username MySQL Anda
- `password` → password MySQL Anda
- `localhost` → host MySQL Anda
- `3306` → port MySQL Anda (default: 3306)
- `chatbot_saung_vibe` → nama database

### 2. Setup Database Schema

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema ke database
npm run prisma:db-push
```

Atau jika ingin menggunakan migrations:

```bash
npm run prisma:migrate
```

### 3. Seed Database (Buat Admin User)

```bash
npm run prisma:seed
```

Ini akan membuat:
- Admin user dengan username: `admin`, password: `admin123`
- Admin settings dengan chat limit 100

### 4. Alternative: Complete Setup

Jalankan sekaligus:

```bash
npm run seed
```

Perintah ini akan:
1. Generate Prisma Client
2. Push schema ke database  
3. Seed database (buat admin user)

## Verifikasi Setup

Cek apakah database sudah ter-setup dengan benar:

```bash
# Buka Prisma Studio (GUI untuk database)
npm run prisma:studio
```

Anda seharusnya bisa melihat:
- Table `users` dengan user `admin`
- Table `user_settings` dengan settings admin
- Table `chat_conversations` (kosong)
- Table `chat_messages` (kosong)

## Jalankan Server

Setelah database setup selesai, jalankan server:

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

Test health endpoint:
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

Pastikan:
- MySQL Server sudah berjalan
- DATABASE_URL di `.env` benar
- Database `chatbot_saung_vibe` sudah ada

### Prisma Client Error
```
Cannot find @prisma/client module
```

Jalankan:
```bash
npm run prisma:generate
```

### Migration Conflicts
Jika ada error saat migration, reset database:

```bash
# DROP semua tables (hati-hati!)
npx prisma migrate reset

# Atau manual: 
# DROP DATABASE chatbot_saung_vibe;
# CREATE DATABASE chatbot_saung_vibe;

npm run seed
```

## Next Steps

Setelah database setup, Anda bisa:
1. Test authentication endpoints menggunakan Postman atau cURL
2. Implementasi chat endpoints
3. Implementasi admin endpoints
