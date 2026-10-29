<USER_REQUEST>
# TECHNIK TOPSHIRIQ (TZ)
# CodePractice — dasturlashni o‘rganish va uy vazifalarini bajarish platformasi

**Loyiha nomi:** CodePractice  
**Mahsulot turi:** Windows desktop ilova + o‘qituvchi web-panel + backend API  
**Asosiy operatsion tizim:** Windows 11  
**Boshlang‘ich dasturlash tillari:** Python va C++  
**Keyingi kengaytirish:** Java va boshqa dasturlash tillari  
**Joylashtirish:** AWS bulutli infratuzilmasi  
**Rejalashtirilgan yuklama:** bir vaqtning o‘zida taxminan 20 nafar o‘quvchi  
**Loyihaning maqsadi:** o‘quvchilarning dasturlash bo‘yicha uy vazifalarini bajarishi, kodni avtomatik tekshirish, natijalarni saqlash va o‘qituvchiga hisobot taqdim etish.

---

## 1. Loyiha maqsadi

CodePractice o‘quvchilar uchun mustaqil dasturlash mashqlari va uy vazifalarini bajarish platformasi bo‘lishi kerak.

Tizim uchta asosiy qismdan tashkil topadi:

1. **Windows desktop ilova** — o‘quvchi topshiriqni ko‘radi, kod yozadi, uni ishga tushiradi, tekshiradi va natijasini ko‘radi.
2. **O‘qituvchi web-paneli** — o‘qituvchi guruhlar, o‘quvchilar, topshiriqlar, muddatlar va natijalarni boshqaradi.
3. **Backend va ma’lumotlar bazasi** — foydalanuvchilar, topshiriqlar, testlar, yuborilgan kodlar, tekshiruv natijalari va hisobotlarni saqlaydi.

Tizim oddiy matn muharriri bo‘lmasligi kerak. U dasturlashni o‘rgatish, vazifalarni tekshirish va o‘quvchining rivojlanishini kuzatishga mo‘ljallangan yagona platforma bo‘lishi kerak.

### 1.1. Asosiy prinsiplar

- O‘quvchi kodni mustaqil yozadi.
- Kod bajarilishi o‘quvchining Windows kompyuterida amalga oshiriladi.
- Internet mavjud bo‘lganda natijalar serverga yuboriladi.
- Test natijalari avtomatik tekshiriladi.
- AI yordamchisi kod va xatolarni tushuntiradi, lekin tayyor yechimni o‘quvchining o‘rniga yozmaydi.
- Topshiriqlar imtihon emas, o‘quv va mashq jarayoniga mo‘ljallangan.
- O‘qituvchi natijalarni web-paneldan kuzata oladi.
- Yangi dasturlash tillari va funksiyalar keyinchalik mavjud tizimni qayta yozmasdan qo‘shilishi mumkin.

## 2. Foydalanuvchi rollari

### 2.1. Administrator

Administrator quyidagi huquqlarga ega:

- O‘qituvchi hisoblarini yaratish, tahrirlash va faolsizlantirish.
- Guruhlar va o‘quvchilarni boshqarish.
- O‘quvchilarni guruhlarga biriktirish.
- O‘qituvchilar va guruhlar bo‘yicha umumiy statistikani ko‘rish.
- Tizim sozlamalarini boshqarish.
- Faollik jurnali va xavfsizlik hodisalarini ko‘rish.
- Topshiriqlar va dasturlash tillari bo‘yicha umumiy sozlamalarni boshqarish.

### 2.2. O‘qituvchi

O‘qituvchi quyidagi imkoniyatlarga ega bo‘ladi:

- O‘z guruhlari va o‘quvchilarini ko‘rish.
- Yangi topshiriq yaratish.
- Topshiriq tavsifi, kiritish va chiqarish formatini belgilash.
- Test misollarini yaratish va tahrirlash.
- Topshiriqni bitta yoki bir nechta guruhga biriktirish.
- Vazifani ochish va topshirish muddatini belgilash.
- O‘quvchilar natijalarini ko‘rish.
- Har bir test bo‘yicha natijani tekshirish.
- Kod bajarilish vaqti va xatolarni ko‘rish.
- O‘quvchi faoliyati bo‘yicha hisobot olish.
- Natijalarni CSV formatida eksport qilish.

O‘qituvchi faqat o‘ziga ruxsat berilgan guruhlar va ma’lumotlarni boshqarishi kerak.

### 2.3. O‘quvchi

O‘quvchi quyidagi imkoniyatlarga ega bo‘ladi:

- Login va parol orqali tizimga kirish.
- O‘ziga biriktirilgan topshiriqlarni ko‘rish.
- Topshiriq tavsifi va namunalarini o‘qish.
- Python yoki C++ tilini tanlash, agar topshiriqda ruxsat etilgan bo‘lsa.
- Kod yozish va tahrirlash.
- Kodni kompyuterida ishga tushirish.
- Test misollarini tekshirish.
- Natijalar va xatolarni ko‘rish.
- AI yordamchisidan tushuntirish olish.
- O‘zining oldingi urinishlari va natijalarini ko‘rish.
- Vazifani qayta bajarish va qayta yuborish.

O‘quvchi boshqa o‘quvchilarning kodlari, shaxsiy ma’lumotlari yoki natijalarini ko‘ra olmasligi kerak.

## 3. Windows desktop ilovasi

### 3.1. Texnologiyalar

Desktop ilova uchun quyidagi texnologiyalar qo‘llanilsin:

- **Tauri 2** — Windows desktop ilova qobig‘i.
- **React** — foydalanuvchi interfeysi.
- **TypeScript** — frontend dasturlash tili.
- **Vite** — frontend yig‘ish vositasi.
- **Monaco Editor** — kod muharriri.
- **Rust** — Tauri ichidagi tizim funksiyalari va xavfsiz lokal jarayonlarni boshqarish.
- **Python runtime va C++ compiler** — kodni mahalliy kompyuterda bajarish uchun.

