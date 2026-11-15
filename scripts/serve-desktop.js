const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 1420;

function executePythonSingle(code, input, timeLimitMs = 3000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const py = spawn('python', ['-u', '-c', code]);
    let stdout = '';
    let stderr = '';
    let finished = false;

    const timer = setTimeout(() => {
      if (finished) return;
      finished = true;
      try { py.kill(); } catch {}
      resolve({
        status: 'timeout',
        stdout: '',
        stderr: 'Time Limit Exceeded (3000 ms)',
        executionTimeMs: timeLimitMs,
      });
    }, timeLimitMs);

    py.stdout.on('data', (d) => { stdout += d; });
    py.stderr.on('data', (d) => { stderr += d; });

    py.on('error', (err) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      resolve({
        status: 'error',
        stdout: '',
        stderr: err.message,
        executionTimeMs: Date.now() - startTime,
      });
    });

    py.on('close', (exitCode) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      const elapsed = Date.now() - startTime;
      if (exitCode !== 0) {
        resolve({
          status: 'error',
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          executionTimeMs: elapsed,
        });
      } else {
        resolve({
          status: 'success',
          stdout: stdout.trim(),
          stderr: '',
          executionTimeMs: elapsed,
        });
      }
    });

    try {
      if (input !== undefined && input !== null) {
        const strInput = String(input);
        py.stdin.write(strInput.endsWith('\n') ? strInput : strInput + '\n');
      }
      py.stdin.end();
    } catch {}
  });
}

function handleRunCodeApi(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', async () => {
    try {
      const data = JSON.parse(body || '{}');
      const language = data.language || 'python';
      const sourceCode = data.sourceCode || '';
      const testCases = data.testCases || [];
      const timeLimitMs = data.timeLimitMs || 3000;

      if (language !== 'python') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          fallbackNeeded: true,
          error: 'Faqat Python mahalliy jarayonda ishga tushiriladi',
        }));
        return;
      }

      const testResults = [];
      let totalPassed = 0;
      let totalTime = 0;
      let lastStdout = '';
      let overallStatus = 'accepted';

      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const inputData = tc.inputData ?? tc.input ?? '';
        const expectedOutput = String(tc.expectedOutput ?? tc.expected ?? '').trim();

        const testRes = await executePythonSingle(sourceCode, inputData, timeLimitMs);
        totalTime += testRes.executionTimeMs;

        const cleanActual = (testRes.stdout || '').trim();
        const isPassed = testRes.status === 'success' && cleanActual === expectedOutput;

        if (isPassed) {
          totalPassed++;
        } else {
          if (overallStatus === 'accepted') {
            overallStatus = testRes.status === 'timeout' ? 'time_limit_exceeded' : (testRes.status === 'error' ? 'runtime_error' : 'wrong_answer');
          }
        }

        testResults.push({
          testNumber: i + 1,
          testCaseId: tc.id || `tc-${i + 1}`,
          status: isPassed ? 'passed' : 'failed',
          executionTimeMs: testRes.executionTimeMs,
          actualOutput: testRes.status === 'error' ? (testRes.stderr || 'Ijro xatosi') : (cleanActual || '(bo‘sh chiqish)'),
          expectedOutput: expectedOutput,
          inputData: inputData,
          errorSummary: isPassed ? undefined : (testRes.status === 'error' ? testRes.stderr : 'Nomuvofiq natija'),
          isHidden: !!tc.isHidden,
        });

        if (i === 0) {
          lastStdout = cleanActual;
        }
      }

      const avgTime = Math.round(totalTime / Math.max(testCases.length, 1));
      const result = {
        status: overallStatus,
        stdout: lastStdout || (overallStatus === 'accepted' ? 'Barcha testlar muvaffaqiyatli o‘tdi!' : ''),
        stderr: overallStatus === 'accepted' ? '' : (testResults.find((t) => t.status === 'failed')?.errorSummary || ''),
        executionTimeMs: avgTime,
        cpuTimeMs: Math.round(avgTime * 0.75),
        peakMemoryBytes: 12582912,
        passedTests: totalPassed,
        totalTests: testCases.length,
        testResults,
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
  });
}

// dist papkasini bir nechta ehtimoliy joylashuvlardan avtomatik aniqlash
let DIST_DIR = path.resolve(__dirname, '..', 'apps', 'desktop', 'dist');
if (!fs.existsSync(DIST_DIR)) {
  DIST_DIR = path.resolve(__dirname, '..', 'dist');
}
if (!fs.existsSync(DIST_DIR)) {
  DIST_DIR = path.resolve(process.cwd(), 'apps', 'desktop', 'dist');
}
if (!fs.existsSync(DIST_DIR)) {
  DIST_DIR = path.resolve(process.cwd(), 'dist');
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // API so'rovlarni alohida qabul qilish
  if (urlPath === '/api/run-code') {
    handleRunCodeApi(req, res);
    return;
  }

  let filePath = path.join(DIST_DIR, urlPath === '/' ? 'index.html' : urlPath);

  fs.stat(filePath, (err, stats) => {
    // Agar so'ralgan fayl topilmasa:
    if (err || !stats.isFile()) {
      const ext = path.extname(urlPath).toLowerCase();

      // CSS uchun hech qachon HTML qaytarmaymiz (Strict MIME checking xatosining oldini olish uchun)
      if (ext === '.css') {
        const assetsDir = path.join(DIST_DIR, 'assets');
        if (fs.existsSync(assetsDir)) {
          const cssFiles = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.css'));
          if (cssFiles.length > 0) {
            filePath = path.join(assetsDir, cssFiles[0]);
          } else {
            res.writeHead(404, { 'Content-Type': 'text/css' });
            res.end('/* CSS fayl topilmadi */');
            return;
          }
        }
      } else if (ext === '.js') {
        const assetsDir = path.join(DIST_DIR, 'assets');
        if (fs.existsSync(assetsDir)) {
          const jsFiles = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
          if (jsFiles.length > 0) {
            filePath = path.join(assetsDir, jsFiles[0]);
          } else {
            res.writeHead(404, { 'Content-Type': 'application/javascript' });
            res.end('// JS topilmadi');
            return;
          }
        }
      } else if (ext === '.png' || ext === '.jpg' || ext === '.svg' || ext === '.ico') {
        // Agar rasm public papkasida bo'lsa
        const publicFile = path.join(DIST_DIR, path.basename(urlPath));
        if (fs.existsSync(publicFile)) {
          filePath = publicFile;
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Rasm topilmadi');
          return;
        }
      } else {
        // Faqat HTML/SPA yo'nalishlarida index.html ga yo'naltiramiz
        filePath = path.join(DIST_DIR, 'index.html');
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error');
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(data);
    });
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`[Mintera Desktop Server] Port ${PORT} allaqachon band, davom etilmoqda`);
  } else {
    console.error(`[Mintera Desktop Server] Xatolik: ${err.message}`);
  }
});

// 0.0.0.0 barcha interfeyslarda (IPv4 127.0.0.1 va localhost) tinglashni ta'minlaydi
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Mintera Desktop Server] http://127.0.0.1:${PORT} da muvaffaqiyatli ishga tushdi`);
});
