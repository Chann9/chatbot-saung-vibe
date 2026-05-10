# 🔧 Prompt Template: Solving Problem

## Context
Digunakan ketika menghadapi error, bug, atau masalah dalam project yang memerlukan debugging dan penyelesaian.

---

## Template Prompt

```
Saya menghadapi masalah di project [PROJECT_NAME]:

**Error/Problem:**
- [Deskripsi error atau masalah yang terjadi]
- Error message: [Copy error message lengkap jika ada]
- Di file: [path/file.ts]

**Konteks:**
- Apa yang sedang saya coba lakukan: [Deskripsi aktivitas]
- Kapan error terjadi: [Timing - saat npm install, build, runtime, dll]
- Yang sudah saya coba: [List solusi yang sudah dicoba]

**Project Stack:**
- Backend: Node.js, Express, TypeScript
- Database: Prisma, MySQL
- [Teknologi lain yang relevan]

**Pertanyaan:**
1. Apa penyebab masalah ini?
2. Bagaimana cara menyelesaikannya?
3. Bagaimana mencegah error serupa di masa depan?

**File terkait yang perlu dilihat:**
- [file1.ts]
- [file2.ts]
- package.json
```

---

## Contoh Penggunaan

```
Saya menghadapi masalah di project chatbot-saung-vibe:

**Error/Problem:**
- npm install gagal dengan error: ERR! 404 Not Found - GET https://registry.npmjs.org/express-validator/-/express-validator-7.0.0.tgz
- Error message: npm error code E404
- Di file: package.json

**Konteks:**
- Apa yang sedang saya coba lakukan: Menginstall dependencies backend
- Kapan error terjadi: Saat menjalankan npm install
- Yang sudah saya coba: Menjalankan npm cache clean --force, menghapus node_modules

**Project Stack:**
- Backend: Node.js, Express, TypeScript
- Database: Prisma, MySQL
- Authentication: JWT, bcryptjs

**Pertanyaan:**
1. Mengapa express-validator versi 7.0.0 tidak ditemukan?
2. Versi mana yang sebaiknya digunakan?
3. Bagaimana cara update package.json dengan benar?

**File terkait:**
- package.json
- backend/
```


## Best Practices

1. **Berikan Error Message Lengkap**
   - Copy paste error message utuh, jangan diringkas
   - Include stack trace jika ada

2. **Jelaskan Konteks dengan Detail**
   - Apa yang sedang dilakukan
   - Kapan error terjadi
   - Screenshot atau log jika membantu

3. **Sebutkan Solusi yang Sudah Dicoba**
   - Bantu AI untuk tidak menyarankan hal yang sama
   - Menunjukkan sudah ada usaha investigasi

4. **Include Relevant Files**
   - Beri tahu file mana yang perlu di-check
   - Jika perlu, paste kode yang error

5. **Spesifik dan Terukur**
   - Jangan vague: "Ada error"
   - Gunakan: "Error 500 di endpoint POST /api/chat pada saat sendMessage dipanggil"

## Checklist sebelum asking

- [ ] Error message sudah dicopy lengkap
- [ ] Sudah dicoba solusi obvious (clear cache, restart, dll)
- [ ] File path dan line number sudah disertakan
- [ ] Project stack sudah dijelaskan
- [ ] Context sudah jelas

