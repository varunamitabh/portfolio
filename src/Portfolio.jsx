import { useState } from "react";

// ──────────────────────────────────────────────
// COLOR PALETTE — "Stormy Morning" (Figma), tuned for contrast
// Base palette: #384959 #6A89A7 #88BDF2 #BDDDFC
// ──────────────────────────────────────────────
const C = {
  bg: "#EDF2F8", // misty blue-gray page background
  surface: "#FFFFFF", // cards / nav
  navBg: "rgba(237,242,248,0.85)",
  ink: "#26333D", // headings / primary text (darker, bolder)
  body: "#39495A", // body copy (darker so it doesn't merge with the page)
  muted: "#617E9B", // meta, dates, captions
  accent: "#3F6488", // links, company names, emphasis (readable)
  accentSolid: "#384959", // primary buttons + dark sections
  tagBg: "#DCEBFB", // light-blue chips (project tech tags)
  tagText: "#2F5171",
  chipBg: "#CFE0F5", // colored skill chips (distinct from project tags)
  chipText: "#274A6E",
  badgeBg: "#D6E7FA",
  badgeText: "#2C5480",
  border: "#D5E0EA", // soft blue-gray borders
  borderSoft: "#E4EBF2",
  darkCard: "#33475B", // contact section
  darkBorder: "#4A6076",
};

const SECTION_MAX = 1080;

// Apple's system typeface — resolves to SF Pro on Apple devices, with graceful fallbacks.
const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif';

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

// Two labeled groups so the section stays scannable as it grows.
const SKILLS = {
  "Programming & Frameworks": [
    "Python",
    "C++",
    "Go",
    "TypeScript",
    "Node.js",
    "SQL",
    "PyTorch",
    "TensorFlow",
    "Hugging Face",
    "ROS2",
    "CUDA",
    "Docker",
    "Git",
    "Linux",
  ],
  "ML & Research": [
    "Machine Learning",
    "Deep Learning",
    "Computer Vision",
    "World Models",
    "LLMs & Agentic AI",
    "Generative AI",
    "Multimodal Learning",
    "Reinforcement Learning",
    "NLP",
    "Representation Learning",
    "Model Evaluation & Benchmarking",
    "Multi-Sensor Fusion",
    "Statistical Modeling",
    "Numerical Optimization",
  ],
};

