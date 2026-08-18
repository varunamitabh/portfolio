import { useState } from "react";

// ──────────────────────────────────────────────
// EDIT YOUR INFO HERE
// ──────────────────────────────────────────────
const PROFILE = {
  name: "Varun Amitabh",
  title: "ML Engineer & Researcher",
  tagline:
    "Recently completed my MS in Electrical & Computer Engineering at the University of Florida — available immediately. I build ML systems end-to-end: multimodal world models for autonomous driving, real-time perception, and agentic AI infrastructure.",
  email: "varunamitabh123@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/varun-amitabh-3b79a8255",
    resume: "/resume.pdf", // put your resume PDF in /public
  },
};

const ABOUT = [
  "My research spans two labs at the University of Florida. At the Trustworthy Engineered Autonomy Lab I'm extending MUVO — a multimodal world model that predicts future camera and LiDAR conditioned on the ego vehicle's actions — from CARLA simulation to real-world nuScenes data. At the i-Heal Lab I handled hardware/software integration for an indoor healthcare-assistant robot.",
  "I'm most interested in the places where models meet real sensors, real latency budgets, and real hardware: world models, agentic AI systems, and real-time ML. I've also co-authored two IEEE conference papers in biomedical imaging.",
];

const PROJECTS = [
  {
    title: "Multimodal World Model for Autonomous Driving",
    description:
      "Ongoing research at UF's TEA Lab: extending MUVO, an RSSM-style world model that predicts future camera and LiDAR conditioned on ego-vehicle actions, from CARLA simulation to real-world nuScenes data — reworking the architecture, adding spatial and KL-divergence loss terms, and conditioning on real CAN-bus telemetry with per-scene temporal alignment.",
    tags: ["PyTorch", "World Models", "nuScenes", "LiDAR", "Sim-to-Real"],
    report: "/reports/world-model.pdf",
  },
  {
    title: "Agent Skills Delivery over MCP",
    description:
      "End-to-end prototype for delivering Agent Skills to LLM agents through MCP servers, built while skills-over-MCP was still an open, unreleased protocol question. Serves skills as MCP resources in the open SKILL.md format — including attached scripts — with a digest-based manifest for agent-side discovery, in line with the direction the MCP working group was converging on.",
    tags: ["MCP", "Agentic AI", "Python", "Go", "TypeScript"],
    report: "/reports/agent-skills-mcp.pdf",
  },
  {
    title: "Through-Plane Super-Resolution on Prostate MRI",
    description:
      "Benchmarked diffusion-based generative models against EDSR-CNN and ESRGAN for multi-image super-resolution on prostate MRI, improving reconstruction quality as measured by PSNR/SSIM, with structured ablation studies across CNN, GAN, and diffusion frameworks.",
    tags: ["Diffusion Models", "PyTorch", "Medical Imaging", "GANs"],
    report: "/reports/mri-super-resolution.pdf",
  },
  {
    title: "Handwritten Digit Detection with YOLOv5",
    description:
      "Object detection and classification of handwritten digits across 10,000+ camera-captured images, reaching 96% mean Average Precision and improving document information extraction for OCR pipelines.",
    tags: ["YOLOv5", "PyTorch", "OCR", "Computer Vision"],
    report: "/reports/yolov5-digits.pdf",
  },
];

const EXPERIENCE = [
  {
    role: "Graduate Research Assistant",
    company: "Trustworthy Engineered Autonomy Lab, University of Florida",
    period: "Jan 2025 – Present",
    description:
      "Developing a multimodal world model integrating LiDAR, vision, and vehicle telemetry for spatial reasoning and multimodal future prediction in autonomous driving — migrating it from CARLA simulation to real nuScenes data with new loss terms and rebuilt data pipelines. Also implemented real-time object detection and tracking in ROS2 + Gazebo using YOLO for live inference on UAV simulation feeds.",
  },
  {
    role: "Graduate Research Assistant",
    company: "i-Heal Lab, University of Florida",
    period: "Nov 2025 – Jan 2026",
    description:
      "Hardware/software integration for an indoor healthcare-assistant robot designed to follow clinicians and surface patient information on request — drivetrain, sensor mounting and wiring, ROS2 sensor ingestion, and work toward autonomous indoor navigation with floor-plan mapping and path planning.",
  },
  {
    role: "Research Assistant",
    company: "Defense Institute of Advanced Technology (DRDO)",
    period: "May 2023 – Jul 2023",
    description:
      "Built scalable data-processing pipelines for 100GB+ spectral imaging datasets and reproducible experimentation workflows, applying statistical and signal-processing techniques to improve data quality and downstream classification performance.",
  },
  {
    role: "Chief Technology Officer",
    company: "Electricals — Wrench Wielders Racing",
    period: "Nov 2022 – Dec 2023",
    description:
      "Led a 25-member technical team through end-to-end electrical system integration and real-time sensor data fusion for a student racing team. Contributed to winning Best Overall Performer at SUPRA'23.",
  },
];

