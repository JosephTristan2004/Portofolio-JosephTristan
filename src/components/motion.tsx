"use client";
import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from "react";
import { ArrowUpRight, Rotate3D, ShieldCheck, Terminal, X } from "lucide-react";
import { profile } from "@/lib/profile";
import { Progress } from "@/components/ui/progress";
export function useMotionPreference() {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReduced(media.matches || localStorage.getItem("jt-motion") === "reduced");
        update();
        media.addEventListener("change", update);
        window.addEventListener("jt-motion-change", update);
        return () => { media.removeEventListener("change", update); window.removeEventListener("jt-motion-change", update); };
    }, []);
    return reduced;
}
export function Reveal({ children, className = "", delay = 0 }: {
    children: ReactNode;
    className?: string;
    delay?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight)
            return;
        el.classList.add("reveal-wait");
        const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) {
            el.classList.remove("reveal-wait");
            observer.disconnect();
        } }, { threshold: .08 });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}
export function BootScreen() {
    const [show, setShow] = useState(false);
    const [progress, setProgress] = useState(0);
    const reduced = useMotionPreference();
    useEffect(() => {
        if (sessionStorage.getItem("jt-booted") || window.matchMedia("(prefers-reduced-motion: reduce)").matches || localStorage.getItem("jt-motion") === "reduced")
            return;
        setShow(true);
        const start = performance.now();
        const interval = window.setInterval(() => setProgress(Math.min(100, Math.floor((performance.now() - start) / 19))), 40);
        const done = window.setTimeout(() => { setShow(false); sessionStorage.setItem("jt-booted", "1"); }, 2150);
        return () => { clearInterval(interval); clearTimeout(done); };
    }, []);
    useEffect(() => { if (reduced)
        setShow(false); }, [reduced]);
    if (!show)
        return null;
    const logs = ["> initializing portfolio.exe", `> loading identity: ${profile.shortName.toLowerCase().replaceAll(" ", "_")}`, "> connecting data + quality", "> access granted. welcome."];
    return <div className="boot-screen" aria-label="Animasi pembuka portofolio">
    <button onClick={() => { setShow(false); sessionStorage.setItem("jt-booted", "1"); }} className="boot-skip">Lewati intro <X size={16}/></button>
    <div className="boot-content"><div className="boot-logo">jt<span>.</span></div><div className="boot-title"><Terminal size={16}/> ESTABLISHING CONNECTION</div><div className="boot-logs" aria-hidden="true">{logs.map((l, i) => <p className={progress >= i * 27 ? "loaded" : ""} key={l}>{l}</p>)}</div><Progress value={progress} aria-label="Memuat animasi pembuka" className="h-1 rounded-none"/><div className="boot-meta"><span>PORTFOLIO_OS / V.2026</span><span>{progress.toString().padStart(3, "0")}%</span></div></div>
    <span className="boot-foot">A LITTLE CODE. A LOT OF CURIOSITY.</span>
  </div>;
}
export function Scramble({ text, className = "" }: {
    text: string;
    className?: string;
}) {
    const [value, setValue] = useState(text);
    const interval = useRef<ReturnType<typeof setInterval> | null>(null);
    const reduced = useMotionPreference();
    const scramble = () => {
        if (reduced)
            return;
        if (interval.current)
            clearInterval(interval.current);
        let frame = 0;
        interval.current = setInterval(() => {
            frame += .5;
            setValue(text.split("").map((c, i) => c === " " ? " " : i < frame ? c : "01#<>/{}"[Math.floor(Math.random() * 8)]).join(""));
            if (frame > text.length) {
                if (interval.current)
                    clearInterval(interval.current);
                setValue(text);
            }
        }, 35);
    };
    useEffect(() => () => { if (interval.current)
        clearInterval(interval.current); }, []);
    return <span className={className} onPointerEnter={scramble}><span className="sr-only">{text}</span><span aria-hidden="true">{value}</span></span>;
}
export function Portrait() {
    const card = useRef<HTMLDivElement>(null);
    const [spinning, setSpinning] = useState(false);
    const reduced = useMotionPreference();
    const move = (e: PointerEvent<HTMLDivElement>) => {
        if (!card.current || reduced || e.pointerType !== "mouse")
            return;
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        card.current.style.setProperty("--rx", `${-y * 17}deg`);
        card.current.style.setProperty("--ry", `${x * 20 - 5}deg`);
        card.current.style.setProperty("--mx", `${(x + .5) * 100}%`);
        card.current.style.setProperty("--my", `${(y + .5) * 100}%`);
    };
    const reset = () => { card.current?.style.setProperty("--rx", "2deg"); card.current?.style.setProperty("--ry", "-5deg"); };
    const spin = () => { if (!reduced && !spinning)
        setSpinning(true); };
    return <div className="portrait-scene" onPointerMove={move} onPointerLeave={reset} onPointerEnter={e => { if (e.pointerType === "mouse")
        spin(); }}>
    <div className="portrait-grid" aria-hidden="true"/><div className="orbit orbit-one" aria-hidden="true"/><div className="orbit orbit-two" aria-hidden="true"/>
    <span className="portrait-node mono">NODE_001 <span>ACTIVE</span></span><span className="float-label label-top"><CodeTag /> DATA ANALYTICS</span><span className="float-label label-left">SQL</span><span className="float-label label-right"><ShieldCheck size={13}/> QA</span>
    <span className="plus plus-one" aria-hidden="true">+</span><span className="plus plus-two" aria-hidden="true">+</span>
    <div ref={card} className="portrait-tilt">
      <div className={`portrait-card ${spinning ? "portrait-spinning" : ""}`} onAnimationEnd={() => setSpinning(false)}>
        <div className="portrait-top mono"><span>IDENTITY / JOSEPH_TRISTAN</span><span>01</span></div>
        <div className={`portrait-window ${profile.photoMode === "photo" ? "portrait-photo" : ""}`}><img src={profile.photo} alt={`Foto ${profile.shortName}`} style={{ objectPosition: profile.photoPosition }} fetchPriority="high"/><div className="portrait-scan" aria-hidden="true"/><div className="portrait-noise" aria-hidden="true"/><div className="portrait-corner corner-tl"/><div className="portrait-corner corner-br"/></div>
        <div className="portrait-caption"><div><span className="mono">HELLO, WORLD. I’M</span><strong>{profile.shortName}<span> ↗</span></strong></div><span className="portrait-barcode" aria-hidden="true">▏▎▍▏▍▎▏▍▎▏</span></div><div className="portrait-sheen" aria-hidden="true"/>
      </div>
    </div>
    <button className="rotate-button mono" onClick={spin} disabled={spinning || reduced} aria-label="Putar foto Joseph dalam 3D"><Rotate3D size={15}/>{reduced ? "PORTRAIT / JOSEPH" : "HOVER TO EXPLORE · CLICK TO ROTATE"}<ArrowUpRight size={13}/></button>
  </div>;
}
function CodeTag() { return <span aria-hidden="true">&lt;/&gt;</span>; }
export function CodingField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const reduced = useMotionPreference();
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || reduced)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        let frame = 0, request = 0, width = 0, height = 0;
        let visible = true;
        const resize = () => { width = canvas.clientWidth; height = canvas.clientHeight; const dpr = Math.min(devicePixelRatio || 1, 1.5); canvas.width = width * dpr; canvas.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(canvas);
        const visibility = () => { visible = !document.hidden; };
        document.addEventListener("visibilitychange", visibility);
        const render = () => {
            if (visible) {
                frame++;
                ctx.clearRect(0, 0, width, height);
                ctx.font = "11px monospace";
                for (let i = 0; i < 18; i++) {
                    const x = (i * 83.3 + 27) % width;
                    const y = (frame * .16 + i * 97) % (height + 100) - 100;
                    ctx.fillStyle = `rgba(0,217,237,${.07 + (i % 3) * .025})`;
                    ctx.fillText(["0101", "{ }", "SQL", "</>", "0x2F", "=>"][i % 6], x, y);
                }
            }
            request = window.requestAnimationFrame(render);
        };
        render();
        return () => { cancelAnimationFrame(request); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
    }, [reduced]);
    return <canvas className="coding-field" ref={canvasRef} aria-hidden="true"/>;
}
