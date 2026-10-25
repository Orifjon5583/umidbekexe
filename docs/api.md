# CodePractice REST API Hujjatlari

Barcha endpointlar `/api/v1` prefiksi ostida ishlaydi.
Swagger interfeysi: `http://localhost:4000/api/docs`

## 1. Autentifikatsiya (/auth)

### `POST /api/v1/auth/login`
- **Tavsif**: Foydalanuvchi tizimga kirishi.
- **So‘rov**:
```json
{
  "username": "student1",
  "password": "Student123!",
  "rememberMe": true
}
```
- **Javob (200 OK)**:
```json
{
  "user": {
    "id": "uuid",
    "fullName": "Alisher Omonov",
    "username": "student1",
    "role": "student"
  },
  "tokens": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "expiresIn": 900
  }
}
```

### `POST /api/v1/auth/refresh`
- **So‘rov**: `{ "refreshToken": "..." }`
- **Javob**: `{ "tokens": { "accessToken": "..." } }`

### `POST /api/v1/auth/logout` (Bearer Token)
- Sessiyani bekor qilish.

### `GET /api/v1/auth/me` (Bearer Token)
- Joriy foydalanuvchi profili.

---

## 2. O‘quvchi Endpointlari

### `GET /api/v1/students/me/dashboard`
- O‘quvchining vazifalari, foizlari va holatlari.

### `GET /api/v1/assignments/:id`
- Vazifa tafsilotlari va masalalar ro‘yxati.

### `PUT /api/v1/assignments/:id/progress`
- Avtomatik saqlash (Autosave draft):
```json
{
  "problemId": "uuid",
  "draftCode": "print('hello')",
  "language": "python"
}
```

### `POST /api/v1/problems/:id/submissions`
- Kod tekshiruvi natijasini serverda saqlash:
```json
{
  "assignmentId": "uuid",
  "language": "python",
  "sourceCode": "a, b = map(int, input().split())\nprint(a + b)",
  "runnerResult": {
    "status": "accepted",
    "passedTests": 10,
    "totalTests": 10,
    "executionTimeMs": 45,
    "cpuTimeMs": 35,
    "peakMemoryBytes": 12582912
  }
}
```

---

## 3. AI Yordamchi (/ai)

### `POST /api/v1/ai/explain-problem`
### `POST /api/v1/ai/explain-code`
### `POST /api/v1/ai/explain-error`
### `POST /api/v1/ai/hint`
### `POST /api/v1/ai/explain-test`

- **So‘rov**:
```json
{
  "problemId": "uuid",
  "requestType": "hint",
  "studentQuestion": "2-qatordagi indeks xatosini qanday to‘g‘rilash mumkin?",
  "currentCode": "nums = [1, 2]\nprint(nums[5])"
}
```

---

## 4. O‘qituvchi Boshqaruvi (/teacher)

- `GET /api/v1/teacher/dashboard`: Umumiy statistika
- `GET, POST, PATCH /api/v1/teacher/groups`: Guruhlar boshqaruvi
- `POST /api/v1/teacher/groups/:id/students`: O‘quvchini guruhga qo‘shish
- `GET, POST, PATCH /api/v1/teacher/problems`: Masalalar va test keyslar
- `GET, POST /api/v1/teacher/assignments`: Vazifa e’lon qilish
- `GET /api/v1/teacher/reports/export`: CSV formatida natijalarni yuklab olish
