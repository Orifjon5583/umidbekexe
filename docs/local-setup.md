# CodePractice — Mahalliy Ishga Tushirish Yo‘riqnomasi

Ushbu yo‘riqnoma orqali loyihani noldan lokal kompyuteringizda ishga tushirishingiz mumkin.

## 1. Talab Qilinadigan Asboblar

- **Node.js**: v20+ yoki v22+ (v24 ham to‘liq qo‘llab-quvvatlanadi)
- **NPM** yoki **PNPM**
- **Docker & Docker Compose** (PostgreSQL uchun) yoki lokal PostgreSQL 15/16/18
- **Python**: 3.10+ (o‘quvchi kompyuterida kod bajarilishi uchun)
- **MinGW-w64 (g++)**: C++ kodlarini kompilyatsiya qilish uchun (ixtiyoriy)

---

## 2. Bosqichma-bosqich O‘rnatish

### 1-qadam: Bog‘liqliklarni o‘rnatish
Loyiha ildiz katalogida barcha workspaces paketlarini o‘rnating:
```bash
npm install
```

### 2-qadam: Muhit o‘zgaruvchilarini sozlash
`.env.example` faylidan nusxa olib `.env` yarating:
```bash
cp .env.example .env
```

### 3-qadam: Ma’lumotlar bazasini ishga tushirish (Docker Compose)
PostgreSQL bazasini konteynerda ishga tushirish:
```bash
docker compose up -d postgres
```

### 4-qadam: Prisma migratsiyalari va Seed ma’lumotlari
```bash
# Prisma Client generatsiya qilish
npm run prisma:generate --workspace=@codepractice/api

# Jadvallarni bazaga yuklash (DB Push yoki Migrate)
npm run prisma:push --workspace=@codepractice/api

# Boshlang‘ich ma’lumotlarni yuklash (admin, teacher1, student1, masalalar, testlar)
npm run db:seed --workspace=@codepractice/api
```

---

## 3. Servislarni Ishga Tushirish

### Backend API (Port 4000)
```bash
npm run api:dev
```
API manzili: `http://localhost:4000/api/v1`
Swagger hujjatlari: `http://localhost:4000/api/docs`

### O‘qituvchi Web-paneli (Port 3000)
```bash
npm run web:dev
```
Brauzerda oching: `http://localhost:3000`

### O‘quvchi Desktop Ilovasi (Port 1420 / Tauri)
```bash
# Frontend dev rejimida ko‘rish:
npm run desktop:dev

# Yoki to‘liq Tauri oynasida ochish:
cd apps/desktop
npm run tauri dev
```

---

## 4. Standart Kirish Hisoblari (Seed)

| Rol | Login | Parol | Maqsad |
|---|---|---|---|
| **Administrator** | `admin` | `Admin123!` | Foydalanuvchilar va rollarni boshqarish |
| **O‘qituvchi** | `teacher1` | `Teacher123!` | Guruhlar, masalalar, vazifalar va natijalar |
| **O‘quvchi** | `student1` | `Student123!` | Desktop ilovada mashqlarni yechish |
| **O‘quvchi 2** | `student2` | `Student123!` | Mashqlarni yechish |
| **O‘quvchi 3** | `student3` | `Student123!` | Mashqlarni yechish |

**Desktop ilovadan chiqish ruxsat kodi (Exit PIN):** `4826`
