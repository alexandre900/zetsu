import { motion, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"

// ─── Design tokens (clickway.fr style) ───────────────────────────────────────
const C = {
  cream: "#FFFDF7",
  gold: "#D1A326",
  goldLight: "#F0C84A",
  black: "#0A0A0A",
  dark: "#171717",
  gray: "#666666",
  grayLight: "#A8A8A8",
  white: "#FFFFFF",
  border: "#E8E4D9",
}

const F = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
const ease = [0.22, 1, 0.36, 1]
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}
const stag = (d = 0.12) => ({
  hidden: {},
  show: { transition: { staggerChildren: d } },
})

function useInView(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

// ─── City clock ───────────────────────────────────────────────────────────────
function CityTime({ city, offset }) {
  const [time, setTime] = useState("")
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const utc = d.getTime() + d.getTimezoneOffset() * 60000
      const local = new Date(utc + offset * 3600000)
      setTime(local.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [offset])
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 28, fontWeight: 400, color: C.white, letterSpacing: -1 }}>{time}</div>
      <div style={{ fontSize: 13, color: C.grayLight, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{city}</div>
    </div>
  )
}

// ─── Marquee strip ────────────────────────────────────────────────────────────
function Marquee({ items, speed = 35, dark = false }) {
  const doubled = [...items, ...items]
  return (
    <div style={{ overflow: "hidden", background: dark ? C.black : C.cream, borderTop: `1px solid ${dark ? "#222" : C.border}`, borderBottom: `1px solid ${dark ? "#222" : C.border}`, padding: "14px 0" }}>
      <motion.div
        style={{ display: "flex", gap: 48, width: "max-content", alignItems: "center" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <span key={i} style={{ fontSize: 14, fontWeight: 400, color: dark ? C.grayLight : C.gray, whiteSpace: "nowrap", letterSpacing: 0.5, fontFamily: F }}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Rotating word card ───────────────────────────────────────────────────────
const rotatingWords = ["e-commerces", "marques", "entrepreneurs", "boutiques", "startups"]

function RotatingWord() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % rotatingWords.length), 2200)
    return () => clearInterval(id)
  }, [])
  return (
    <span style={{ display: "inline-block", position: "relative", verticalAlign: "middle" }}>
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: C.gold, color: C.white, borderRadius: 12, padding: "2px 18px 4px",
        minWidth: 200, fontSize: "inherit", fontWeight: 400, lineHeight: "inherit",
        overflow: "hidden", position: "relative",
      }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={idx}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            style={{ display: "block", whiteSpace: "nowrap" }}
          >
            {rotatingWords[idx]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  )
}

// ─── Black CTA button ─────────────────────────────────────────────────────────
function BtnBlack({ children, style }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: hov ? "#222" : C.black,
        color: C.white, border: `1px solid ${C.grayLight}`,
        borderRadius: 10, padding: "13px 24px",
        fontSize: 13, fontWeight: 500, fontFamily: F,
        textTransform: "uppercase", letterSpacing: 1,
        cursor: "pointer", transition: "background 0.2s",
        ...style,
      }}
    >
      {children}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  )
}

