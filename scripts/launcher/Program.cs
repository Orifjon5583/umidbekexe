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

                // 1. Backend API (port 4000) ishlayotganligini tekshirish
                if (!IsPortOpen("127.0.0.1", 4000))
                {
                    StartBackendServer(baseDir);
                    WaitForPort("127.0.0.1", 4000, 10);
                }

                // 2. Desktop Web (port 1420) ishlayotganligini tekshirish
                if (!IsPortOpen("127.0.0.1", 1420))
                {
                    StartDesktopServer(baseDir);
                    WaitForPort("127.0.0.1", 1420, 10);
                }

                // 3. Microsoft Edge ilova rejimida ishga tushirish (Windows 11 nativ desktop oynasi)
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
                    bool success = result.AsyncWaitHandle.WaitOne(1000);
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

            Process.Start(psi);
        }

        static void StartDesktopServer(string baseDir)
        {
            string scriptPath = Path.Combine(baseDir, "scripts", "serve-desktop.js");
            if (!File.Exists(scriptPath)) return;

            var psi = new ProcessStartInfo
            {
                FileName = "node.exe",
                Arguments = "\"" + scriptPath + "\"",
                WorkingDirectory = baseDir,
                WindowStyle = ProcessWindowStyle.Hidden,
                CreateNoWindow = true,
                UseShellExecute = false
            };

            Process.Start(psi);
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

            if (edgePath != null)
            {
                // App rejimi: sarlavha paneli, manzillar satrisiz, 1440x900 o'lchamda toza desktop oyna
                string args = string.Format(
                    "--app=http://localhost:1420 --window-size=1440,900 --user-data-dir=\"{0}\" --no-first-run --no-default-browser-check --disable-features=Translate,OptimizationHints",
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
                    FileName = "http://localhost:1420",
                    UseShellExecute = true
                });
            }
        }
    }
}
