# CodePractice Windows 11 Lokal Kod Runner Hujjati

## 1. Umumiy Tushuncha

CodePractice tizimida o‘quvchilar yozgan Python va C++ kodlari **o‘quvchining o‘z Windows 11 kompyuterida** bajariladi. Bu arxitektura:
- Serverga tushadigan og‘ir kompilyatsiya va hisoblash yuklamasini bartaraf qiladi.
- Internet aloqasi vaqtincha sustlashganda ham o‘quvchining lokal testlash tezligiga ta’sir ko‘rsatmaydi.
- O‘quvchining kompyuteridagi resurslardan to‘liq foydalanish imkonini beradi.

---

## 2. Dasturlash Tillari va Muhit Talablari

### 2.1. Python Runner
- **Qo‘llab-quvvatlanadigan versiyalar**: Python 3.10, 3.11, 3.12, 3.13.
- **O‘rnatish**: `python.org` saytidan Windows installer yuklanadi. O‘rnatish vaqtida **"Add Python to PATH"** belgisi yoqilgan bo‘lishi shart.
- **Ishga tushirish mantiqi**:
  1. Kod vaqtinchalik katalogdagi `solution.py` fayliga yoziladi.
  2. Jarayon `python -u solution.py` parametri orqali buferlanmagan (unbuffered) rejimda ishga tushiriladi.
  3. `stdin` ga testning kiruvchi ma’lumotlari uzatiladi.
  4. Belgilangan `time_limit_ms` (standart 1500–2000 ms) ichida chiqish kutiladi.

### 2.2. C++ Runner
- **Tavsiya etiladigan kompilyator**: MinGW-w64 (`g++`) yoki MSVC (`cl.exe`).
- **O‘rnatish**: MSYS2 (`pacman -S mingw-w64-ucrt-x86_64-gcc`) yoki WinLibs orqali o‘rnatilib, `bin` papkasi Windows PATH tizimiga qo‘shiladi.
- **Kompilyatsiya buyrug‘i**:
  ```cmd
  g++ -O2 -std=c++17 solution.cpp -o solution.exe
  ```
- **Kompilyatsiya xatosi**: Agar kompilyator xato bersa, jarayon darhol `compile_error` statusi va xato matni (stderr) bilan qaytariladi.

---

## 3. Xavfsizlik va Resurs Cheklovlari (Windows Job Objects)

Windows muhitida ishonchsiz kodni xavfsiz boshqarish uchun Rust runner quyidagi mexanizmlarni qo‘llaydi:

1. **Jarayonlar Daraxtini To‘xtatish (Kill on Job Close)**:
   - `JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE` bayrog‘i orqali bolalar va uning barcha yaratgan qo‘shimcha jarayonlari asosiy jarayon yopilganda bir zumda yo‘q qilinadi.
2. **Xotira Chegarasi (Memory Limit)**:
   - `JOBOBJECT_EXTENDED_LIMIT_INFORMATION` orqali har bir jarayon uchun RAM hajmi (masalan 128 MB) bilan cheklanadi. Limit oshsa, OS avtomatik ravishda jarayonni to‘xtatadi (`memory_limit_exceeded`).
3. **Vaqt Chegarasi (Timeout Guard)**:
   - Toksik yoki cheksiz sikllarning oldini olish uchun taymer nazorati o‘rnatilgan. Vaqt oshib ketsa, `TerminateJobObject` chaqiriladi.
4. **Vaqtinchalik Fayllar Tozalanishi**:
   - Har bir bajarilish uchun alohida `tempdir` ochiladi va test yakunlangach darhol xotiradan to‘liq o‘chiriladi.

---

## 4. Chiqish Natijasini Qiyoslash Qoidasi

Runner test natijalarini quyidagi normalizatsiya asosida solishtiradi:
- Barcha `\r\n` (CRLF) belgilari `\n` (LF) ga keltiriladi.
- Har bir qator oxiridagi bo‘sh joylar (`trim_end`) olib tashlanadi.
- Chiqishning boshlanishi va yakunidagi bo‘sh qatorlar (`trim`) qirqiladi.
- Agar kutilgan va haqiqiy matn to‘liq mos kelsa, test muvaffaqiyatli deb hisoblanadi.
