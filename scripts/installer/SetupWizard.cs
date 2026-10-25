using System;
using System.ComponentModel;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Threading;
using System.Windows.Forms;
using Microsoft.Win32;

namespace CodePracticeInstaller
{
    public class SetupWizardForm : Form
    {
        private PictureBox picLogo;
        private Label lblTitle;
        private Label lblSubtitle;
        private Label lblInstallPathHeader;
        private TextBox txtInstallPath;
        private Button btnBrowse;
        private CheckBox chkDesktopShortcut;
        private CheckBox chkStartMenuShortcut;
        private CheckBox chkLaunchAfter;
        private ProgressBar progressBar;
        private Label lblStatus;
        private Button btnInstall;
        private Button btnCancel;
        private Panel panelHeader;
        private Panel panelFooter;

        private string defaultInstallDir;
        private bool isInstalled = false;

        public SetupWizardForm()
        {
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.Text = "CodePractice v2.4.0 — O‘rnatish ustasi (Setup)";
            this.Size = new Size(620, 500);
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = true;
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.FromArgb(248, 250, 252);
            this.Font = new Font("Segoe UI", 9F, FontStyle.Regular, GraphicsUnit.Point);

            defaultInstallDir = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Programs",
                "CodePractice"
            );

            // 1. Header Panel
            panelHeader = new Panel
            {
                Dock = DockStyle.Top,
                Height = 110,
                BackColor = Color.FromArgb(7, 11, 20),
                Padding = new Padding(20, 15, 20, 15)
            };

            picLogo = new PictureBox
            {
                Size = new Size(180, 80),
                Location = new Point(15, 15),
                SizeMode = PictureBoxSizeMode.Zoom,
                BackColor = Color.Transparent
            };

            string logoPath = FindAssetPath("logo.png");
            if (File.Exists(logoPath))
            {
                try { picLogo.Image = Image.FromFile(logoPath); } catch { }
            }

            lblTitle = new Label
            {
                Text = "CodePractice O‘quvchi Dasturi",
                Font = new Font("Segoe UI", 13F, FontStyle.Bold),
                ForeColor = Color.White,
                Location = new Point(205, 22),
                AutoSize = true
            };

            lblSubtitle = new Label
            {
                Text = "Windows 11 desktop dasturlash laboratoriyasi (v2.4.0)\nPython va C++ mashqlari uchun xavfsiz muhit",
                Font = new Font("Segoe UI", 8.5F, FontStyle.Regular),
                ForeColor = Color.FromArgb(148, 163, 184),
                Location = new Point(206, 52),
                Size = new Size(380, 40)
            };

            panelHeader.Controls.Add(picLogo);
            panelHeader.Controls.Add(lblTitle);
            panelHeader.Controls.Add(lblSubtitle);

            // 2. Body Area
            lblInstallPathHeader = new Label
            {
                Text = "O‘rnatish manzili (Target Folder):",
                Font = new Font("Segoe UI", 9F, FontStyle.Bold),
                ForeColor = Color.FromArgb(30, 41, 59),
                Location = new Point(25, 130),
                AutoSize = true
            };

            txtInstallPath = new TextBox
            {
                Text = defaultInstallDir,
                Location = new Point(25, 155),
                Size = new Size(450, 26),
                ReadOnly = false,
                BackColor = Color.White,
                BorderStyle = BorderStyle.FixedSingle
            };

            btnBrowse = new Button
            {
                Text = "Tanlash...",
                Location = new Point(485, 153),
                Size = new Size(95, 28),
                BackColor = Color.FromArgb(241, 245, 249),
                FlatStyle = FlatStyle.System
            };
            btnBrowse.Click += (s, e) =>
            {
                using (var fbd = new FolderBrowserDialog())
                {
                    fbd.SelectedPath = txtInstallPath.Text;
                    if (fbd.ShowDialog() == DialogResult.OK)
                    {
                        txtInstallPath.Text = Path.Combine(fbd.SelectedPath, "CodePractice");
                    }
                }
            };

            // Checkboxes
            chkDesktopShortcut = new CheckBox
            {
                Text = "Ishchi stolda (Desktop) CodePractice yorlig‘ini yaratish",
                Checked = true,
                Location = new Point(25, 200),
                AutoSize = true,
                ForeColor = Color.FromArgb(51, 65, 85)
            };

