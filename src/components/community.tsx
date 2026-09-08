"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Hash, Link2, LoaderCircle, MessageSquare, RefreshCw, Send, Users } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type CommunityMessage, rooms } from "@/lib/community";
const roomInfo = { lobby: { label: "lobby", description: "Kenalan, ngobrol, dan bertukar ide." }, "data-code": { label: "data-and-code", description: "Diskusi seputar data, coding, dan quality assurance." }, showcase: { label: "showcase", description: "Bagikan karya, artikel, atau sesuatu yang sedang kamu bangun." } };
export default function Community() {
    const [room, setRoom] = useState<typeof rooms[number]>("lobby");
    const [messages, setMessages] = useState<CommunityMessage[]>([]);
    const [name, setName] = useState("");
    const [body, setBody] = useState("");
    const [link, setLink] = useState("");
    const [linkOpen, setLinkOpen] = useState(false);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [error, setError] = useState("");
    const [sending, setSending] = useState(false);
    const [sendError, setSendError] = useState("");
    const [sent, setSent] = useState(false);
    const [active, setActive] = useState(false);
    const [retry, setRetry] = useState(0);
    const root = useRef<HTMLDivElement>(null), scroll = useRef<HTMLDivElement>(null), bottom = useRef(true);
    const posting = useRef(false);
    const pending = useRef<{
        id: string;
        key: string;
    } | null>(null);
    useEffect(() => { const draft = localStorage.getItem("jt-guest-name"); if (draft)
        setName(draft); const observer = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "200px" }); if (root.current)
        observer.observe(root.current); return () => observer.disconnect(); }, []);
    useEffect(() => { localStorage.setItem("jt-guest-name", name); }, [name]);
    useEffect(() => {
        if (!active)
            return;
        const controller = new AbortController();
        let busy = false;
        const fetchMessages = async () => { if (document.hidden || busy)
            return; busy = true; try {
            const res = await fetch(`/api/community?room=${room}`, { signal: controller.signal, cache: "no-store" });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error || "Pesan tidak dapat dimuat.");
            setMessages(data.messages);
            setStatus("ready");
            setError("");
        }
        catch (e) {
            if (!controller.signal.aborted) {
                setStatus("error");
                setError(e instanceof Error ? e.message : "Koneksi terputus. Coba lagi.");
            }
        }
        finally {
            busy = false;
        } };
        void fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => { controller.abort(); clearInterval(interval); };
    }, [room, active, retry]);
    useEffect(() => { if (bottom.current && scroll.current)
        scroll.current.scrollTop = scroll.current.scrollHeight; }, [messages]);
    const changeRoom = (value: string) => { setRoom(value as typeof rooms[number]); setMessages([]); setStatus("loading"); setError(""); setSendError(""); bottom.current = true; };
    const submit = async (e: FormEvent) => {
        e.preventDefault();
        if (posting.current)
            return;
        posting.current = true;
        setSending(true);
        setSendError("");
        setSent(false);
        const payload = { room, name: name.trim(), body: body.trim(), link: link.trim() };
        const key = JSON.stringify(payload);
        if (pending.current?.key !== key)
            pending.current = { id: crypto.randomUUID(), key };
        try {
            const res = await fetch("/api/community", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, id: pending.current.id }) });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error || "Pesan belum terkirim.");
            if (data.message)
                setMessages(list => list.some(m => m.id === data.message.id) ? list : [...list, data.message].slice(-60));
            setBody("");
            setLink("");
            setLinkOpen(false);
            pending.current = null;
            bottom.current = true;
            setSent(true);
            setRetry(r => r + 1);
        }
        catch (e) {
            setSendError(e instanceof Error ? e.message : "Koneksi terputus. Tulisanmu tetap ada; silakan coba lagi.");
        }
        finally {
            setSending(false);
            posting.current = false;
        }
    };
    return <div ref={root} className="community-panel">
    <div className="community-sidebar"><div className="community-brand"><span className="community-brand-icon"><Users size={21}/></span><div><strong>The common room<span>.</span></strong><p>GOOD PEOPLE. SHARED CURIOSITY.</p></div></div><p className="channel-label mono">CHANNELS</p><Tabs orientation="vertical" value={room} onValueChange={changeRoom}><TabsList className="channel-tabs">{rooms.map(r => <TabsTrigger key={r} value={r} disabled={sending}><Hash size={17}/>{roomInfo[r].label}{room === r && <span className="channel-indicator"/>}</TabsTrigger>)}</TabsList></Tabs><div className="community-note"><MessageSquare size={18}/><p>Belajar itu lebih seru ketika dibagikan.</p><span>Saling menghargai. Bagikan hal yang bermanfaat.</span></div></div>
    <div className="community-main"><div className="chat-heading"><div><strong><Hash size={19}/>{roomInfo[room].label}</strong><p>{roomInfo[room].description}</p></div><span className={`connection-state mono ${status === "ready" ? "connected" : ""}`}>{status === "ready" ? "CONNECTED" : status === "error" ? "RECONNECT" : "CONNECTING"}</span></div>
      <div ref={scroll} className="chat-messages" role="log" aria-label={`Pesan ruang ${roomInfo[room].label}`} aria-live="off" onScroll={() => { if (scroll.current)
        bottom.current = scroll.current.scrollHeight - scroll.current.scrollTop - scroll.current.clientHeight < 80; }}>
        {status === "loading" && !messages.length ? <div className="chat-loading" role="status"><div className="flex gap-3"><Skeleton className="size-8 shrink-0 rounded-none"/><div className="w-full space-y-3"><Skeleton className="h-3 w-24"/><Skeleton className="h-3 w-4/5"/><Skeleton className="h-3 w-3/5"/></div></div><p>Menghubungkan ke ruang diskusi…</p></div> : status === "error" && !messages.length ? <div className="chat-empty"><RefreshCw size={26}/><p role="alert">{error}</p><button onClick={() => setRetry(r => r + 1)} className="button compact secondary">COBA LAGI</button></div> : !messages.length ? <Empty className="chat-empty"><EmptyHeader><EmptyMedia className="empty-message-icon"><MessageSquare size={26}/><span>+</span></EmptyMedia><EmptyTitle className="chat-empty-title">Every connection starts with hello.</EmptyTitle><EmptyDescription className="chat-empty-description">Belum ada pesan di #{roomInfo[room].label}.<br />Jadilah yang pertama membuka percakapan.</EmptyDescription></EmptyHeader></Empty> : messages.map(m => <article className="chat-message" key={m.id}><div className="message-avatar">{m.name.slice(0, 2).toUpperCase()}</div><div className="message-content"><div className="message-meta"><strong>{m.name}</strong><span className="guest-label">Tamu</span><time dateTime={new Date(m.created_at).toISOString()}>{new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(m.created_at)}</time></div><p>{m.body}</p>{m.link && <a className="shared-link" href={m.link} target="_blank" rel="noopener noreferrer nofollow ugc"><Link2 size={14}/><span>{m.link}</span><ArrowUpRight size={14}/></a>}</div></article>)}
      </div>
      {status === "error" && messages.length > 0 && <p className="chat-inline-error" role="alert">{error}<button onClick={() => setRetry(r => r + 1)}>Coba lagi</button></p>}
      <form className="chat-composer" onSubmit={submit}><div className="guest-name"><label htmlFor="guest-name">Kirim sebagai</label><input id="guest-name" placeholder="Nama kamu" value={name} onChange={e => setName(e.target.value)} minLength={2} maxLength={32} required disabled={sending}/><span className="mono">GUEST</span></div><label className="sr-only" htmlFor="community-message">Pesan</label><textarea id="community-message" placeholder={`Tulis sesuatu di #${roomInfo[room].label}…`} value={body} onChange={e => { setBody(e.target.value); setSent(false); }} maxLength={1000} required disabled={sending} rows={2}/>{linkOpen && <div className="share-link-input"><Link2 size={16}/><input type="url" aria-label="Tautan yang dibagikan" placeholder="https://…" value={link} onChange={e => setLink(e.target.value)} maxLength={500} disabled={sending}/></div>}<div className="composer-actions"><button type="button" className={`share-button ${linkOpen ? "selected" : ""}`} onClick={() => setLinkOpen(o => !o)} aria-expanded={linkOpen} disabled={sending}><Link2 size={16}/>{linkOpen ? "Sembunyikan tautan" : "Bagikan tautan"}</button><div><span className="message-count mono">{body.length}/1000</span><button type="submit" className="send-button" disabled={sending || status === "loading" || !body.trim() || name.trim().length < 2}>{sending ? <LoaderCircle size={16} className="animate-spin"/> : <Send size={16}/>}<span>{sending ? "Mengirim…" : "Kirim"}</span></button></div></div><div className="composer-feedback" aria-live="polite">{sendError ? <span className="error-text">{sendError}</span> : sent ? <span className="text-cyan">Pesan terkirim.</span> : <span>Pesan dapat dibaca pengunjung lain. Jangan bagikan informasi pribadi.</span>}</div></form>
    </div>
  </div>;
}
