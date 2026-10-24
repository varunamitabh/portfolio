import { useEffect, useRef, useState } from "react";
import HeroCanvas from "./HeroCanvas.jsx";
import "./styles.css";

// ──────────────────────────────────────────────
// EDIT YOUR INFO HERE
// All site content lives in these blocks. Styling lives in styles.css.
// ──────────────────────────────────────────────
const PROFILE = {
  name: "Varun Amitabh",
  role: "ML Engineer",
  email: "varunamitabh123@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/varun-amitabh-3b79a8255",
    resume: "/resume.pdf", // put your resume PDF in /public
  },
  // Small monospace labels at the top of the hero.
  labels: ["ML Research Engineer", "MS ECE · University of Florida", "Open to relocation"],
  // Big hero statement: the first part is white, the second part grey.
  headline: ["I build ML systems", "that work in the real world."],
  // "Now" line in the strip at the bottom of the hero.
  now: { lead: "Now:", text: "extending a world model to real-world data and researching on uq methods + stronger evals at UF's TEA Lab" },
};

// Hero intro. Wrap a phrase in **double asterisks** to make it white.
const INTRO =
  "I finished my MS in Electrical & Computer Engineering at the University of Florida in 2026. I'm specially interested in problems where a model has to work with **real sensors, hardware and a latency budget**. Right now that's a world model which predicts what the future frames from a car would like based on the actions it takes.";

// Each project: `hook` is the bold first sentence, `body` follows it in grey.
// `stat` is optional: a headline number shown under the text.
const FEATURED_PROJECTS = [
  {
    area: "Autonomous driving",
    status: "Ongoing research",
    title: "Multimodal world model for autonomous driving",
    hook: "MUVO learned to forecast camera frames and LiDAR scans inside a driving simulator. I'm getting it to do the same on real roads.",
    body: "The original model was trained in CARLA and conditioned on the car's own actions. At UF's TEA Lab I'm moving it onto nuScenes, which meant reworking parts of the architecture, adding spatial and KL-divergence loss terms, and rebuilding the data pipeline so the model reads real CAN-bus telemetry lined up with each scene.",
    tags: ["PyTorch", "World Models", "nuScenes", "LiDAR", "Sim-to-Real"],
    report: "/reports/world-model.pdf",
  },
  {
    area: "Agentic AI",
    status: "Prototype",
    title: "Agent Skills delivery over MCP",
    hook: "When I started this, there was no agreed way to hand Agent Skills to an agent over MCP, so I built one.",
    body: "Agent Skills are folders of instructions and scripts that an LLM agent loads when a task calls for them. My prototype runs an MCP server that exposes each skill as a resource in the open SKILL.md format, scripts included, and publishes a manifest with content digests so the agent can see which skills exist. The design ended up close to what the MCP working group was converging on.",
    tags: ["MCP", "Agentic AI", "Python", "Go", "TypeScript"],
  },
  {
    area: "Medical imaging",
    status: "Research project",
    title: "Through-plane super-resolution on prostate MRI",
    hook: "Testing whether diffusion models can fill in the detail MRI loses between slices.",
    body: "Prostate MRI is usually sharp within each slice and much coarser between slices. I compared diffusion models with EDSR (a CNN) and ESRGAN (a GAN) on multi-image through-plane super-resolution, and ran ablations across all three model families. Reconstruction quality improved, measured by PSNR and SSIM.",
    tags: ["Diffusion Models", "PyTorch", "Medical Imaging", "GANs"],
    report: "/reports/mri-super-resolution.pdf",
  },
  {
    area: "Computer vision",
    status: "Project",
    title: "Handwritten digit detection with YOLOv5",
    hook: "Finding and reading handwritten digits in ordinary camera photos.",
    body: "I trained YOLOv5 to detect and classify handwritten digits in more than 10,000 camera photos. It was the detection step for a document OCR pipeline.",
    stat: { value: "96% mAP", label: "Mean average precision" },
    tags: ["YOLOv5", "PyTorch", "OCR", "Computer Vision"],
    report: "/reports/yolov5-digits.pdf",
  },
];