            chkStartMenuShortcut = new CheckBox
            {
                Text = "Bosh menyuda (Start Menu) dasturni ro‘yxatga olish",
                Checked = true,
                Location = new Point(25, 230),
                AutoSize = true,
                ForeColor = Color.FromArgb(51, 65, 85)
            };

            chkLaunchAfter = new CheckBox
            {
                Text = "O‘rnatish yakunlangach dasturni darhol ishga tushirish",
                Checked = true,
                Location = new Point(25, 260),
                AutoSize = true,
                ForeColor = Color.FromArgb(51, 65, 85)
            };

            // Progress Bar & Status
            progressBar = new ProgressBar
            {
                Location = new Point(25, 305),
                Size = new Size(555, 18),
                Visible = false,
                Style = ProgressBarStyle.Continuous
            };

            lblStatus = new Label
            {
                Text = "Dasturni kompyuteringizga o‘rnatish uchun «O‘rnatish» tugmasini bosing.",
                Location = new Point(25, 330),
                Size = new Size(555, 35),
                ForeColor = Color.FromArgb(100, 116, 139),
                Font = new Font("Segoe UI", 8.5F, FontStyle.Regular)
            };

            // 3. Footer Panel
            panelFooter = new Panel
            {
                Dock = DockStyle.Bottom,
                Height = 60,
                BackColor = Color.FromArgb(241, 245, 249),
                Padding = new Padding(20, 12, 20, 12)
            };

            btnCancel = new Button
            {
                Text = "Bekor qilish",
                Size = new Size(110, 34),
                Location = new Point(365, 13),
                BackColor = Color.White,
                FlatStyle = FlatStyle.System
            };
            btnCancel.Click += (s, e) => this.Close();

            btnInstall = new Button
            {
                Text = "O‘rnatish (Install)",
                Size = new Size(140, 34),
                Location = new Point(485, 13),
                BackColor = Color.FromArgb(37, 99, 235),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.System,
                Font = new Font("Segoe UI", 9F, FontStyle.Bold)
            };
            btnInstall.Click += BtnInstall_Click;

            panelFooter.Controls.Add(btnCancel);
            panelFooter.Controls.Add(btnInstall);

            // Add all controls to form
            this.Controls.Add(panelHeader);
            this.Controls.Add(lblInstallPathHeader);
            this.Controls.Add(txtInstallPath);
            this.Controls.Add(btnBrowse);
            this.Controls.Add(chkDesktopShortcut);
            this.Controls.Add(chkStartMenuShortcut);
            this.Controls.Add(chkLaunchAfter);
            this.Controls.Add(progressBar);
            this.Controls.Add(lblStatus);
            this.Controls.Add(panelFooter);

            // Load Window Icon
            string icoPath = FindAssetPath("app.ico");
            if (File.Exists(icoPath))
            {
                try { this.Icon = new Icon(icoPath); } catch { }
            }
        }

        private void BtnInstall_Click(object sender, EventArgs e)
        {
            if (isInstalled)
            {
                // Tugatish / Ishga tushirish bosqichi
                if (chkLaunchAfter.Checked)
                {
                    string targetExe = Path.Combine(txtInstallPath.Text, "CodePractice.exe");
                    if (File.Exists(targetExe))
                    {
                        Process.Start(new ProcessStartInfo
                        {
                            FileName = targetExe,
                            WorkingDirectory = txtInstallPath.Text,
                            UseShellExecute = true
                        });
                    }
                }
                this.Close();
                return;
            }

            // O'rnatish jarayonini boshlash
            btnInstall.Enabled = false;
            btnBrowse.Enabled = false;
            txtInstallPath.ReadOnly = true;
            chkDesktopShortcut.Enabled = false;
            chkStartMenuShortcut.Enabled = false;
            progressBar.Visible = true;
            progressBar.Value = 10;
            lblStatus.Text = "O‘rnatish tayyorlanmoqda...";

            var bw = new BackgroundWorker();
            bw.WorkerReportsProgress = true;
            bw.DoWork += (s, ev) => PerformInstallation(bw);
            bw.ProgressChanged += (s, ev) =>
            {
                progressBar.Value = Math.Min(100, ev.ProgressPercentage);
                if (ev.UserState != null)
                {
                    lblStatus.Text = ev.UserState.ToString();
                }
            };
            bw.RunWorkerCompleted += (s, ev) =>
            {
                if (ev.Error != null)
                {
                    lblStatus.Text = "Xatolik: " + ev.Error.Message;
                    lblStatus.ForeColor = Color.Red;
                    btnInstall.Enabled = true;
                    btnInstall.Text = "Qayta urinish";
                }
                else
                {
                    isInstalled = true;
                    progressBar.Value = 100;
                    lblStatus.Text = "Tabriklaymiz! CodePractice v2.4.0 muvaffaqiyatli o‘rnatildi.";
                    lblStatus.ForeColor = Color.FromArgb(16, 185, 129);
                    lblStatus.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
                    btnCancel.Visible = false;
                    btnInstall.Text = "Ishga tushirish";
                    btnInstall.Enabled = true;
                }
            };
            bw.RunWorkerAsync();
        }

