import { useEffect, useRef } from "react";

// ──────────────────────────────────────────────
// Interactive hero background (WebGL2, no library).
//
// The shader redraws the same blue/amber glow as the CSS `.hero-glow`. The
// cursor stirs a velocity field: the glow is smeared along it and a little
// coloured ink is left behind, like ink in water. On touch devices a slow
// drifting point stands in for the cursor.
//
// Runs only while the hero is on screen, the tab is visible and something is
// moving. Without WebGL2 + float render targets, or with reduced motion, the
// component renders nothing and the CSS glow stays in place.
// ──────────────────────────────────────────────

const TUNING = {
  simScale: 0.25, // sim texels per CSS px
  radius: 0.0028, // splat size (uv², gaussian)
  force: 0.9, // how hard the cursor pushes the field
  velDecay: 0.12, // velocity left after 1s
  dyeDecay: 0.1, // ink left after 1s
  ink: 0.07, // ink strength per splat
  smear: 0.05, // how far the glow is dragged by the field
};

const IDLE_MS = 3200; // stop the loop this long after the last input

// ── Shaders ────────────────────────────────────

const VERT = `#version 300 es
in vec2 p;
out vec2 uv;
void main() { uv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

// Same layers as .hero-glow in styles.css. That element is inset -20% on each
// side, so its gradient centres land at these positions relative to the hero.
const GLOW = `
uniform vec2 res;
const vec3 BG   = vec3(10.0, 10.0, 12.0) / 255.0;
const vec3 COOL = vec3(41.0, 151.0, 255.0) / 255.0;
const vec3 WARM = vec3(255.0, 159.0, 10.0) / 255.0;
vec3 glow(vec2 uv) {
  vec2 px = vec2(uv.x, 1.0 - uv.y) * res;
  float vmax = max(res.x, res.y) / 100.0;
  vec3 col = BG;
  float dw = distance(px, vec2(-0.032, 1.088) * res) / vmax;
  col = mix(col, WARM, 0.12 * clamp(1.0 - dw / 38.0, 0.0, 1.0));
  float dc = distance(px, vec2(0.92, 0.108) * res) / vmax;
  float ac = dc < 28.0
    ? mix(0.24, 0.08, dc / 28.0)
    : mix(0.08, 0.0, clamp((dc - 28.0) / 27.0, 0.0, 1.0));
  return mix(col, COOL, ac);
}`;

const FRAG_HEAD = `#version 300 es
precision highp float;
in vec2 uv;
out vec4 o;
`;

const BLEED_VEL = FRAG_HEAD + `
uniform sampler2D vel;
uniform vec2 texel;
uniform float dt, decay, radius, aspect;
uniform vec2 ptr, force;
void main() {
  vec2 v = texture(vel, uv).xy;
  vec2 b = uv - v * dt;
  vec2 a = texture(vel, b).xy;
  vec2 n = texture(vel, b + vec2(texel.x, 0.0)).xy + texture(vel, b - vec2(texel.x, 0.0)).xy
         + texture(vel, b + vec2(0.0, texel.y)).xy + texture(vel, b - vec2(0.0, texel.y)).xy;
  a = mix(a, n * 0.25, 0.25) * pow(decay, dt);
  vec2 d = uv - ptr; d.x *= aspect;
  a += force * exp(-dot(d, d) / radius);
  o = vec4(a, 0.0, 1.0);
}`;

const BLEED_DYE = FRAG_HEAD + `
uniform sampler2D dye, vel;
uniform float dt, decay, radius, aspect;
uniform vec2 ptr;
uniform vec3 ink;
void main() {
  vec2 v = texture(vel, uv).xy;
  vec3 c = texture(dye, uv - v * dt).rgb * pow(decay, dt);
  vec2 d = uv - ptr; d.x *= aspect;
  c += ink * exp(-dot(d, d) / (radius * 1.6));
  o = vec4(min(c, vec3(1.0)), 1.0);
}`;

const BLEED_SHOW = FRAG_HEAD + GLOW + `
uniform sampler2D dye, vel;
uniform float smear;
void main() {
  vec2 off = texture(vel, uv).xy * smear;
  // Each channel is dragged a slightly different distance: colours separate
  // and bleed into each other along the cursor's path.
  vec3 base = vec3(glow(uv - off * 1.25).r, glow(uv - off).g, glow(uv - off * 0.75).b);
  vec3 ink = texture(dye, uv).rgb;
  o = vec4(1.0 - (1.0 - base) * (1.0 - ink), 1.0);
}`;

// ── WebGL plumbing ─────────────────────────────

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(s));
  }
  return s;
}

function program(gl, frag) {
  const p = gl.createProgram();
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, frag));
  gl.bindAttribLocation(p, 0, "p");
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const u = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const { name } = gl.getActiveUniform(p, i);
    u[name] = gl.getUniformLocation(p, name);
  }
  return { p, u };
}

function target(gl, w, h) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  return { tex, fb, w, h };
}

function pingPong(gl, w, h) {
  let a = target(gl, w, h);
  let b = target(gl, w, h);
  return {
    get read() { return a; },
    get write() { return b; },
    swap() { [a, b] = [b, a]; },
    dispose() {
      [a, b].forEach((t) => { gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fb); });
    },
  };
}

function setUniforms(gl, u, values) {
  let unit = 0;
  for (const [k, v] of Object.entries(values)) {
    const loc = u[k];
    if (loc == null) continue;
    if (v && v.tex) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, v.tex);
      gl.uniform1i(loc, unit++);
    } else if (typeof v === "number") gl.uniform1f(loc, v);
    else if (v.length === 2) gl.uniform2f(loc, v[0], v[1]);
    else if (v.length === 3) gl.uniform3f(loc, v[0], v[1], v[2]);
  }
}

// ── Component ──────────────────────────────────

export default function HeroCanvas({ onReady }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    if (!canvas || !hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl2", {
      alpha: false, antialias: false, depth: false, stencil: false,
      premultipliedAlpha: false, powerPreference: "low-power",
    });
    if (!gl || !(gl.getExtension("EXT_color_buffer_float") || gl.getExtension("EXT_color_buffer_half_float"))) {
      return;
    }

    let progs;
    try {
      progs = { vel: program(gl, BLEED_VEL), dye: program(gl, BLEED_DYE), show: program(gl, BLEED_SHOW) };
    } catch (err) {
      console.warn("Hero background disabled:", err);
      return;
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const T = TUNING;
    const autoMove = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let cssW = 1, cssH = 1, fields = [], velF, dyeF;
    const ptr = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, moved: false, auto: false };
    let lastInput = -Infinity;
    let visible = true;
    let raf = 0;
    let last = 0;

    function draw(prog, values, dest) {
      gl.useProgram(prog.p);
      setUniforms(gl, prog.u, values);
      gl.bindFramebuffer(gl.FRAMEBUFFER, dest ? dest.fb : null);
      gl.viewport(0, 0, dest ? dest.w : canvas.width, dest ? dest.h : canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function resize() {
      const r = hero.getBoundingClientRect();
      cssW = Math.max(1, r.width);
      cssH = Math.max(1, r.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      fields.forEach((f) => f.dispose());
      const sw = Math.max(32, Math.round(cssW * T.simScale));
      const sh = Math.max(32, Math.round(cssH * T.simScale));
      velF = pingPong(gl, sw, sh);
      dyeF = pingPong(gl, sw, sh);
      fields = [velF, dyeF];
      step(0);
    }

    function inkColour(x) {
      // Warm on the left, cool on the right, like the glow itself.
      const t = Math.min(1, Math.max(0, (x - 0.15) / 0.7));
      const warm = [1.0, 0.62, 0.04], cool = [0.16, 0.59, 1.0];
      return warm.map((w, i) => (w + (cool[i] - w) * t) * T.ink);
    }

    function step(dt) {
      const res = [cssW, cssH];
      const aspect = cssW / cssH;
      const dx = ptr.x - ptr.px, dy = ptr.y - ptr.py;
      const moved = ptr.moved;

      const s = moved && dt > 0 ? T.force / Math.max(dt, 1 / 120) : 0;
      const force = [Math.max(-3, Math.min(3, dx * s)), Math.max(-3, Math.min(3, dy * s))];
      const speed = Math.hypot(dx * aspect, dy);
      const texel = [1 / velF.read.w, 1 / velF.read.h];
      draw(progs.vel, {
        vel: velF.read, texel, dt, decay: T.velDecay, radius: T.radius, aspect,
        ptr: [ptr.x, ptr.y], force,
      }, velF.write);
      velF.swap();
      draw(progs.dye, {
        dye: dyeF.read, vel: velF.read, dt, decay: T.dyeDecay, radius: T.radius, aspect,
        ptr: [ptr.x, ptr.y],
        ink: moved ? inkColour(ptr.x).map((c) => c * (ptr.auto ? 0.45 : Math.min(1, speed * 40))) : [0, 0, 0],
      }, dyeF.write);
      dyeF.swap();
      draw(progs.show, { res, dye: dyeF.read, vel: velF.read, smear: T.smear }, null);
      ptr.px = ptr.x;
      ptr.py = ptr.y;
      ptr.moved = false;
    }

    function frame(now) {
      raf = 0;
      const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
      last = now;
      if (autoMove && now - lastInput > 1500) {
        // A slow figure-of-eight drift, standing in for a cursor.
        const t = now / 1000;
        ptr.x = 0.55 + 0.32 * Math.sin(t * 0.21);
        ptr.y = 0.5 + 0.28 * Math.sin(t * 0.37 + 1.3);
        ptr.moved = true;
        ptr.auto = true;
      }
      step(dt);
      if (shouldRun(now)) raf = requestAnimationFrame(frame);
      else last = 0;
    }

    function shouldRun(now = performance.now()) {
      return visible && !document.hidden && (autoMove || now - lastInput < IDLE_MS);
    }

    function wake() {
      if (!raf && shouldRun()) raf = requestAnimationFrame(frame);
    }

    function onMove(e) {
      const r = hero.getBoundingClientRect();
      ptr.x = (e.clientX - r.left) / r.width;
      ptr.y = 1 - (e.clientY - r.top) / r.height;
      ptr.moved = true;
      ptr.auto = false;
      lastInput = performance.now();
      wake();
    }

    function onEnter(e) {
      // Don't streak in from wherever the pointer last left.
      const r = hero.getBoundingClientRect();
      ptr.px = ptr.x = (e.clientX - r.left) / r.width;
      ptr.py = ptr.y = 1 - (e.clientY - r.top) / r.height;
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    const ro = new ResizeObserver(() => resize());
    const onVis = () => wake();

    resize();
    io.observe(hero);
    ro.observe(hero);
    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerenter", onEnter, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    onReady?.(true);
    wake();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerenter", onEnter);
      document.removeEventListener("visibilitychange", onVis);
      fields.forEach((f) => f.dispose());
      Object.values(progs).forEach(({ p }) => gl.deleteProgram(p));
      gl.deleteBuffer(quad);
      onReady?.(false);
    };
  }, [onReady]);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