const SIDE_PROJECTS = [
  {
    title: "Recovering occluded images with Modern Hopfield Networks",
    hook: "How much of a damaged image can an associative memory get back?",
    body: "I stored MNIST digits in a Modern Hopfield Network, then buried them under noise and polygon, circle and spline masks to see what it could bring back. I tracked recall as the network grew (100, 400 and 784 nodes) and as it stored more patterns. I also added a cosine-similarity retrieval step to identify occluded digits the network had never stored, and scored everything with accuracy, MSE, IoU and SSIM.",
    figure: "Perfect recall at 784 nodes",
    tags: ["Hopfield Networks", "PyTorch", "MNIST"],
    report: "/reports/hopfield-pattern-recovery.pdf",
  },
  {
    title: "Ship detection in satellite images",
    hook: "I kept this one to classical ML.",
    body: "The dataset had 4,000 PlanetScope images, with three ship-free images for every one with a ship. I compared SVM and Random Forest pipelines on PCA and Isomap features, tuned with grid search. SVM with PCA generalized best, so I turned it into a sliding-window detector that scans full scenes.",
    figure: "96.9% accuracy · 0.94 F1",
    tags: ["scikit-learn", "SVM", "PCA", "Remote Sensing"],
    report: "/reports/ship-detection-ml-pipelines.pdf",
  },
];

const EXPERIENCE = [
  {
    role: "ML Research Engineer",
    company: "Trustworthy Engineered Autonomy Lab, University of Florida",
    period: "Jan 2025 – Present",
    description:
      "Developing a multimodal world model that combines LiDAR, vision and vehicle telemetry for spatial reasoning and future prediction in autonomous driving, and migrating it from CARLA simulation to real nuScenes data with new loss terms and rebuilt data pipelines. Also built real-time object detection and tracking in ROS2 and Gazebo, running YOLO on live UAV simulation feeds.",
  },
  {
    role: "Robotics Engineer",
    company: "i-Heal Lab, University of Florida",
    period: "Nov 2025 – Jan 2026",
    description:
      "Hardware and software integration for an indoor healthcare-assistant robot that follows clinicians and brings up patient information on request: drivetrain, sensor mounting and wiring, ROS2 sensor ingestion, and early work on autonomous indoor navigation with floor-plan mapping and path planning.",
  },
  {
    role: "Research Engineer",
    company: "Defense Institute of Advanced Technology (DRDO)",
    period: "May 2023 – Jul 2023",
    description:
      "Built data-processing pipelines for 100GB+ spectral imaging datasets along with reproducible experiment workflows, and used statistical and signal-processing techniques to improve data quality and downstream classification.",
  },
  {
    role: "Chief Technology Officer, Electricals",
    company: "Wrench Wielders Racing",
    period: "Nov 2022 – Dec 2023",
    description:
      "Led a 25-person technical team through electrical system integration and real-time sensor data fusion for a student racing car. The team won Best Overall Performer at SUPRA'23.",
  },
];

const SKILLS = {
  Languages: ["Python", "C++", "Go", "TypeScript", "SQL"],
  "ML & frameworks": ["PyTorch", "TensorFlow", "Hugging Face", "CUDA", "ROS2", "Node.js"],
  Research: [
    "World models",
    "Multimodal learning & sensor fusion",
    "Computer vision",
    "LLMs & agentic AI",
    "Generative models",
    "Reinforcement learning",
  ],
  "Methods & tools": [
    "Model evaluation & benchmarking",
    "Representation learning",
    "Statistical modeling",
    "Numerical optimization",
    "Docker, Git, Linux",
  ],
};

const PUBLICATIONS = [
  {
    title: "Deep Learning for Pulmonary Disease Identification",
    venue: "IEEE ICCCNT 2023 · Co-author",
    contribution:
      "Built the CNN and the training and evaluation pipeline for 3-class chest X-ray classification (COVID-19, lung opacity, normal), reaching 85% accuracy.",
    doi: "https://doi.org/10.1109/ICCCNT56998.2023.10307502",
  },
  {
    title: "Biomedical Image Classification using Deep Reinforcement Learning",
    venue: "IEEE ICAECT 2024 · Co-author",
    contribution:
      "Built the CNN and deep-RL (DQN) components for a benchmark comparing CNN, Fuzzy-CNN and deep-RL approaches to chest X-ray classification.",
    doi: "https://doi.org/10.1109/ICAECT60202.2024.10468733",
  },
];

const EDUCATION = [
  {
    school: "University of Florida",
    degree: "M.S. Electrical & Computer Engineering",
    period: "2024 – 2026",
    detail:
      "Coursework: Machine Learning, Pattern Recognition, NLP, Image Processing & Computer Vision, Information Theory in ML, Deep Learning in Medical Image Analysis.",
  },
  {
    school: "Symbiosis Institute of Technology, Pune",
    degree: "B.Tech Electronics & Telecommunications",
    period: "2020 – 2024",
    detail:
      "Coursework: Artificial Intelligence, Machine Learning, Digital Image Processing, Pattern Recognition, Medical Imaging, Computer Networking.",
  },
];