Ilova Windows 11 da barqaror ishlashi kerak. Arxitektura imkon qadar Windows 10 ning qo‘llab-quvvatlanadigan versiyalariga ham mos bo‘lishi mumkin, ammo asosiy sinov platformasi Windows 11 hisoblanadi.

### 3.2. Birinchi ishga tushirish

Ilova birinchi marta ochilganda:

1. Ilova o‘z versiyasini tekshiradi.
2. Python va C++ uchun zarur muhit mavjudligini tekshiradi.
3. Kerakli komponentlar yo‘q bo‘lsa, foydalanuvchiga tushunarli ko‘rsatma beradi.
4. Foydalanuvchi login va parolini kiritadi.
5. Backend orqali hisob ma’lumotlari tekshiriladi.
6. O‘quvchining guruhlari va faol topshiriqlari yuklanadi.
7. Asosiy sahifa ochiladi.

Kerakli komponentlarni o‘rnatish jarayoni imzolangan, ishonchli paketlar orqali amalga oshirilsin. Ilova administrator huquqlarini sababsiz talab qilmasin.

### 3.3. Asosiy interfeys

Ilova quyidagi sahifalardan iborat bo‘lsin:

**1. Kirish sahifasi**
- Login maydoni.
- Parol maydoni.
- Parolni ko‘rsatish/yashirish.
- Kirish tugmasi.
- Tarmoq yoki autentifikatsiya xatolari haqida xabar.

**2. Bosh sahifa**
- O‘quvchi ismi va guruhi.
- Faol topshiriqlar.
- Bajarilgan topshiriqlar.
- Muddati yaqin vazifalar.
- Oxirgi natijalar.
- Profil va chiqish tugmalari.

**3. Topshiriqlar sahifasi**
- Topshiriq nomi.
- Qisqacha tavsif.
- Holati: yangi, jarayonda, bajarilgan, muddat o‘tgan.
- Topshirish muddati.
- Ruxsat etilgan dasturlash tillari.
- Topshiriqni ochish tugmasi.

**4. Kod muharriri sahifasi**
- Topshiriq tavsifi.
- Kod yozish muharriri.
- Dasturlash tilini tanlash.
- Kodni ishga tushirish tugmasi.
- Testlarni tekshirish tugmasi.
- AI yordamchisi paneli.
- Natijalar va xatolar paneli.
- Bajarilish vaqti.
- Testlarning o‘tish holati.
- Saqlash va yuborish holati.

**5. Natijalar sahifasi**
- Topshiriq nomi.
- Urinishlar soni.
- O‘tgan testlar soni.
- Muvaffaqiyatsiz testlar soni.
- Bajarilish vaqti.
- Oldingi urinishlar tarixi.

**6. Profil sahifasi**
- Foydalanuvchi ma’lumotlari.
- Guruh.
- Dastur versiyasi.
- Chiqish funksiyasi.

## 4. To‘liq ekran rejimi va boshqaruv

### 4.1. Ish rejimi

O‘quvchi kod yozishni boshlash uchun topshiriqni ochib, **“Boshlash”** tugmasini bosadi.

Shundan keyin ilova to‘liq ekran rejimiga o‘tadi. Muharrir va topshiriq paneli ekran o‘lchamiga moslashadi.

To‘liq ekran rejimi uy vazifasini bajarishda qulaylik yaratish va chalg‘ituvchi elementlarni kamaytirish uchun ishlatiladi. U yashirin kuzatuv yoki o‘quvchining butun operatsion tizimini nazorat qilish vositasi bo‘lmasligi kerak.

### 4.2. Clipboard cheklovi

Clipboard cheklovi faqat CodePractice ilovasining o‘zida, ayniqsa kod muharriri doirasida ishlashi shart.

Quyidagilar taqiqlanadi:

- Kod muharririga tashqaridan matnni paste qilish.
- Muharrirdan kodni copy qilish.
- Muharrir ichidagi o‘ng tugma menyusi orqali copy/paste.
- Tashqi matnni drag-and-drop orqali muharrirga joylashtirish.
- Muharrirning boshqa clipboard asosidagi amallaridan foydalanish.

Texnik talablar:

- `Ctrl+C`, `Ctrl+X`, `Ctrl+V` va tegishli clipboard kombinatsiyalarini muharrir ichida bloklash.
- Monaco Editor menyularida clipboard amallarini o‘chirish.
- Muharrir kontekst menyusidagi copy/paste buyruqlarini olib tashlash.
- Drag-and-drop orqali tashqi matnni kiritishni bloklash.
- Clipboard orqali ma’lumot ko‘chirish imkoniyatlarini Tauri va frontend integratsiyasida cheklash.
- Ruxsat etilgan matn kiritish, kod yozish, tanlash va tahrirlash funksiyalarini saqlash.

Ushbu cheklovlar butun Windows tizimiga emas, CodePractice ilovasiga taalluqli. Oddiy desktop ilova boshqa dasturlar, kamera yoki tashqi qurilmalar orqali nusxa olishni mutlaq to‘xtata olmaydi. Tizim buni 100 foiz imtihon nazorati deb taqdim etmasligi kerak.

## 5. Kod muharriri va bajarish tizimi

### 5.1. Monaco Editor

Kod muharriri quyidagi funksiyalarni qo‘llab-quvvatlasin:

- Sintaksisni ranglash.
- Qator raqamlari.
- Avtomatik qavs yopish.
- Indentatsiya.
- Kodni qatorlar bo‘yicha ko‘rish.
- Xato qatorini ko‘rsatish.
- Kodni tahrirlash va o‘chirish.
- Python va C++ sintaksisi.
- Muharrir o‘lchamini moslashtirish.
- Kodni avtomatik saqlash.
- Yozilayotgan kodning mahalliy nusxasini tiklash.