const FEATURED_PROJECTS = [
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

// ──────────────────────────────────────────────
// SIDE & SCHOOL PROJECTS
// ──────────────────────────────────────────────
const SIDE_PROJECTS = [
  {
    title: "Pattern Recovery from Noisy Images with Modern Hopfield Networks",
    description:
      "Studied Modern Hopfield Networks (log-sum-exp attention energy) as associative memory for recovering MNIST digits under composite noise and structured occlusions (polygon, circle, and spline masks). Analyzed recall against latent dimensionality (100/400/784 nodes, perfect recall at full resolution) and stored-pattern count, and built a cosine-similarity attention retrieval to identify occluded held-out digits — evaluated with Accuracy, MSE, IoU, and SSIM.",
    tags: ["Modern Hopfield Networks", "PyTorch", "Associative Memory", "MNIST"],
    report: "/reports/hopfield-pattern-recovery.pdf",
  },
  {
    title: "ML Pipelines for Ship Detection in Satellite Images",
    description:
      "Benchmarked classical ML pipelines for detecting ships in PlanetScope satellite imagery (4,000 images, imbalanced 3:1 no-ship/ship). Compared SVM and Random Forest against PCA and Isomap dimensionality reduction with grid-search tuning; the SVM + PCA pipeline generalized best at ~96.9% test accuracy (0.94 F1), then extended it to full scenes with a sliding-window detector.",
    tags: ["scikit-learn", "SVM", "PCA", "Isomap", "Remote Sensing"],
    report: "/reports/ship-detection-ml-pipelines.pdf",
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
    venue:
      "14th Intl. Conf. on Computing, Communication and Networking Technologies (ICCCNT), IEEE, 2023 — co-author",
    contribution:
      "Built the CNN architecture and training/evaluation pipeline for 3-class chest X-ray classification (COVID-19 / lung opacity / normal), reaching 85% accuracy.",
    doi: "https://doi.org/10.1109/ICCCNT56998.2023.10307502",
  },
  {
    title: "Biomedical Image Classification using Deep Reinforcement Learning",
    venue:
      "4th Intl. Conf. on Advances in Electrical, Computing, Communication and Sustainable Technologies (ICAECT), IEEE, 2024 — co-author",
    contribution:
      "Built the deep-learning (CNN) and deep-RL (DQN) components for a benchmark comparing CNN, Fuzzy-CNN, and Deep-RL approaches to chest X-ray classification.",
    doi: "https://doi.org/10.1109/ICAECT60202.2024.10468733",
  },
];

// ──────────────────────────────────────────────
// LIFE OUTSIDE TECH — PLACEHOLDERS: swap the emoji, title, and text for
// your own. Add or remove cards freely; the grid reflows automatically.
// ──────────────────────────────────────────────
const INTERESTS = [
  {
    emoji: "⚽",
    title: "Sports",
    text: "I follow football(not American), rather religiously and have been an avid Barca fan for a long time (I will not be talking about the '26 WC finals). I've also been following Ferrari in F1 for some time now and still wait for when Charles Leclerc finally gets his hands on the WDC. Growing up, I've also dabbled in tennis, badminton and golf(!), and kinda sorta got into running to supplement my foodie habits, but I do still follow tennis(I'm waiting for Carlos Alcaraz to make his comeback and return giving competition to Sinner). Overall, I enjoy watching, playing and following sports I'd say, and I'm always up for a good game or a discussion about sports, so feel free to hmu!",
  },
  {
    emoji: "🎧",
    title: "Music",
    text: "I don't think I can correctly classify the music I listen to, but I do enjoy a good mix of genres. From the classics like The Beatles and Queen to modern artists like The Strokes and Post Malone, I appreciate a wide range of musical styles and I think this link does justice to what I listen to: ",
    link: { href: "https://www.last.fm/user/aightF", label: "last.fm" },
  },
  {
    emoji: "🎮",
    title: "Gaming",
    text: "I've been out of gaming for a while now and want to get that dream PC setup going, but my sports obsession did bleed into playing every FIFA game version from '05 to '26. I also have sub par aiming skills at FPS games like CS2 and Valorant(I didn't really understand the mechanics of R6S sadly). But, I do like my story modes and am always on the lookout for niche Indie games, so if you have any recommendations, I'm all ears!",
  },
  {
    emoji: "✈️",
    title: "Travel",
    text: "I love to travel and explore new places, whether it's a weekend getaway(open to suggestions near SF!) or a longer trip abroad. I enjoy immersing myself in different cultures, trying new foods, and experiencing the local way of life. My last trip was to Vietnam in '25 and it was amazing in terms of the food and culture(my coffee addiction was re-awakened haha). I'm planning for my next trip to be in Europe and explore a few countires there, but I'm always looking for new destinations to add to my travel bucket list.",
  },
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
    fontFamily: FONT,
    fontWeight: 500,
    textDecoration: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    transition: "all 0.15s ease",
    border: "1px solid",
  };
  const styles =
    variant === "accent"
      ? { ...base, color: "#fff", backgroundColor: C.accentSolid, borderColor: C.accentSolid }
      : { ...base, color: C.accent, backgroundColor: "transparent", borderColor: C.border };

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={styles}>
      {children} <ArrowIcon />
    </a>
  );
}

const NAV_SECTIONS = ["Projects", "Experience", "Publications", "Interests", "Contact"];

function NavBar() {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      backgroundColor: C.navBg, backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${C.border}`, padding: "0 24px",
    }}>
      <div style={{
        maxWidth: SECTION_MAX, margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        height: 56,
      }}>
        <a href="#top" style={{
          fontFamily: FONT, fontWeight: 700, fontSize: 18,
          color: C.ink, textDecoration: "none", letterSpacing: "-0.02em",
        }}>
          {PROFILE.name.split(" ")[0].toLowerCase()}<span style={{ color: C.accent }}>.</span>
        </a>

        {/* Desktop nav */}
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}
             className="nav-links-desktop">
          {NAV_SECTIONS.map((s) => (
            <a key={s} href={`#${s.toLowerCase()}`} style={{
              fontSize: 14, color: C.muted, textDecoration: "none",
              fontFamily: FONT, fontWeight: 500,
            }}>{s}</a>
          ))}
          <a href={PROFILE.links.resume} target="_blank" rel="noopener noreferrer" style={{
            fontSize: 13, color: "#fff", backgroundColor: C.accentSolid,
            padding: "6px 14px", borderRadius: 6, textDecoration: "none",
            fontFamily: FONT, fontWeight: 600,
          }}>Resume ↓</a>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="nav-hamburger" style={{
          display: "none", background: "none", border: "none", cursor: "pointer",
          padding: 4, color: C.ink,
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
          padding: "16px 0 20px", borderTop: `1px solid ${C.border}`,
        }}>
          {NAV_SECTIONS.map((s) => (
            <a key={s} href={`#${s.toLowerCase()}`} onClick={() => setOpen(false)} style={{
              fontSize: 15, color: C.ink, textDecoration: "none",
              fontFamily: FONT, fontWeight: 500,
            }}>{s}</a>
          ))}
          <a href={PROFILE.links.resume} target="_blank" rel="noopener noreferrer" style={{
            fontSize: 14, color: C.accent, textDecoration: "none",
            fontFamily: FONT, fontWeight: 600,
          }}>Download Resume ↓</a>
        </div>
      )}
    </nav>
  );
}

