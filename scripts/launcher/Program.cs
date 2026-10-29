using System;
using System.Diagnostics;
using System.IO;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Windows.Forms;

namespace CodePractice
{
    class Program
    {
        [STAThread]
        static void Main(string[] args)
        {
            try
            {
                string baseDir = AppDomain.CurrentDomain.BaseDirectory;

                // 1. Desktop UI Server (port 1420) ni birinchi navbatda ishga tushirish
                if (!IsPortOpen("127.0.0.1", 1420))
                {
                    StartDesktopServer(baseDir);
                    WaitForPort("127.0.0.1", 1420, 10);
                }

                // 2. Backend API (port 4000) ni fonda ishga tushirish (asosiy oynani kutdirmasdan)
                ThreadPool.QueueUserWorkItem((state) =>
                {
                    try
                    {
                        if (!IsPortOpen("127.0.0.1", 4000))
                        {
                            StartBackendServer(baseDir);
                        }
                    }
                    catch {}
                });

                // 3. Microsoft Edge ilova rejimida ochish (127.0.0.1 orqali to'g'ridan-to'g'ri bog'lanish)
                LaunchAppWindow();
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    "CodePractice ilovasini ishga tushirishda xatolik yuz berdi:\n\n" + ex.Message,
                    "CodePractice v2.4 — Xatolik",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error
                );
            }
        }

        static bool IsPortOpen(string host, int port)
        {
            try
            {
                using (var client = new TcpClient())
                {
                    var result = client.BeginConnect(host, port, null, null);
                    bool success = result.AsyncWaitHandle.WaitOne(800);
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

        static void WaitForPort(string host, int port, int maxSeconds)
        {
            for (int i = 0; i < maxSeconds * 4; i++)
            {
                if (IsPortOpen(host, port)) return;
                Thread.Sleep(250);
            }
        }

        static string FindNodeExe()
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

        static void StartDesktopServer(string baseDir)
        {
            string scriptPath = Path.Combine(baseDir, "scripts", "serve-desktop.js");
            if (!File.Exists(scriptPath))
            {
                // Agar o'rnatilgan papkada bo'lmasa, ishchi stol/loyiha papkasidan qidiramiz
                scriptPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "scripts", "serve-desktop.js");
            }

            if (!File.Exists(scriptPath)) return;

            string nodeExe = FindNodeExe();

            var psi = new ProcessStartInfo
            {
                FileName = nodeExe,
                Arguments = "\"" + scriptPath + "\"",
                WorkingDirectory = baseDir,
                WindowStyle = ProcessWindowStyle.Hidden,
                CreateNoWindow = true,
                UseShellExecute = false
            };

            try
            {
                Process.Start(psi);
            }
            catch
            {
                // Zaxira: cmd.exe orqali chaqirish
                try
                {
                    var cmdPsi = new ProcessStartInfo
                    {
                        FileName = "cmd.exe",
                        Arguments = "/c node \"" + scriptPath + "\"",
                        WorkingDirectory = baseDir,
                        WindowStyle = ProcessWindowStyle.Hidden,
                        CreateNoWindow = true,
                        UseShellExecute = false
                    };
                    Process.Start(cmdPsi);
                }
                catch {}
            }
        }

        static void StartBackendServer(string baseDir)
        {
            string apiDir = Path.Combine(baseDir, "apps", "api");
            if (!Directory.Exists(apiDir)) return;

            var psi = new ProcessStartInfo
            {
                FileName = "cmd.exe",
                Arguments = "/c npm --workspace=apps/api run start",
                WorkingDirectory = baseDir,
                WindowStyle = ProcessWindowStyle.Hidden,
                CreateNoWindow = true,
                UseShellExecute = false
            };

            try
            {
                Process.Start(psi);
            }
            catch {}
        }

        static void LaunchAppWindow()
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
                "CodePracticeStudentApp"
            );

            // DIQQAT: localhost o'rniga 127.0.0.1 ishlatiladi (Windows 11 IPv6 timeout xatosini oldini olish uchun)
            string appUrl = "http://127.0.0.1:1420";

            if (edgePath != null)
            {
                string args = string.Format(
                    "--app={0} --window-size=1440,900 --user-data-dir=\"{1}\" --no-first-run --no-default-browser-check --disable-http-cache --disable-features=Translate,OptimizationHints",
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
                // Edge topilmasa standart brauzerda ochish
                Process.Start(new ProcessStartInfo
                {
                    FileName = appUrl,
                    UseShellExecute = true
                });
            }
        }
    }
}
