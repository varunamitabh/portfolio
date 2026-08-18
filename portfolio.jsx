import { useState } from "react";

// ──────────────────────────────────────────────
// EDIT YOUR INFO HERE
// ──────────────────────────────────────────────
const PROFILE = {
  name: "Alex Chen",
  title: "Full-Stack Engineer",
  tagline:
    "I build performant web applications with clean architecture. Currently looking for roles where I can ship meaningful products.",
  email: "alex@example.com",
  links: {
    github: "https://github.com/alexchen",
    linkedin: "https://linkedin.com/in/alexchen",
    resume: "/resume.pdf", // put your resume PDF in /public
  },
};

const EXPERIENCE = [
  {
    role: "Software Engineer",
    company: "Acme Corp",
    period: "2022 – 2024",
    description:
      "Led frontend migration from legacy jQuery to React, reducing load times by 40%. Built internal tooling used by 200+ employees. Owned the design system and component library.",
  },
  {
    role: "Frontend Developer",
    company: "StartupXYZ",
    period: "2020 – 2022",
    description:
      "Shipped the customer-facing dashboard from scratch using React and D3. Implemented real-time data streaming with WebSockets. Collaborated directly with the design team on a ground-up redesign.",
  },
  {
    role: "Software Engineering Intern",
    company: "BigTech Inc",
    period: "Summer 2019",
    description:
      "Built an internal metrics dashboard used by the infrastructure team. Wrote Python scripts to automate deployment reporting.",
  },
];

const PROJECTS = [
  {
    title: "Distributed Task Queue",
    description:
      "A Redis-backed distributed task queue with retry logic, dead-letter handling, and a real-time monitoring dashboard.",
    tags: ["Python", "Redis", "React", "WebSocket"],
    github: "https://github.com/alexchen/taskqueue",
    live: "https://taskqueue-demo.vercel.app",
    report: "/reports/taskqueue-report.pdf",
  },
  {
    title: "ML Model Serving Platform",
    description:
      "End-to-end platform for deploying ML models as REST APIs with automatic scaling, versioning, and A/B testing support.",
    tags: ["Python", "FastAPI", "Docker", "AWS"],
    github: "https://github.com/alexchen/mlserve",
    report: "/reports/mlserve-report.pdf",
  },
  {
    title: "Real-Time Collaboration Editor",
    description:
      "Google Docs-style collaborative text editor using CRDTs for conflict-free real-time editing across multiple clients.",
    tags: ["TypeScript", "React", "Node.js", "CRDT"],
    github: "https://github.com/alexchen/collab-editor",
    live: "https://collab-demo.vercel.app",
  },
  {
    title: "Personal Finance Tracker",
    description:
      "Full-stack budgeting app with bank integration, spending analytics, and automated categorization using a fine-tuned classifier.",
    tags: ["Next.js", "PostgreSQL", "Plaid API", "Chart.js"],
    github: "https://github.com/alexchen/fintrack",
    report: "/reports/fintrack-report.pdf",
  },
];

const SKILLS = [
  "JavaScript / TypeScript",
  "React",
  "Node.js",
  "Python",
  "PostgreSQL",
  "AWS",
  "Docker",
  "Git",
];

// ──────────────────────────────────────────────
// COMPONENTS
// ──────────────────────────────────────────────

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 13L13 1M13 1H4M13 1V10" />
    </svg>
  );
}

function LinkButton({ href, children, variant = "default" }) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "13px",
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    fontWeight: 500,
    textDecoration: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    transition: "all 0.15s ease",
    border: "1px solid",
  };
  const styles =
    variant === "accent"
      ? { ...base, color: "#fff", backgroundColor: "#2B4ACB", borderColor: "#2B4ACB" }
      : { ...base, color: "#374151", backgroundColor: "transparent", borderColor: "#D1D5DB" };

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={styles}>
      {children} <ArrowIcon />
    </a>
  );
}

