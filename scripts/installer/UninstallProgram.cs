using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;
using Microsoft.Win32;

namespace CodePracticeInstaller
{
    class UninstallProgram
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            var dialog = MessageBox.Show(
                "Mintera v2.4.0 dasturini kompyuteringizdan butunlay o‘chirib tashlamoqchimisiz?",
                "Mintera — O‘chirish (Uninstall)",
                MessageBoxButtons.YesNo,
                MessageBoxIcon.Question
            );

            if (dialog != DialogResult.Yes) return;

            try
            {
                // 1. Ishchi stoldagi yorliqni o'chirish
                string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                string desktopShortcut = Path.Combine(desktopPath, "Mintera.lnk");
                if (File.Exists(desktopShortcut)) File.Delete(desktopShortcut);

                // 2. Bosh menyudagi yorliqni o'chirish
                string startMenuPath = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.StartMenu),
                    "Programs",
                    "Mintera"
                );
                if (Directory.Exists(startMenuPath)) Directory.Delete(startMenuPath, true);

                // 3. Reestrdan o'chirish
                try
                {
                    using (RegistryKey key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Uninstall", true))
                    {
                        if (key != null) key.DeleteSubKeyTree("Mintera", false);
                    }
                }
                catch {}

                // 4. Standart o'rnatilgan ilova papkasini tozalash (AppData/Local/Programs/Mintera)
                string installedDir = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                    "Programs",
                    "Mintera"
                );

                string appDir = AppDomain.CurrentDomain.BaseDirectory.TrimEnd('\\');

                // Qat'iy xavfsizlik himoyasi:
                // Faqat o'rnatilgan "Programs\Mintera" papkasini o'chirish!
                // Loyiha / manba kodlari joylashgan papkani HECH QACHON o'chirmaslik!
                if (Directory.Exists(installedDir))
                {
                    string batchPath = Path.Combine(Path.GetTempPath(), "cp_cleanup.bat");
                    File.WriteAllText(batchPath, string.Format(
                        "@echo off\r\nping 127.0.0.1 -n 2 > nul\r\nrmdir /s /q \"{0}\"\r\ndel \"%~f0\"",
                        installedDir
                    ));

                    Process.Start(new ProcessStartInfo
                    {
                        FileName = batchPath,
                        CreateNoWindow = true,
                        WindowStyle = ProcessWindowStyle.Hidden,
                        UseShellExecute = true
                    });
                }

                MessageBox.Show(
                    "Mintera dasturi kompyuteringizdan muvaffaqiyatli o‘chirildi.",
                    "Mintera — O‘chirildi",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Information
                );
            }
            catch (Exception ex)
            {
                MessageBox.Show("O‘chirishda xatolik yuz berdi: " + ex.Message, "Xatolik", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
