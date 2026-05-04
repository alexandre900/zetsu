import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"

// ─── Tokens ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#06060C",
  bg2: "#0D0D1A",
  surface: "#10101F",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.14)",
  accent: "#5B4FE8",
  accentMid: "#7B6FFF",
  accentLight: "#A89CFF",
  accentGlow: "rgba(91,79,232,0.22)",
  accentGlow2: "rgba(123,111,255,0.12)",
  text: "#EEEDF8",
  muted: "#6B6A80",
  muted2: "#9998B0",
  white: "#FFFFFF",
  orange: "#FF6B35",
  orangeGlow: "rgba(255,107,53,0.15)",
  green: "#22C55E",
  red: "#EF4444",
}

const F = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"

// ─── Motion helpers ───────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1]
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
}
const stag = (d = 0.1) => ({
  hidden: {},
  show: { transition: { staggerChildren: d } },
})

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Glow({ style }) {
  return <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(90px)", pointerEvents: "none", ...style }} />
}

function Tag({ children, color }) {
  const bg = color === "orange" ? C.orangeGlow : C.accentGlow2
  const text = color === "orange" ? C.orange : C.accentLight
  const border = color === "orange" ? "rgba(255,107,53,0.3)" : "rgba(91,79,232,0.3)"
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 13px", borderRadius: 999,
      background: bg, border: `1px solid ${border}`,
      color: text, fontSize: 12, fontWeight: 600,
      fontFamily: F, letterSpacing: "0.04em", textTransform: "uppercase",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: text, display: "inline-block" }} />
      {children}
    </span>
  )
}

function SectionLabel({ children }) {
  return (
    <motion.div variants={fadeUp} style={{ marginBottom: 20 }}>
      <Tag>{children}</Tag>
    </motion.div>
  )
}

function Heading({ children, style }) {
  return (
    <motion.h2 variants={fadeUp} style={{
      margin: 0, fontFamily: F, fontWeight: 800,
      fontSize: "clamp(28px, 3.5vw, 48px)",
      lineHeight: 1.1, letterSpacing: "-0.025em",
      color: C.text, ...style,
    }}>
      {children}
    </motion.h2>
  )
}

function Grad({ children }) {
  return (
    <span style={{
      background: `linear-gradient(135deg, ${C.accentLight} 0%, ${C.white} 50%, ${C.accentLight} 100%)`,
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
    }}>{children}</span>
  )
}

function Sub({ children, style }) {
  return (
    <motion.p variants={fadeUp} style={{
      margin: 0, fontFamily: F, fontSize: 16, lineHeight: 1.7,
      color: C.muted, ...style,
    }}>{children}</motion.p>
  )
}

function Btn({ children, primary, small, onClick, style }) {
  const [h, setH] = useState(false)
  const base = small ? { padding: "10px 20px", fontSize: 13 } : { padding: "15px 30px", fontSize: 15 }
  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setH(true)} onHoverEnd={() => setH(false)}
      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        borderRadius: 12, fontFamily: F, fontWeight: 600,
        cursor: "pointer", border: "none",
        transition: "box-shadow 0.2s ease",
        ...(primary ? {
          background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentMid} 100%)`,
          color: C.white,
          boxShadow: h ? `0 0 40px rgba(91,79,232,0.5)` : `0 0 24px ${C.accentGlow}`,
        } : {
          background: h ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${C.border}`,
          color: C.text,
        }),
        ...base, ...style,
      }}
    >{children}</motion.button>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [sc, setSc] = useState(false)
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 30)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <motion.nav initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 48px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: sc ? "rgba(6,6,12,0.88)" : "transparent",
        backdropFilter: sc ? "blur(24px)" : "none",
        borderBottom: sc ? `1px solid ${C.border}` : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: `linear-gradient(135deg, ${C.accent}, ${C.accentMid})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 20px ${C.accentGlow}`,
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" />
            <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.6" />
            <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.6" />
            <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" />
          </svg>
        </div>
        <span style={{ fontFamily: F, fontWeight: 700, fontSize: 17, color: C.text, letterSpacing: "-0.01em" }}>
          Adstudio
        </span>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: 32 }}>
        {["Services", "Résultats", "Processus", "Tarifs", "FAQ"].map(l => (
          <NavItem key={l}>{l}</NavItem>
        ))}
      </div>

      {/* CTA */}
      <Btn primary small>Démarrer →</Btn>
    </motion.nav>
  )
}

