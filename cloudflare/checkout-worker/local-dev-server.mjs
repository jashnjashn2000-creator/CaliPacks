import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import worker from "./src/index.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const PORT = 8787;

function loadEnv() {
  const env = {};
  const file = path.join(root, ".dev.vars");
  if (!fs.existsSync(file)) return env;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnv();

const server = http.createServer(async (req, res) => {
  try {
    const url = `http://127.0.0.1:${PORT}${req.url || "/"}`;
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value == null) continue;
      headers.set(key, Array.isArray(value) ? value.join(", ") : String(value));
    }
    const method = req.method || "GET";
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks);
    const init = { method, headers };
    if (raw.length && method !== "GET" && method !== "HEAD") {
      init.body = raw;
    }
    const response = await worker.fetch(new Request(url, init), env);
    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        status: "error",
        message: String(err && err.message ? err.message : err),
      })
    );
  }
});

server.listen(PORT, "127.0.0.1", () => {
  const configured = Boolean(env.VIVA_CLIENT_ID && env.VIVA_CLIENT_SECRET && env.VIVA_SOURCE_CODE);
  console.log(`Smoke Cali checkout on http://127.0.0.1:${PORT}`);
  console.log(
    configured
      ? `Viva credentials loaded from .dev.vars (mode: ${env.VIVA_ENV || "demo"})`
      : "Add VIVA_CLIENT_ID, VIVA_CLIENT_SECRET and VIVA_SOURCE_CODE (demo) to .dev.vars — see VIVA-SETUP.md"
  );
});