// Add or remove cards freely; the grid reflows.
const INTERESTS = [
  {
    title: "Sports",
    text: "I follow football (not American) rather religiously and have been an avid Barça fan for a long time (I will not be talking about the '26 WC final). I've also been following Ferrari in F1 for a while and I'm still waiting for Charles Leclerc to finally get his hands on the WDC. Growing up I dabbled in tennis, badminton and golf (!), and kinda sorta got into running to keep up with my foodie habits. I still follow tennis too, and I'm waiting for Carlos Alcaraz to come back and give Sinner some competition. Always up for a game or a sports debate, so feel free to hmu!",
  },
  {
    title: "Music",
    text: "I can't really classify what I listen to, but it's a good mix of genres: from the classics like The Beatles and Queen to The Strokes and Post Malone. This probably does it more justice than I can: ",
    link: { href: "https://www.last.fm/user/aightF", label: "my last.fm" },
  },
  {
    title: "Gaming",
    text: "I've been out of gaming for a while and still want to get that dream PC setup going, but my sports obsession did bleed into playing every FIFA from '05 to '26. My aim in CS2 and Valorant is sub-par (and I never quite understood R6S). I do love a good story mode and I'm always on the lookout for niche indie games, so if you have recommendations, I'm all ears!",
  },
  {
    title: "Travel",
    text: "I love exploring new places, whether it's a weekend getaway (open to suggestions near SF!) or a longer trip abroad, mostly for the food, the culture and the local way of life. My last trip was to Vietnam in '25 and the food was amazing (it also re-awakened my coffee addiction). Next on the list is a few countries in Europe.",
  },
];

const NAV = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "publications", label: "Publications" },
  { id: "outside", label: "Outside work" },
  { id: "contact", label: "Contact" },
];

// ──────────────────────────────────────────────
// SMALL PIECES
// ──────────────────────────────────────────────

function Arrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 9.5l7-7M4 2.5h5.5V8" />
    </svg>
  );
}

function ExtLink({ href, children, className = "text-link" }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children} <Arrow />
    </a>
  );
}

// Renders **bold** segments from a plain string.
function Rich({ text }) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 ? <strong key={i}>{part}</strong> : part
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  }

  return (
    <button type="button" className="copy" data-copied={copied} onClick={copy}
      aria-label="Copy email address">
      <svg className="icon-copy" width="15" height="15" viewBox="0 0 16 16" fill="none"
        stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <rect x="5.5" y="5.5" width="8" height="8" rx="2" />
        <path d="M10.5 3.5v-.5a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" />
      </svg>
      <svg className="icon-done" width="15" height="15" viewBox="0 0 16 16" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true">
        <path d="M3.5 8.5l3 3 6-7" />
      </svg>
      <span className="sr-only" aria-live="polite">{copied ? "Email copied" : ""}</span>
    </button>
  );
}

function Tags({ tags }) {
  return (
    <span className="stack mono">
      {tags.map((t, i) => (
        <span key={t} className="tag">{i > 0 && " · "}{t}</span>
      ))}
    </span>
  );
}

function SectionHead({ index, label, title, sub }) {
  return (
    <>
      <div className="sec-rule mono reveal">
        <span>{index}</span>
        <span>{label}</span>
      </div>
      <h2 className="sec-title reveal">
        {title} {sub && <span className="dim">{sub}</span>}
      </h2>
    </>
  );
}

// ──────────────────────────────────────────────
// SECTIONS
// ──────────────────────────────────────────────

function Nav({ tone }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="nav" data-tone={tone} data-menu={open ? "open" : "closed"}>
      <div className="container nav-inner">
        <a href="#top" className="nav-name" onClick={() => setOpen(false)}>{PROFILE.name}</a>

        <nav className="nav-links" aria-label="Sections">
          {NAV.map((s) => <a key={s.id} href={`#${s.id}`}>{s.label}</a>)}
          <a href={PROFILE.links.resume} target="_blank" rel="noopener noreferrer"
            className="btn btn-accent nav-cta">Résumé</a>
        </nav>

        <button type="button" className="nav-toggle" aria-expanded={open}
          aria-controls="nav-sheet" aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}>
          <span /><span />
        </button>
      </div>

      <nav id="nav-sheet" className="nav-sheet" data-open={open} aria-label="Sections"
        inert={open ? undefined : ""}>
        {NAV.map((s) => (
          <a key={s.id} href={`#${s.id}`} onClick={() => setOpen(false)}>{s.label}</a>
        ))}
        <a href={PROFILE.links.resume} target="_blank" rel="noopener noreferrer"
          onClick={() => setOpen(false)}>Résumé</a>
      </nav>
    </header>
  );
}

