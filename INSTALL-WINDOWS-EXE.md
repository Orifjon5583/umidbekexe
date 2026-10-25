# CodePractice v2.4.0 — Windows 11 O‘rnatish va Ishga Tushirish Yo‘riqnomasi

Ushbu platforma o‘quvchilar uchun **Windows 11 o‘rnatiladigan desktop dasturi** (Setup Installer) sifatida ishlab chiqilgan.

---

## 1. Dasturni Kompyuterga O‘rnatish (Setup Installer)

Loyiha papkasida rasmiy **`CodePractice-Setup.exe`** o‘rnatish fayli mavjud:

```text
umitbekexe/
├── CodePractice-Setup.exe   <--- Dasturni o‘rnatish ustasi (Installer)
├── CodePractice.exe         <--- Asosiy desktop ilova (Portable launcher)
├── Uninstall.exe            <--- Dasturni to‘liq o‘chirish vositasi
├── assets/
│   ├── logo.png             <--- Rasmiy CodePractice logotipi
│   ├── icon.png             <--- Squircle dastur piktogrammasi
│   └── app.ico              <--- Windows piktogrammasi
└── build-windows-exe.bat    <--- Avtomatik qayta yig‘ish skripti
```

### O‘rnatish bosqichlari:
1. **`CodePractice-Setup.exe`** faylini ikki marta bosing.
2. O‘rnatish oynasida (Setup Wizard):
   - Rasmiy **CodePractice** logotipi va dastur ta’rifi chiqadi;
   - O‘rnatish papkasi tanlanadi (standart: `%LOCALAPPDATA%\Programs\CodePractice`);
   - Quyidagi qulayliklar avtomatik yoqilgan bo‘ladi:
     - [✓] Ishchi stolda (Desktop) **CodePractice** yorlig‘ini yaratish;
     - [✓] Bosh menyuda (Start Menu) dasturni ro‘yxatga olish;
     - [✓] O‘rnatish yakunlangach dasturni darhol ochish.
3. **«O‘rnatish (Install)»** tugmasini bosing.
4. O‘rnatish bir necha soniyada yakunlanadi va ishchi stolda yangi logotip bilan yorliq paydo bo‘ladi!

---

## 2. Bosh Ekran va Yangi Dizayn (Branding)

Desktop ilovaning bosh ekrani (Kirish) rasmiy **CodePractice (`CODE • BUILD • IMPROVE`)** logotipi va zamonaviy to‘q navy-gradient vizual uslubida qayta ishlandi:

- **Bosh ekran logotipi:** 682×389 yuqori tiniqlikdagi neon-ko‘k va binafsha gradientli `logo.png`;
- **Windows TitleBar va Header:** Squircle shaklidagi `icon.png` dastur piktogrammasi;
- **Tezkor test kirish:** `student1` / `Student123!` (1-bosishda avtomatik to‘ldirish tugmasi bilan);
- **Chiqish xavfsizligi:** O‘qituvchi maxsus PIN kodi (`4826`);
- **Mahalliy kompilyatsiya:** Python 3.11 va C++20 GCC, Windows Job Objects orqali xavfsiz chegaralangan (RAM: 128 MB, CPU: 2000 ms).

---

## 3. Dasturni Kompyuterdan O‘chirish (Uninstall)

- Bosh menyu (Start Menu) -> **CodePractice** -> **«CodePractice dasturini o‘chirish»** ni bosing;
- Yoki o‘rnatilgan papkadagi `Uninstall.exe` faylini ishga tushiring.
- Dastur ishchi stoldagi barcha yorliqlar, ro‘yxat yozuvlari va fayllarni toza o‘chiradi.

---

## 4. Tauri 2 orqali Standalone Setup Yig‘ish (Ishlab chiquvchilar uchun)

Agar to‘liq mustaqil Rust native installer (`.msi` / `.exe`) yaratmoqchi bo‘lsangiz:
```powershell
# 1. Rust o'rnatish
winget install Rustlang.Rustup

# 2. Installer yig'ish
npm run desktop:build-exe
```
Fayllar `apps/desktop/src-tauri/target/release/bundle/nsis/` papkasida shakllanadi.
