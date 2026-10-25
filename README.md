# CodePractice — Dasturlash Mashqlari Platformasi

CodePractice — o‘quvchilar uchun Windows 11 desktop ilovasi va o‘qituvchilar uchun web-paneldan iborat bo‘lgan, darsdan keyingi majburiy amaliy dasturlash mashqlarini bajarish platformasi.

---

## 🚀 Asosiy Imkoniyatlar

- **O‘quvchilar uchun Windows 11 Desktop Ilovasi (Tauri 2 + React + Monaco Editor)**:
  - Kod o‘quvchining kompyuterida (Python va C++) xavfsiz va alohida jarayonda bajariladi.
  - Ilova doirasida nusxalash/qo‘yish (`Ctrl+C`, `Ctrl+V`, `Ctrl+X`) va sichqoncha kontekst menyusi cheklangan.
  - Kod avtomatik saqlanadi (Autosave) va ilova yopilganda qayta tiklanadi.
  - Server-side boshqariladigan do‘stona AI Yordamchi (masalani tushuntirish, xatoni izohlash, yo‘naltiruvchi maslahat).
  - Chiqish uchun o‘qituvchining maxsus ruxsat kodi (`4826`) talab qilinadi.
- **O‘qituvchilar uchun Web-panel (React + Tailwind CSS)**:
  - Guruhlar tuzish va o‘quvchilarni biriktirish.
  - Masalalar banki: shartlar, cheklovlar, kiruvchi/chiquvchi ma’lumotlar va avtomatik test keyslar (ochiq va yashirin testlar).
  - Muddatli (deadline) uy vazifalarini e’lon qilish.
  - Natijalar va tahlillar: bajarilish foizlari, o‘tgan testlar soni, sarflangan vaqt va resurslar.
  - Natijalarni CSV formatida yuklab olish.
- **Backend API (NestJS + TypeScript + Prisma + PostgreSQL)**:
  - Role-based Access Control (`admin`, `teacher`, `student`).
  - Qisqa muddatli Access Token (15m) + xavfsiz Refresh Token (7d).
  - Swagger REST API hujjatlari: `/api/docs`.

---

## 📁 Monorepo Tuzilishi

```text
codepractice/
├── apps/
│   ├── api/             # NestJS Backend API
│   ├── web/             # O‘qituvchi Web-paneli (React + Tailwind)
│   └── desktop/         # O‘quvchi Windows Desktop ilovasi (Tauri 2 + React + Rust)
├── packages/
│   ├── shared-types/    # Umumiy TypeScript interfeyslari va tiplar
│   ├── validation/      # Validatsiya funksiyalari
│   └── api-client/      # Frontend va Desktop uchun Typed API Client
├── database/
│   ├── prisma/          # Prisma schema va sozlamalar
│   └── seeds/           # Boshlang‘ich ma’lumotlar (admin, o‘qituvchi, o‘quvchilar, masalalar)
├── docs/                # To‘liq arxitektura va o‘rnatish hujjatlari
├── infrastructure/aws/  # AWS ECS Fargate, S3, CloudFront va Terraform
├── docker-compose.yml   # PostgreSQL va konteynerlar
├── .env.example         # Muhit o‘zgaruvchilari namunasi
└── package.json
```

---

## 💻 Windows 11 Desktop (.exe) Ilovasi

Loyiha o‘quvchilar uchun to‘liq Windows 11 `.exe` formatida tayyorlangan:
- **Darhol ishga tushirish:** Loyiha papkasidagi **`CodePractice.exe`** faylini ikki marta bosing. U backend server va ilova oynasini avtomatik ko‘taradi.
- **Tauri 2 orqali .exe va installer yig‘ish:** `build-windows-exe.bat` faylini ishga tushiring yoki [INSTALL-WINDOWS-EXE.md](file:///c:/Users/legio/OneDrive/Ishchi%20stol/umitbekexe/INSTALL-WINDOWS-EXE.md) ga qarang.

---

## ⚡ Tezkor Ishga Tushirish

### 1. Bog‘liqliklarni o‘rnatish:
```bash
npm install
```

### 2. Ma’lumotlar bazasini ishga tushirish:
```bash
docker compose up -d postgres
```

### 3. Prisma va Seed ma’lumotlari:
```bash
npm run prisma:push --workspace=@codepractice/api
npm run db:seed --workspace=@codepractice/api
```

### 4. Dasturlarni ishga tushirish:
```bash
# Backend API (Port 4000)
npm run api:dev

# O‘qituvchi Web-paneli (Port 3000)
npm run web:dev

# O‘quvchi Desktop Ilovasi (Port 1420)
npm run desktop:dev
```

---

## 🔑 Standart Tizimga Kirish Ma’lumotlari

| Foydalanuvchi | Login | Parol | Rol |
|---|---|---|---|
| **Bosh Administrator** | `admin` | `Admin123!` | Administrator |
| **O‘qituvchi** | `teacher1` | `Teacher123!` | O‘qituvchi |
| **O‘quvchi 1** | `student1` | `Student123!` | O‘quvchi |
| **O‘quvchi 2** | `student2` | `Student123!` | O‘quvchi |
| **O‘quvchi 3** | `student3` | `Student123!` | O‘quvchi |

**Desktop ilovadan chiqish ruxsat kodi (Exit PIN):** `4826`

---

## 📖 Hujjatlar

- [Arxitektura va Xavfsizlik Modeli](docs/architecture.md)
- [REST API Hujjatlari](docs/api.md)
- [Mahalliy O‘rnatish Yo‘riqnomasi](docs/local-setup.md)
- [Windows 11 Runner va Job Objects](docs/windows-runner.md)
- [AWS Joylashtirish Yo‘riqnomasi](docs/aws-deployment.md)