AI rejimida kod avtomatik generatsiya qilinmasligi yoki AI javobi bevosita muharrirga qo‘shilmasligi kerak.

### 5.2. Python

Python topshiriqlari o‘quvchining kompyuterida lokal bajariladi.

Talablar:

- Qo‘llab-quvvatlanadigan Python versiyasini aniqlash.
- Kodni alohida vaqtinchalik ish katalogida bajarish.
- `stdout` va `stderr` chiqishlarini ajratish.
- Syntax error va runtime errorlarni qaytarish.
- Bajarilish vaqtini o‘lchash.
- Vaqt chegarasidan oshgan jarayonni to‘xtatish.
- Jarayonning chiqish hajmini cheklash.
- Testlar tugagach vaqtinchalik fayllarni xavfsiz tozalash.

### 5.3. C++

C++ topshiriqlari uchun qo‘llab-quvvatlanadigan compiler ishlatiladi.

Talablar:

- Compiler mavjudligini tekshirish.
- Zarur bo‘lsa, imzolangan installer orqali o‘rnatish.
- Kodni vaqtinchalik katalogga yozish.
- Kodni alohida jarayonda kompilyatsiya qilish.
- Kompilyatsiya xatolarini foydalanuvchiga ko‘rsatish.
- Muvaffaqiyatli kompilyatsiyadan keyin dasturni ishga tushirish.
- Bajarilish vaqtini o‘lchash.
- Vaqt chegarasidan oshgan jarayonni to‘xtatish.
- Kompilyator va ishga tushirish jarayonining chiqish hajmini cheklash.

### 5.4. Kodni xavfsiz bajarish

O‘quvchi yozgan kod ishonchsiz dastur sifatida qaralishi shart.

Kod bajarish tizimi quyidagilarni ta’minlasin:

- Kodni asosiy desktop jarayonidan alohida bajarish.
- Har bir urinish uchun alohida vaqtinchalik ish katalogi yaratish.
- Har bir jarayonga vaqt limiti qo‘yish.
- Xotira va CPU sarfini cheklash imkoniyatidan foydalanish.
- Jarayonlar daraxtini nazorat qilish va kerak bo‘lsa to‘liq to‘xtatish.
- Cheksiz sikllarni aniqlash va to‘xtatish.
- Fayl tizimiga kirishni imkon qadar cheklash.
- Tarmoqdan foydalanishni o‘chirish yoki alohida ruxsatlar bilan cheklash.
- Maxfiy kalitlar, tokenlar va server credentiallarini kod bajariladigan jarayonga uzatmaslik.
- Kodni administrator huquqida ishga tushirmaslik.
- Natija va log hajmini cheklash.
- Xatolik yuz berganda asosiy ilovaning ishlashini davom ettirish.

Tauri imkoniyatlaridan foydalangan holda Rust tomondagi buyruqlar ro‘yxati aniq belgilanadi. Frontenddan istalgan shell buyrug‘ini bajarishga ruxsat berilmasin.

**Muhim:** oddiy `subprocess` yoki `Command` orqali alohida jarayon yaratishning o‘zi to‘liq sandbox hisoblanmaydi. Windows uchun amaliy himoya sifatida cheklangan foydalanuvchi konteksti, Windows Job Objects, process resource limitlari va zaruratga qarab Windows Sandbox yoki boshqa mustahkam izolyatsiya mexanizmi qo‘llanilishi kerak. Himoya darajasi sinovlarda tekshiriladi.

## 6. Avtomatik test tizimi

### 6.1. Asosiy talab

O‘quvchi kodini ishga tushirganda tizim kodning to‘g‘ri yoki noto‘g‘riligini test misollari orqali tekshirishi kerak.

Har bir topshiriq kamida quyidagi ma’lumotlarga ega bo‘lsin:

- Topshiriq nomi.
- Tavsif.
- Kiritish formati.
- Chiqish formati.
- Namunaviy input va output.
- Test misollari.
- Vaqt chegarasi.
- Ruxsat etilgan dasturlash tillari.
- Baholash mezoni.

### 6.2. Testlar ishlash tartibi

1. O‘quvchi kod yozadi.
2. “Testlarni tekshirish” tugmasini bosadi.
3. Ilova kodni kompilyatsiya qiladi yoki interpretator orqali ishga tushiradi.
4. Tizim test misollarini ketma-ket yoki xavfsiz boshqariladigan tartibda bajaradi.
5. Har bir testning input ma’lumoti dasturga uzatiladi.
6. Dastur chiqishi kutilgan natija bilan taqqoslanadi.
7. Natija testlar kesimida qayd etiladi.
8. O‘quvchiga umumiy natija ko‘rsatiladi.
9. Urinish serverga yuboriladi.

### 6.3. O‘nta tasodifiy test

Oldingi talabga muvofiq, tegishli topshiriqlarda **10 ta tasodifiy test misoli** orqali tekshiruv bajarilishi kerak.

- Test generatori topshiriqning qoidalariga mos inputlar yaratadi.
- Tasodifiy testlar oldindan belgilangan diapazon va cheklovlarga rioya qiladi.
- Har bir tekshiruv uchun ishlatilgan testlar to‘plami yoki seed qayd etiladi.
- Bir xil urinish natijasini qayta tekshirish zarur bo‘lsa, o‘sha seed va testlar to‘plamidan foydalanish mumkin bo‘ladi.
- Tasodifiy test generatori mavjud bo‘lmagan topshiriqlarda o‘qituvchi yaratgan testlar ishlatiladi.
- Testlar faqat tasodifiy sonlar bilan cheklanmaydi: zarur bo‘lganda chegara qiymatlari, minimal va maksimal qiymatlar ham tekshiriladi.

Testlarning to‘liq input va output ma’lumotlari o‘quvchiga oshkor qilinishi shart emas. O‘qituvchi qaysi testlar o‘tganini va xato turini belgilangan ruxsatlar doirasida ko‘ra oladi.

### 6.4. Natijalarni taqqoslash

