@echo off
chcp 65001 >nul
echo ====================================================================
echo     CodePractice v2.4.0 — Windows 11 Desktop (.exe) & Installer
echo ====================================================================
echo.

echo [1/4] Desktop frontend (React + TypeScript + Monaco + Yangi Logo) yig'ilmoqda...
call npm --workspace=apps/desktop run build
if %errorlevel% neq 0 (
    echo [XATOLIK] Frontend yig'ishda xatolik yuz berdi!
    pause
    exit /b %errorlevel%
)

echo.
echo [2/4] Ilova piktogrammalari (app.ico, icon.png) yangilanmoqda...
C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe /nologo /out:scripts\crop-icon.exe /r:System.Drawing.dll scripts\crop-icon.cs
call scripts\crop-icon.exe

echo.
echo [3/4] Windows 11 dasturlari kompilyatsiya qilinmoqda...
C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe /target:winexe /nologo /win32icon:assets\app.ico /out:CodePractice.exe /r:System.Windows.Forms.dll scripts\launcher\Program.cs
C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe /target:winexe /nologo /win32icon:assets\app.ico /out:Uninstall.exe /r:System.Windows.Forms.dll scripts\installer\UninstallProgram.cs
C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe /target:winexe /nologo /win32icon:assets\app.ico /out:CodePractice-Setup.exe /r:System.Windows.Forms.dll /r:System.Drawing.dll scripts\installer\SetupWizard.cs

echo.
echo [MUVAFFAQIN] Quyidagi fayllar muvaffaqiyatli tayyorlandi:
echo   - CodePractice-Setup.exe  (O'rnatuvchi dastur - Installer)
echo   - CodePractice.exe        (Asosiy ishchi ilova)
echo   - Uninstall.exe           (O'chirish dasturi)

echo.
echo [4/4] Tauri 2 Rust Native .exe kompilyatsiyasi tekshirilmoqda...
where cargo >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [ESLATMA] Kompyuteringizda Rust (cargo) o'rnatilmagan.
    echo Yuqorida yaratilgan "CodePractice-Setup.exe" orqali ilovani to'liq o'rnatishingiz mumkin.
    echo Agar Tauri 2 orqali rasmiy standalone NSIS installer (.exe) yaratmoqchi bo'lsangiz:
    echo   1. Terminalda: winget install Rustlang.Rustup
    echo   2. Kompyuterni qayta yuklab: npm run desktop:build-exe
    echo.
) else (
    echo Rust aniqlandi! Tauri 2 orqali rasmiy .exe va o'rnatuvchi paket yaratilmoqda...
    call npm --workspace=apps/desktop run tauri build
    echo.
    echo [MUVAFFAQIN] Tauri release .exe va installer tayyor:
    echo   apps\desktop\src-tauri\target\release\
)

echo.
echo ====================================================================
echo   O'RNATISH UCHUN: Loyiha papkasidagi "CodePractice-Setup.exe"
echo   faylini ikki marta bosib ishga tushiring!
echo ====================================================================
pause
