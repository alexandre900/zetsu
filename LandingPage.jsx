import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"

// ─── Design Tokens ───────────────────────────────────────────────────────────
const colors = {
  bg: "#0A0A0F",
  surface: "#111118",
  border: "rgba(255,255,255,0.07)",
  accent: "#7C6BFF",
  accentLight: "#A89CFF",
  accentGlow: "rgba(124,107,255,0.25)",
  text: "#F0EFF8",
  muted: "#7B7A8E",
  white: "#FFFFFF",
}

const font = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"

// ─── Reusable Animations ─────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = (delay = 0.08) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
})

// ─── Sub-components ──────────────────────────────────────────────────────────

function Pill({ children }) {
  return (
    <motion.span
      variants={fadeUp}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 14px",
        borderRadius: 999,
        background: "rgba(124,107,255,0.12)",
        border: `1px solid rgba(124,107,255,0.3)`,
        color: colors.accentLight,
        fontSize: 13,
        fontWeight: 500,
        fontFamily: font,
        letterSpacing: "0.02em",
        marginBottom: 24,
      }}
    >
      <span style={{ fontSize: 10 }}>●</span>
      {children}
    </motion.span>
  )
}

function GradientText({ children, style }) {
  return (
    <span
      style={{
        background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.accentLight} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        ...style,
      }}
    >
      {children}
    </span>
  )
}

function Button({ children, primary, onClick, style }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: primary ? "14px 28px" : "13px 27px",
        borderRadius: 12,
        border: primary ? "none" : `1px solid ${colors.border}`,
        background: primary
          ? `linear-gradient(135deg, ${colors.accent} 0%, #9B8BFF 100%)`
          : hovered
          ? "rgba(255,255,255,0.05)"
          : "rgba(255,255,255,0.02)",
        color: colors.white,
        fontSize: 15,
        fontWeight: 600,
        fontFamily: font,
        cursor: "pointer",
        transition: "background 0.2s ease",
        boxShadow: primary ? `0 0 32px ${colors.accentGlow}` : "none",
        ...style,
      }}
    >
      {children}
    </motion.button>
  )
}

function FeatureCard({ icon, title, description, delay = 0 }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(124,107,255,0.06)" : colors.surface,
        border: `1px solid ${hovered ? "rgba(124,107,255,0.25)" : colors.border}`,
        borderRadius: 20,
        padding: 32,
        transition: "all 0.3s ease",
        cursor: "default",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: "rgba(124,107,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          marginBottom: 20,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          margin: "0 0 10px",
          fontSize: 18,
          fontWeight: 600,
          color: colors.text,
          fontFamily: font,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: 15,
          lineHeight: 1.65,
          color: colors.muted,
          fontFamily: font,
        }}
      >
        {description}
      </p>
    </motion.div>
  )
}