Taqqoslash usuli topshiriq turiga qarab tanlanadi:

- Matnning aniq mosligi.
- Ortib qolgan bo‘sh joylarni hisobga olmaydigan taqqoslash.
- Har bir qatordagi qiymatlarni taqqoslash.
- Sonli qiymatlarda ruxsat etilgan xatolik chegarasi.
- Maxsus validator funksiyasi.

Har bir topshiriqda taqqoslash qoidasi aniq ko‘rsatiladi. Barcha topshiriqlarga bir xil tekshirish usulini majburan qo‘llash mumkin emas.

### 6.5. Natijalar paneli

Natijalar panelida quyidagilar ko‘rsatiladi:

- Umumiy testlar soni.
- O‘tgan testlar soni.
- O‘tmagan testlar soni.
- Kompilyatsiya holati.
- Bajarilish vaqti.
- Syntax error.
- Runtime error.
- Time limit exceeded.
- Kutilgan va haqiqiy natija, agar o‘qituvchi ruxsat bergan bo‘lsa.

## 7. AI yordamchisi

### 7.1. Maqsad

AI yordamchisi o‘quvchiga dasturlashni tushunishda yordam berishi kerak. U o‘quvchining o‘rniga vazifani bajarmaydi.

### 7.2. Ruxsat etilgan funksiyalar

- Syntax error sababini tushuntirish.
- Runtime error sababini tushuntirish.
- Xato bo‘lishi mumkin bo‘lgan kod qismini ko‘rsatish.
- Dasturlash tushunchalarini izohlash.
- Topshiriq shartini soddaroq tushuntirish.
- Kodni qanday tekshirish bo‘yicha maslahat berish.
- O‘quvchini mustaqil yechimga olib boradigan yo‘naltiruvchi savollar berish.
- Python va C++ sintaksisi bo‘yicha yordam berish.

### 7.3. Taqiqlangan funksiyalar

- Topshiriqning to‘liq tayyor yechimini berish.
- Butun kodni o‘quvchi o‘rniga yozish.
- AI yaratgan kodni muharrirga avtomatik kiritish.
- “Yechimni yarat” kabi to‘liq kod ishlab chiqarishga qaratilgan tugma.
- O‘quvchining roziligisiz kodni o‘zgartirish.
- Kodni o‘quvchining o‘rniga yuborish.

### 7.4. AI ishlash tartibi

1. O‘quvchi AI yordamchisiga savol beradi yoki xato haqida tushuntirish so‘raydi.
2. Ilova zarur kontekstni tayyorlaydi: topshiriq sharti, o‘quvchi yuborgan savol va kerak bo‘lsa xato xabari.
3. Kontekst backend orqali AI xizmatiga yuboriladi.
4. AI javobi o‘quvchiga yordamchi panelida ko‘rsatiladi.
5. O‘quvchi tavsiyani o‘qib, kodni o‘zi tahrirlaydi.

AI xizmatining API kaliti desktop ilovaga joylashtirilmasligi kerak. Kalit serverda saqlanadi.

AI javoblari xarajat va suiiste’molning oldini olish uchun so‘rovlar soni va token hajmi bo‘yicha cheklanishi mumkin. AI ishlamagan holatda kod yozish va testlarni bajarish funksiyalari ishlashda davom etishi kerak.

## 8. Topshiriqlar va uy vazifalari

### 8.1. Topshiriq yaratish

O‘qituvchi web-panel orqali quyidagilarni kiritadi:

- Topshiriq nomi.
- Batafsil shart.
- Mavzu.
- Qiyinlik darajasi.
- Dasturlash tili.
- Input formati.
- Output formati.
- Namuna.
- Testlar.
- Test tekshirish qoidasi.
- Vaqt limiti.
- Maksimal ball.
- Vazifa ochiladigan sana va vaqt.
- Topshirish muddati.
- Biriktiriladigan guruh yoki guruhlar.

### 8.2. Topshiriq holatlari

- Draft — qoralama.
- Scheduled — rejalashtirilgan.
- Open — bajarish uchun ochiq.
- Submitted — yuborilgan.
- Completed — bajarilgan.
- Overdue — muddati o‘tgan.
- Archived — arxivlangan.

### 8.3. Urinishlar

- O‘quvchi bir vazifani bir necha marta bajarishi mumkin.
- Har bir tekshiruv urinish sifatida qayd qilinadi.
- Oxirgi urinish va eng yaxshi natija alohida saqlanishi mumkin.
- O‘qituvchi urinishlar tarixini ko‘radi.
- O‘quvchi o‘zining oldingi natijalarini ko‘radi.
- Qayta topshirish qoidalari o‘qituvchi tomonidan belgilanadi.

## 9. O‘qituvchi web-paneli

### 9.1. Texnologiyalar

- React.
- TypeScript.
- Vite.
- Tailwind CSS yoki loyiha davomida tanlangan yagona dizayn tizimi.
- Backend bilan REST API orqali aloqa.

### 9.2. Sahifalar

**1. Login**
- O‘qituvchi va administrator autentifikatsiyasi.

**2. Dashboard**
- O‘quvchilar soni.
- Guruhlar soni.
- Faol topshiriqlar.
- Topshirilgan vazifalar.
- Bajarilmagan vazifalar.
- So‘nggi faoliyat.

**3. Guruhlar**
- Guruhlar ro‘yxati.
- Guruh yaratish va tahrirlash.
- Guruhga o‘quvchi biriktirish.

**4. O‘quvchilar**
- Ism-familiya.
- Login.
- Guruh.
- Faollik holati.
- Topshiriqlar bajarilishi.

**5. Topshiriqlar**
- Topshiriqlar ro‘yxati.
- Yangi topshiriq yaratish.
- Tahrirlash.
- Testlar boshqaruvi.
- Vazifani guruhga biriktirish.

