import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer as httpServer } from "node:http";
import { fileURLToPath } from "node:url";
import { requestSession } from "./session.mjs";

const root = fileURLToPath(new URL("../public/", import.meta.url));
const assets = { "/": ["index.html", "text/html; charset=utf-8"], "/app.js": ["app.js", "text/javascript; charset=utf-8"], "/styles.css": ["styles.css", "text/css; charset=utf-8"] };

function loadEnv() {
  if (!existsSync(".env")) return;
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].trim();
  }
}

export function configFrom(env = process.env) {
  const config = { secretKey: env.XPAYR_SECRET_KEY || "", baseUrl: (env.XPAYR_BASE_URL || "https://xpayr.com/api/v1").replace(/\/+$/, ""), network: env.XPAYR_NETWORK || "bsc-testnet", currency: (env.XPAYR_CURRENCY || "USDC").toUpperCase(), amount: env.DEMO_AMOUNT || "9.99", port: Number(env.PORT || 3001) };
  if (!/^https:\/\//.test(config.baseUrl)) throw new Error("XPAYR_BASE_URL must use HTTPS");
  return config;
}

export function createServer(config, fetchImpl = globalThis.fetch) {
  return httpServer(async (request, response) => {
    response.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; frame-src https://xpayr.com; frame-ancestors 'none'; base-uri 'none'");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Referrer-Policy", "strict-origin");
    if (request.method === "GET" && assets[request.url]) {
      const [name, type] = assets[request.url];
      response.writeHead(200, { "Content-Type": type }).end(await readFile(root + name));
      return;
    }
    if (request.method === "POST" && request.url === "/api/session") {
      try {
        const session = await requestSession(config, `widget_${randomUUID()}`, fetchImpl);
        response.writeHead(201, { "Content-Type": "application/json", "Cache-Control": "no-store" }).end(JSON.stringify(session));
      } catch (error) {
        response.writeHead(502, { "Content-Type": "application/json", "Cache-Control": "no-store" }).end(JSON.stringify({ error: error.message }));
      }
      return;
    }
    response.writeHead(404).end("Not found");
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  loadEnv();
  const config = configFrom();
  createServer(config).listen(config.port, "127.0.0.1", () => console.log(`Widget example: http://127.0.0.1:${config.port}`));
}