        private void PerformInstallation(BackgroundWorker bw)
        {
            string targetDir = txtInstallPath.Text.Trim();
            if (!Directory.Exists(targetDir))
            {
                Directory.CreateDirectory(targetDir);
            }

            string sourceDir = AppDomain.CurrentDomain.BaseDirectory;

            // 1. Asosiy fayllarni nusxalash
            bw.ReportProgress(25, "Ilova fayllari va konfiguratsiyalar ko‘chirilmoqda...");
            CopyFileIfExists(Path.Combine(sourceDir, "CodePractice.exe"), Path.Combine(targetDir, "CodePractice.exe"));
            CopyFileIfExists(Path.Combine(sourceDir, "Uninstall.exe"), Path.Combine(targetDir, "Uninstall.exe"));

            // Assets
            string targetAssets = Path.Combine(targetDir, "assets");
            Directory.CreateDirectory(targetAssets);
            CopyFileIfExists(FindAssetPath("app.ico"), Path.Combine(targetAssets, "app.ico"));
            CopyFileIfExists(FindAssetPath("icon.png"), Path.Combine(targetAssets, "icon.png"));
            CopyFileIfExists(FindAssetPath("logo.png"), Path.Combine(targetAssets, "logo.png"));

            // Scripts
            string targetScripts = Path.Combine(targetDir, "scripts");
            Directory.CreateDirectory(targetScripts);
            CopyFileIfExists(Path.Combine(sourceDir, "scripts", "serve-desktop.js"), Path.Combine(targetScripts, "serve-desktop.js"));

            // Apps Desktop dist
            bw.ReportProgress(45, "Monaco Editor va Frontend komponentlari o‘rnatilmoqda...");
            string sourceDesktopDist = Path.Combine(sourceDir, "apps", "desktop", "dist");
            string targetDesktopDist = Path.Combine(targetDir, "apps", "desktop", "dist");
            if (Directory.Exists(sourceDesktopDist))
            {
                CopyDirectoryRecursive(sourceDesktopDist, targetDesktopDist);
            }

            // Apps Api dist
            bw.ReportProgress(65, "NestJS Backend xizmatlari o‘rnatilmoqda...");
            string sourceApiDist = Path.Combine(sourceDir, "apps", "api", "dist");
            string targetApiDist = Path.Combine(targetDir, "apps", "api", "dist");
            if (Directory.Exists(sourceApiDist))
            {
                CopyDirectoryRecursive(sourceApiDist, targetApiDist);
            }

            // Package json fayllari
            CopyFileIfExists(Path.Combine(sourceDir, "package.json"), Path.Combine(targetDir, "package.json"));
            string targetAppsApi = Path.Combine(targetDir, "apps", "api");
            Directory.CreateDirectory(targetAppsApi);
            CopyFileIfExists(Path.Combine(sourceDir, "apps", "api", "package.json"), Path.Combine(targetAppsApi, "package.json"));

            // 2. Shortcuts yaratish
            bw.ReportProgress(80, "Windows yorliqlari (Shortcuts) yaratilmoqda...");
            string targetExe = Path.Combine(targetDir, "CodePractice.exe");
            string iconFile = Path.Combine(targetAssets, "app.ico");

            if (chkDesktopShortcut.Checked)
            {
                string desktopDir = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                string shortcutPath = Path.Combine(desktopDir, "CodePractice.lnk");
                CreateWindowsShortcut(shortcutPath, targetExe, targetDir, iconFile, "CodePractice Desktop Ilovasi");
            }

            if (chkStartMenuShortcut.Checked)
            {
                string startMenuDir = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.StartMenu),
                    "Programs",
                    "CodePractice"
                );
                Directory.CreateDirectory(startMenuDir);
                string shortcutPath = Path.Combine(startMenuDir, "CodePractice.lnk");
                CreateWindowsShortcut(shortcutPath, targetExe, targetDir, iconFile, "CodePractice Desktop Ilovasi");