function StatCard({ value, label }) {
  return (
    <motion.div variants={fadeUp} style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: 40,
          fontWeight: 800,
          fontFamily: font,
          background: `linear-gradient(135deg, ${colors.white}, ${colors.accentLight})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: 6,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 15, color: colors.muted, fontFamily: font }}>{label}</div>
    </motion.div>
  )
}

function NavLink({ children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: hovered ? colors.text : colors.muted,
        fontSize: 14,
        fontWeight: 500,
        fontFamily: font,
        cursor: "pointer",
        transition: "color 0.2s ease",
      }}
    >
      {children}
    </span>
  )
}

function GridBackground() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        pointerEvents: "none",
      }}
    />
  )
}

function GlowOrb({ style }) {
  return (
    <div
      style={{
        position: "absolute",
        borderRadius: "50%",
        filter: "blur(80px)",
        pointerEvents: "none",
        ...style,
      }}
    />
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 40px",
        height: 68,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(10,10,15,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${colors.border}` : "1px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: `linear-gradient(135deg, ${colors.accent}, #9B8BFF)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 800,
            color: "white",
            fontFamily: font,
          }}
        >
          Z
        </div>
        <span
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: colors.text,
            fontFamily: font,
            letterSpacing: "-0.01em",
          }}
        >
          Zetsu
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        {["Product", "Features", "Pricing", "Docs"].map((link) => (
          <NavLink key={link}>{link}</NavLink>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Button style={{ padding: "10px 20px", fontSize: 14 }}>Log in</Button>
        <Button primary style={{ padding: "10px 20px", fontSize: 14 }}>
          Get started →
        </Button>
      </div>
    </motion.nav>
  )
}

function HeroSection() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "120px 40px 80px",
        overflow: "hidden",
      }}
    >
      <GridBackground />
      <GlowOrb
        style={{
          width: 600,
          height: 400,
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          background: `radial-gradient(circle, ${colors.accentGlow} 0%, transparent 70%)`,
        }}
      />

      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        animate="show"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 760,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Pill>Introducing Zetsu 1.0</Pill>

        <motion.h1
          variants={fadeUp}
          style={{
            margin: "0 0 24px",
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: colors.text,
            fontFamily: font,
          }}
        >
          Build faster,
          <br />
          <GradientText>ship smarter.</GradientText>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          style={{
            margin: "0 0 40px",
            fontSize: 18,
            lineHeight: 1.7,
            color: colors.muted,
            fontFamily: font,
            maxWidth: 520,
          }}
        >
          Zetsu streamlines your entire workflow — from idea to production — with AI-powered tools
          built for modern teams.
        </motion.p>

        <motion.div variants={fadeUp} style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Button primary>Start for free →</Button>
          <Button>Watch demo ▶</Button>
        </motion.div>

        <motion.p
          variants={fadeUp}
          style={{
            marginTop: 20,
            fontSize: 13,
            color: colors.muted,
            fontFamily: font,
          }}
        >
          No credit card required · Free plan forever
        </motion.p>
      </motion.div>

      {/* Hero visual */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          marginTop: 80,
          width: "100%",
          maxWidth: 900,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: 20,
            padding: 2,
            boxShadow: `0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)`,
          }}
        >
          <div
            style={{
              background: "#0D0D14",
              borderRadius: 18,
              height: 380,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Fake UI mockup */}
            <div style={{ position: "absolute", inset: 0, padding: 24 }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                {["#FF5F57", "#FFBD2E", "#28CA41"].map((c) => (
                  <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20, height: "calc(100% - 40px)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[80, 65, 90, 55, 75].map((w, i) => (
                    <div
                      key={i}
                      style={{
                        height: 28,
                        width: `${w}%`,
                        background: i === 1 ? `rgba(124,107,255,0.25)` : "rgba(255,255,255,0.04)",
                        borderRadius: 8,
                        border: i === 1 ? `1px solid rgba(124,107,255,0.3)` : "none",
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[1, 2, 3].map((row) => (
                    <div key={row} style={{ display: "flex", gap: 12 }}>
                      {[1, 2, 3].map((col) => (
                        <div
                          key={col}
                          style={{
                            flex: 1,
                            height: 80,
                            background: "rgba(255,255,255,0.03)",
                            borderRadius: 12,
                            border: `1px solid ${colors.border}`,
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <GlowOrb
              style={{
                width: 300,
                height: 200,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(circle, rgba(124,107,255,0.08) 0%, transparent 70%)`,
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function StatsSection() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} style={{ padding: "80px 40px", position: "relative" }}>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 24,
          padding: "60px 40px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 40,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <GlowOrb
          style={{
            width: 400,
            height: 200,
            bottom: -100,
            left: "50%",
            transform: "translateX(-50%)",
            background: `radial-gradient(circle, ${colors.accentGlow} 0%, transparent 70%)`,
          }}
        />
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          animate={visible ? "show" : "hidden"}
          style={{ display: "contents" }}
        >
          <StatCard value="50K+" label="Active teams" />
          <StatCard value="99.9%" label="Uptime SLA" />
          <StatCard value="10x" label="Faster shipping" />
          <StatCard value="4.9★" label="User rating" />
        </motion.div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: "⚡",
      title: "Lightning fast",
      description: "Built on an edge-first architecture. Your workflows execute in milliseconds, not seconds.",
    },
    {
      icon: "🧠",
      title: "AI-powered",
      description: "Intelligent suggestions that learn your team's patterns and automate repetitive work.",
    },
    {
      icon: "🔒",
      title: "Enterprise security",
      description: "SOC 2 Type II certified with end-to-end encryption and granular access controls.",
    },
    {
      icon: "🔗",
      title: "100+ integrations",
      description: "Connect with the tools you already use — GitHub, Slack, Figma, Notion, and more.",
    },
    {
      icon: "📊",
      title: "Real-time analytics",
      description: "Deep insights into your team's performance with customizable dashboards and reports.",
    },
    {
      icon: "🌐",
      title: "Global scale",
      description: "Deployed across 30+ regions worldwide for maximum performance wherever you are.",
    },
  ]

  return (
    <section ref={ref} style={{ padding: "80px 40px" }}>
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        animate={visible ? "show" : "hidden"}
        style={{ maxWidth: 1100, margin: "0 auto" }}
      >
        <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 60 }}>
          <Pill>Features</Pill>
          <h2
            style={{
              margin: "16px 0 16px",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              color: colors.text,
              fontFamily: font,
            }}
          >
            Everything your team needs
          </h2>
          <p style={{ margin: 0, fontSize: 17, color: colors.muted, fontFamily: font }}>
            One platform to plan, build, and ship — without the chaos.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 0.05} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function TestimonialsSection() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.2 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const testimonials = [
    {
      quote: "Zetsu cut our release cycle from 2 weeks to 3 days. It's become the backbone of our entire engineering process.",
      name: "Sarah Chen",
      role: "VP of Engineering, Vercel",
      avatar: "SC",
      avatarColor: "#7C6BFF",
    },
    {
      quote: "The AI features alone are worth 10x the price. It's like having a senior engineer reviewing every PR.",
      name: "Marcus Dupont",
      role: "CTO, Linear",
      avatar: "MD",
      avatarColor: "#FF6B6B",
    },
    {
      quote: "We've tried everything. Zetsu is the first tool that actually gets out of the way and lets us focus on building.",
      name: "Priya Nair",
      role: "Lead Developer, Stripe",
      avatar: "PN",
      avatarColor: "#4ECDC4",
    },
  ]

  return (
    <section ref={ref} style={{ padding: "80px 40px" }}>
      <motion.div
        variants={stagger(0.12)}
        initial="hidden"
        animate={visible ? "show" : "hidden"}
        style={{ maxWidth: 1100, margin: "0 auto" }}
      >
        <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 60 }}>
          <Pill>Testimonials</Pill>
          <h2
            style={{
              margin: "16px 0 0",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              color: colors.text,
              fontFamily: font,
            }}
          >
            Loved by builders worldwide
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: 32,
              }}
            >
              <div style={{ marginBottom: 20, fontSize: 22, color: colors.accent }}>❝</div>
              <p
                style={{
                  margin: "0 0 24px",
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: colors.text,
                  fontFamily: font,
                }}
              >
                {t.quote}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: t.avatarColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "white",
                    fontFamily: font,
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, fontFamily: font }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: 13, color: colors.muted, fontFamily: font }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function CTASection() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} style={{ padding: "80px 40px 120px" }}>
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        animate={visible ? "show" : "hidden"}
        style={{
          maxWidth: 760,
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
        }}
      >
        <GlowOrb
          style={{
            width: 500,
            height: 300,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${colors.accentGlow} 0%, transparent 70%)`,
          }}
        />
        <motion.div variants={fadeUp} style={{ position: "relative", zIndex: 1 }}>
          <Pill>Get started today</Pill>
          <h2
            style={{
              margin: "16px 0 20px",
              fontSize: "clamp(32px, 5vw, 60px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: colors.text,
              fontFamily: font,
            }}
          >
            Ready to ship{" "}
            <GradientText>10x faster?</GradientText>
          </h2>
          <p
            style={{
              margin: "0 0 40px",
              fontSize: 17,
              lineHeight: 1.65,
              color: colors.muted,
              fontFamily: font,
            }}
          >
            Join 50,000+ teams who've transformed the way they build. Start free, upgrade when you're ready.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Button primary>Start for free →</Button>
            <Button>Talk to sales</Button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function Footer() {
  const links = {
    Product: ["Features", "Pricing", "Changelog", "Roadmap"],
    Company: ["About", "Blog", "Careers", "Press"],
    Legal: ["Privacy", "Terms", "Security", "Cookies"],
  }

  return (
    <footer
      style={{
        borderTop: `1px solid ${colors.border}`,
        padding: "60px 40px 40px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 60 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: `linear-gradient(135deg, ${colors.accent}, #9B8BFF)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "white",
                  fontFamily: font,
                }}
              >
                Z
              </div>
              <span style={{ fontSize: 17, fontWeight: 700, color: colors.text, fontFamily: font }}>
                Zetsu
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: colors.muted, fontFamily: font, maxWidth: 280 }}>
              The modern platform for teams who want to build more and manage less.
            </p>
          </div>
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: colors.muted,
                  fontFamily: font,
                  marginBottom: 16,
                }}
              >
                {category}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map((item) => (
                  <span
                    key={item}
                    style={{ fontSize: 14, color: colors.muted, fontFamily: font, cursor: "pointer" }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            paddingTop: 28,
            borderTop: `1px solid ${colors.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 13, color: colors.muted, fontFamily: font }}>
            © 2026 Zetsu, Inc. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: 20 }}>
            {["Twitter", "GitHub", "LinkedIn"].map((s) => (
              <span key={s} style={{ fontSize: 13, color: colors.muted, fontFamily: font, cursor: "pointer" }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.bg,
        color: colors.text,
        overflowX: "hidden",
      }}
    >
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  )
}
