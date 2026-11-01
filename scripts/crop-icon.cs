using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

class IconCropper
{
    static void Main()
    {
        string currentDir = Directory.GetCurrentDirectory();
        string inputPath = Path.Combine(currentDir, "assets", "logo.png");
        string userUpload = @"C:\Users\legio\.gemini\antigravity\brain\5c5ce7c3-4da6-444c-9dc0-5ac6128a27c5\.user_uploaded\media_1793535389012_3e43a87b.jpg";
        if (File.Exists(userUpload))
        {
            inputPath = userUpload;
        }

        using (Bitmap src = new Bitmap(inputPath))
        {
            int w = src.Width;
            int h = src.Height;

            Bitmap transparentBmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);

            for (int y = 0; y < h; y++)
            {
                for (int x = 0; x < w; x++)
                {
                    Color c = src.GetPixel(x, y);
                    int r = c.R;
                    int g = c.G;
                    int b = c.B;

                    int minVal = Math.Min(r, Math.Min(g, b));
                    int maxVal = Math.Max(r, Math.Max(g, b));
                    int colorDiff = maxVal - minVal;

                    if (minVal >= 253 && colorDiff <= 2)
                    {
                        transparentBmp.SetPixel(x, y, Color.FromArgb(0, 0, 0, 0));
                    }
                    else if (colorDiff <= 12 && minVal > 220)
                    {
                        double t = (minVal - 220) / 33.0;
                        if (t > 1.0) t = 1.0;
                        if (t < 0.0) t = 0.0;
                        int alpha = (int)((1.0 - t) * 160);
                        if (alpha <= 5)
                            transparentBmp.SetPixel(x, y, Color.FromArgb(0, 0, 0, 0));
                        else
                            transparentBmp.SetPixel(x, y, Color.FromArgb(alpha, 15, 23, 42));
                    }
                    else if (colorDiff <= 25 && minVal > 200 && y > 820)
                    {
                        int shadowAlpha = Math.Min(180, (255 - minVal) * 2);
                        transparentBmp.SetPixel(x, y, Color.FromArgb(shadowAlpha, 15, 23, 42));
                    }
                    else
                    {
                        if (minVal > 220 && colorDiff > 12)
                        {
                            double alphaVal = Math.Min(1.0, (255.0 - minVal) / 30.0 + (colorDiff / 100.0));
                            if (alphaVal > 1.0) alphaVal = 1.0;
                            int finalA = (int)(alphaVal * 255);
                            transparentBmp.SetPixel(x, y, Color.FromArgb(finalA, r, g, b));
                        }
                        else
                        {
                            transparentBmp.SetPixel(x, y, Color.FromArgb(255, r, g, b));
                        }
                    }
                }
            }

            int cropMinX = 50;
            int cropMaxX = 974;
            int cropMinY = 10;
            int cropMaxY = 934;
            int cropW = cropMaxX - cropMinX;
            int cropH = cropMaxY - cropMinY;
            int squareSize = Math.Max(cropW, cropH);

            Bitmap squareEmblem = new Bitmap(squareSize, squareSize, PixelFormat.Format32bppArgb);
            using (Graphics g = Graphics.FromImage(squareEmblem))
            {
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.SmoothingMode = SmoothingMode.HighQuality;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                g.Clear(Color.Transparent);

                int offsetX = (squareSize - cropW) / 2;
                int offsetY = (squareSize - cropH) / 2;
                g.DrawImage(transparentBmp,
                    new Rectangle(offsetX, offsetY, cropW, cropH),
                    new Rectangle(cropMinX, cropMinY, cropW, cropH),
                    GraphicsUnit.Pixel);
            }

            Bitmap icon512 = ResizeBitmap(squareEmblem, 512, 512);

            string[] iconPngPaths = new string[]
            {
                Path.Combine(currentDir, "assets", "icon.png"),
                Path.Combine(currentDir, "assets", "logo.png"),
                Path.Combine(currentDir, "apps", "desktop", "public", "icon.png"),
                Path.Combine(currentDir, "apps", "desktop", "public", "logo.png"),
                Path.Combine(currentDir, "apps", "desktop", "src", "assets", "icon.png"),
                Path.Combine(currentDir, "apps", "desktop", "src", "assets", "logo.png"),
                Path.Combine(currentDir, "apps", "desktop", "src-tauri", "icons", "logo.png"),
                Path.Combine(currentDir, "apps", "web", "public", "icon.png"),
                Path.Combine(currentDir, "apps", "web", "public", "logo.png"),
                Path.Combine(currentDir, "apps", "web", "src", "assets", "logo.png")
            };

            foreach (var p in iconPngPaths)
            {
                string dir = Path.GetDirectoryName(p);
                if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
                icon512.Save(p, ImageFormat.Png);
            }

            string[] icoPaths = new string[]
            {
                Path.Combine(currentDir, "assets", "app.ico"),
                Path.Combine(currentDir, "apps", "desktop", "public", "app.ico")
            };

            using (Bitmap icoBmp = ResizeBitmap(squareEmblem, 256, 256))
            {
                IntPtr hIcon = icoBmp.GetHicon();
                using (Icon ico = Icon.FromHandle(hIcon))
                {
                    foreach (var ip in icoPaths)
                    {
                        using (FileStream fs = new FileStream(ip, FileMode.Create))
                        {
                            ico.Save(fs);
                        }
                    }
                }
            }

            Console.WriteLine("Mintera yangi logotipi barcha joylarga muvaffaqiyatli saqlandi!");
        }
    }

    static Bitmap ResizeBitmap(Bitmap src, int w, int h)
    {
        Bitmap res = new Bitmap(w, h, PixelFormat.Format32bppArgb);
        using (Graphics g = Graphics.FromImage(res))
        {
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.SmoothingMode = SmoothingMode.HighQuality;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.CompositingQuality = CompositingQuality.HighQuality;
            g.Clear(Color.Transparent);
            g.DrawImage(src, 0, 0, w, h);
        }
        return res;
    }
}