function NavItem({ children }) {
  const [h, setH] = useState(false)
  return (
    <span onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ fontFamily: F, fontSize: 14, fontWeight: 500, cursor: "pointer",
        color: h ? C.text : C.muted, transition: "color 0.2s" }}>
      {children}
    </span>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      position: "relative", minHeight: "100vh",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "140px 40px 80px", overflow: "hidden",
    }}>
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
        maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 100%)",
      }} />
      <Glow style={{ width: 700, height: 400, top: "0%", left: "50%", transform: "translateX(-50%)",
        background: `radial-gradient(ellipse, ${C.accentGlow} 0%, transparent 65%)` }} />
      <Glow style={{ width: 300, height: 300, top: "20%", left: "10%",
        background: `radial-gradient(circle, rgba(91,79,232,0.08) 0%, transparent 70%)` }} />
      <Glow style={{ width: 300, height: 300, top: "20%", right: "10%",
        background: `radial-gradient(circle, rgba(91,79,232,0.08) 0%, transparent 70%)` }} />

      <motion.div variants={stag(0.1)} initial="hidden" animate="show"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 780, position: "relative", zIndex: 1 }}>

        {/* Social proof pill */}
        <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px",
            borderRadius: 999, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
          }}>
            <div style={{ display: "flex" }}>
              {["#FF6B6B", "#4ECDC4", "#FFE66D", "#A89CFF"].map((col, i) => (
                <div key={i} style={{
                  width: 22, height: 22, borderRadius: "50%", background: col,
                  border: "2px solid #06060C", marginLeft: i > 0 ? -6 : 0,
                  fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center",
                }} />
              ))}
            </div>
            <span style={{ fontFamily: F, fontSize: 13, color: C.muted2 }}>
              <span style={{ color: C.text, fontWeight: 600 }}>+80 marques</span> nous font déjà confiance
            </span>
            <span style={{ color: C.accentLight, fontSize: 13 }}>★★★★★</span>
          </div>
        </motion.div>

        <motion.h1 variants={fadeUp} style={{
          margin: "0 0 24px", fontFamily: F, fontWeight: 900,
          fontSize: "clamp(42px, 6.5vw, 82px)", lineHeight: 1.04,
          letterSpacing: "-0.04em", color: C.text,
        }}>
          Des creatives Meta<br />
          qui <Grad>convertissent vraiment</Grad>
        </motion.h1>

        <Sub style={{ maxWidth: 520, marginBottom: 40 }}>
          On crée des visuels statiques percutants pour vos campagnes Facebook & Instagram.
          Moins de budget brûlé, plus de ventes.
        </Sub>

        <motion.div variants={fadeUp} style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
          <Btn primary>Obtenir mes creatives →</Btn>
          <Btn>Voir les résultats ↓</Btn>
        </motion.div>

        <motion.div variants={fadeUp} style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {[
            { icon: "✓", label: "Livraison en 48h" },
            { icon: "✓", label: "Révisions illimitées" },
            { icon: "✓", label: "Sans abonnement" },
          ].map(({ icon, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: C.green, fontWeight: 700, fontSize: 13 }}>{icon}</span>
              <span style={{ fontFamily: F, fontSize: 13, color: C.muted2 }}>{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Ad mockups floating */}
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease }}
        style={{ marginTop: 72, width: "100%", maxWidth: 960, position: "relative", zIndex: 1 }}>
        <AdsMockup />
      </motion.div>
    </section>
  )
}