// Shared style for justified body copy.
const bodyProse = {
  fontFamily: FONT,
  textAlign: "justify",
  hyphens: "auto",
  WebkitHyphens: "auto",
};

function SectionHeading({ children, sub }) {
  return (
    <>
      <h2 style={{
        fontFamily: FONT, fontWeight: 700,
        fontSize: 25, color: C.ink, letterSpacing: "-0.02em",
        margin: sub ? "0 0 8px" : "0 0 28px",
      }}>{children}</h2>
      {sub && (
        <p style={{
          fontFamily: FONT, fontSize: 14,
          color: C.muted, margin: "0 0 28px",
        }}>{sub}</p>
      )}
    </>
  );
}

function Hero() {
  return (
    <section id="top" style={{
      maxWidth: SECTION_MAX, margin: "0 auto", padding: "80px 24px 48px",
    }}>
      <div style={{
        display: "inline-block", fontSize: 12, fontWeight: 600,
        fontFamily: FONT, color: C.badgeText,
        backgroundColor: C.badgeBg, padding: "4px 10px", borderRadius: 4,
        letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 20,
      }}>
        Open to work · Available immediately
      </div>
      <h1 style={{
        fontFamily: FONT, fontWeight: 700,
        fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.1,
        color: C.ink, letterSpacing: "-0.03em", margin: "0 0 12px",
      }}>
        {PROFILE.name}
      </h1>
      <p style={{
        fontFamily: FONT, fontWeight: 500,
        fontSize: "clamp(18px, 2.5vw, 23px)", color: C.muted,
        margin: "0 0 20px", letterSpacing: "-0.01em",
      }}>
        {PROFILE.title}
      </p>
      <p style={{
        ...bodyProse, fontSize: 16.5,
        lineHeight: 1.7, color: C.body, maxWidth: 760, margin: "0 0 32px",
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
      maxWidth: SECTION_MAX, margin: "0 auto", padding: "0 24px 48px",
    }}>
      {ABOUT.map((para, i) => (
        <p key={i} style={{
          ...bodyProse, fontSize: 15.5,
          lineHeight: 1.75, color: C.body, maxWidth: 900,
          margin: i === ABOUT.length - 1 ? 0 : "0 0 14px",
        }}>{para}</p>
      ))}
    </section>
  );
}

