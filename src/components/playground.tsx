"use client";
import { useEffect, useRef, useState } from "react";
import { Bug, Check, Clock3, Play, RotateCcw, Trophy, Layers3, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
const challenges = [
    { prompt: "Loop ini harus menampilkan setiap item satu kali. Klik baris yang menyebabkan bug.", lines: ['const stack = ["SQL", "Python", "React"];', 'for (let i = 0; i <= stack.length; i++) {', '  console.log(stack[i]);', '}'], bug: 1, explanation: "Gunakan i < stack.length. Indeks terakhir array adalah length − 1, sehingga <= mengakses satu elemen di luar array." },
    { prompt: "Nilai total seharusnya 30. Temukan baris yang perlu diperbaiki.", lines: ['const price = 10;', 'const quantity = 3;', 'const total = price + quantity;', 'console.log(total);'], bug: 2, explanation: "Total harga dihitung dengan perkalian: price * quantity. Operator + menghasilkan 13, bukan 30." },
    { prompt: "Fungsi ini harus mengembalikan nama pertama. Klik baris yang salah.", lines: ['function firstName(names: string[]) {', '  if (names.length === 0) return null;', '  return names[1];', '}'], bug: 2, explanation: "Array dimulai dari indeks 0. Gunakan names[0] untuk mengambil elemen pertama." },
    { prompt: "Fungsi ini harus menjumlahkan dua angka. Cari baris yang menyebabkan kesalahan.", lines: ['function sum(a: number, b: number) {', '  const result = a + b;', '  return a;', '}'], bug: 2, explanation: "Fungsi menghitung result, tetapi mengembalikan a. Ganti menjadi return result." },
    { prompt: "User dewasa berusia 18 tahun atau lebih. Temukan kesalahan batas usia.", lines: ['function isAdult(age: number) {', '  const minimumAge = 18;', '  return age > minimumAge;', '}'], bug: 2, explanation: "Gunakan >= agar usia tepat 18 tahun juga termasuk dewasa. Pengujian boundary value menangkap bug ini." },
];
function BugHunt() {
    const [state, setState] = useState<"idle" | "playing" | "done">("idle");
    const [level, setLevel] = useState(0);
    const [score, setScore] = useState(0);
    const [seconds, setSeconds] = useState(60);
    const [selected, setSelected] = useState<number | null>(null);
    const [correct, setCorrect] = useState(false);
    const [wrong, setWrong] = useState<number[]>([]);
    const deadline = useRef(0);
    useEffect(() => {
        if (state !== "playing")
            return;
        const id = setInterval(() => { const remaining = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)); setSeconds(remaining); if (!remaining)
            setState("done"); }, 200);
        return () => clearInterval(id);
    }, [state]);
    const start = () => { setLevel(0); setScore(0); setSeconds(60); setSelected(null); setCorrect(false); setWrong([]); deadline.current = Date.now() + 60000; setState("playing"); };
    const choose = (index: number) => { if (correct || state !== "playing" || wrong.includes(index))
        return; setSelected(index); if (index === challenges[level].bug) {
        setCorrect(true);
        setScore(s => s + 100);
    }
    else {
        setWrong(w => [...w, index]);
        setScore(s => Math.max(0, s - 25));
    } };
    const next = () => { if (level === challenges.length - 1) {
        setState("done");
        return;
    } setLevel(l => l + 1); setSelected(null); setCorrect(false); setWrong([]); };
    return <div className="game-board">
    <div className="game-toolbar mono"><span><Bug size={15}/> BUG_HUNT.EXE</span><span><Clock3 size={14}/>{seconds}s <span className="toolbar-divider">/</span><Trophy size={14}/>{score} pts</span></div>
    {state === "idle" ? <div className="game-start"><div className="game-icon"><Bug size={32}/></div><span className="eyebrow">THINK LIKE A QA ENGINEER</span><h3>Can you spot the bug?</h3><p>5 potongan kode. 60 detik. Temukan baris yang salah.<br />+100 untuk jawaban benar, −25 untuk tebakan salah.</p><button className="button primary" onClick={start}><Play size={15}/> START DEBUGGING <ArrowRight size={16}/></button><span className="game-footnote mono">NO INSTALLATION. JUST YOUR INSTINCT.</span></div> : state === "done" ? <div className="game-start" aria-live="polite"><div className="game-icon"><Trophy size={32}/></div><span className="eyebrow">RUN COMPLETE</span><h3>{score >= 400 ? "Quality gate: passed." : "Keep your eyes on the code."}</h3><p>Skor sesi kamu <strong className="text-cyan">{score} / 500</strong>.<br />{seconds === 0 ? "Waktu habis. Coba lagi dengan lebih teliti." : "Setiap bug yang ditemukan adalah pengalaman baru."}</p><button className="button primary" onClick={start}><RotateCcw size={16}/> PLAY AGAIN</button></div> : <div className="game-active"><div className="game-round mono"><span>CHALLENGE {String(level + 1).padStart(2, "0")} / 05</span><Progress value={seconds / 60 * 100} aria-label="Sisa waktu" className="h-1 w-28 rounded-none"/></div><p className="game-question">{challenges[level].prompt}</p><div className="code-choices">{challenges[level].lines.map((line, i) => <button key={`${level}-${i}`} className={`${wrong.includes(i) ? "code-wrong" : ""} ${selected === i && correct ? "code-correct" : ""}`} onClick={() => choose(i)} disabled={correct || wrong.includes(i)} aria-label={`Baris ${i + 1}: ${line}`}><span className="line-number">{i + 1}</span><code>{line}</code>{selected === i && correct && <Check size={16}/>}</button>)}</div><div className="game-feedback" aria-live="polite">{correct ? <><p><Check size={15}/>{challenges[level].explanation}</p><button className="button compact primary" onClick={next}>{level === 4 ? "LIHAT HASIL" : "NEXT CHALLENGE"}<ArrowRight size={15}/></button></> : selected !== null ? <p className="wrong-answer">Belum tepat. Cek logika setiap baris dan coba lagi.</p> : <p className="text-muted">Pilih baris kode untuk memeriksanya.</p>}</div></div>}
  </div>;
}
const symbols = ["SQL", "QA", "{ }", "AI", "ETL", "</>"];
function MemoryGame() {
    const [cards, setCards] = useState<string[]>([]);
    const [open, setOpen] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => () => { if (timer.current)
        clearTimeout(timer.current); }, []);
    const start = () => { if (timer.current)
        clearTimeout(timer.current); const deck = [...symbols, ...symbols]; for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    } setCards(deck); setOpen([]); setMatched([]); setMoves(0); };
    const flip = (i: number) => { if (open.length >= 2 || open.includes(i) || matched.includes(i))
        return; const next = [...open, i]; setOpen(next); if (next.length === 2) {
        setMoves(m => m + 1);
        if (cards[next[0]] === cards[i]) {
            setMatched(m => [...m, ...next]);
            setOpen([]);
        }
        else
            timer.current = setTimeout(() => setOpen([]), 850);
    } };
    return <div className="game-board"><div className="game-toolbar mono"><span><Layers3 size={15}/> MEMORY_MATCH.EXE</span><span>{matched.length / 2}/6 PAIRS <span className="toolbar-divider">/</span> {moves} MOVES</span></div>{!cards.length ? <div className="game-start"><div className="game-icon"><Layers3 size={32}/></div><span className="eyebrow">A QUICK MEMORY CHECK</span><h3>Connect the stack.</h3><p>Temukan 6 pasang simbol teknologi.<br />Semakin sedikit langkah, semakin baik.</p><button className="button primary" onClick={start}><Play size={15}/> START MATCHING<ArrowRight size={16}/></button><span className="game-footnote mono">TAKE A BREATH. MAKE A MATCH.</span></div> : <div className="memory-active"><div className="memory-grid">{cards.map((symbol, i) => <button className={`memory-card ${open.includes(i) || matched.includes(i) ? "is-flipped" : ""} ${matched.includes(i) ? "is-matched" : ""}`} key={i} onClick={() => flip(i)} disabled={matched.includes(i) || open.includes(i)} aria-label={matched.includes(i) ? `Pasangan ${symbol} ditemukan` : open.includes(i) ? `Kartu ${symbol}` : `Buka kartu ${i + 1}`}><span className="memory-back" aria-hidden="true">jt<span>.</span></span><span className="memory-front" aria-hidden="true">{symbol}</span></button>)}</div><div className="memory-result" aria-live="polite"><p>{matched.length === 12 ? `Perfect connection. Selesai dalam ${moves} langkah!` : "Buka dua kartu dan temukan pasangannya."}</p><button onClick={start} className="icon-button" aria-label="Ulangi memory game"><RotateCcw size={17}/></button></div></div>}</div>;
}
export default function Playground() { return <Tabs defaultValue="bugs" className="playground-tabs"><TabsList className="game-tabs"><TabsTrigger value="bugs"><Bug size={16}/> Bug hunt</TabsTrigger><TabsTrigger value="memory"><Layers3 size={16}/> Memory match</TabsTrigger></TabsList><TabsContent value="bugs"><BugHunt /></TabsContent><TabsContent value="memory"><MemoryGame /></TabsContent></Tabs>; }