                // Uninstall yorlig'i
                string uninsShortcut = Path.Combine(startMenuDir, "CodePractice dasturini o‘chirish.lnk");
                CreateWindowsShortcut(uninsShortcut, Path.Combine(targetDir, "Uninstall.exe"), targetDir, iconFile, "CodePractice O‘chirish");
            }

            // 3. Windows Registry (Uninstall ma'lumotlari)
            bw.ReportProgress(90, "Windows boshqaruv paneliga ro‘yxatga olinmoqda...");
            try
            {
                RegisterInWindowsRegistry(targetDir);
            }
            catch {}

            Thread.Sleep(300);
            bw.ReportProgress(100, "O‘rnatish muvaffaqiyatli yakunlandi!");
        }

        private void RegisterInWindowsRegistry(string installDir)
        {
            string uninstallKey = @"Software\Microsoft\Windows\CurrentVersion\Uninstall\CodePractice";
            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(uninstallKey))
            {
                if (key != null)
                {
                    key.SetValue("DisplayName", "CodePractice (v2.4.0)");
                    key.SetValue("DisplayVersion", "2.4.0");
                    key.SetValue("Publisher", "CodePractice Team");
                    key.SetValue("DisplayIcon", Path.Combine(installDir, "assets", "app.ico"));
                    key.SetValue("InstallLocation", installDir);
                    key.SetValue("UninstallString", "\"" + Path.Combine(installDir, "Uninstall.exe") + "\"");
                    key.SetValue("NoModify", 1, RegistryValueKind.DWord);
                    key.SetValue("NoRepair", 1, RegistryValueKind.DWord);
                }
            }
        }

        private void CreateWindowsShortcut(string shortcutPath, string targetExe, string workDir, string iconPath, string desc)
        {
            try
            {
                Type shellType = Type.GetTypeFromProgID("WScript.Shell");
                if (shellType == null) return;
                dynamic shell = Activator.CreateInstance(shellType);
                dynamic shortcut = shell.CreateShortcut(shortcutPath);
                shortcut.TargetPath = targetExe;
                shortcut.WorkingDirectory = workDir;
                shortcut.Description = desc;
                if (File.Exists(iconPath))
                {
                    shortcut.IconLocation = iconPath + ",0";
                }
                shortcut.Save();
            }
            catch {}
        }

        private void CopyFileIfExists(string src, string dst)
        {
            if (File.Exists(src))
            {
                string dir = Path.GetDirectoryName(dst);
                if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
                File.Copy(src, dst, true);
            }
        }

        private void CopyDirectoryRecursive(string sourceDir, string targetDir)
        {
            Directory.CreateDirectory(targetDir);
            foreach (string file in Directory.GetFiles(sourceDir))
            {
                File.Copy(file, Path.Combine(targetDir, Path.GetFileName(file)), true);
            }
            foreach (string subDir in Directory.GetDirectories(sourceDir))
            {
                CopyDirectoryRecursive(subDir, Path.Combine(targetDir, Path.GetFileName(subDir)));
            }
        }

        private string FindAssetPath(string fileName)
        {
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            string[] candidates = new string[]
            {
                Path.Combine(baseDir, "assets", fileName),
                Path.Combine(baseDir, "..", "assets", fileName),
                Path.Combine(Directory.GetCurrentDirectory(), "assets", fileName),
                Path.Combine(Directory.GetCurrentDirectory(), "apps", "desktop", "public", fileName)
            };

            foreach (var c in candidates)
            {
                if (File.Exists(c)) return c;
            }
            return fileName;
        }

        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new SetupWizardForm());
        }
    }
}