function AdsMockup() {
  const formats = [
    { w: 220, h: 280, label: "Feed carré", ratio: "1:1", bg: `linear-gradient(135deg, #1a1040 0%, #2d1b69 100%)`, delay: 0, scale: 1 },
    { w: 200, h: 320, label: "Stories", ratio: "9:16", bg: `linear-gradient(135deg, #0f1f3d 0%, #1e3a5f 100%)`, delay: 0.1, scale: 1.05 },
    { w: 280, h: 280, label: "Feed rectangulaire", ratio: "4:5", bg: `linear-gradient(135deg, #1a0030 0%, #3d0060 100%)`, delay: 0.05, scale: 1.1 },
    { w: 200, h: 320, label: "Reels", ratio: "9:16", bg: `linear-gradient(135deg, #001a1a 0%, #003d3d 100%)`, delay: 0.15, scale: 1.05 },
    { w: 220, h: 280, label: "Feed carré", ratio: "1:1", bg: `linear-gradient(135deg, #1f1a00 0%, #4a3800 100%)`, delay: 0.2, scale: 1 },
  ]

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-end", justifyContent: "center" }}>
      {formats.map((f, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + f.delay, duration: 0.7, ease }}
          whileHover={{ y: -8, scale: 1.02 }}
          style={{
            width: f.w, height: f.h,
            borderRadius: 16,
            background: f.bg,
            border: `1px solid rgba(255,255,255,0.08)`,
            position: "relative", overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            transform: `scale(${f.scale})`,
            cursor: "default",
            flexShrink: 0,
          }}>
          {/* Fake ad content */}
          <div style={{ position: "absolute", inset: 0, padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.15)" }} />
              <div style={{ padding: "3px 8px", borderRadius: 6, background: "rgba(255,255,255,0.1)", fontSize: 9, color: "rgba(255,255,255,0.6)", fontFamily: F }}>
                SPONSORISÉ
              </div>
            </div>
            <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
              width: "70%", height: "40%", borderRadius: 12,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
            <div>
              <div style={{ height: 8, background: "rgba(255,255,255,0.3)", borderRadius: 4, marginBottom: 6, width: "85%" }} />
              <div style={{ height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 4, marginBottom: 12, width: "65%" }} />
              <div style={{ height: 28, background: `linear-gradient(135deg, ${C.accent}, ${C.accentMid})`, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ height: 5, width: "50%", background: "rgba(255,255,255,0.8)", borderRadius: 3 }} />
              </div>
            </div>
          </div>
          {/* Ratio badge */}
          <div style={{
            position: "absolute", top: 8, right: 8, padding: "2px 7px",
            background: "rgba(0,0,0,0.5)", borderRadius: 6,
            fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: F, fontWeight: 600,
          }}>{f.ratio}</div>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Logos / Social proof ─────────────────────────────────────────────────────
function LogosSection() {
  const logos = ["Shopify", "WooCommerce", "PrestaShop", "BigCommerce", "Squarespace", "Wix"]
  return (
    <section style={{ padding: "40px 40px 80px", position: "relative" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontFamily: F, fontSize: 12, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 32 }}>
          Compatible avec toutes les plateformes e-commerce
        </p>
        <div style={{ display: "flex", gap: 0, alignItems: "center", justifyContent: "center",
          borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
          {logos.map((logo, i) => (
            <div key={logo} style={{
              flex: 1, padding: "20px 16px", textAlign: "center",
              borderRight: i < logos.length - 1 ? `1px solid ${C.border}` : "none",
              fontFamily: F, fontSize: 13, fontWeight: 600, color: C.muted,
              letterSpacing: "0.02em",
            }}>{logo}</div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function StatsSection() {
  const [ref, vis] = useInView(0.3)
  const stats = [
    { val: "3.8×", label: "ROAS moyen constaté", sub: "sur nos creatives vs avant" },
    { val: "-42%", label: "Coût par clic", sub: "réduction moyenne du CPC" },
    { val: "+127%", label: "Taux de clic", sub: "amélioration du CTR" },
    { val: "48h", label: "Délai de livraison", sub: "garanti sur chaque commande" },
  ]
  return (
    <section ref={ref} style={{ padding: "0 40px 80px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          background: C.surface, borderRadius: 24, border: `1px solid ${C.border}`,
          overflow: "hidden", position: "relative",
        }}>
          <Glow style={{ width: 500, height: 200, bottom: -100, left: "50%", transform: "translateX(-50%)",
            background: `radial-gradient(ellipse, ${C.accentGlow} 0%, transparent 70%)` }} />
          <motion.div variants={stag(0.1)} initial="hidden" animate={vis ? "show" : "hidden"} style={{ display: "contents" }}>
            {stats.map((s, i) => (
              <motion.div key={i} variants={fadeUp} style={{
                padding: "48px 32px", textAlign: "center",
                borderRight: i < stats.length - 1 ? `1px solid ${C.border}` : "none",
                position: "relative",
              }}>
                <div style={{
                  fontFamily: F, fontWeight: 900, fontSize: 44, letterSpacing: "-0.03em",
                  background: `linear-gradient(135deg, ${C.white}, ${C.accentLight})`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  marginBottom: 8,
                }}>{s.val}</div>
                <div style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: F, fontSize: 12, color: C.muted }}>{s.sub}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Services ─────────────────────────────────────────────────────────────────
function ServicesSection() {
  const [ref, vis] = useInView()
  const services = [
    { icon: "◼", title: "Creatives statiques", desc: "Visuels optimisés pour le feed Facebook & Instagram. Formats 1:1, 4:5, 1.91:1. Texte accrocheur, hiérarchie visuelle claire.", tag: "Core" },
    { icon: "▦", title: "Pack Stories & Reels", desc: "Formats verticaux 9:16 pensés pour l'attention mobile. Urgence, offre visible en 0.5 seconde.", tag: "Populaire" },
    { icon: "◈", title: "A/B Testing visuel", desc: "Plusieurs versions d'un même creative pour identifier ce qui performe. Angles différents, CTA variés.", tag: "Pro" },
    { icon: "◉", title: "Audit de vos creatives", desc: "On analyse vos visuels actuels et on vous dit exactement pourquoi ils ne convertissent pas.", tag: "Diagnostic" },
    { icon: "▣", title: "Copywriting intégré", desc: "Accroche, corps et CTA rédigés par nos experts. Un visuel sans bonne copy ne vend pas.", tag: "Core" },
    { icon: "◐", title: "Livraison en source", desc: "Fichiers Figma éditables livrés avec chaque commande. Modifiez vous-même en cas de besoin.", tag: "Inclus" },
  ]
  return (
    <section ref={ref} style={{ padding: "80px 40px" }}>
      <motion.div variants={stag(0.08)} initial="hidden" animate={vis ? "show" : "hidden"}
        style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 60 }}>
          <SectionLabel>Services</SectionLabel>
          <Heading style={{ marginBottom: 16 }}>Tout ce qu'il faut pour<br /><Grad>des ads qui vendent</Grad></Heading>
          <Sub style={{ maxWidth: 480 }}>Des creatives pensées performance, pas juste pour être belles.</Sub>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {services.map((s, i) => <ServiceCard key={i} {...s} />)}
        </div>
      </motion.div>
    </section>
  )
}

function ServiceCard({ icon, title, desc, tag }) {
  const [h, setH] = useState(false)
  return (
    <motion.div variants={fadeUp}
      onHoverStart={() => setH(true)} onHoverEnd={() => setH(false)}
      style={{
        padding: "36px 32px", position: "relative", overflow: "hidden",
        background: h ? "rgba(91,79,232,0.04)" : "transparent",
        border: `1px solid ${h ? "rgba(91,79,232,0.2)" : C.border}`,
        transition: "all 0.3s ease", cursor: "default",
      }}>
      {h && <Glow style={{ width: 200, height: 150, top: -50, left: -50,
        background: `radial-gradient(circle, ${C.accentGlow2} 0%, transparent 70%)` }} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <span style={{ fontSize: 24, color: C.accentMid }}>{icon}</span>
        <Tag small>{tag}</Tag>
      </div>
      <h3 style={{ margin: "0 0 10px", fontFamily: F, fontSize: 17, fontWeight: 700, color: C.text }}>{title}</h3>
      <p style={{ margin: 0, fontFamily: F, fontSize: 14, lineHeight: 1.65, color: C.muted }}>{desc}</p>
    </motion.div>
  )
}

// ─── Process ──────────────────────────────────────────────────────────────────
function ProcessSection() {
  const [ref, vis] = useInView()
  const steps = [
    { n: "01", title: "Brief en 5 min", desc: "Vous remplissez un formulaire simple : offre, cible, ton, références visuelles." },
    { n: "02", title: "Stratégie créative", desc: "On identifie l'angle d'attaque qui résonne avec votre audience et votre offre." },
    { n: "03", title: "Design & Copy", desc: "Nos designers créent vos visuels avec un copywriting intégré pensé pour convertir." },
    { n: "04", title: "Livraison en 48h", desc: "Vous recevez vos creatives en fichiers prêts à lancer dans Meta Ads Manager." },
  ]
  return (
    <section ref={ref} style={{ padding: "80px 40px", background: C.bg2, position: "relative", overflow: "hidden" }}>
      <Glow style={{ width: 600, height: 400, top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        background: `radial-gradient(ellipse, rgba(91,79,232,0.06) 0%, transparent 70%)` }} />
      <motion.div variants={stag(0.12)} initial="hidden" animate={vis ? "show" : "hidden"}
        style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <SectionLabel>Processus</SectionLabel>
          <Heading style={{ marginBottom: 16 }}>Simple, rapide,<br /><Grad>sans prise de tête</Grad></Heading>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, position: "relative" }}>
          {/* Connector line */}
          <div style={{ position: "absolute", top: 36, left: "12.5%", right: "12.5%", height: 1,
            background: `linear-gradient(90deg, transparent, ${C.border}, ${C.accent}, ${C.border}, transparent)` }} />
          {steps.map((s, i) => (
            <motion.div key={i} variants={fadeUp} style={{ padding: "0 24px", textAlign: "center", position: "relative" }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%", margin: "0 auto 28px",
                background: `linear-gradient(135deg, ${C.surface}, ${C.bg2})`,
                border: `1px solid ${C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: F, fontSize: 13, fontWeight: 800, color: C.accentLight,
                letterSpacing: "0.05em", position: "relative", zIndex: 1,
              }}>{s.n}</div>
              <h3 style={{ margin: "0 0 10px", fontFamily: F, fontSize: 16, fontWeight: 700, color: C.text }}>{s.title}</h3>
              <p style={{ margin: 0, fontFamily: F, fontSize: 14, lineHeight: 1.65, color: C.muted }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

// ─── Before / After ───────────────────────────────────────────────────────────
function BeforeAfterSection() {
  const [ref, vis] = useInView()
  return (
    <section ref={ref} style={{ padding: "80px 40px" }}>
      <motion.div variants={stag(0.1)} initial="hidden" animate={vis ? "show" : "hidden"}
        style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <SectionLabel>Résultats</SectionLabel>
          <Heading style={{ marginBottom: 16 }}>Avant vs Après :<br /><Grad>la différence est visible</Grad></Heading>
          <Sub>Résultats réels de nos clients sur des comptes Meta Ads actifs.</Sub>
        </div>
        <motion.div variants={fadeUp} style={{
          background: C.surface, borderRadius: 24, border: `1px solid ${C.border}`,
          overflow: "hidden", position: "relative",
        }}>
          <Glow style={{ width: 400, height: 300, top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            background: `radial-gradient(ellipse, ${C.accentGlow} 0%, transparent 70%)` }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", position: "relative", zIndex: 1 }}>
            {/* Before */}
            <div style={{ padding: "48px", borderRight: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.red }} />
                <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.muted, letterSpacing: "0.05em", textTransform: "uppercase" }}>Avant nos creatives</span>
              </div>
              {[
                { label: "CTR moyen", val: "0.8%", color: C.red },
                { label: "CPC", val: "€2.40", color: C.red },
                { label: "ROAS", val: "1.4×", color: C.red },
                { label: "Taux de conversion", val: "1.2%", color: C.red },
              ].map(m => <Metric key={m.label} {...m} bad />)}
            </div>
            {/* After */}
            <div style={{ padding: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.green }} />
                <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.muted, letterSpacing: "0.05em", textTransform: "uppercase" }}>Après nos creatives</span>
              </div>
              {[
                { label: "CTR moyen", val: "3.1%", color: C.green, delta: "+287%" },
                { label: "CPC", val: "€1.10", color: C.green, delta: "-54%" },
                { label: "ROAS", val: "3.8×", color: C.green, delta: "+171%" },
                { label: "Taux de conversion", val: "3.8%", color: C.green, delta: "+217%" },
              ].map(m => <Metric key={m.label} {...m} />)}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function Metric({ label, val, color, bad, delta }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
      <span style={{ fontFamily: F, fontSize: 14, color: C.muted }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {delta && <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: C.green,
          background: "rgba(34,197,94,0.1)", padding: "2px 7px", borderRadius: 6 }}>{delta}</span>}
        <span style={{ fontFamily: F, fontSize: 18, fontWeight: 800, color }}>{val}</span>
      </div>
    </div>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function TestimonialsSection() {
  const [ref, vis] = useInView()
  const testimonials = [
    {
      quote: "On a multiplié notre ROAS par 2.6 en seulement 3 semaines. Leurs creatives captent l'attention là où les nôtres passaient inaperçues.",
      name: "Thomas L.", role: "Fondateur, marque de mode streetwear", avatar: "TL", ac: "#7C6BFF",
    },
    {
      quote: "48h de délai, résultats le lendemain du lancement. Notre coût par acquisition a chuté de 38%. Je ne ferai plus mes creatives en interne.",
      name: "Camille R.", role: "Directrice Marketing, e-commerce beauté", avatar: "CR", ac: "#FF6B6B",
    },
    {
      quote: "L'audit seul valait l'investissement. Ils ont identifié en 10 minutes pourquoi nos ads ne convertissaient pas depuis 6 mois.",
      name: "Julien M.", role: "CEO, agence dropshipping", avatar: "JM", ac: "#4ECDC4",
    },
  ]
  return (
    <section ref={ref} style={{ padding: "80px 40px", background: C.bg2, position: "relative", overflow: "hidden" }}>
      <Glow style={{ width: 500, height: 300, top: 0, left: "50%", transform: "translateX(-50%)",
        background: `radial-gradient(ellipse, rgba(91,79,232,0.08) 0%, transparent 70%)` }} />
      <motion.div variants={stag(0.1)} initial="hidden" animate={vis ? "show" : "hidden"}
        style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <SectionLabel>Témoignages</SectionLabel>
          <Heading style={{ marginBottom: 16 }}>Ce que disent<br /><Grad>nos clients</Grad></Heading>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={fadeUp} style={{
              background: C.surface, borderRadius: 20, padding: "32px",
              border: `1px solid ${C.border}`,
            }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 20 }}>
                {[...Array(5)].map((_, j) => (
                  <span key={j} style={{ color: "#FFB800", fontSize: 14 }}>★</span>
                ))}
              </div>
              <p style={{ margin: "0 0 28px", fontFamily: F, fontSize: 15, lineHeight: 1.7, color: C.text }}>
                "{t.quote}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: t.ac,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: F, fontSize: 12, fontWeight: 700, color: "white" }}>{t.avatar}</div>
                <div>
                  <div style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: C.text }}>{t.name}</div>
                  <div style={{ fontFamily: F, fontSize: 12, color: C.muted }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
function PricingSection() {
  const [ref, vis] = useInView()
  const [annual, setAnnual] = useState(false)
  const plans = [
    {
      name: "Starter", price: "297", desc: "Pour tester et lancer vos premières campagnes.",
      features: ["5 creatives statiques", "2 formats au choix", "1 révision", "Livraison 72h", "Fichiers PNG/JPG"],
      cta: "Commencer",
    },
    {
      name: "Growth", price: "697", desc: "Pour les marques qui veulent scaler leurs résultats.", popular: true,
      features: ["15 creatives statiques", "Tous les formats Meta", "3 révisions", "Livraison 48h", "Fichiers Figma éditables", "Copywriting inclus", "1 A/B test visuel"],
      cta: "Commencer →",
    },
    {
      name: "Scale", price: "1497", desc: "Pour les équipes qui ont besoin d'une machine à creatives.",
      features: ["40 creatives statiques", "Tous formats + Stories", "Révisions illimitées", "Livraison 48h", "Fichiers Figma éditables", "Copywriting premium", "3 A/B tests visuels", "Audit de compte inclus", "Manager dédié"],
      cta: "Nous contacter",
    },
  ]
  return (
    <section ref={ref} style={{ padding: "80px 40px", position: "relative" }}>
      <Glow style={{ width: 600, height: 400, top: "20%", left: "50%", transform: "translateX(-50%)",
        background: `radial-gradient(ellipse, ${C.accentGlow} 0%, transparent 70%)` }} />
      <motion.div variants={stag(0.1)} initial="hidden" animate={vis ? "show" : "hidden"}
        style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <SectionLabel>Tarifs</SectionLabel>
          <Heading style={{ marginBottom: 16 }}>Investissement clair,<br /><Grad>retour mesurable</Grad></Heading>
          <Sub>Sans abonnement caché. Vous payez, on livre.</Sub>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, alignItems: "start" }}>
          {plans.map((p, i) => <PricingCard key={i} {...p} />)}
        </div>
        <motion.p variants={fadeUp} style={{ textAlign: "center", marginTop: 32,
          fontFamily: F, fontSize: 13, color: C.muted }}>
          💳 Paiement sécurisé · Satisfait ou remboursé sous 7 jours · Facture disponible
        </motion.p>
      </motion.div>
    </section>
  )
}

function PricingCard({ name, price, desc, features, cta, popular }) {
  return (
    <motion.div variants={fadeUp} style={{
      borderRadius: 20, border: `1px solid ${popular ? C.accentMid : C.border}`,
      background: popular ? `linear-gradient(160deg, rgba(91,79,232,0.08) 0%, ${C.surface} 100%)` : C.surface,
      padding: popular ? "40px 32px" : "32px",
      position: "relative", overflow: "hidden",
      boxShadow: popular ? `0 0 60px ${C.accentGlow}` : "none",
      transform: popular ? "scale(1.03)" : "scale(1)",
    }}>
      {popular && (
        <div style={{ position: "absolute", top: 16, right: 16 }}>
          <Tag color="orange">Le plus choisi</Tag>
        </div>
      )}
      {popular && <Glow style={{ width: 200, height: 150, top: -50, left: "50%", transform: "translateX(-50%)",
        background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 70%)` }} />}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 12,
          letterSpacing: "0.05em", textTransform: "uppercase" }}>{name}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
          <span style={{ fontFamily: F, fontSize: 42, fontWeight: 900, color: C.text, letterSpacing: "-0.03em" }}>€{price}</span>
        </div>
        <p style={{ fontFamily: F, fontSize: 14, color: C.muted, marginBottom: 28, lineHeight: 1.5 }}>{desc}</p>
        <div style={{ height: 1, background: C.border, marginBottom: 24 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {features.map(f => (
            <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: C.green, fontSize: 13, marginTop: 1, flexShrink: 0 }}>✓</span>
              <span style={{ fontFamily: F, fontSize: 14, color: C.muted2 }}>{f}</span>
            </div>
          ))}
        </div>
        <Btn primary={popular} style={{ width: "100%", justifyContent: "center" }}>{cta}</Btn>
      </div>
    </motion.div>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQSection() {
  const [ref, vis] = useInView()
  const [open, setOpen] = useState(null)
  const faqs = [
    { q: "Quel type de creatives créez-vous ?", a: "Uniquement des visuels statiques optimisés pour Meta Ads (Facebook & Instagram). Pas de vidéo ni de GIF — nous sommes spécialisés dans le format statique haute performance : plus rapide à produire, plus simple à tester, et souvent plus efficace pour la conversion directe." },
    { q: "Combien de temps pour recevoir mes creatives ?", a: "48 heures ouvrées à partir de la validation de votre brief. Pour le plan Starter, comptez 72h. Nous garantissons ces délais dans nos CGV." },
    { q: "Que se passe-t-il si je ne suis pas satisfait ?", a: "Vous avez droit à des révisions (1 sur Starter, 3 sur Growth, illimitées sur Scale). Si après révisions le résultat ne vous convient pas, nous remboursons intégralement sous 7 jours." },
    { q: "Faut-il me fournir des éléments graphiques ?", a: "Idéalement oui : logo en vectoriel, photos produits, charte graphique. Si vous n'avez rien, nous travaillons avec des visuels de stock premium et vos couleurs de marque." },
    { q: "Vous occupez-vous de la mise en ligne des ads ?", a: "Non, nous livrons uniquement les creatives. Vous les mettez en ligne vous-même dans Meta Ads Manager. Si vous avez besoin d'accompagnement media buying, nous pouvons vous recommander des partenaires." },
    { q: "Puis-je commander un seul visuel ?", a: "Nos packs démarrent à 5 creatives minimum (Starter). Tester sur un seul visuel n'est pas représentatif — la performance vient de l'itération et du volume." },
  ]
  return (
    <section ref={ref} style={{ padding: "80px 40px", background: C.bg2 }}>
      <motion.div variants={stag(0.08)} initial="hidden" animate={vis ? "show" : "hidden"}
        style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <SectionLabel>FAQ</SectionLabel>
          <Heading>Questions fréquentes</Heading>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {faqs.map((faq, i) => (
            <FAQItem key={i} {...faq} isOpen={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function FAQItem({ q, a, isOpen, onToggle }) {
  return (
    <motion.div variants={fadeUp} style={{ borderRadius: 12, overflow: "hidden",
      background: isOpen ? C.surface : "transparent", border: `1px solid ${isOpen ? C.border : "transparent"}`,
      transition: "all 0.2s ease" }}>
      <button onClick={onToggle} style={{
        width: "100%", padding: "20px 24px", background: "transparent", border: "none",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        cursor: "pointer", textAlign: "left",
      }}>
        <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: C.text }}>{q}</span>
        <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}
          style={{ fontSize: 20, color: C.accentLight, flexShrink: 0, marginLeft: 16 }}>+</motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease }}>
            <div style={{ padding: "0 24px 20px" }}>
              <p style={{ margin: 0, fontFamily: F, fontSize: 14, lineHeight: 1.7, color: C.muted }}>{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── CTA Final ────────────────────────────────────────────────────────────────
function CTASection() {
  const [ref, vis] = useInView(0.3)
  return (
    <section ref={ref} style={{ padding: "80px 40px 120px", position: "relative", overflow: "hidden" }}>
      <Glow style={{ width: 700, height: 500, top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        background: `radial-gradient(ellipse, ${C.accentGlow} 0%, transparent 65%)` }} />
      <motion.div variants={stag(0.1)} initial="hidden" animate={vis ? "show" : "hidden"}
        style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <SectionLabel>Prêt à démarrer ?</SectionLabel>
        <Heading style={{ fontSize: "clamp(36px, 5vw, 64px)", marginBottom: 20 }}>
          Vos prochaines ads<br /><Grad>méritent mieux.</Grad>
        </Heading>
        <Sub style={{ marginBottom: 40, fontSize: 17 }}>
          Rejoignez les marques qui ont arrêté de brûler leur budget Meta sur des creatives qui ne convertissent pas.
        </Sub>
        <motion.div variants={fadeUp} style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn primary>Lancer ma commande →</Btn>
          <Btn>Voir les tarifs</Btn>
        </motion.div>
        <motion.p variants={fadeUp} style={{ marginTop: 20, fontFamily: F, fontSize: 13, color: C.muted }}>
          Livraison en 48h · Satisfait ou remboursé · Sans engagement
        </motion.p>
      </motion.div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const cols = {
    Services: ["Creatives statiques", "Pack Stories", "A/B Testing", "Audit de compte"],
    Ressources: ["Blog", "Cas clients", "Guide Meta Ads", "FAQ"],
    Légal: ["Mentions légales", "CGV", "Politique de confidentialité"],
  }
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, padding: "60px 48px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 60 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10,
                background: `linear-gradient(135deg, ${C.accent}, ${C.accentMid})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 16px ${C.accentGlow}` }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" />
                  <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.6" />
                  <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.6" />
                  <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" />
                </svg>
              </div>
              <span style={{ fontFamily: F, fontWeight: 700, fontSize: 17, color: C.text }}>Adstudio</span>
            </div>
            <p style={{ fontFamily: F, fontSize: 14, lineHeight: 1.65, color: C.muted, maxWidth: 260, marginBottom: 20 }}>
              L'agence spécialisée en creatives statiques Meta qui propulsent vos campagnes Facebook & Instagram.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {["f", "in", "𝕏"].map(s => (
                <div key={s} style={{ width: 34, height: 34, borderRadius: 8,
                  background: C.surface, border: `1px solid ${C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: F, fontSize: 12, fontWeight: 700, color: C.muted, cursor: "pointer" }}>{s}</div>
              ))}
            </div>
          </div>
          {Object.entries(cols).map(([cat, items]) => (
            <div key={cat}>
              <div style={{ fontFamily: F, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: C.muted, marginBottom: 20 }}>{cat}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {items.map(item => (
                  <span key={item} style={{ fontFamily: F, fontSize: 14, color: C.muted, cursor: "pointer",
                    transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = C.muted2}
                    onMouseLeave={e => e.target.style.color = C.muted}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ paddingTop: 28, borderTop: `1px solid ${C.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: F, fontSize: 13, color: C.muted }}>
            © 2026 Adstudio. Tous droits réservés.
          </span>
          <span style={{ fontFamily: F, fontSize: 13, color: C.muted }}>
            Fait avec ♥ pour les marques qui veulent performer.
          </span>
        </div>
      </div>
    </footer>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, overflowX: "hidden" }}>
      <Navbar />
      <Hero />
      <LogosSection />
      <StatsSection />
      <ServicesSection />
      <ProcessSection />
      <BeforeAfterSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  )
}