function Hero({ heroRef }) {
  const [white, grey] = PROFILE.headline;
  const [glReady, setGlReady] = useState(false);
  return (
    <section id="top" className="hero" ref={heroRef} data-gl={glReady ? "on" : "off"}>
      <div className="hero-glow" aria-hidden="true" />
      <HeroCanvas onReady={setGlReady} />

      <div className="container hero-top mono" data-enter style={{ "--d": 0 }}>
        {PROFILE.labels.map((l) => <span key={l}>[ {l} ]</span>)}
      </div>

      <div className="container hero-main">
        <h1 className="hero-title">
          <span className="hero-kicker" data-enter style={{ "--d": 1 }}>
            Hi, I'm {PROFILE.name}.
          </span>
          <span data-enter style={{ "--d": 2, display: "block" }}>
            {white} <span className="dim">{grey}</span>
          </span>
        </h1>

        <div className="hero-side" data-enter style={{ "--d": 4 }}>
          <p className="hero-intro"><Rich text={INTRO} /></p>
          <div className="hero-actions">
            <a href="#contact" className="btn btn-light">Get in touch</a>
            <ExtLink href={PROFILE.links.linkedin}>LinkedIn</ExtLink>
          </div>
          <div className="hero-email">
            <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            <CopyEmail />
          </div>
        </div>
      </div>

      <div className="container" data-enter style={{ "--d": 6 }}>
        <div className="hero-strip mono">
          <span className="live">Available now</span>
          <span className="now"><b>{PROFILE.now.lead}</b> {PROFILE.now.text}</span>
          <a href="#work" className="scroll-cue">Scroll ↓</a>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ p, i }) {
  return (
    <article className="card project reveal" style={{ "--i": i % 2 }}>
      <div className="project-meta mono">
        <span>{String(i + 1).padStart(2, "0")} · {p.area}</span>
        <span>{p.status}</span>
      </div>
      <h3>{p.title}</h3>
      <p className="project-body"><strong>{p.hook}</strong> {p.body}</p>
      {p.stat && (
        <p className="project-stat"><b>{p.stat.value}</b>{p.stat.label}</p>
      )}
      <div className="project-foot">
        <Tags tags={p.tags} />
        {p.report && <ExtLink href={p.report}>Read the report</ExtLink>}
      </div>
    </article>
  );
}