const EDUCATION = [
  {
    school: "University of Florida",
    degree: "M.S. — Electrical & Computer Engineering",
    period: "2024 – 2026",
    detail:
      "Coursework: Machine Learning, Pattern Recognition, NLP, Image Processing & Computer Vision, Information Theory in ML, Deep Learning in Medical Image Analysis.",
  },
  {
    school: "Symbiosis Institute of Technology, Pune",
    degree: "B.Tech — Electronics & Telecommunications",
    period: "2020 – 2024",
    detail:
      "Coursework: Artificial Intelligence, Machine Learning, Digital Image Processing, Pattern Recognition, Medical Imaging, Computer Networking.",
  },
];

const PUBLICATIONS = [
  {
    title: "Deep Learning for Pulmonary Disease Identification",
    venue: "14th Intl. Conf. on Computing, Communication and Networking Technologies (ICCCNT), IEEE, 2023 — co-author",
    contribution:
      "Built the CNN architecture and training/evaluation pipeline for 3-class chest X-ray classification (COVID-19 / lung opacity / normal), reaching 85% accuracy.",
    doi: "https://doi.org/10.1109/ICCCNT56998.2023.10307502",
  },
  {
    title: "Biomedical Image Classification using Deep Reinforcement Learning",
    venue: "4th Intl. Conf. on Advances in Electrical, Computing, Communication and Sustainable Technologies (ICAECT), IEEE, 2024 — co-author",
    contribution:
      "Built the deep-learning (CNN) and deep-RL (DQN) components for a benchmark comparing CNN, Fuzzy-CNN, and Deep-RL approaches to chest X-ray classification.",
    doi: "https://doi.org/10.1109/ICAECT60202.2024.10468733",
  },
];

