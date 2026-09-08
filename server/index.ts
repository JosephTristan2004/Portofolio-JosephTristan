import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { GET, POST } from "./community.ts";
import { closeDatabase } from "./db.ts";
const root = fileURLToPath(new URL("../", import.meta.url));
const publicDirectory = resolve(root, "dist");
const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || "127.0.0.1";
const mimeTypes: Record<string, string> = {
    ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif",
    ".ico": "image/x-icon", ".pdf": "application/pdf", ".woff2": "font/woff2",
};
function reply(response: ServerResponse, status: number, body: string, type = "application/json; charset=utf-8") {
    response.writeHead(status, { "Content-Type": type, "X-Content-Type-Options": "nosniff" });
    response.end(body);
}
async function handleApi(incoming: IncomingMessage, outgoing: ServerResponse, url: URL) {
    if (url.pathname !== "/api/community") {
        reply(outgoing, 404, JSON.stringify({ error: "Endpoint tidak ditemukan." }));
        return;
    }
    const method = incoming.method || "GET";
    if (method !== "GET" && method !== "POST") {
        outgoing.setHeader("Allow", "GET, POST");
        reply(outgoing, 405, JSON.stringify({ error: "Metode tidak didukung." }));
        return;
    }
    const headers = new Headers();
    for (const [name, value] of Object.entries(incoming.headers)) {
        if (Array.isArray(value))
            value.forEach(item => headers.append(name, item));
        else if (value !== undefined)
            headers.set(name, value);
    }
    let body: string | undefined;
    if (method === "POST") {
        const chunks: Buffer[] = [];
        let total = 0;
        for await (const chunk of incoming) {
            const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
            total += buffer.length;
            if (total > 8000) {
                reply(outgoing, 413, JSON.stringify({ error: "Pesan terlalu panjang." }));
                return;
            }
            chunks.push(buffer);
        }
        body = Buffer.concat(chunks).toString("utf8");
    }
    const request = new Request(url, { method, headers, body });
    const result = method === "GET" ? await GET(request) : await POST(request);
    result.headers.forEach((value, name) => outgoing.setHeader(name, value));
    outgoing.setHeader("X-Content-Type-Options", "nosniff");
    outgoing.statusCode = result.status;
    outgoing.end(Buffer.from(await result.arrayBuffer()));
}
const server = createServer(async (request, response) => {
    try {
        // PUBLIC_ORIGIN dipakai saat server ditempatkan di belakang proxy HTTPS.
        const origin = process.env.PUBLIC_ORIGIN || `http://${request.headers.host || `127.0.0.1:${port}`}`;
        const url = new URL(request.url || "/", origin);
        if (url.pathname.startsWith("/api/")) {
            await handleApi(request, response, url);
            return;
        }
        if (request.method !== "GET" && request.method !== "HEAD") {
            reply(response, 405, JSON.stringify({ error: "Metode tidak didukung." }));
            return;
        }
        let pathname: string;
        try {
            pathname = decodeURIComponent(url.pathname);
        }
        catch {
            reply(response, 400, JSON.stringify({ error: "URL tidak valid." }));
            return;
        }
        const filename = resolve(publicDirectory, `.${pathname}`);
        if (filename !== publicDirectory && !filename.startsWith(publicDirectory + sep)) {
            reply(response, 403, JSON.stringify({ error: "Akses tidak diizinkan." }));
            return;
        }
        let target = filename;
        try {
            if (!(await stat(target)).isFile())
                target = resolve(publicDirectory, "index.html");
        }
        catch {
            if (extname(pathname)) {
                reply(response, 404, JSON.stringify({ error: "Berkas tidak ditemukan." }));
                return;
            }
            target = resolve(publicDirectory, "index.html");
        }
        let bytes: Buffer;
        try {
            bytes = await readFile(target);
        }
        catch {
            reply(response, 503, "Jalankan npm run build terlebih dahulu, atau npm run dev untuk mengedit website.", "text/plain; charset=utf-8");
            return;
        }
        response.writeHead(200, {
            "Content-Type": mimeTypes[extname(target)] || "application/octet-stream",
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": target.includes(`${sep}assets${sep}`) ? "public, max-age=31536000, immutable" : "no-cache",
        });
        response.end(request.method === "HEAD" ? undefined : bytes);
    }
    catch (error) {
        console.error("Request failed:", error);
        if (!response.headersSent)
            reply(response, 500, JSON.stringify({ error: "Terjadi kesalahan pada server." }));
        else
            response.end();
    }
});
server.listen(port, host, () => {
    const address = server.address();
    const actualPort = address && typeof address !== "string" ? address.port : port;
    console.log(`Server portfolio: http://${host}:${actualPort}`);
});
server.on("error", (error) => { console.error(error.message); closeDatabase(); process.exitCode = 1; });
let closing = false;
function shutdown() {
    if (closing)
        return;
    closing = true;
    server.close(() => { closeDatabase(); process.exitCode = 0; });
    server.closeAllConnections();
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
