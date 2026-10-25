using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

class IconCropper
{
    static void Main()
    {
        string currentDir = Directory.GetCurrentDirectory();
        string logoPath = Path.Combine(currentDir, "assets", "logo.png");
        if (!File.Exists(logoPath))
        {
            logoPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "assets", "logo.png");
        }
        string baseDir = currentDir;

        using (Image src = Image.FromFile(logoPath))
        {
            // The squircle icon is in the left 330px
            int cropW = 330;
            int cropH = src.Height;

            using (Bitmap bmp = new Bitmap(cropW, cropH))
            {
                using (Graphics g = Graphics.FromImage(bmp))
                {
                    g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                    g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                    g.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
                    g.DrawImage(src, 0, 0, new Rectangle(0, 0, cropW, cropH), GraphicsUnit.Pixel);
                }

                string iconPng = Path.Combine(baseDir, "assets", "icon.png");
                string desktopPublicIcon = Path.Combine(baseDir, "apps", "desktop", "public", "icon.png");
                string desktopSrcIcon = Path.Combine(baseDir, "apps", "desktop", "src", "assets", "icon.png");

                bmp.Save(iconPng, ImageFormat.Png);
                bmp.Save(desktopPublicIcon, ImageFormat.Png);
                bmp.Save(desktopSrcIcon, ImageFormat.Png);

                // Create .ico file as well
                using (Bitmap iconBmp = new Bitmap(bmp, 256, 256))
                {
                    IntPtr hIcon = iconBmp.GetHicon();
                    using (Icon ico = Icon.FromHandle(hIcon))
                    {
                        using (FileStream fs = new FileStream(Path.Combine(baseDir, "assets", "app.ico"), FileMode.Create))
                        {
                            ico.Save(fs);
                        }
                        using (FileStream fs = new FileStream(Path.Combine(baseDir, "apps", "desktop", "public", "app.ico"), FileMode.Create))
                        {
                            ico.Save(fs);
                        }
                    }
                }

                Console.WriteLine("Iconlar muvaffaqiyatli yaratildi!");
            }
        }
    }
}