function Work() {
  return (
    <section id="work" className="section container">
      <SectionHead index="01" label="Work" title="Selected work."
        sub="Research and side projects, most with a full write-up." />

      <div className="project-grid">
        {FEATURED_PROJECTS.map((p, i) => <ProjectCard key={p.title} p={p} i={i} />)}
      </div>

      <p className="sub-label mono reveal">Smaller projects</p>
      <div className="mini-list">
        {SIDE_PROJECTS.map((p) => (
          <article key={p.title} className="mini reveal">
            <div>
              <h3>{p.title}</h3>
              <Tags tags={p.tags} />
            </div>
            <p><strong>{p.hook}</strong> {p.body}</p>
            <div className="mini-aside">
              <span className="figure">{p.figure}</span>
              {p.report && <ExtLink href={p.report}>Report</ExtLink>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Rows({ items }) {
  return (
    <div className="rows">
      {items.map((it) => (
        <article key={it.title + it.when} className="row reveal">
          <div className="row-when mono">{it.when}</div>
          <div>
            <h3>{it.title}</h3>
            <p className="row-org">{it.org}</p>
            <p className="row-detail">{it.detail}</p>
            {it.link && <ExtLink href={it.link.href}>{it.link.label}</ExtLink>}
          </div>
        </article>
      ))}
    </div>
  );
}

function Experience() {
  return (
    <section id="experience" className="section container">
      <SectionHead index="02" label="Experience" title="Experience."
        sub="Two research labs, a defence research institute and a racing team." />
      <Rows items={EXPERIENCE.map((e) => ({
        when: e.period, title: e.role, org: e.company, detail: e.description,
      }))} />
    </section>
  );
}

function Toolkit() {
  return (
    <section id="toolkit" className="section container">
      <SectionHead index="03" label="Toolkit" title="What I work with." />
      <div className="toolkit">
        {Object.entries(SKILLS).map(([group, items], i) => (
          <div key={group} className="reveal" style={{ "--i": i }}>
            <h3 className="mono">{group}</h3>
            <ul>{items.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Publications() {
  return (
    <section id="publications" className="section container">
      <SectionHead index="04" label="Publications" title="Publications."
        sub="Two IEEE conference papers on chest X-ray classification." />
      <Rows items={PUBLICATIONS.map((p) => ({
        when: p.venue.split(" · ")[0], title: p.title, org: p.venue.split(" · ")[1],
        detail: p.contribution, link: { href: p.doi, label: "Read the paper" },
      }))} />
    </section>
  );
}

function Education() {
  return (
    <section id="education" className="section container">
      <SectionHead index="05" label="Education" title="Education." />
      <Rows items={EDUCATION.map((e) => ({
        when: e.period, title: e.degree, org: e.school, detail: e.detail,
      }))} />
    </section>
  );
}

function Outside() {
  return (
    <section id="outside" className="section container">
      <SectionHead index="06" label="Outside work" title="Life outside tech."
        sub="What I'm up to when I'm not training models or reading papers." />
      <div className="life-grid">
        {INTERESTS.map((it, i) => (
          <article key={it.title} className="card life reveal" style={{ "--i": i % 2 }}>
            <h3>{it.title}</h3>
            <p>
              {it.text}
              {it.link && (
                <a href={it.link.href} target="_blank" rel="noopener noreferrer">{it.link.label}</a>
              )}
            </p>
          </article>
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
    setStatus("sending");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!res.ok) throw new Error(`Form submit failed: ${res.status}`);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="form-done" role="status">
        <strong>Thanks, message received.</strong>
        I'll get back to you soon, usually within a day or two.
      </div>
    );
  }

  return (
    <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field"
      onSubmit={handleSubmit}>
      <input type="hidden" name="form-name" value="contact" />
      <p hidden>
        <label>Don't fill this out: <input name="bot-field" /></label>
      </p>
      <label className="field">
        <span className="mono">Name</span>
        <input type="text" name="name" autoComplete="name" required />
      </label>
      <label className="field">
        <span className="mono">Email</span>
        <input type="email" name="email" autoComplete="email" required />
      </label>
      <label className="field">
        <span className="mono">Message</span>
        <textarea name="message" rows={5} required />
      </label>
      <div className="form-row">
        <button type="submit" className="btn btn-light" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        {status === "error" && (
          <p className="form-note" data-kind="error" role="alert">
            That didn't go through. Please email me directly instead.
          </p>
        )}
      </div>
    </form>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <SectionHead index="07" label="Contact" title="Let's talk."
          sub="I'm looking for ML engineering roles and can start right away." />
        <div className="contact-grid">
          <div className="contact-direct reveal">
            <p>
              Send a note through the form, or reach me directly. I'm happy to relocate
              for the right role.
            </p>
            <div className="contact-links">
              <div>
                <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
                <CopyEmail />
              </div>
              <a href={PROFILE.links.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn <span className="mono">↗</span>
              </a>
              <a href={PROFILE.links.resume} target="_blank" rel="noopener noreferrer">
                Résumé <span className="mono">PDF ↗</span>
              </a>
            </div>
          </div>
          <div className="reveal" style={{ "--i": 1 }}>
            <ContactForm />
          </div>
        </div>

        <footer className="footer mono">
          <span>{PROFILE.name} · {new Date().getFullYear()}</span>
          <a href="#top">Back to top ↑</a>
        </footer>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// MAIN APP
// ──────────────────────────────────────────────

export default function Portfolio() {
  const heroRef = useRef(null);
  const [navTone, setNavTone] = useState("dark");

  // Nav switches to its light material once the dark hero is mostly gone.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => setNavTone(entry.isIntersecting ? "dark" : "light"),
      { rootMargin: "-52px 0px 0px 0px", threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Each .reveal block fades up once when it scrolls into view.
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Nav tone={navTone} />
      <main>
        <Hero heroRef={heroRef} />
        <Work />
        <Experience />
        <Toolkit />
        <Publications />
        <Education />
        <Outside />
        <Contact />
      </main>
    </>
  );
}