function NavBar() {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      backgroundColor: "rgba(250,250,248,0.85)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid #E5E7EB", padding: "0 24px",
    }}>
      <div style={{
        maxWidth: 860, margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        height: 56,
      }}>
        <a href="#top" style={{
          fontFamily: "'Space Grotesk', system-ui", fontWeight: 700, fontSize: 18,
          color: "#111", textDecoration: "none", letterSpacing: "-0.02em",
        }}>
          {PROFILE.name.split(" ")[0].toLowerCase()}<span style={{ color: "#2B4ACB" }}>.</span>
        </a>

        {/* Desktop nav */}
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}
             className="nav-links-desktop">
          {["Projects", "Experience", "Contact"].map((s) => (
            <a key={s} href={`#${s.toLowerCase()}`} style={{
              fontSize: 14, color: "#6B7280", textDecoration: "none",
              fontFamily: "'Space Grotesk', system-ui", fontWeight: 500,
            }}>{s}</a>
          ))}
          <a href={PROFILE.links.resume} target="_blank" rel="noopener noreferrer" style={{
            fontSize: 13, color: "#fff", backgroundColor: "#2B4ACB",
            padding: "6px 14px", borderRadius: 6, textDecoration: "none",
            fontFamily: "'Space Grotesk', system-ui", fontWeight: 600,
          }}>Resume ↓</a>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="nav-hamburger" style={{
          display: "none", background: "none", border: "none", cursor: "pointer",
          padding: 4, color: "#374151",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></> :
              <><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></>}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="nav-mobile-menu" style={{
          display: "none", flexDirection: "column", gap: 16,
          padding: "16px 0 20px", borderTop: "1px solid #E5E7EB",
        }}>
          {["Projects", "Experience", "Contact"].map((s) => (
            <a key={s} href={`#${s.toLowerCase()}`} onClick={() => setOpen(false)} style={{
              fontSize: 15, color: "#374151", textDecoration: "none",
              fontFamily: "'Space Grotesk', system-ui", fontWeight: 500,
            }}>{s}</a>
          ))}
          <a href={PROFILE.links.resume} target="_blank" rel="noopener noreferrer" style={{
            fontSize: 14, color: "#2B4ACB", textDecoration: "none",
            fontFamily: "'Space Grotesk', system-ui", fontWeight: 600,
          }}>Download Resume ↓</a>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section id="top" style={{
      maxWidth: 860, margin: "0 auto", padding: "80px 24px 64px",
    }}>
      <div style={{
        display: "inline-block", fontSize: 12, fontWeight: 600,
        fontFamily: "'Space Grotesk', system-ui", color: "#2B4ACB",
        backgroundColor: "#EEF1FB", padding: "4px 10px", borderRadius: 4,
        letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 20,
      }}>
        Open to work
      </div>
      <h1 style={{
        fontFamily: "'Space Grotesk', system-ui", fontWeight: 700,
        fontSize: "clamp(32px, 5vw, 48px)", lineHeight: 1.1,
        color: "#111", letterSpacing: "-0.03em", margin: "0 0 12px",
      }}>
        {PROFILE.name}
      </h1>
      <p style={{
        fontFamily: "'Space Grotesk', system-ui", fontWeight: 500,
        fontSize: "clamp(18px, 2.5vw, 22px)", color: "#6B7280",
        margin: "0 0 20px", letterSpacing: "-0.01em",
      }}>
        {PROFILE.title}
      </p>
      <p style={{
        fontFamily: "'Inter', system-ui, sans-serif", fontSize: 16,
        lineHeight: 1.65, color: "#4B5563", maxWidth: 560, margin: "0 0 32px",
      }}>
        {PROFILE.tagline}
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <LinkButton href={`mailto:${PROFILE.email}`} variant="accent">Get in touch</LinkButton>
        <LinkButton href={PROFILE.links.github}>GitHub</LinkButton>
        <LinkButton href={PROFILE.links.linkedin}>LinkedIn</LinkButton>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section style={{
      maxWidth: 860, margin: "0 auto", padding: "0 24px 56px",
    }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {SKILLS.map((s) => (
          <span key={s} style={{
            fontSize: 13, fontFamily: "'Space Grotesk', system-ui",
            fontWeight: 500, color: "#374151", backgroundColor: "#F3F4F6",
            padding: "5px 12px", borderRadius: 5,
          }}>{s}</span>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  return (
    <div style={{
      backgroundColor: "#fff", border: "1px solid #E5E7EB",
      borderRadius: 10, padding: 24,
      display: "flex", flexDirection: "column", gap: 14,
      transition: "box-shadow 0.15s ease",
    }}>
      <h3 style={{
        fontFamily: "'Space Grotesk', system-ui", fontWeight: 600,
        fontSize: 17, color: "#111", margin: 0, letterSpacing: "-0.01em",
      }}>{project.title}</h3>
      <p style={{
        fontFamily: "'Inter', system-ui", fontSize: 14,
        lineHeight: 1.6, color: "#6B7280", margin: 0, flex: 1,
      }}>{project.description}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {project.tags.map((t) => (
          <span key={t} style={{
            fontSize: 11, fontFamily: "'Space Grotesk', system-ui",
            fontWeight: 600, color: "#2B4ACB", backgroundColor: "#EEF1FB",
            padding: "3px 8px", borderRadius: 4, letterSpacing: "0.02em",
          }}>{t}</span>
        ))}
      </div>
      <div style={{
        display: "flex", gap: 8, flexWrap: "wrap",
        paddingTop: 6, borderTop: "1px solid #F3F4F6",
      }}>
        {project.github && <LinkButton href={project.github}>Code</LinkButton>}
        {project.live && <LinkButton href={project.live}>Live Demo</LinkButton>}
        {project.report && <LinkButton href={project.report}>Report (PDF)</LinkButton>}
      </div>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" style={{
      maxWidth: 860, margin: "0 auto", padding: "0 24px 64px",
    }}>
      <h2 style={{
        fontFamily: "'Space Grotesk', system-ui", fontWeight: 700,
        fontSize: 24, color: "#111", letterSpacing: "-0.02em",
        margin: "0 0 8px",
      }}>Projects</h2>
      <p style={{
        fontFamily: "'Inter', system-ui", fontSize: 14,
        color: "#9CA3AF", margin: "0 0 28px",
      }}>Selected work — click through for code, demos, and detailed reports.</p>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
        gap: 18,
      }}>
        {PROJECTS.map((p) => <ProjectCard key={p.title} project={p} />)}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" style={{
      maxWidth: 860, margin: "0 auto", padding: "0 24px 64px",
    }}>
      <h2 style={{
        fontFamily: "'Space Grotesk', system-ui", fontWeight: 700,
        fontSize: 24, color: "#111", letterSpacing: "-0.02em",
        margin: "0 0 28px",
      }}>Experience</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {EXPERIENCE.map((exp, i) => (
          <div key={i} style={{
            display: "flex", gap: 20, padding: "24px 0",
            borderTop: "1px solid #F3F4F6",
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', system-ui", fontSize: 13,
              fontWeight: 500, color: "#9CA3AF", minWidth: 90,
              paddingTop: 2, whiteSpace: "nowrap",
            }}>{exp.period}</div>
            <div>
              <h3 style={{
                fontFamily: "'Space Grotesk', system-ui", fontWeight: 600,
                fontSize: 16, color: "#111", margin: "0 0 2px",
              }}>{exp.role}</h3>
              <p style={{
                fontFamily: "'Space Grotesk', system-ui", fontSize: 14,
                fontWeight: 500, color: "#2B4ACB", margin: "0 0 8px",
              }}>{exp.company}</p>
              <p style={{
                fontFamily: "'Inter', system-ui", fontSize: 14,
                lineHeight: 1.6, color: "#6B7280", margin: 0,
              }}>{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" style={{
      maxWidth: 860, margin: "0 auto", padding: "0 24px 80px",
    }}>
      <div style={{
        backgroundColor: "#111", borderRadius: 12, padding: "48px 32px",
        textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: "'Space Grotesk', system-ui", fontWeight: 700,
          fontSize: 24, color: "#fff", letterSpacing: "-0.02em",
          margin: "0 0 10px",
        }}>Let's work together</h2>
        <p style={{
          fontFamily: "'Inter', system-ui", fontSize: 15,
          color: "#9CA3AF", margin: "0 0 28px", lineHeight: 1.6,
        }}>
          I'm actively looking for my next role. If you think I'd be a good fit, let's talk.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <a href={`mailto:${PROFILE.email}`} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 14, fontFamily: "'Space Grotesk', system-ui", fontWeight: 600,
            color: "#111", backgroundColor: "#fff", padding: "10px 20px",
            borderRadius: 7, textDecoration: "none",
          }}>{PROFILE.email}</a>
          <a href={PROFILE.links.linkedin} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 14, fontFamily: "'Space Grotesk', system-ui", fontWeight: 500,
            color: "#D1D5DB", backgroundColor: "transparent",
            border: "1px solid #374151", padding: "10px 20px",
            borderRadius: 7, textDecoration: "none",
          }}>LinkedIn <ArrowIcon /></a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      maxWidth: 860, margin: "0 auto", padding: "0 24px 40px",
      textAlign: "center",
    }}>
      <p style={{
        fontFamily: "'Space Grotesk', system-ui", fontSize: 12,
        color: "#D1D5DB",
      }}>
        Built with React · {new Date().getFullYear()}
      </p>
    </footer>
  );
}

// ──────────────────────────────────────────────
// MAIN APP
// ──────────────────────────────────────────────

export default function Portfolio() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Space+Grotesk:wght@500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #FAFAF8; -webkit-font-smoothing: antialiased; }

        a:hover { opacity: 0.85; }

        /* Responsive rules */
        @media (max-width: 640px) {
          .nav-links-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
          .nav-mobile-menu { display: flex !important; }
        }
        @media (min-width: 641px) {
          .nav-links-desktop { display: flex !important; }
          .nav-hamburger { display: none !important; }
          .nav-mobile-menu { display: none !important; }
        }
      `}</style>
      <NavBar />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
