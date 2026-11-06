using System;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.Net.Sockets;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows.Forms;

[assembly: AssemblyTitle("Mintera LMS")]
[assembly: AssemblyDescription("Mintera — O‘quvchi Dasturlash Muhiti va O‘qituvchi Boshqaruv Tizimi")]
[assembly: AssemblyCompany("Mintera")]
[assembly: AssemblyProduct("Mintera LMS Enterprise")]
[assembly: AssemblyCopyright("© 2026 Mintera. Barcha huquqlar himoyalangan.")]
[assembly: AssemblyVersion("2.4.0.0")]
[assembly: AssemblyFileVersion("2.4.0.0")]

namespace Mintera
{
    static class Program
    {
        [DllImport("Gdi32.dll", EntryPoint = "CreateRoundRectRgn")]
        public static extern IntPtr CreateRoundRectRgn(
            int nLeftRect,
            int nTopRect,
            int nRightRect,
            int nBottomRect,
            int nWidthEllipse,
            int nHeightEllipse
        );

        [STAThread]
        static void Main(string[] args)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            try
            {
                string baseDir = AppDomain.CurrentDomain.BaseDirectory;

                // Agar argument orqali to'g'ridan-to'g'ri chaqirilgan bo'lsa
                bool isSilent = false;
                string directMode = null;
                bool isKiosk = false;

                foreach (var arg in args)
                {
                    string a = arg.ToLower();
                    if (a == "--student" || a == "-s") directMode = "student";
                    else if (a == "--teacher" || a == "-t") directMode = "teacher";
                    else if (a == "--both" || a == "-b") directMode = "both";
                    else if (a == "--kiosk" || a == "-k") isKiosk = true;
                    else if (a == "--silent") isSilent = true;
                }

                if (isSilent && directMode != null)
                {
                    // To'g'ridan-to'g'ri rejim (splash ko'rsatmasdan)
                    StartAllServicesSilent(baseDir);
                    LaunchMode(directMode, isKiosk);
                    return;
                }

                // Standart holat: Zamonaviy Splash Screen bilan ishga tushirish
                Application.Run(new SplashForm(baseDir, directMode, isKiosk));
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    "Mintera ilovasini ishga tushirishda kutilmagan xatolik:\n\n" + ex.Message,
                    "Mintera v2.4 — Xatolik",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error
                );
            }
        }

        public static void LaunchMode(string mode, bool isKiosk)
        {
            if (mode == "teacher")
            {
                LaunchBrowserApp("http://127.0.0.1:3000", false, "MinteraTeacherApp");
            }
            else if (mode == "both")
            {
                LaunchBrowserApp("http://127.0.0.1:1420", isKiosk, "MinteraStudentApp");
                Thread.Sleep(500);
                LaunchBrowserApp("http://127.0.0.1:3000", false, "MinteraTeacherApp");
            }
            else
            {
                // Standart: student
                LaunchBrowserApp("http://127.0.0.1:1420", isKiosk, "MinteraStudentApp");
            }
        }

        public static void StartAllServicesSilent(string baseDir)
        {
            if (!IsPortOpen("127.0.0.1", 1420)) StartService(baseDir, "scripts\\serve-desktop.js");
            if (!IsPortOpen("127.0.0.1", 3000)) StartService(baseDir, "scripts\\serve-web.js");
            if (!IsPortOpen("127.0.0.1", 4005)) StartService(baseDir, "scripts\\telegram-bot.js");
        }

        public static bool IsPortOpen(string host, int port)
        {
            try
            {
                using (var client = new TcpClient())
                {
                    var result = client.BeginConnect(host, port, null, null);
                    bool success = result.AsyncWaitHandle.WaitOne(450);
                    if (!success) return false;
                    client.EndConnect(result);
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        public static void WaitForPort(string host, int port, int maxSeconds)
        {
            for (int i = 0; i < maxSeconds * 4; i++)
            {
                if (IsPortOpen(host, port)) return;
                Thread.Sleep(250);
            }
        }

        public static string FindNodeExe()
        {
            string[] possiblePaths = new string[]
            {
                @"C:\Program Files\nodejs\node.exe",
                @"C:\Program Files (x86)\nodejs\node.exe",
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Programs\nodejs\node.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"nodejs\node.exe")
            };

            foreach (var p in possiblePaths)
            {
                if (File.Exists(p)) return p;
            }

            return "node";
        }

        public static void StartService(string baseDir, string relativeScriptPath)
        {
            string scriptPath = Path.Combine(baseDir, relativeScriptPath);
            if (!File.Exists(scriptPath)) return;

            string nodeExe = FindNodeExe();

            try
            {
                var psi = new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = "/c start /b \"\" \"" + nodeExe + "\" \"" + scriptPath + "\"",
                    WorkingDirectory = baseDir,
                    WindowStyle = ProcessWindowStyle.Hidden,
                    CreateNoWindow = true,
                    UseShellExecute = false
                };
                Process.Start(psi);
            }
            catch
            {
                try
                {
                    var fallbackPsi = new ProcessStartInfo
                    {
                        FileName = nodeExe,
                        Arguments = "\"" + scriptPath + "\"",
                        WorkingDirectory = baseDir,
                        WindowStyle = ProcessWindowStyle.Hidden,
                        CreateNoWindow = true,
                        UseShellExecute = false
                    };
                    Process.Start(fallbackPsi);
                }
                catch {}
            }
        }

        public static void LaunchBrowserApp(string appUrl, bool isKiosk, string profileName)
        {
            string[] possiblePaths = new string[]
            {
                @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
                @"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData) + @"\Microsoft\Edge\Application\msedge.exe"
            };

            string edgePath = null;
            foreach (var p in possiblePaths)
            {
                if (File.Exists(p))
                {
                    edgePath = p;
                    break;
                }
            }

            string userDataDir = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                profileName
            );

            if (edgePath != null)
            {
                string kioskFlag = isKiosk ? "--kiosk " : "";
                string args = string.Format(
                    "{0}--app={1} --window-size=1440,900 --user-data-dir=\"{2}\" --no-first-run --no-default-browser-check --disable-http-cache --disable-features=Translate,OptimizationHints",
                    kioskFlag,
                    appUrl,
                    userDataDir
                );

                var psi = new ProcessStartInfo
                {
                    FileName = edgePath,
                    Arguments = args,
                    UseShellExecute = true
                };

                Process.Start(psi);
            }
            else
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = appUrl,
                    UseShellExecute = true
                });
            }
        }
    }

    /// <summary>
    /// Zamonaviy Mintera Splash va Rejim tanlash oynasi
    /// </summary>
    public class SplashForm : Form
    {
        private string baseDir;
        private string forcedMode;
        private bool isKiosk;

        private Label lblTitle;
        private Label lblSubtitle;
        private Label lblStatus;
        private ProgressBar progressBar;
        private Button btnStudent;
        private Button btnTeacher;
        private Button btnBoth;
        private Label lblTimer;

        private System.Windows.Forms.Timer countdownTimer;
        private int secondsRemaining = 4;
        private bool userInteracted = false;

        public SplashForm(string baseDir, string forcedMode, bool isKiosk)
        {
            this.baseDir = baseDir;
            this.forcedMode = forcedMode;
            this.isKiosk = isKiosk;

            InitializeCustomUI();
        }

        private void InitializeCustomUI()
        {
            this.Text = "Mintera LMS — Ishga tushirilmoqda";
            this.Size = new Size(580, 380);
            this.FormBorderStyle = FormBorderStyle.None;
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.FromArgb(15, 23, 42); // Slate 900
            this.ShowInTaskbar = true;

            // Dumaloq burchaklar (Windows 11 uslubida)
            try
            {
                this.Region = Region.FromHrgn(Program.CreateRoundRectRgn(0, 0, this.Width, this.Height, 20, 20));
            }
            catch {}

            // Form cheti chizig'i (Paint hodisasi)
            this.Paint += (s, e) =>
            {
                using (Pen borderPen = new Pen(Color.FromArgb(59, 130, 246), 2)) // Royal Blue Border
                {
                    e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
                    e.Graphics.DrawRectangle(borderPen, 1, 1, this.Width - 2, this.Height - 2);
                }
            };

            // 1. Logo rasmi yoki ikonkasi
            PictureBox picLogo = new PictureBox();
            picLogo.Size = new Size(54, 54);
            picLogo.Location = new Point(36, 32);
            picLogo.SizeMode = PictureBoxSizeMode.Zoom;
            string iconPath = Path.Combine(baseDir, "assets", "logo.png");
            if (!File.Exists(iconPath)) iconPath = Path.Combine(baseDir, "assets", "icon.png");
            if (File.Exists(iconPath))
            {
                try { picLogo.Image = Image.FromFile(iconPath); } catch {}
            }
            this.Controls.Add(picLogo);

            // 2. Sarlavha
            lblTitle = new Label();
            lblTitle.Text = "MINTERA";
            lblTitle.Font = new Font("Segoe UI", 22, FontStyle.Bold);
            lblTitle.ForeColor = Color.White;
            lblTitle.Location = new Point(102, 28);
            lblTitle.AutoSize = true;
            this.Controls.Add(lblTitle);

            lblSubtitle = new Label();
            lblSubtitle.Text = "Dasturlash va Ta'lim Platformasi • v2.4 Enterprise";
            lblSubtitle.Font = new Font("Segoe UI", 9.5f, FontStyle.Regular);
            lblSubtitle.ForeColor = Color.FromArgb(148, 163, 184); // Slate 400
            lblSubtitle.Location = new Point(106, 68);
            lblSubtitle.AutoSize = true;
            this.Controls.Add(lblSubtitle);

            // 3. Status matni
            lblStatus = new Label();
            lblStatus.Text = "⚡ Tizim modullari va serverlar tekshirilmoqda...";
            lblStatus.Font = new Font("Segoe UI", 9.5f, FontStyle.Bold);
            lblStatus.ForeColor = Color.FromArgb(56, 189, 248); // Sky 400
            lblStatus.Location = new Point(36, 116);
            lblStatus.Size = new Size(508, 22);
            this.Controls.Add(lblStatus);

            // 4. Progress bar
            progressBar = new ProgressBar();
            progressBar.Location = new Point(36, 142);
            progressBar.Size = new Size(508, 8);
            progressBar.Minimum = 0;
            progressBar.Maximum = 100;
            progressBar.Value = 15;
            this.Controls.Add(progressBar);

            // 5. Rejim tanlash sarlavhasi
            Label lblChoose = new Label();
            lblChoose.Text = "Qaysi rejimda ochilsin?";
            lblChoose.Font = new Font("Segoe UI", 9, FontStyle.Bold);
            lblChoose.ForeColor = Color.FromArgb(203, 213, 225);
            lblChoose.Location = new Point(36, 172);
            lblChoose.AutoSize = true;
            this.Controls.Add(lblChoose);

            // 6. Tugma 1: O'quvchi Sandboxi
            btnStudent = new Button();
            btnStudent.Text = "👨‍🎓 O‘quvchi Muhiti\n(Student Sandbox 1420)";
            btnStudent.Font = new Font("Segoe UI", 9.5f, FontStyle.Bold);
            btnStudent.BackColor = Color.FromArgb(37, 99, 235); // Blue 600
            btnStudent.ForeColor = Color.White;
            btnStudent.FlatStyle = FlatStyle.Flat;
            btnStudent.FlatAppearance.BorderSize = 0;
            btnStudent.Location = new Point(36, 200);
            btnStudent.Size = new Size(160, 68);
            btnStudent.Cursor = Cursors.Hand;
            btnStudent.Click += (s, e) => SelectModeAndLaunch("student");
            this.Controls.Add(btnStudent);

            // 7. Tugma 2: O'qituvchi Web-Paneli
            btnTeacher = new Button();
            btnTeacher.Text = "👨‍🏫 O‘qituvchi Paneli\n(Web Panel 3000)";
            btnTeacher.Font = new Font("Segoe UI", 9.5f, FontStyle.Bold);
            btnTeacher.BackColor = Color.FromArgb(30, 41, 59); // Slate 800
            btnTeacher.ForeColor = Color.FromArgb(241, 245, 249);
            btnTeacher.FlatStyle = FlatStyle.Flat;
            btnTeacher.FlatAppearance.BorderColor = Color.FromArgb(71, 85, 105);
            btnTeacher.Location = new Point(210, 200);
            btnTeacher.Size = new Size(160, 68);
            btnTeacher.Cursor = Cursors.Hand;
            btnTeacher.Click += (s, e) => SelectModeAndLaunch("teacher");
            this.Controls.Add(btnTeacher);

            // 8. Tugma 3: Ikkalasini ochish
            btnBoth = new Button();
            btnBoth.Text = "🚀 Barchasini Ochish\n(Web + Desktop)";
            btnBoth.Font = new Font("Segoe UI", 9.5f, FontStyle.Bold);
            btnBoth.BackColor = Color.FromArgb(30, 41, 59);
            btnBoth.ForeColor = Color.FromArgb(241, 245, 249);
            btnBoth.FlatStyle = FlatStyle.Flat;
            btnBoth.FlatAppearance.BorderColor = Color.FromArgb(71, 85, 105);
            btnBoth.Location = new Point(384, 200);
            btnBoth.Size = new Size(160, 68);
            btnBoth.Cursor = Cursors.Hand;
            btnBoth.Click += (s, e) => SelectModeAndLaunch("both");
            this.Controls.Add(btnBoth);

            // 9. Pastki avtomatik taymer yozuvi
            lblTimer = new Label();
            lblTimer.Text = "⏱ Standart holatda O‘quvchi Muhiti " + secondsRemaining + " soniyada ochiladi...";
            lblTimer.Font = new Font("Segoe UI", 8.5f, FontStyle.Regular);
            lblTimer.ForeColor = Color.FromArgb(148, 163, 184);
            lblTimer.Location = new Point(36, 290);
            lblTimer.Size = new Size(508, 20);
            lblTimer.TextAlign = ContentAlignment.MiddleCenter;
            this.Controls.Add(lblTimer);

            // 10. Chiqish tugmasi (kichik X burchakda)
            Label lblClose = new Label();
            lblClose.Text = "✕";
            lblClose.Font = new Font("Segoe UI", 11, FontStyle.Bold);
            lblClose.ForeColor = Color.FromArgb(148, 163, 184);
            lblClose.Location = new Point(540, 10);
            lblClose.Size = new Size(30, 30);
            lblClose.Cursor = Cursors.Hand;
            lblClose.Click += (s, e) => Application.Exit();
            this.Controls.Add(lblClose);

            // Orqa fonda serverlarni tekshirish va ishga tushirish
            this.Shown += (s, e) => StartBackgroundServicesAsync();
        }

        private void StartBackgroundServicesAsync()
        {
            Thread worker = new Thread(() =>
            {
                UpdateProgress("🖥️ Desktop serveri (1420) tekshirilmoqda...", 25);
                if (!Program.IsPortOpen("127.0.0.1", 1420))
                {
                    Program.StartService(baseDir, "scripts\\serve-desktop.js");
                    Program.WaitForPort("127.0.0.1", 1420, 6);
                }

                UpdateProgress("🌐 Web-panel serveri (3000) tekshirilmoqda...", 55);
                if (!Program.IsPortOpen("127.0.0.1", 3000))
                {
                    Program.StartService(baseDir, "scripts\\serve-web.js");
                    Program.WaitForPort("127.0.0.1", 3000, 6);
                }

                UpdateProgress("✈️ Telegram Bot xizmati (4005) tekshirilmoqda...", 85);
                if (!Program.IsPortOpen("127.0.0.1", 4005))
                {
                    Program.StartService(baseDir, "scripts\\telegram-bot.js");
                    Program.WaitForPort("127.0.0.1", 4005, 3);
                }

                UpdateProgress("✅ Barcha xizmatlar tayyor!", 100);

                // Agar parametrda rejim oldindan belgilangan bo'lsa
                if (!string.IsNullOrEmpty(forcedMode))
                {
                    Thread.Sleep(400);
                    this.Invoke(new Action(() => SelectModeAndLaunch(forcedMode)));
                    return;
                }

                // Aks holda avtomatik taymerni ishga tushirish
                this.Invoke(new Action(StartCountdown));
            });

            worker.IsBackground = true;
            worker.Start();
        }

        private void UpdateProgress(string message, int value)
        {
            if (this.IsDisposed || !this.IsHandleCreated) return;
            this.Invoke(new Action(() =>
            {
                lblStatus.Text = message;
                progressBar.Value = Math.Min(100, Math.Max(0, value));
            }));
        }

        private void StartCountdown()
        {
            countdownTimer = new System.Windows.Forms.Timer();
            countdownTimer.Interval = 1000;
            countdownTimer.Tick += (s, e) =>
            {
                if (userInteracted)
                {
                    countdownTimer.Stop();
                    return;
                }

                secondsRemaining--;
                if (secondsRemaining > 0)
                {
                    lblTimer.Text = "⏱ Standart holatda O‘quvchi Muhiti " + secondsRemaining + " soniyada ochiladi...";
                }
                else
                {
                    countdownTimer.Stop();
                    SelectModeAndLaunch("student");
                }
            };
            countdownTimer.Start();
        }

        private void SelectModeAndLaunch(string mode)
        {
            userInteracted = true;
            if (countdownTimer != null) countdownTimer.Stop();

            lblStatus.Text = "🚀 Mintera ochilmoqda...";
            progressBar.Value = 100;
            this.Refresh();

            Thread.Sleep(300);
            Program.LaunchMode(mode, isKiosk);

            // Splash oynasini yopish
            this.Hide();
            Application.Exit();
        }
    }
}
