import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");

const PORT = 48921;

// 1. Start a simple static file server that redirects unknown routes to index.html (SPA Fallback)
const server = http.createServer((req, res) => {
  let urlPath = req.url.split("?")[0];
  let filePath = path.join(distDir, urlPath);

  // Serve folder index or fallback to root index.html for SPA router
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, "index.html");
  }

  const ext = path.extname(filePath);
  let contentType = "text/html";
  if (ext === ".js") contentType = "text/javascript";
  else if (ext === ".css") contentType = "text/css";
  else if (ext === ".json") contentType = "application/json";
  else if (ext === ".png") contentType = "image/png";
  else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
  else if (ext === ".webp") contentType = "image/webp";
  else if (ext === ".svg") contentType = "image/svg+xml";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end("Internal Server Error");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, async () => {
  console.log(`[prerender] Local server running on http://localhost:${PORT}`);

  const routes = [
    { path: "/", output: "index.html" },
    { path: "/qna", output: "qna/index.html" },
  ];

  let browser;
  try {
    console.log("[prerender] Launching Puppeteer...");
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    for (const route of routes) {
      console.log(`[prerender] Crawling route: ${route.path}...`);
      const page = await browser.newPage();
      
      // Set typical viewport
      await page.setViewport({ width: 1200, height: 800 });

      // Navigate to route
      await page.goto(`http://localhost:${PORT}${route.path}`, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      // Let the react page load fully and settle
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Retrieve the fully rendered HTML DOM
      const html = await page.content();

      // Output destination
      const outPath = path.join(distDir, route.output);
      const outDir = path.dirname(outPath);

      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }

      fs.writeFileSync(outPath, html, "utf8");
      console.log(`[prerender] Saved pre-rendered HTML to ${outPath}`);
      await page.close();
    }

    console.log("[prerender] Pre-rendering completed successfully!");
  } catch (error) {
    console.error("[prerender] Error during pre-rendering:", error);
  } finally {
    if (browser) {
      await browser.close();
    }
    server.close(() => {
      console.log("[prerender] Local server closed.");
      process.exit(0);
    });
  }
});