**6. Natijalar**
- O‘quvchi bo‘yicha natijalar.
- Guruh bo‘yicha natijalar.
- Topshiriq bo‘yicha natijalar.
- O‘tgan va o‘tmagan testlar.
- Bajarilish vaqti.
- Urinishlar tarixi.

**7. Hisobotlar**
- Sana oralig‘i bo‘yicha filtr.
- Guruh bo‘yicha filtr.
- Topshiriq bo‘yicha filtr.
- CSV eksport.
- Bajarilish foizi.
- O‘rtacha natija.
- Muddati o‘tgan topshiriqlar.

**8. Sozlamalar**
- Foydalanuvchi rollari.
- Dasturlash tillari.
- Tizim sozlamalari.
- Audit jurnali.

Web-panel mobil va desktop ekranlarga moslashishi kerak.

## 10. Backend arxitekturasi

### 10.1. Tavsiya etiladigan texnologiyalar

- **Python + FastAPI** — backend REST API.
- **PostgreSQL** — asosiy ma’lumotlar bazasi.
- **SQLAlchemy** — ORM.
- **Alembic** — ma’lumotlar bazasi migratsiyalari.
- **Pydantic** — ma’lumotlarni tekshirish.
- **JWT yoki xavfsiz server sessiyasi** — autentifikatsiya mexanizmi.
- **HTTPS** — barcha tashqi API aloqalari.
- **AWS** — server infratuzilmasi.

### 10.2. Backend modullari

- Authentication.
- Users.
- Roles and permissions.
- Groups.
- Students.
- Assignments.
- Test cases.
- Submission attempts.
- Execution results.
- Reports.
- AI assistant.
- Application versions.
- Audit logs.

Dastlab 20 nafar bir vaqtdagi foydalanuvchi uchun mikroservislar arxitekturasi majburiy emas. Modullarga ajratilgan, testlanadigan monolit backend ishlab chiqish va boshqarishni soddalashtiradi.