const SKILLS = [
  "Python",
  "PyTorch",
  "C++",
  "TensorFlow",
  "ROS2",
  "CUDA",
  "Docker",
  "LLMs & Agentic AI",
  "Computer Vision",
  "Multimodal Learning",
  "Reinforcement Learning",
  "SQL",
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

const NAV_SECTIONS = ["Projects", "Experience", "Publications", "Contact"];

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
          {NAV_SECTIONS.map((s) => (
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
          {NAV_SECTIONS.map((s) => (
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
      maxWidth: 860, margin: "0 auto", padding: "80px 24px 48px",
    }}>
      <div style={{
        display: "inline-block", fontSize: 12, fontWeight: 600,
        fontFamily: "'Space Grotesk', system-ui", color: "#2B4ACB",
        backgroundColor: "#EEF1FB", padding: "4px 10px", borderRadius: 4,
        letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 20,
      }}>
        Open to work · Available immediately
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
        lineHeight: 1.65, color: "#4B5563", maxWidth: 620, margin: "0 0 32px",
      }}>
        {PROFILE.tagline}
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <LinkButton href="#contact" variant="accent">Get in touch</LinkButton>
        <LinkButton href={PROFILE.links.linkedin}>LinkedIn</LinkButton>
        <LinkButton href={PROFILE.links.resume}>Resume (PDF)</LinkButton>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" style={{
      maxWidth: 860, margin: "0 auto", padding: "0 24px 48px",
    }}>
      {ABOUT.map((para, i) => (
        <p key={i} style={{
          fontFamily: "'Inter', system-ui", fontSize: 15,
          lineHeight: 1.7, color: "#4B5563", maxWidth: 680,
          margin: i === ABOUT.length - 1 ? 0 : "0 0 14px",
        }}>{para}</p>
      ))}
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
      }}>Selected work — click through for detailed PDF reports.</p>
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
          <div key={i} className="timeline-row" style={{
            display: "flex", gap: 20, padding: "24px 0",
            borderTop: "1px solid #F3F4F6",
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', system-ui", fontSize: 13,
              fontWeight: 500, color: "#9CA3AF", minWidth: 110,
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

function Education() {
  return (
    <section id="education" style={{
      maxWidth: 860, margin: "0 auto", padding: "0 24px 64px",
    }}>
      <h2 style={{
        fontFamily: "'Space Grotesk', system-ui", fontWeight: 700,
        fontSize: 24, color: "#111", letterSpacing: "-0.02em",
        margin: "0 0 28px",
      }}>Education</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {EDUCATION.map((edu, i) => (
          <div key={i} className="timeline-row" style={{
            display: "flex", gap: 20, padding: "24px 0",
            borderTop: "1px solid #F3F4F6",
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', system-ui", fontSize: 13,
              fontWeight: 500, color: "#9CA3AF", minWidth: 110,
              paddingTop: 2, whiteSpace: "nowrap",
            }}>{edu.period}</div>
            <div>
              <h3 style={{
                fontFamily: "'Space Grotesk', system-ui", fontWeight: 600,
                fontSize: 16, color: "#111", margin: "0 0 2px",
              }}>{edu.degree}</h3>
              <p style={{
                fontFamily: "'Space Grotesk', system-ui", fontSize: 14,
                fontWeight: 500, color: "#2B4ACB", margin: "0 0 8px",
              }}>{edu.school}</p>
              <p style={{
                fontFamily: "'Inter', system-ui", fontSize: 14,
                lineHeight: 1.6, color: "#6B7280", margin: 0,
              }}>{edu.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Publications() {
  return (
    <section id="publications" style={{
      maxWidth: 860, margin: "0 auto", padding: "0 24px 64px",
    }}>
      <h2 style={{
        fontFamily: "'Space Grotesk', system-ui", fontWeight: 700,
        fontSize: 24, color: "#111", letterSpacing: "-0.02em",
        margin: "0 0 28px",
      }}>Publications</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {PUBLICATIONS.map((pub) => (
          <div key={pub.title} style={{
            backgroundColor: "#fff", border: "1px solid #E5E7EB",
            borderRadius: 10, padding: 24,
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            <h3 style={{
              fontFamily: "'Space Grotesk', system-ui", fontWeight: 600,
              fontSize: 16, color: "#111", margin: 0, letterSpacing: "-0.01em",
            }}>{pub.title}</h3>
            <p style={{
              fontFamily: "'Inter', system-ui", fontSize: 13,
              color: "#9CA3AF", margin: 0, lineHeight: 1.5,
            }}>{pub.venue}</p>
            <p style={{
              fontFamily: "'Inter', system-ui", fontSize: 14,
              lineHeight: 1.6, color: "#6B7280", margin: 0,
            }}>{pub.contribution}</p>
            <div>
              <LinkButton href={pub.doi}>View paper (DOI)</LinkButton>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString(),
      });
      if (!res.ok) throw new Error(`Form submit failed: ${res.status}`);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const inputStyle = {
    width: "100%",
    backgroundColor: "#1F2937",
    border: "1px solid #374151",
    borderRadius: 7,
    padding: "10px 14px",
    color: "#F9FAFB",
    fontSize: 14,
    fontFamily: "'Inter', system-ui, sans-serif",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    fontFamily: "'Space Grotesk', system-ui",
    color: "#9CA3AF",
    marginBottom: 6,
    textAlign: "left",
  };

  if (status === "sent") {
    return (
      <p style={{
        fontFamily: "'Inter', system-ui", fontSize: 15, color: "#A7F3D0",
        margin: "0 0 8px", lineHeight: 1.6,
      }}>
        Thanks — your message is on its way. I'll get back to you soon.
      </p>
    );
  }

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      style={{ maxWidth: 480, margin: "0 auto", textAlign: "left" }}
    >
      <input type="hidden" name="form-name" value="contact" />
      <p style={{ display: "none" }}>
        <label>Don't fill this out: <input name="bot-field" /></label>
      </p>
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="contact-name" style={labelStyle}>Name</label>
        <input id="contact-name" type="text" name="name" required style={inputStyle} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="contact-email" style={labelStyle}>Email</label>
        <input id="contact-email" type="email" name="email" required style={inputStyle} />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label htmlFor="contact-message" style={labelStyle}>Message</label>
        <textarea id="contact-message" name="message" required rows={4} style={{ ...inputStyle, resize: "vertical" }} />
      </div>
      {status === "error" && (
        <p style={{
          fontFamily: "'Inter', system-ui", fontSize: 13, color: "#FCA5A5",
          margin: "0 0 12px",
        }}>
          Something went wrong — please email me directly instead.
        </p>
      )}
      <button type="submit" disabled={status === "sending"} style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontSize: 14, fontFamily: "'Space Grotesk', system-ui", fontWeight: 600,
        color: "#111", backgroundColor: "#fff", padding: "10px 24px",
        borderRadius: 7, border: "none", cursor: "pointer",
        opacity: status === "sending" ? 0.7 : 1,
      }}>
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
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
          I'm actively looking for my next role. Drop a message below, or reach me directly by email or LinkedIn.
        </p>
        <ContactForm />
        <div style={{
          display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap",
          marginTop: 28, paddingTop: 24, borderTop: "1px solid #1F2937",
        }}>
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
        Varun Amitabh · {new Date().getFullYear()}
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
          .timeline-row { flex-direction: column; gap: 6px !important; }
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
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Publications />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
