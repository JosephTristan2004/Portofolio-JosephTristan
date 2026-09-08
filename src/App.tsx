"use client";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, BriefcaseBusiness, Check, CheckCheck, Code2, Database, Download, ExternalLink, FileText, Gamepad2, CodeXml as Github, GraduationCap, Camera as Instagram, BriefcaseBusiness as Linkedin, Mail, MapPin, Menu, MessageCircle, MoveUpRight, Pause, Play, ShieldCheck, Sparkles, Terminal, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { BootScreen, CodingField, Portrait, Reveal, Scramble } from "./components/motion";
import Playground from "./components/playground";
import Community from "./components/community";
import { profile, projects } from "@/lib/profile";
type Project = typeof projects[number];
type Channel = "cv" | "email" | "whatsapp" | "linkedin" | "github" | "instagram";
const channelNames: Record<Channel, string> = { cv: "Curriculum Vitae", email: "Email", whatsapp: "WhatsApp", linkedin: "LinkedIn", github: "GitHub", instagram: "Instagram" };
const nav = [{ id: "about", label: "About" }, { id: "work", label: "Work" }, { id: "playground", label: "Playground" }, { id: "community", label: "Community" }];
function SectionNumber({ number, label }: {
    number: string;
    label: string;
}) { return <div className="section-eyebrow"><span>{number}</span><i />{label}</div>; }
function ProjectVisual({ kind }: {
    kind: string;
}) {
    if (kind === "qa")
        return <div className="project-visual qa-visual" aria-hidden="true"><div className="visual-window"><div className="mini-window-header"><div><i /><i /><i /></div><span>quality_gate.test.ts</span><ShieldCheck size={14}/></div><div className="test-list"><p><span className="text-violet">describe</span>(<span className="text-cyan">&apos;A better experience&apos;</span>, () =&gt; &#123;</p>{["user authentication", "business flow validation", "regression & retesting"].map((item, i) => <div key={item} style={{ animationDelay: `${i * .5}s` }}><Check size={14}/><span>{item}</span><small>CHECK</small></div>)}<p className="test-close">&#125;);</p></div></div><span className="visual-caption mono">REQUIREMENT → TEST → VALIDATE</span></div>;
    if (kind === "data")
        return <div className="project-visual data-visual" aria-hidden="true"><div className="data-pipeline"><span><Database size={22}/><small>SOURCE</small></span><i /><span className="data-node"><Code2 size={24}/><small>ETL</small></span><i /><span><Database size={22}/><small>WAREHOUSE</small></span></div><div className="data-code"><p><em>SELECT</em> insight</p><p><em>FROM</em> raw_data</p><p><em>WHERE</em> curiosity <b>IS NOT NULL</b>;</p></div><span className="visual-caption mono">EXTRACT. TRANSFORM. UNDERSTAND.</span></div>;
    if (kind === "web")
        return <div className="project-visual web-visual" aria-hidden="true"><div className="code-editor"><div className="editor-tab"><Code2 size={13}/> stepy / checkout.php <span>●</span></div><p><i>01</i><em>&lt;?php</em></p><p><i>02</i><span className="text-violet">class</span> <b>ShoppingExperience</b> &#123;</p><p><i>03</i>&nbsp; <span className="text-violet">public function</span> build() &#123;</p><p><i>04</i>&nbsp;&nbsp; <span className="text-violet">return</span> <span className="text-cyan">&apos;idea → checkout&apos;</span>;</p><p><i>05</i>&nbsp; &#125;</p><p><i>06</i>&#125;</p></div><span className="visual-caption mono">CUSTOMER × COMMERCE × CODE</span></div>;
    return <div className="project-visual ml-visual" aria-hidden="true"><div className="sequence-label mono">SEQUENTIAL THINKING</div><div className="sequence-diagram"><div className="sequence-inputs"><span>t − 2</span><span>t − 1</span><span>t</span></div><span className="sequence-arrow">→</span><div className="lstm-block">LSTM<small>MEMORY CELL</small></div><span className="sequence-arrow">→</span><div className="sequence-output">p<small>RETENTION</small></div></div><div className="sequence-signals">{Array.from({ length: 30 }, (_, i) => <i key={i} style={{ height: `${10 + (i * 17 % 38)}px`, animationDelay: `${i * .09}s` }}/>)}</div><span className="visual-caption mono">PAST BEHAVIOR. FUTURE POSSIBILITIES.</span></div>;
}
export default function App() {
    const [menu, setMenu] = useState(false);
    const [active, setActive] = useState("");
    const [selected, setSelected] = useState<Project | null>(null);
    const [contact, setContact] = useState<Channel | null>(null);
    const [reduced, setReduced] = useState(false);
    const [systemReduced, setSystemReduced] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    useEffect(() => {
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        const apply = () => { setSystemReduced(media.matches); const value = localStorage.getItem("jt-motion") === "reduced" || media.matches; setReduced(value); document.documentElement.dataset.motion = value ? "reduced" : "full"; };
        apply();
        media.addEventListener("change", apply);
        const observer = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting)
            setActive(e.target.id); }); }, { rootMargin: "-20% 0px -60% 0px" });
        document.querySelectorAll("main section[id]").forEach(s => observer.observe(s));
        let ticking = false;
        const onScroll = () => { if (!ticking) {
            requestAnimationFrame(() => { const max = document.documentElement.scrollHeight - innerHeight; setScrollProgress(max > 0 ? scrollY / max * 100 : 0); ticking = false; });
            ticking = true;
        } };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => { observer.disconnect(); window.removeEventListener("scroll", onScroll); media.removeEventListener("change", apply); };
    }, []);
    useEffect(() => { if (!menu)
        return; const close = (e: KeyboardEvent) => { if (e.key === "Escape")
        setMenu(false); }; document.addEventListener("keydown", close); return () => document.removeEventListener("keydown", close); }, [menu]);
    const toggleMotion = () => { const next = !reduced; setReduced(next); localStorage.setItem("jt-motion", next ? "reduced" : "full"); document.documentElement.dataset.motion = next ? "reduced" : "full"; window.dispatchEvent(new Event("jt-motion-change")); };
    const openChannel = (channel: Channel) => {
        const value = profile[channel];
        if (!value) {
            setContact(channel);
            return;
        }
        if (channel === "email") {
            const subject = encodeURIComponent("Halo Joseph Tristan");
            const body = encodeURIComponent("Halo Joseph, saya ingin menghubungi kamu.");
            // Open Gmail's compose window directly so this works even when
            // Windows has no default MAILTO application configured.
            const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(value)}&su=${subject}&body=${body}`;
            const mailWindow = window.open(gmailCompose, "_blank", "noopener,noreferrer");
            if (!mailWindow) window.location.assign(gmailCompose);
            return;
        }
        if (channel === "whatsapp") {
            window.open(`https://wa.me/${value.replace(/\D/g, "")}`, "_blank", "noopener,noreferrer");
            return;
        }
        if (channel === "cv") {
            const a = document.createElement("a");
            a.href = value;
            a.download = "CV-Joseph-Ananda-Tristan.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            return;
        }
        window.open(value, "_blank", "noopener,noreferrer");
    };
    return <>
    <BootScreen /><a className="skip-link" href="#main">Lewati navigasi</a><div className="reading-progress" style={{ width: `${scrollProgress}%` }} aria-hidden="true"/>
    <header className="site-header"><div className="header-inner"><a href="#home" className="wordmark" aria-label="Joseph Tristan, beranda">jt<span>.</span><span className="wordmark-bracket">/</span><span className="wordmark-name">JOSEPH<br />TRISTAN</span></a><nav aria-label="Navigasi utama" className={menu ? "main-nav nav-open" : "main-nav"}>{nav.map(n => <a href={`#${n.id}`} key={n.id} className={active === n.id ? "nav-active" : ""} onClick={() => setMenu(false)}>{n.label}</a>)}</nav><a href="#contact" className="header-contact">Let’s talk <ArrowUpRight size={16}/></a><button className="menu-toggle icon-button" onClick={() => setMenu(m => !m)} aria-expanded={menu} aria-label={menu ? "Tutup menu" : "Buka menu"}>{menu ? <X size={22}/> : <Menu size={22}/>}</button></div></header>
    <main id="main">
      <section className="hero section-shell" id="home"><CodingField /><div className="hero-copy"><div className="hero-eyebrow mono"><i />PORTFOLIO / {profile.year} <span>[ SYSTEM ONLINE ]</span></div><h1 className="hero-title"><span className="title-line"><Scramble text={profile.headline[0]}/></span><span className="title-line outlined"><Scramble text={profile.headline[1]}/></span><span className="title-line text-cyan"><Scramble text={profile.headline[2]}/></span></h1><p className="hero-description">Hi, I’m <strong>{profile.shortName}.</strong> {profile.heroDescription}</p><div className="hero-actions"><button className="button primary" onClick={() => openChannel("cv")}><Download size={17}/> DOWNLOAD CV <ArrowUpRight size={16}/></button><a href="#work" className="button text-button">EXPLORE MY WORK <ArrowRight size={17}/></a></div><div className="hero-coordinates mono"><span><MapPin size={14}/>{profile.location}</span><i /><span><Code2 size={14}/>DATA / QA / ML</span></div><div className="hero-socials"><span className="mono">OPEN CHANNELS</span><button onClick={() => openChannel("linkedin")}><Linkedin size={16}/>LinkedIn</button><button onClick={() => openChannel("whatsapp")}><MessageCircle size={16}/>WhatsApp</button><button onClick={() => openChannel("email")}><Mail size={16}/>Email</button></div></div><Portrait /><a className="scroll-cue mono" href="#about"><span>SCROLL TO DISCOVER</span><ArrowDown size={15}/></a><span className="hero-side-label mono" aria-hidden="true">CREATIVE MIND. ANALYTICAL CORE.</span></section>
      <div className="tech-ticker" aria-label="Teknologi: Python, SQL, Power BI, Quality Assurance, React, Machine Learning"><div className="ticker-track" aria-hidden="true">{[0, 1].map(n => <div className="ticker-set" key={n}>{["PYTHON", "SQL", "POWER BI", "QUALITY ASSURANCE", "REACT", "MACHINE LEARNING"].map(t => <span key={t}><span className="ticker-star">✳</span>{t}</span>)}</div>)}</div></div>
      <section id="about" className="about-section section-shell section-spacing"><Reveal><SectionNumber number="01" label="THE PERSON BEHIND THE CODE"/></Reveal><div className="about-grid"><Reveal><h2>Curious by nature.<br /><span className="muted-heading">Precise by design.</span></h2><p className="about-intro">The big picture matters.<br /><span>So does the smallest detail.</span></p><div className="signature">{profile.shortName}<span>↗</span></div></Reveal><Reveal delay={120} className="about-details"><p>Saya <strong>{profile.name}</strong>, mahasiswa S1 Sistem Informasi di Universitas Multimedia Nusantara. Saya tertarik memahami bagaimana data bisa menjawab pertanyaan, dan bagaimana teknologi bisa bekerja lebih baik untuk manusia.</p><p>Pengalaman sebagai <strong>Quality Assurance Intern di Telkomsigma</strong> melatih saya melihat sistem dari sisi pengguna: menguji alur, menemukan detail yang terlewat, dan bekerja bersama tim untuk meningkatkan kualitas aplikasi.</p><div className="about-facts"><div><GraduationCap size={19}/><span><strong>Universitas Multimedia Nusantara</strong><small>S1 Sistem Informasi · Angkatan 2023</small></span></div><div><BriefcaseBusiness size={19}/><span><strong>PT Sigma Cipta Caraka</strong><small>Quality Assurance Intern · 2026</small></span></div></div></Reveal></div><div className="focus-grid">{[{ no: "01", icon: Database, title: "Find the insight.", text: "Data analytics, visualisasi, dan business intelligence untuk memahami cerita di balik angka." }, { no: "02", icon: ShieldCheck, title: "Question the details.", text: "Pengujian yang terstruktur, dokumentasi yang jelas, dan rasa ingin tahu di setiap skenario." }, { no: "03", icon: Code2, title: "Build with purpose.", text: "Menghubungkan logika, antarmuka, dan pengalaman pengguna melalui pengembangan aplikasi." }].map((f, i) => <Reveal key={f.no} delay={i * 100} className="focus-card"><div className="focus-top"><f.icon size={23}/><span className="mono">{f.no}</span></div><h3>{f.title}</h3><p>{f.text}</p></Reveal>)}</div></section>
      <section id="work" className="work-section section-shell section-spacing"><Reveal><SectionNumber number="02" label="SELECTED WORK"/><div className="section-title-row"><h2>Less talk.<br /><span className="muted-heading">More proof of work.</span></h2><p>Dari pengujian aplikasi sampai analisis data.<br />Beberapa hal yang pernah saya kerjakan.</p></div></Reveal><div className="projects-grid">{projects.map((p, i) => <Reveal key={p.id} delay={i % 2 * 110}><button className={`project-card project-${p.kind}`} onClick={() => setSelected(p)} aria-label={`Lihat detail ${p.name}`}><ProjectVisual kind={p.kind}/><div className="project-content"><div className="project-category mono"><span>{p.id} / {p.category}</span><ArrowUpRight size={22}/></div><h3>{p.title}</h3><p className="project-name">{p.name}</p><p className="project-summary">{p.summary}</p><div className="project-tags">{p.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></button></Reveal>)}</div></section>
      <section className="skills-section section-shell section-spacing" id="skills"><Reveal><SectionNumber number="03" label="THE TOOLKIT"/><div className="section-title-row"><h2>Tools change.<br /><span className="muted-heading">Curiosity stays.</span></h2><p>Teknologi yang saya gunakan<br />untuk belajar, menganalisis, dan membangun.</p></div></Reveal><div className="skill-rows">{[{ n: "01", name: "Data & intelligence", tools: ["Python", "SQL", "Power BI", "Tableau", "Pentaho", "Machine learning"] }, { n: "02", name: "Quality & systems", tools: ["UAT", "Regression testing", "Test case design", "Defect reporting", "FSD / TSD"] }, { n: "03", name: "Code & creativity", tools: ["Java", "PHP", "MySQL", "React", "TypeScript", "Figma", "Video editing"] }].map((s, i) => <Reveal className="skill-row" key={s.n} delay={i * 70}><span className="skill-number mono">{s.n}</span><h3>{s.name}</h3><div className="skill-tags">{s.tools.map(t => <span key={t}>{t}</span>)}</div><ArrowUpRight size={19} className="skill-arrow"/></Reveal>)}</div><Reveal className="experience-note"><span className="eyebrow">OUTSIDE THE EDITOR</span><p>Dokumentasi acara, video editing, dan kolaborasi di <strong>SIM 2025</strong> serta <strong>Perkenalan Prodi 2025</strong>. Kreativitas juga menjadi bagian dari cara saya bekerja.</p><Sparkles size={25}/></Reveal></section>
      <section id="playground" className="playground-section section-spacing"><div className="section-shell"><Reveal><SectionNumber number="04" label="THE PLAYGROUND"/></Reveal><div className="playground-grid"><Reveal className="playground-copy"><span className="small-tag"><Gamepad2 size={15}/> THE OTHER SIDE OF THE BRAIN</span><h2>A little break.<br /><span className="text-cyan">A little challenge.</span></h2><p>Di balik analisis yang serius, selalu ada ruang untuk bermain. Uji ketelitianmu atau tantang daya ingatmu dengan dua mini challenge.</p><div className="playground-tip"><span className="terminal-prompt">&gt;_</span><p>You don’t need to be a developer.<br />Just bring your curiosity<span className="blinking-cursor">_</span></p></div><span className="mono playground-side-note">HUMAN SKILLS / MACHINE PRECISION</span></Reveal><Reveal delay={100}><Playground /></Reveal></div></div></section>
      <section id="community" className="community-section section-shell section-spacing"><Reveal><SectionNumber number="05" label="LET’S CONNECT THE DOTS"/><div className="section-title-row"><h2>Better together<span className="text-cyan">.</span></h2><p>Ngobrol tentang teknologi, saling berbagi,<br />dan temukan sudut pandang baru.</p></div></Reveal><Reveal><Community /></Reveal></section>
      <section id="contact" className="contact-section section-shell section-spacing"><CodingField /><Reveal><SectionNumber number="06" label="THE NEXT CONNECTION"/><div className="contact-grid"><div><span className="contact-kicker mono">FOR TEAMS, COMPANIES & CREATIVE PEOPLE</span><h2>Have something<br />in mind<span className="text-cyan">?</span></h2><p>Mari bertukar ide, berdiskusi tentang peluang kerja,<br />atau membangun sesuatu yang bermanfaat.</p><div className="contact-actions"><button className="button primary" onClick={() => openChannel("email")}><Mail size={17}/> LET’S TALK <ArrowUpRight size={16}/></button><button className="button secondary" onClick={() => openChannel("whatsapp")}><MessageCircle size={17}/> WHATSAPP <ArrowUpRight size={16}/></button></div></div><div className="contact-links">{[{ channel: "email" as Channel, icon: Mail, name: "Email", sub: profile.email ?? "Send me an email" }, { channel: "linkedin" as Channel, icon: Linkedin, name: "LinkedIn", sub: "Professional connections" }, { channel: "github" as Channel, icon: Github, name: "GitHub", sub: "Code & experiments" }, { channel: "instagram" as Channel, icon: Instagram, name: "Instagram", sub: "A little beyond the screen" }, { channel: "cv" as Channel, icon: FileText, name: "Curriculum Vitae", sub: "The story, on one document" }].map(l => <button onClick={() => openChannel(l.channel)} key={l.channel}><l.icon size={21}/><div><strong>{l.name}</strong><span>{l.sub}</span></div><ArrowUpRight size={20}/></button>)}</div></div></Reveal></section>
    </main>
    <footer className="site-footer section-shell"><div className="footer-top"><a href="#home" className="wordmark">jt<span>.</span></a><p>Always learning. Always building.</p><a href="#home" className="back-top mono">BACK TO TOP <ArrowUp size={15}/></a></div><div className="footer-bottom"><span>© {profile.year} {profile.name}</span><span className="footer-made"><Code2 size={13}/> Made with curiosity & a little caffeine.</span><label className="motion-toggle" htmlFor="motion-switch"><Switch id="motion-switch" size="sm" disabled={systemReduced} checked={!reduced} onCheckedChange={toggleMotion} aria-label="Aktifkan animasi"/>Animasi {reduced ? "nonaktif" : "aktif"}</label></div></footer>
    <Dialog open={!!selected} onOpenChange={open => { if (!open)
        setSelected(null); }}><DialogContent className="project-dialog">{selected && <><DialogHeader><span className="eyebrow">{selected.category} / {selected.id}</span><DialogTitle>{selected.title}</DialogTitle><DialogDescription>{selected.name}</DialogDescription></DialogHeader><p className="dialog-description">{selected.description}</p><h4>Fokus & kontribusi</h4><ul className="contribution-list">{selected.contributions.map(c => <li key={c}><CheckCheck size={17}/><span>{c}</span></li>)}</ul><div className="dialog-tools"><span className="eyebrow">TOOLKIT</span><p>{selected.tools}</p></div><p className="project-scope">{selected.scope}</p><a href="#contact" className="button primary" onClick={() => setSelected(null)}>LET’S TALK ABOUT IT <ArrowUpRight size={16}/></a></>}</DialogContent></Dialog>
    <Dialog open={!!contact} onOpenChange={open => { if (!open)
        setContact(null); }}><DialogContent className="contact-dialog"><DialogHeader><span className="eyebrow">CONTACT / JOSEPH TRISTAN</span><DialogTitle>{contact ? channelNames[contact] : "Kontak"}</DialogTitle><DialogDescription>{contact === "cv" ? "Dokumen CV belum tersedia untuk diunduh." : "Kontak ini belum dipublikasikan."}</DialogDescription></DialogHeader><div className="contact-unavailable-icon">{contact === "cv" ? <FileText size={30}/> : <MessageCircle size={30}/>}</div><p>{contact === "cv" ? "Sambil menunggu CV, kamu bisa melihat pengalaman, keahlian, dan detail proyek di halaman portofolio." : "Kamu tetap bisa menyapa dan berdiskusi di ruang komunitas."}</p><a href={contact === "cv" ? "#about" : "#community"} className="button primary" onClick={() => setContact(null)}>{contact === "cv" ? "LIHAT PROFIL" : "BUKA KOMUNITAS"}<ArrowRight size={16}/></a></DialogContent></Dialog>
  </>;
}