function BtnOutline({ children, style }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "transparent",
        color: hov ? C.black : C.gray,
        border: `1px solid ${hov ? C.black : C.border}`,
        borderRadius: 10, padding: "13px 24px",
        fontSize: 13, fontWeight: 500, fontFamily: F,
        textTransform: "uppercase", letterSpacing: 1,
        cursor: "pointer", transition: "all 0.2s",
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ background: C.cream, position: "relative", overflow: "hidden", padding: "120px 24px 100px" }}>
      {/* radial gold glow */}
      <div style={{
        position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)",
        width: 700, height: 400,
        background: `radial-gradient(ellipse, rgba(209,163,38,0.18) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", position: "relative" }}>
        {/* badge */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.white, border: `1px solid ${C.border}`, borderRadius: 99, padding: "7px 16px", marginBottom: 36 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.gold, display: "inline-block" }} />
          <span style={{ fontSize: 13, color: C.gray, fontFamily: F, fontWeight: 400 }}>Agence Ads Meta Statiques</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease, delay: 0.08 }}
          style={{ fontSize: "clamp(42px, 6vw, 68px)", lineHeight: 1.1, fontWeight: 400, color: C.black, fontFamily: F, marginBottom: 32, letterSpacing: -1.5 }}
        >
          On crée les ads Meta de tes{" "}
          <RotatingWord />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease, delay: 0.18 }}
          style={{ fontSize: 17, color: C.gray, fontFamily: F, fontWeight: 400, lineHeight: 1.65, maxWidth: 540, margin: "0 auto 44px" }}
        >
          Des visuels statiques qui stoppent le scroll — conçus pour convertir sur Facebook et Instagram.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.26 }}
          style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <BtnBlack>Réserver un appel</BtnBlack>
          <BtnOutline>Voir les projets</BtnOutline>
        </motion.div>

        {/* social proof row */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 52, flexWrap: "wrap" }}>
          <div style={{ display: "flex" }}>
            {["#A","#B","#C","#D"].map((c, i) => (
              <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: `hsl(${i * 40 + 30},50%,70%)`, border: `2px solid ${C.cream}`, marginLeft: i ? -10 : 0 }} />
            ))}
          </div>
          <span style={{ fontSize: 14, color: C.gray, fontFamily: F }}>+47 marques nous font confiance</span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ fontSize: 14, color: C.gray, fontFamily: F }}>⭐ 4.9 / 5</span>
        </motion.div>
      </div>
    </section>
  )
}

// ─── LOGO MARQUEE + SERVICE CARDS ─────────────────────────────────────────────
const brands = ["Shopify", "Meta Ads", "Facebook", "Instagram", "WooCommerce", "Klaviyo", "TikTok Shop", "Prestashop", "Google Ads", "Canva Pro"]

function ServiceCard({ title, tag, gradient }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, minWidth: 280, borderRadius: 16, overflow: "hidden",
        background: `linear-gradient(160deg, ${gradient[0]}, ${gradient[1]})`,
        padding: 32, cursor: "pointer",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.3s ease",
        position: "relative",
      }}
    >
      <div style={{ fontSize: 36, marginBottom: 16 }}>{tag}</div>
      <div style={{ fontSize: 22, fontWeight: 400, color: C.white, fontFamily: F, lineHeight: 1.25 }}>{title}</div>
      <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1 }}>Découvrir</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </div>
  )
}

function ServicesSection() {
  const [ref, visible] = useInView()
  return (
    <section style={{ background: C.black }}>
      <Marquee items={brands} dark speed={40} />
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <motion.div variants={stag(0.15)} initial="hidden" animate={visible ? "show" : "hidden"}
          style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <motion.div variants={fadeUp} style={{ flex: 1, minWidth: 280 }}>
            <ServiceCard title="Ads de conversion" tag="🎯" gradient={["#1a1a1a", "#2d2200"]} />
          </motion.div>
          <motion.div variants={fadeUp} style={{ flex: 1, minWidth: 280 }}>
            <ServiceCard title="Ads de notoriété" tag="✨" gradient={["#1a1a00", "#2d2800"]} />
          </motion.div>
          <motion.div variants={fadeUp} style={{ flex: 1, minWidth: 280 }}>
            <ServiceCard title="Séries créatives A/B" tag="🔥" gradient={["#1a0a00", "#2d1400"]} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── PORTFOLIO ────────────────────────────────────────────────────────────────
const projects = [
  { name: "Maison Dorée", tag: "E-commerce Mode", roas: "ROAS ×4.2", color: ["#2a1f00", "#4a3800"] },
  { name: "FitFuel", tag: "Nutrition & Sport", roas: "ROAS ×6.1", color: ["#001a10", "#003020"] },
  { name: "Lumis Cosmetics", tag: "Beauté", roas: "ROAS ×3.8", color: ["#1a0020", "#2d0040"] },
  { name: "Habitat+", tag: "Maison & Déco", roas: "ROAS ×5.0", color: ["#001020", "#002040"] },
]

function PortfolioSection() {
  const [ref, visible] = useInView()
  return (
    <section style={{ background: C.cream, padding: "100px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div variants={stag()} initial="hidden" animate={visible ? "show" : "hidden"} ref={ref}>
          <motion.p variants={fadeUp} style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: C.gold, fontFamily: F, marginBottom: 12 }}>Nos meilleurs projets</motion.p>
          <motion.h2 variants={fadeUp} style={{ fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 400, color: C.black, fontFamily: F, letterSpacing: -1, marginBottom: 56 }}>
            Des résultats concrets,<br />pas juste du beau design.
          </motion.h2>
          <motion.div variants={stag(0.1)} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
            {projects.map((p, i) => (
              <motion.div key={i} variants={fadeUp}
                style={{
                  borderRadius: 16, overflow: "hidden", aspectRatio: "4/3", position: "relative",
                  background: `linear-gradient(145deg, ${p.color[0]}, ${p.color[1]})`,
                  border: `1px solid ${C.border}`,
                }}>
                {/* fake ad preview */}
                <div style={{ position: "absolute", inset: 0, padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ background: C.gold, color: C.white, fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{p.roas}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 400, color: C.white, fontFamily: F }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4, fontFamily: F }}>{p.tag}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── PROCESS ──────────────────────────────────────────────────────────────────
const steps = [
  { n: "01", title: "Brief & stratégie", desc: "On analyse votre marché, vos concurrents et vos audiences cibles pour cadrer la créa." },
  { n: "02", title: "Direction artistique", desc: "On propose 3 directions visuelles différentes — vous choisissez celle qui vous correspond." },
  { n: "03", title: "Production", desc: "Nos designers créent vos ads statiques optimisées pour chaque format Meta." },
  { n: "04", title: "Livraison & itérations", desc: "Fichiers livrés en 14 jours. 2 tours de révisions inclus, satisfaction garantie." },
]

const skills = ["Figma", "Motion Design", "Copy Ads", "Facebook Ads", "A/B Testing", "Creative Strategy", "Brand Identity", "Performance Creative", "UGC", "Hook Testing"]

function ProcessSection() {
  const [ref, visible] = useInView()
  return (
    <section style={{ background: C.cream, padding: "0 24px 100px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ height: 1, background: C.border, marginBottom: 80 }} />
        <motion.div variants={stag()} initial="hidden" animate={visible ? "show" : "hidden"} ref={ref}>
          <motion.p variants={fadeUp} style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: C.gold, fontFamily: F, marginBottom: 12 }}>Notre process</motion.p>
          <motion.h2 variants={fadeUp} style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: C.black, fontFamily: F, letterSpacing: -1, marginBottom: 56, maxWidth: 620 }}>
            Livraison en 14 jours,<br />satisfaction garantie.
          </motion.h2>
          <motion.div variants={stag(0.1)} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 24 }}>
            {steps.map((s, i) => (
              <motion.div key={i} variants={fadeUp} style={{ padding: "28px 24px", background: C.white, borderRadius: 16, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 36, fontWeight: 400, color: C.gold, fontFamily: F, marginBottom: 16 }}>{s.n}</div>
                <div style={{ fontSize: 17, fontWeight: 400, color: C.black, fontFamily: F, marginBottom: 10 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: C.gray, fontFamily: F, lineHeight: 1.6 }}>{s.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <div style={{ marginTop: 60 }}>
        <Marquee items={skills} speed={30} />
      </div>
    </section>
  )
}

// ─── TEAM BENTO ───────────────────────────────────────────────────────────────
const teamMembers = [
  { name: "Alex", role: "Creative Director", color: "#2a1800" },
  { name: "Sofia", role: "Motion Designer", color: "#001520" },
  { name: "Marc", role: "Ads Strategist", color: "#1a0020" },
  { name: "Léa", role: "Copywriter", color: "#001a08" },
]

function TeamSection() {
  const [ref, visible] = useInView()
  return (
    <section style={{ background: C.cream, padding: "0 24px 100px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ height: 1, background: C.border, marginBottom: 80 }} />
        <motion.div ref={ref} variants={stag()} initial="hidden" animate={visible ? "show" : "hidden"}>
          <motion.p variants={fadeUp} style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: C.gold, fontFamily: F, marginBottom: 12 }}>L'équipe</motion.p>
          <motion.h2 variants={fadeUp} style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: C.black, fontFamily: F, letterSpacing: -1, marginBottom: 48 }}>
            Des créatifs obsédés<br />par la performance.
          </motion.h2>
          <motion.div variants={stag(0.08)} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {teamMembers.map((m, i) => (
              <motion.div key={i} variants={fadeUp} style={{
                borderRadius: 16, overflow: "hidden", aspectRatio: "3/4",
                background: `linear-gradient(160deg, ${m.color}, #111)`,
                border: `2px solid ${C.gold}`,
                position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 20,
              }}>
                <div style={{ fontSize: 16, fontWeight: 400, color: C.white, fontFamily: F }}>{m.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontFamily: F, marginTop: 3 }}>{m.role}</div>
              </motion.div>
            ))}
          </motion.div>
          {/* testimonial card */}
          <motion.div variants={fadeUp} style={{
            marginTop: 24, background: C.dark, borderRadius: 16, padding: "36px 40px",
            display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap",
          }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ color: C.gold, fontSize: 24, marginBottom: 16 }}>★★★★★</div>
              <p style={{ fontSize: 18, color: C.white, fontFamily: F, fontWeight: 400, lineHeight: 1.6 }}>
                "Notre ROAS est passé de 2.1 à 6.4 en seulement 3 semaines. Les visuels sont au-dessus de tout ce qu'on avait vu auparavant."
              </p>
              <div style={{ marginTop: 20, fontSize: 14, color: C.grayLight, fontFamily: F }}>— Tristan B., Fondateur Maison Dorée</div>
            </div>
            <div style={{
              flex: "0 0 180px", aspectRatio: "9/16", borderRadius: 12,
              background: "linear-gradient(160deg, #2a1800, #111)", border: `1px solid #333`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(209,163,38,0.2)", border: `2px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill={C.gold}><path d="M6 4l8 5-8 5V4z" /></svg>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const reviews = [
  { name: "Sarah L.", brand: "FitFuel", text: "On a enfin des ads qui ressemblent à notre marque et qui convertissent. Équipe réactive, process carré.", stars: 5 },
  { name: "Julien M.", brand: "Lumis Cosmetics", text: "3 semaines de collaboration et déjà +180% de CTR. Je recommande les yeux fermés.", stars: 5 },
  { name: "Emma C.", brand: "Habitat+", text: "Le rapport qualité-prix est imbattable. On a testé 3 agences avant eux — c'est sans comparaison.", stars: 5 },
  { name: "Pierre D.", brand: "SportEdge", text: "Livraison en 12 jours (même avant le délai prévu) et les visuels déchirent. Top.", stars: 5 },
  { name: "Nadia R.", brand: "BeautyBox", text: "Notre feed Instagram a été complètement transformé. Le ROI est là depuis le premier mois.", stars: 5 },
]

function TestimonialsSection() {
  const [ref, visible] = useInView()
  return (
    <section style={{ background: C.cream, padding: "0 0 100px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: C.border, marginBottom: 80 }} />
        <motion.div ref={ref} variants={stag()} initial="hidden" animate={visible ? "show" : "hidden"}>
          <motion.p variants={fadeUp} style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: C.gold, fontFamily: F, marginBottom: 12 }}>Témoignages</motion.p>
          <motion.h2 variants={fadeUp} style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: C.black, fontFamily: F, letterSpacing: -1, marginBottom: 48 }}>
            Ce qu'ils disent.
          </motion.h2>
        </motion.div>
      </div>
      <div style={{ paddingLeft: 24, overflowX: "auto", display: "flex", gap: 16, scrollbarWidth: "none" }}>
        {reviews.map((r, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: 30 }} animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.6, ease }}
            style={{
              flex: "0 0 300px", background: C.white, borderRadius: 16, padding: "28px 24px",
              border: `1px solid ${C.border}`,
            }}>
            <div style={{ color: C.gold, marginBottom: 14 }}>{"★".repeat(r.stars)}</div>
            <p style={{ fontSize: 15, color: C.black, fontFamily: F, lineHeight: 1.65, fontWeight: 400 }}>"{r.text}"</p>
            <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: C.black, fontFamily: F }}>{r.name}</span>
              <span style={{ fontSize: 12, color: C.gray, fontFamily: F }}>{r.brand}</span>
            </div>
          </motion.div>
        ))}
        <div style={{ flex: "0 0 24px" }} />
      </div>
    </section>
  )
}