function Skills() {
  return (
    <section style={{
      maxWidth: SECTION_MAX, margin: "0 auto", padding: "0 24px 56px",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {Object.entries(SKILLS).map(([group, items]) => (
          <div key={group}>
            <p style={{
              fontFamily: FONT, fontSize: 12,
              fontWeight: 600, color: C.muted, letterSpacing: "0.06em",
              textTransform: "uppercase", margin: "0 0 10px",
            }}>{group}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {items.map((s) => (
                <span key={s} style={{
                  fontSize: 13, fontFamily: FONT,
                  fontWeight: 500, color: C.chipText, backgroundColor: C.chipBg,
                  padding: "5px 12px", borderRadius: 5,
                }}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  return (
    <div className="card" style={{
      backgroundColor: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 10, padding: 24,
      display: "flex", flexDirection: "column", gap: 14,
    }}>
      <h3 style={{
        fontFamily: FONT, fontWeight: 600,
        fontSize: 17, color: C.ink, margin: 0, letterSpacing: "-0.01em",
      }}>{project.title}</h3>
      <p style={{
        ...bodyProse, fontSize: 14,
        lineHeight: 1.65, color: C.body, margin: 0, flex: 1,
      }}>{project.description}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {project.tags.map((t, i) => (
          <span key={`${t}-${i}`} style={{
            fontSize: 11, fontFamily: FONT,
            fontWeight: 600, color: C.tagText, backgroundColor: C.tagBg,
            padding: "3px 8px", borderRadius: 4, letterSpacing: "0.02em",
          }}>{t}</span>
        ))}
      </div>
      <div style={{
        display: "flex", gap: 8, flexWrap: "wrap",
        paddingTop: 6, borderTop: `1px solid ${C.borderSoft}`,
      }}>
        {project.github && <LinkButton href={project.github}>Code</LinkButton>}
        {project.live && <LinkButton href={project.live}>Live Demo</LinkButton>}
        {project.report && <LinkButton href={project.report}>Report (PDF)</LinkButton>}
      </div>
    </div>
  );
}

function ProjectGrid({ projects }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
      gap: 18,
    }}>
      {projects.map((p) => <ProjectCard key={p.title} project={p} />)}
    </div>
  );
}

function SubLabel({ children, style }) {
  return (
    <p style={{
      fontFamily: FONT, fontSize: 13,
      fontWeight: 600, color: C.muted, letterSpacing: "0.05em",
      textTransform: "uppercase", margin: "0 0 16px", ...style,
    }}>{children}</p>
  );
}

function Projects() {
  return (
    <section id="projects" style={{
      maxWidth: SECTION_MAX, margin: "0 auto", padding: "0 24px 64px",
    }}>
      <SectionHeading sub="Selected work — click through for detailed PDF reports.">
        Projects
      </SectionHeading>

      <SubLabel>Research & Featured Work</SubLabel>
      <ProjectGrid projects={FEATURED_PROJECTS} />

      <SubLabel style={{ margin: "36px 0 16px" }}>Side Projects</SubLabel>
      <ProjectGrid projects={SIDE_PROJECTS} />
    </section>
  );
}

function TimelineList({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {items.map((item, i) => (
        <div key={i} className="timeline-row" style={{
          display: "flex", gap: 24, padding: "24px 0",
          borderTop: `1px solid ${C.borderSoft}`,
        }}>
          <div style={{
            fontFamily: FONT, fontSize: 13,
            fontWeight: 500, color: C.muted, width: 150, flexShrink: 0,
            paddingTop: 2,
          }}>{item.period}</div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{
              fontFamily: FONT, fontWeight: 600,
              fontSize: 16, color: C.ink, margin: "0 0 2px",
            }}>{item.title}</h3>
            <p style={{
              fontFamily: FONT, fontSize: 14,
              fontWeight: 500, color: C.accent, margin: "0 0 8px",
            }}>{item.subtitle}</p>
            <p style={{
              ...bodyProse, fontSize: 14,
              lineHeight: 1.65, color: C.body, margin: 0,
            }}>{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Experience() {
  const items = EXPERIENCE.map((e) => ({
    period: e.period, title: e.role, subtitle: e.company, detail: e.description,
  }));
  return (
    <section id="experience" style={{
      maxWidth: SECTION_MAX, margin: "0 auto", padding: "0 24px 64px",
    }}>
      <SectionHeading>Experience</SectionHeading>
      <TimelineList items={items} />
    </section>
  );
}

function Education() {
  const items = EDUCATION.map((e) => ({
    period: e.period, title: e.degree, subtitle: e.school, detail: e.detail,
  }));
  return (
    <section id="education" style={{
      maxWidth: SECTION_MAX, margin: "0 auto", padding: "0 24px 64px",
    }}>
      <SectionHeading>Education</SectionHeading>
      <TimelineList items={items} />
    </section>
  );
}

function Publications() {
  return (
    <section id="publications" style={{
      maxWidth: SECTION_MAX, margin: "0 auto", padding: "0 24px 64px",
    }}>
      <SectionHeading>Publications</SectionHeading>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {PUBLICATIONS.map((pub) => (
          <div key={pub.title} className="card" style={{
            backgroundColor: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 10, padding: 24,
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            <h3 style={{
              fontFamily: FONT, fontWeight: 600,
              fontSize: 16, color: C.ink, margin: 0, letterSpacing: "-0.01em",
            }}>{pub.title}</h3>
            <p style={{
              fontFamily: FONT, fontSize: 13,
              color: C.muted, margin: 0, lineHeight: 1.5,
            }}>{pub.venue}</p>
            <p style={{
              ...bodyProse, fontSize: 14,
              lineHeight: 1.65, color: C.body, margin: 0,
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

function Interests() {
  return (
    <section id="interests" style={{
      maxWidth: SECTION_MAX, margin: "0 auto", padding: "0 24px 64px",
    }}>
      <SectionHeading sub="What I'm upto when I'm not coding, reading papers, or writing reports.">
        Life Outside Tech
      </SectionHeading>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {INTERESTS.map((item) => (
          <div key={item.title} className="card interest-row" style={{
            backgroundColor: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 10, padding: "22px 24px",
            display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 20,
          }}>
            <span style={{
              fontSize: 32, lineHeight: 1, flexShrink: 0,
              width: 44, textAlign: "center",
            }}>{item.emoji}</span>
            <div>
              <h3 style={{
                fontFamily: FONT, fontWeight: 600,
                fontSize: 16, color: C.ink, margin: "0 0 6px",
              }}>{item.title}</h3>
              <p style={{
                fontFamily: FONT, fontSize: 14,
                lineHeight: 1.65, color: C.body, margin: 0,
              }}>
                {item.text}
                {item.link && (
                  <a href={item.link.href} target="_blank" rel="noopener noreferrer"
                    style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>
                    {item.link.label}
                  </a>
                )}
              </p>
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
    backgroundColor: "#2B3D4F",
    border: `1px solid ${C.darkBorder}`,
    borderRadius: 7,
    padding: "10px 14px",
    color: "#EAF1F8",
    fontSize: 14,
    fontFamily: FONT,
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    fontFamily: FONT,
    color: "#A9C0D6",
    marginBottom: 6,
    textAlign: "left",
  };

  if (status === "sent") {
    return (
      <p style={{
        fontFamily: FONT, fontSize: 15, color: "#BDDDFC",
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
          fontFamily: FONT, fontSize: 13, color: "#F5B7B7",
          margin: "0 0 12px",
        }}>
          Something went wrong — please email me directly instead.
        </p>
      )}
      <button type="submit" disabled={status === "sending"} style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontSize: 14, fontFamily: FONT, fontWeight: 600,
        color: C.ink, backgroundColor: "#fff", padding: "10px 24px",
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
      maxWidth: SECTION_MAX, margin: "0 auto", padding: "0 24px 80px",
    }}>
      <div style={{
        backgroundColor: C.darkCard, borderRadius: 12, padding: "48px 32px",
        textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: FONT, fontWeight: 700,
          fontSize: 25, color: "#fff", letterSpacing: "-0.02em",
          margin: "0 0 10px",
        }}>Let's work together</h2>
        <p style={{
          fontFamily: FONT, fontSize: 15,
          color: "#C2D2E2", margin: "0 0 28px", lineHeight: 1.6,
        }}>
          I'm actively looking for my next role. Drop a message below, or reach me directly by email or LinkedIn.
        </p>
        <ContactForm />
        <div style={{
          display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap",
          marginTop: 28, paddingTop: 24, borderTop: `1px solid ${C.darkBorder}`,
        }}>
          <a href={`mailto:${PROFILE.email}`} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 14, fontFamily: FONT, fontWeight: 600,
            color: C.ink, backgroundColor: "#fff", padding: "10px 20px",
            borderRadius: 7, textDecoration: "none",
          }}>{PROFILE.email}</a>
          <a href={PROFILE.links.linkedin} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 14, fontFamily: FONT, fontWeight: 500,
            color: "#D3E0EC", backgroundColor: "transparent",
            border: `1px solid ${C.darkBorder}`, padding: "10px 20px",
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
      maxWidth: SECTION_MAX, margin: "0 auto", padding: "0 24px 40px",
      textAlign: "center",
    }}>
      <p style={{
        fontFamily: FONT, fontSize: 12,
        color: C.muted,
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
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: ${C.bg};
          font-family: ${FONT};
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        a { transition: opacity 0.15s ease; }
        a:hover { opacity: 0.82; }

        /* Apple-style floating cards: rest with a soft shadow, lift on hover */
        .card {
          box-shadow: 0 1px 3px rgba(38, 51, 61, 0.05);
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 30px rgba(38, 51, 61, 0.13);
        }

        /* Responsive rules */
        @media (max-width: 640px) {
          .nav-links-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
          .nav-mobile-menu { display: flex !important; }
          .timeline-row { flex-direction: column; gap: 6px !important; }
          /* left-align justified prose on narrow screens to avoid big word gaps */
          .timeline-row p, #about p, #top p, #projects p, #publications p { text-align: left !important; }
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
        <Interests />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
