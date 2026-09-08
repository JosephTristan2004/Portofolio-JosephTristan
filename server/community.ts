import { getRawDb } from "./db.ts";
import { messageSchema, rooms } from "../src/lib/community.ts";
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function session(request: Request) { const found = request.headers.get("cookie")?.split(";").map(c => c.trim()).find(c => c.startsWith("jt_guest="))?.slice(9); return found && uuidPattern.test(found) ? found : crypto.randomUUID(); }
function headers(sid: string, request: Request) { return { "Cache-Control": "no-store", "Set-Cookie": `jt_guest=${sid}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${new URL(request.url).protocol === "https:" ? "; Secure" : ""}` }; }
export async function GET(request: Request) {
    const sid = session(request);
    const room = new URL(request.url).searchParams.get("room") ?? "lobby";
    if (!rooms.includes(room as typeof rooms[number]))
        return Response.json({ error: "Ruang tidak ditemukan." }, { status: 400 });
    try {
        const result = await getRawDb().prepare("SELECT id, room, name, body, link, created_at FROM community_messages WHERE room = ? ORDER BY created_at DESC, id DESC LIMIT 60").bind(room).all();
        return Response.json({ messages: result.results.reverse() }, { headers: headers(sid, request) });
    }
    catch (error) {
        console.error("Community read failed", error);
        return Response.json({ error: "Komunitas belum dapat dimuat. Coba lagi sebentar." }, { status: 503, headers: headers(sid, request) });
    }
}
export async function POST(request: Request) {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin)
        return Response.json({ error: "Permintaan tidak diizinkan." }, { status: 403 });
    if (!request.headers.get("content-type")?.includes("application/json"))
        return Response.json({ error: "Format pesan tidak didukung." }, { status: 415 });
    if (Number(request.headers.get("content-length") ?? 0) > 8000)
        return Response.json({ error: "Pesan terlalu panjang." }, { status: 413 });
    const sid = session(request);
    let raw: unknown;
    try {
        const text = await request.text();
        if (text.length > 8000)
            return Response.json({ error: "Pesan terlalu panjang." }, { status: 413 });
        raw = JSON.parse(text);
    }
    catch {
        return Response.json({ error: "Pesan tidak valid." }, { status: 400 });
    }
    const parsed = messageSchema.safeParse(raw);
    if (!parsed.success)
        return Response.json({ error: parsed.error.issues[0]?.message ?? "Periksa pesan kamu." }, { status: 400 });
    const { id, room, name, body, link } = parsed.data;
    const now = Date.now();
    try {
        const db = getRawDb();
        const existing = await db.prepare("SELECT id, session_id FROM community_messages WHERE id = ?").bind(id).first<{
            id: string;
            session_id: string;
        }>();
        if (existing) {
            if (existing.session_id === sid)
                return Response.json({ ok: true, id }, { headers: headers(sid, request) });
            return Response.json({ error: "Pesan tidak dapat dikirim. Muat ulang dan coba lagi." }, { status: 409 });
        }
        const result = await db.prepare(`INSERT INTO community_messages (id, room, name, body, link, session_id, created_at)
      SELECT ?, ?, ?, ?, ?, ?, ?
      WHERE NOT EXISTS (SELECT 1 FROM community_messages WHERE session_id = ? AND created_at > ?)
      AND (SELECT COUNT(*) FROM community_messages WHERE session_id = ? AND created_at > ?) < 100`).bind(id, room, name, body, link, sid, now, sid, now - 3000, sid, now - 86400000).run();
        if (result.meta.changes === 0)
            return Response.json({ error: "Beri jeda beberapa detik sebelum mengirim lagi. Batasnya 100 pesan per hari." }, { status: 429, headers: { ...headers(sid, request), "Retry-After": "3" } });
        return Response.json({ ok: true, message: { id, room, name, body, link, created_at: now } }, { status: 201, headers: headers(sid, request) });
    }
    catch (error) {
        console.error("Community write failed", error);
        return Response.json({ error: "Pesan belum terkirim. Tulisan kamu tetap tersimpan di kolom pesan; silakan coba lagi." }, { status: 503, headers: headers(sid, request) });
    }
}