// ─── CTA DARK CARD ────────────────────────────────────────────────────────────
const badges = ["Livraison 14 jours", "Révisions illimitées", "Formats Facebook & Instagram", "Stratégie incluse", "Formats Stories & Reels", "Support WhatsApp"]

function CTASection() {
  const [ref, visible] = useInView()
  return (
    <section style={{ background: C.cream, padding: "0 24px 100px" }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }} animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
        style={{
          maxWidth: 1100, margin: "0 auto",
          background: C.dark, borderRadius: 24, padding: "60px 48px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48,
        }}
      >
        <div>
          <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: C.gold, fontFamily: F, marginBottom: 16 }}>Commencer maintenant</div>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 400, color: C.white, fontFamily: F, letterSpacing: -0.8, lineHeight: 1.2, marginBottom: 28 }}>
            Commandez vos ads Meta statiques dès maintenant.
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 36 }}>
            {badges.map((b, i) => (
              <span key={i} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(209,163,38,0.12)", border: `1px solid rgba(209,163,38,0.3)`,
                borderRadius: 8, padding: "6px 12px", fontSize: 13, color: C.gold, fontFamily: F,
              }}>
                <span style={{ fontSize: 10 }}>✓</span> {b}
              </span>
            ))}
          </div>
          <BtnBlack style={{ background: C.gold, border: `1px solid ${C.gold}` }}>Réserver un appel gratuit</BtnBlack>
        </div>

        {/* Calendly-style widget */}
        <div style={{ background: "#111", borderRadius: 16, padding: 28, border: "1px solid #2a2a2a" }}>
          <div style={{ fontSize: 15, color: C.white, fontFamily: F, marginBottom: 20, fontWeight: 400 }}>📅 Choisissez un créneau</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {["Lun 5", "Mar 6", "Mer 7", "Jeu 8", "Ven 9", "Lun 12"].map((d, i) => (
              <button key={i} style={{
                background: i === 2 ? C.gold : "transparent",
                border: `1px solid ${i === 2 ? C.gold : "#333"}`,
                borderRadius: 8, padding: "10px 8px", fontSize: 13,
                color: i === 2 ? C.white : C.grayLight, fontFamily: F, cursor: "pointer",
              }}>{d}</button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginTop: 16 }}>
            {["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"].map((t, i) => (
              <button key={i} style={{
                background: i === 3 ? C.gold : "transparent",
                border: `1px solid ${i === 3 ? C.gold : "#333"}`,
                borderRadius: 8, padding: "9px 8px", fontSize: 13,
                color: i === 3 ? C.white : C.grayLight, fontFamily: F, cursor: "pointer",
              }}>{t}</button>
            ))}
          </div>
          <button style={{
            width: "100%", marginTop: 20, background: C.gold, border: "none",
            borderRadius: 10, padding: "14px", fontSize: 14, color: C.white,
            fontFamily: F, fontWeight: 500, cursor: "pointer", letterSpacing: 0.5,
          }}>Confirmer le rendez-vous →</button>
        </div>
      </motion.div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: C.cream, padding: "0 24px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ background: C.black, borderRadius: 24, padding: "60px 48px 40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 40, marginBottom: 60 }}>
            {/* logo + tagline */}
            <div style={{ flex: "0 0 260px" }}>
              <div style={{ fontSize: 28, fontWeight: 400, color: C.white, fontFamily: F, letterSpacing: -1, marginBottom: 12 }}>
                <span style={{ color: C.gold }}>●</span> Zetsu
              </div>
              <p style={{ fontSize: 14, color: C.grayLight, fontFamily: F, lineHeight: 1.65 }}>
                Agence créative spécialisée en ads statiques Meta. On crée, vous convertissez.
              </p>
            </div>

            {/* nav links */}
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              {[["Agence", ["Manifeste", "Équipe", "Projets"]], ["Services", ["Ads Conversion", "Ads Notoriété", "Packs A/B"]], ["Contact", ["Réserver un appel", "Hello@zetsu.fr", "Instagram"]]].map(([title, links]) => (
                <div key={title}>
                  <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5, color: C.grayLight, fontFamily: F, marginBottom: 16 }}>{title}</div>
                  {links.map(l => (
                    <div key={l} style={{ fontSize: 14, color: "#666", fontFamily: F, marginBottom: 10, cursor: "pointer" }}>{l}</div>
                  ))}
                </div>
              ))}
            </div>

            {/* city clocks */}
            <div style={{ display: "flex", gap: 36 }}>
              <CityTime city="Paris" offset={1} />
              <CityTime city="Dubaï" offset={4} />
              <CityTime city="Toronto" offset={-5} />
            </div>
          </div>

          <div style={{ height: 1, background: "#1f1f1f", marginBottom: 28 }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <span style={{ fontSize: 13, color: "#444", fontFamily: F }}>© 2025 Zetsu. Tous droits réservés.</span>
            <div style={{ display: "flex", gap: 24 }}>
              {["Mentions légales", "Politique de confidentialité", "CGV"].map(l => (
                <span key={l} style={{ fontSize: 13, color: "#444", fontFamily: F, cursor: "pointer" }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return (
    <nav style={{
      position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
      zIndex: 100, width: "calc(100% - 48px)", maxWidth: 1060,
      background: scrolled ? "rgba(255,253,247,0.88)" : "rgba(255,253,247,0.6)",
      backdropFilter: "blur(12px)", borderRadius: 14,
      border: `1px solid ${C.border}`,
      padding: "14px 24px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      transition: "background 0.3s",
    }}>
      <div style={{ fontSize: 18, fontWeight: 400, color: C.black, fontFamily: F, letterSpacing: -0.5 }}>
        <span style={{ color: C.gold }}>●</span> Zetsu
      </div>
      <div style={{ display: "flex", gap: 32 }}>
        {["Services", "Projets", "Process", "Équipe"].map(l => (
          <span key={l} style={{ fontSize: 14, color: C.gray, fontFamily: F, cursor: "pointer", fontWeight: 400 }}>{l}</span>
        ))}
      </div>
      <BtnBlack style={{ padding: "9px 18px", fontSize: 12 }}>Réserver un appel</BtnBlack>
    </nav>
  )
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ fontFamily: F, background: C.cream, minHeight: "100vh" }}>
      <Nav />
      <div style={{ paddingTop: 88 }}>
        <Hero />
        <ServicesSection />
        <PortfolioSection />
        <ProcessSection />
        <TeamSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  )
}