### 10.3. Asosiy API yo‘nalishlari

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/me`
- `GET /api/v1/assignments`
- `GET /api/v1/assignments/{id}`
- `POST /api/v1/submissions`
- `GET /api/v1/submissions/{id}`
- `GET /api/v1/submissions/{id}/results`
- `POST /api/v1/ai/explain`
- `GET /api/v1/reports/summary`
- `GET /api/v1/reports/submissions`

O‘qituvchi va administrator uchun guruhlar, o‘quvchilar, topshiriqlar va testlarni boshqarish API yo‘nalishlari ham yaratiladi.

Barcha endpointlar autentifikatsiya, rol va resursga egalik huquqi bo‘yicha tekshirilishi kerak.

## 11. Ma’lumotlar bazasi

PostgreSQL ma’lumotlar bazasida quyidagi asosiy jadvallar bo‘lsin.

### 11.1. `users`

- `id` — UUID, birlamchi kalit.
- `full_name` — ism-familiya.
- `username` — noyob login.
- `password_hash` — parolning xavfsiz xeshi.
- `role` — admin, teacher yoki student.
- `is_active` — faol holat.
- `created_at`.
- `updated_at`.

### 11.2. `groups`

- `id`.
- `name`.
- `description`.
- `created_at`.

### 11.3. `group_members`

- `group_id`.
- `student_id`.
- `joined_at`.

Bir o‘quvchining bir nechta guruhga qatnashishi talab qilinmasa, bu bog‘lanish biznes qoidalari bilan cheklanadi.

### 11.4. `teacher_groups`

- `teacher_id`.
- `group_id`.

Bu jadval o‘qituvchining faqat ruxsat etilgan guruhlarni boshqarishini ta’minlaydi.

### 11.5. `assignments`

- `id`.
- `title`.
- `description`.
- `topic`.
- `difficulty`.
- `allowed_languages`.
- `input_format`.
- `output_format`.
- `time_limit_ms`.
- `max_score`.
- `status`.
- `available_at`.
- `due_at`.
- `created_by`.
- `created_at`.
- `updated_at`.

### 11.6. `assignment_groups`

- `assignment_id`.
- `group_id`.

### 11.7. `test_cases`

- `id`.
- `assignment_id`.
- `input_data`.
- `expected_output`.
- `test_type`.
- `weight`.
- `is_hidden`.
- `created_at`.

Maxfiy testlar o‘quvchi API javoblarida yoki desktop ilova paketida oshkor qilinmasligi kerak.

### 11.8. `submissions`

- `id`.
- `assignment_id`.
- `student_id`.
- `language`.
- `source_code`.
- `status`.
- `score`.
- `passed_tests`.
- `total_tests`.
- `execution_time_ms`.
- `created_at`.

### 11.9. `submission_test_results`

- `id`.
- `submission_id`.
- `test_case_id` yoki maxfiy testlar uchun xavfsiz ichki identifikator.
- `status`.
- `execution_time_ms`.
- `error_type`.
- `created_at`.

### 11.10. `ai_requests`

- `id`.
- `student_id`.
- `assignment_id`.
- `request_type`.
- `created_at`.
- `status`.
- `usage_metadata`.

Maxfiylik va xarajat talablariga qarab AI so‘rovlarining to‘liq matnini saqlash o‘rniga minimal audit ma’lumotlari saqlanishi mumkin.

### 11.11. `audit_logs`

- `id`.
- `actor_id`.
- `action`.
- `resource_type`.
- `resource_id`.
- `created_at`.
- `metadata`.

Audit loglar orqali muhim boshqaruv amallari kuzatiladi.

### 11.12. Ma’lumotlar bazasi talablari

- Barcha jadvallarda mos birlamchi kalitlar.
- Kerakli tashqi kalitlar va indekslar.
- `username` uchun UNIQUE cheklovi.
- Sana-vaqtlar UTC formatida saqlanishi.
- Vaqt mintaqasi interfeysda to‘g‘ri ko‘rsatilishi.
- Migratsiyalar Alembic orqali boshqarilishi.
- Backup va tiklash jarayoni sinovdan o‘tkazilishi.
- O‘quvchilar faqat o‘zlariga tegishli yozuvlarni ko‘rishi.

## 12. AWS infratuzilmasi va joylashtirish

### 12.1. Arxitektura

Tizim quyidagi mantiqiy qismlardan iborat bo‘lsin:

- Windows desktop ilova.
- HTTPS orqali backend API.
- O‘qituvchi web-paneli.
- PostgreSQL ma’lumotlar bazasi.
- Server tomondagi AI integratsiyasi.
- Monitoring va loglar.
- Zaxira nusxa tizimi.

### 12.2. AWS komponentlari

Dastlabki versiyada quyidagi xizmatlardan foydalanish mumkin:

- Amazon EC2 — FastAPI backendni ishga tushirish.
- Amazon RDS for PostgreSQL — boshqariladigan ma’lumotlar bazasi.
- Amazon S3 — desktop installer va statik fayllarni saqlash.
- AWS IAM — xizmatlar uchun minimal huquqlar.
- AWS CloudWatch — loglar va monitoring.
- AWS Certificate Manager yoki mos TLS yechimi — HTTPS sertifikatlari.
- AWS Systems Manager yoki xavfsiz SSH — server boshqaruvi.

Tanlangan xizmatlar va konfiguratsiya ishlab chiqish bosqichida tasdiqlanadi. Ishlab chiqarish muhitida maxfiy ma’lumotlar kod ichiga yozilmasligi kerak.

### 12.3. Domen va HTTPS

- Web-panel va API uchun domen nomlari konfiguratsiya qilinadi.
- Barcha tashqi aloqalar HTTPS orqali amalga oshiriladi.
- HTTP so‘rovlari HTTPS ga yo‘naltiriladi.
- CORS faqat ruxsat etilgan web domenlarga ochiladi.
- API hujjatlari production muhitida himoyalanishi yoki cheklanishi mumkin.

### 12.4. Yuklama

Birinchi bosqichda 20 nafar bir vaqtdagi o‘quvchi uchun ishlash maqsad qilinadi.

Sinovda quyidagilar tekshiriladi:

- Bir vaqtda login qilish.
- Topshiriqlar ro‘yxatini yuklash.
- Bir vaqtda kod yuborish.
- Bir vaqtda AI so‘rovlarini bajarish.
- Hisobotlarni yaratish.
- Serverning barqarorligi va xatolardan tiklanishi.

20 ta foydalanuvchi talabi sinov natijalari bilan tasdiqlanishi kerak. Keyinchalik foydalanuvchilar soni oshsa, backend va ma’lumotlar bazasi resurslari kengaytiriladi.

## 13. Xavfsizlik

### 13.1. Autentifikatsiya

- Parollar ochiq matnda saqlanmaydi.
- Argon2id yoki mos xavfsiz parol xeshlash algoritmi ishlatiladi.
- Access tokenlar qisqa muddatli bo‘ladi.
- Refresh tokenlar xavfsiz saqlanadi va bekor qilinishi mumkin.
- Login urinishlari tezligi cheklanadi.
- Faolsizlantirilgan foydalanuvchi tizimga kira olmaydi.

### 13.2. Ruxsatlar

Backend har bir so‘rovda foydalanuvchining huquqini tekshiradi. Faqat frontendda tugmalarni yashirish xavfsizlik uchun yetarli emas.

- O‘quvchi faqat o‘z ma’lumotlarini ko‘radi.
- O‘qituvchi faqat ruxsat etilgan guruhlarni boshqaradi.
- Administratorga alohida huquqlar beriladi.
- Maxfiy testlar o‘quvchi API orqali olinmaydi.
- Boshqa foydalanuvchining ID sini yuborish orqali uning ma’lumotlarini ko‘rish imkoni bo‘lmaydi.

### 13.3. API xavfsizligi

- HTTPS.
- Request schema validation.
- Rate limiting.
- CORS cheklovlari.
- SQL injection himoyasi.
- XSS va CSRF xavflarini tegishli joylarda kamaytirish.
- Fayl va so‘rov hajmini cheklash.
- Xavfsiz error handling.
- Maxfiy ma’lumotlarni loglarga yozmaslik.

### 13.4. Kod xavfsizligi

O‘quvchi kodi ishonchsiz hisoblanadi. U serverda bevosita bajarilmaydi. Birinchi versiyada kod lokal kompyuterda bajariladi.

Serverga faqat zarur bo‘lgan topshirish ma’lumotlari, kod yoki natija yuboriladi. Kodni serverda qayta bajarish talab etilsa, bu alohida izolyatsiyalangan execution service orqali amalga oshiriladi.

### 13.5. Maxfiylik

- O‘quvchi ma’lumotlari faqat vakolatli shaxslarga ko‘rinadi.
- AI xizmatiga faqat kerakli kontekst yuboriladi.
- API kalitlari desktop ilovaga joylashtirilmaydi.
- Ma’lumotlarni saqlash va o‘chirish siyosati hujjatlashtiriladi.
- Backup fayllari himoyalanadi.

## 14. Natijalarni serverga yuborish

Kod lokal bajarilganidan keyin ilova quyidagi ma’lumotlarni yuboradi:

- O‘quvchi identifikatori — serverdagi autentifikatsiyadan aniqlanadi.
- Topshiriq identifikatori.
- Urinish identifikatori.
- Dasturlash tili.
- Testlar soni.
- O‘tgan testlar soni.
- Umumiy holat.
- Bajarilish vaqti.
- Xato turi.
- Topshirilgan kod, agar platforma sozlamalari va maxfiylik siyosati bunga ruxsat bersa.

Server mijoz yuborgan ball yoki natijani to‘liq ishonchli deb qabul qilmasligi kerak. Mijoz tomonidan yuborilgan kod va natija o‘quvchining urinish qaydi hisoblanadi. Maxfiy testlar va qat’iy baholash kerak bo‘lsa, server tomonda ishonchli tekshiruv yoki mustaqil validator talab qilinadi.

Internet vaqtincha uzilganda ilova natijani lokal navbatda saqlab, aloqa tiklanganda qayta yuborishi mumkin. Qayta yuborish takroriy yozuvlar yaratmasligi uchun idempotency mexanizmi ishlatiladi.

## 15. UI/UX va dizayn talablari

Dizayn zamonaviy, sodda va ta’lim platformasiga mos bo‘lishi kerak.

- Toza interfeys.
- O‘qishga qulay shriftlar.
- Yetarli kontrast.
- Kod muharriri uchun katta ish maydoni.
- Muhim amallar aniq ko‘rsatilishi.
- Yuklanish va kutish holatlari.
- Tushunarli xatolik xabarlari.
- Muvaffaqiyatli natija va muvaffaqiyatsiz natijani farqlash.
- Kichik va katta ekranlarga mos web-panel.
- Bir xil ranglar, tugmalar, inputlar va modal oynalar tizimi.
- O‘zbek tilidagi interfeys.

Desktop ilova va web-panel bir xil vizual uslubga ega bo‘lsin, ammo har birining vazifasiga mos interfeys saqlansin.

Figma dizaynida barcha sahifalar, modal oynalar, holatlar, loading ekranlari, xatoliklar, bo‘sh ro‘yxatlar va responsiv ko‘rinishlar ko‘rsatilishi kerak.

## 16. Dastur tuzilmasi

Tavsiya etiladigan loyiha tuzilmasi:

```text
CodePractice/
├── desktop/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── features/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── styles/
│   ├── src-tauri/
│   │   ├── src/
│   │   │   ├── commands/
│   │   │   ├── execution/
│   │   │   ├── security/
│   │   │   └── main.rs
│   │   └── tauri.conf.json
│   └── tests/
├── web/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── features/
│   │   ├── services/
│   │   └── types/
│   └── tests/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── security/
│   │   └── main.py
│   ├── migrations/
│   └── tests/
├── docs/
├── deployment/
└── README.md
```

Bu tuzilma tavsiya etilgan boshlang‘ich tuzilma. Ishlab chiqish jarayonida texnik zaruratga qarab takomillashtirilishi mumkin, lekin desktop, web va backend kodlari aniq ajratilgan bo‘lishi kerak.

## 17. Testlash talablari

### 17.1. Unit testlar

- Autentifikatsiya.
- Ruxsatlar.
- Test natijalarini taqqoslash.
- Ball hisoblash.
- Topshiriq holatlari.
- API schema validation.
- AI so‘rovlari uchun cheklovlar.

### 17.2. Integratsion testlar

- Desktop ilovaning backend bilan aloqasi.
- Login va logout.
- Topshiriqni olish.
- Python kodini bajarish.
- C++ kodini kompilyatsiya qilish va bajarish.
- Natijani serverga yuborish.
- Web-paneldan topshiriq yaratish.
- Hisobotlarni olish.

### 17.3. Xavfsizlik testlari

- Noto‘g‘ri login.
- Ruxsatsiz API so‘rovlari.
- Boshqa o‘quvchi ma’lumotlariga kirishga urinish.
- Cheksiz sikl.
- Juda katta chiqish.
- Juda uzoq bajariladigan kod.
- Fayl tizimiga ruxsatsiz kirish urinishlari.
- Tarmoqdan foydalanishga urinish.
- Maxfiy testlarni API orqali olishga urinish.
- AI orqali tayyor yechim olishni cheklash.

### 17.4. Yuklama testlari

20 nafar virtual foydalanuvchi bilan:

- Login.
- Topshiriqlarni ko‘rish.
- Kod urinishlarini yuborish.
- Natijalarni olish.
- AI yordamchisidan foydalanish.
- Hisobotlarni yuklash.

Natijalar bo‘yicha javob vaqti, xatolar foizi, CPU, RAM va ma’lumotlar bazasi yuklamasi o‘lchanadi.

### 17.5. Qabul qilish mezonlari

Loyiha quyidagi holatlarda qabul qilinadi:

1. Windows 11 da desktop ilova muvaffaqiyatli o‘rnatiladi va ochiladi.
2. O‘quvchi login orqali tizimga kira oladi.
3. Topshiriqlar web-paneldan yaratiladi va desktop ilovada ko‘rinadi.
4. Python kodi lokal bajariladi.
5. C++ kodi kompilyatsiya qilinadi va lokal bajariladi.
6. Syntax error va runtime error tushunarli ko‘rsatiladi.
7. 10 ta tasodifiy test ishlaydigan topshiriqlarda test tekshiruvi bajariladi.
8. Natijalar serverga yuboriladi va web-panelda ko‘rinadi.
9. AI kod va xatolarni tushuntiradi, lekin tayyor yechimni muharrirga kiritmaydi.
10. Clipboard cheklovi CodePractice ichidagi muharrirda ishlaydi.
11. O‘quvchi boshqa foydalanuvchining ma’lumotlarini ko‘ra olmaydi.
12. 20 nafar bir vaqtdagi foydalanuvchi bilan yuklama sinovlari muvaffaqiyatli o‘tadi.
13. Xavfsizlik sinovlarida aniqlangan muhim zaifliklar bartaraf etiladi.
14. Installer, web-panel, backend, migratsiyalar va hujjatlar topshiriladi.

## 18. Ishlab chiqish bosqichlari

### 1-bosqich: Talablarni aniqlashtirish va dizayn

- Figma maketlarini tayyorlash.
- Desktop ilova sahifalari.
- O‘qituvchi web-paneli.
- API arxitekturasi.
- Ma’lumotlar bazasi sxemasi.
- Dasturlash tillari va kod bajarish muhiti bo‘yicha qarorlar.

**Natija:** tasdiqlangan dizayn va texnik arxitektura.

### 2-bosqich: Backend va ma’lumotlar bazasi

- FastAPI loyihasi.
- PostgreSQL.
- Migratsiyalar.
- Autentifikatsiya.
- Rollar va ruxsatlar.
- Guruhlar va o‘quvchilar.
- Topshiriqlar va testlar API si.

**Natija:** ishlaydigan backend va ma’lumotlar bazasi.

### 3-bosqich: Desktop ilovaning asosiy qismi

- Tauri 2 loyihasi.
- React va TypeScript interfeysi.
- Login.
- Bosh sahifa.
- Topshiriqlar ro‘yxati.
- Profil.
- Backend bilan integratsiya.

**Natija:** tizimga kiradigan va topshiriqlarni ko‘rsatadigan Windows ilova.

### 4-bosqich: Kod muharriri va lokal bajarish

- Monaco Editor.
- Python bajarish.
- C++ kompilyatsiyasi.
- Lokal ish kataloglari.
- Vaqt limitlari.
- Xato xabarlari.
- Xavfsiz jarayon boshqaruvi.

**Natija:** o‘quvchi kod yozib, kompyuterida bajara oladi.

### 5-bosqich: Test tizimi va natijalar

- Test misollarini boshqarish.
- 10 ta tasodifiy test.
- Natijalarni taqqoslash.
- Urinishlar tarixi.
- Natijalarni backendga yuborish.

**Natija:** avtomatik tekshirish va hisobotlar uchun ma’lumotlar.

### 6-bosqich: AI yordamchisi

- Backend orqali AI xizmatini ulash.
- Xatolarni tushuntirish.
- Kod va topshiriq kontekstini uzatish.
- Tayyor yechim berishni cheklash.
- AI so‘rovlarini nazorat qilish.

**Natija:** o‘quvchiga tushuntirish beradigan yordamchi.

### 7-bosqich: Web-panel

- Dashboard.
- Guruhlar va o‘quvchilar.
- Topshiriqlar yaratish.
- Testlarni boshqarish.
- Natijalar va hisobotlar.
- CSV eksport.

**Natija:** o‘qituvchi tizimni brauzer orqali boshqara oladi.

### 8-bosqich: Xavfsizlik va sinovlar

- Lokal kod bajarish xavfsizligi.
- API xavfsizligi.
- Ruxsatlar testlari.
- Yuklama testlari.
- UI testlari.
- Xatolarni tuzatish.

**Natija:** qabul sinovlariga tayyor versiya.

### 9-bosqich: AWS va chiqarish

- Production muhitini tayyorlash.
- HTTPS.
- Ma’lumotlar bazasi.
- Loglar va monitoring.
- Backup va tiklash sinovi.
- Windows installer.
- O‘rnatish va foydalanuvchi qo‘llanmasi.

**Natija:** o‘quvchilarga tarqatish mumkin bo‘lgan dastlabki versiya.

## 19. Topshiriladigan yakuniy materiallar

Ishlab chiqish tugaganda quyidagilar topshirilishi shart:

- Windows uchun CodePractice installer.
- Desktop ilovaning to‘liq manba kodi.
- Web-panelning to‘liq manba kodi.
- Backend manba kodi.
- PostgreSQL sxemasi va migratsiyalar.
- API hujjatlari.
- AWS joylashtirish yo‘riqnomasi.
- `.env.example` kabi namunaviy konfiguratsiya fayli, maxfiy kalitlarsiz.
- Testlar va ularni ishga tushirish yo‘riqnomasi.
- Figma dizayn fayli.
- Administrator uchun qo‘llanma.
- O‘qituvchi uchun qo‘llanma.
- O‘quvchi uchun qisqa yo‘riqnoma.
- Backup va tiklash yo‘riqnomasi.
- Yangi dasturlash tilini qo‘shish bo‘yicha texnik hujjat.

## 20. Keyingi versiyalar uchun imkoniyatlar

Birinchi versiyaning asosiy funksiyalari tayyor bo‘lgandan keyin quyidagilarni qo‘shish mumkin:

- Java dasturlash tilini qo‘llab-quvvatlash.
- Qo‘shimcha tillar va compilerlar.
- Kengaytirilgan statistikalar.
- O‘quvchi rivojlanish grafigi.
- Yangi topshiriq turlari.
- O‘qituvchi uchun tayyor topshiriqlar kutubxonasi.
- Ilova yangilanishlarini boshqarish.
- O‘quvchilar soni oshganda infratuzilmani kengaytirish.

Bu funksiyalar birinchi versiyaning ishga tushishiga to‘sqinlik qilmasligi kerak.

## 21. Yakuniy ishlab chiqish talabi

CodePractice ishlab chiqishda barcha asosiy funksiyalar haqiqiy ishlashi kerak. Faqat dizayn uchun yaratilgan tugmalar, soxta natijalar, statik hisobotlar yoki ishlamaydigan demo funksiyalar yakuniy mahsulot sifatida qabul qilinmaydi.

Har bir modul:

- Haqiqiy backend yoki lokal mexanizmga ulangan bo‘lishi.
- Xatolarni to‘g‘ri boshqarishi.
- Tegishli testlardan o‘tishi.
- Xavfsizlik talablariga rioya qilishi.
- Hujjatlashtirilgan bo‘lishi kerak.

Avval ishlaydigan asosiy versiya ishlab chiqiladi. Keyin AI, kengaytirilgan hisobotlar va qo‘shimcha tillar bosqichma-bosqich takomillashtiriladi.

**Yakuniy maqsad:** o‘quvchi Windows kompyuterida CodePractice dasturini ochadi, vazifani tanlaydi, kodni mustaqil yozadi, lokal bajaradi, testlardan o‘tkazadi va natijasini serverga yuboradi. O‘qituvchi esa web-panelda topshiriqlarni boshqaradi va o‘quvchilarning natijalarini kuzatadi.
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-10-29T20:17:42+05:00.
</ADDITIONAL_METADATA>