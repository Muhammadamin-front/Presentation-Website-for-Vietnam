import { useEffect, useRef, useState, type ComponentProps } from "react";
import { cn } from "../lib/utils";

/* WebGL2 suyuqlik simulyatsiyasi (Navier–Stokes, stable fluids):
   suv yuzasiga lak tomchilari tushadi, sichqoncha bilan oqim hosil bo‘ladi.
   Bo‘yoq «yutilish» (absorbance) sifatida saqlanadi: rang = qog‘oz · e^(−a). */

const PAPER: [number, number, number] = [248 / 255, 245 / 255, 239 / 255];

function absorb(hex: string, k = 1): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
    .map((c) => c / 255)
    .map((c, i) => -Math.log(Math.max(c, 0.01) / PAPER[i]) * k) as [number, number, number];
}

const LACQUER = absorb("#8f1d14"); // lak-qizil
const DARK = absorb("#24130e", 0.9); // qora lak
const GOLD = absorb("#c9971c", 0.75); // oltin
const CLEAR: [number, number, number] = [0, 0, 0];
const PIGMENTS = [LACQUER, DARK, GOLD];

const CFG = {
  simRes: 128,
  dyeRes: 1024,
  densityDissipation: 0.018,
  velocityDissipation: 0.9,
  pressure: 0.8,
  pressureIterations: 20,
  curl: 6,
  splatRadius: 9e-4,
  splatForce: 3200,
};

const VERT = `#version 300 es
precision highp float;
in vec2 aPosition;
out vec2 vUv; out vec2 vL; out vec2 vR; out vec2 vT; out vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const HEAD = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
out vec4 fragColor;
`;

const FRAG = {
  copy: `${HEAD}
uniform sampler2D uTexture;
void main () { fragColor = texture(uTexture, vUv); }`,
  clear: `${HEAD}
uniform sampler2D uTexture; uniform float value;
void main () { fragColor = value * texture(uTexture, vUv); }`,
  splat: `${HEAD}
uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;
void main () {
  vec2 p = vUv - point; p.x *= aspectRatio;
  vec3 s = exp(-dot(p, p) / radius) * color;
  fragColor = vec4(texture(uTarget, vUv).xyz + s, 1.0);
}`,
  advection: `${HEAD}
uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation;
void main () {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  fragColor = texture(uSource, coord) / (1.0 + dissipation * dt);
}`,
  divergence: `${HEAD}
uniform sampler2D uVelocity;
void main () {
  float L = texture(uVelocity, vL).x; float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y; float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x; if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y; if (vB.y < 0.0) B = -C.y;
  fragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,
  curl: `${HEAD}
uniform sampler2D uVelocity;
void main () {
  float L = texture(uVelocity, vL).y; float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x; float B = texture(uVelocity, vB).x;
  fragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,
  vorticity: `${HEAD}
uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
void main () {
  float L = texture(uCurl, vL).x; float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x; float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C; force.y *= -1.0;
  vec2 v = texture(uVelocity, vUv).xy + force * dt;
  fragColor = vec4(clamp(v, -1000.0, 1000.0), 0.0, 1.0);
}`,
  pressure: `${HEAD}
uniform sampler2D uPressure; uniform sampler2D uDivergence;
void main () {
  float L = texture(uPressure, vL).x; float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x; float B = texture(uPressure, vB).x;
  float d = texture(uDivergence, vUv).x;
  fragColor = vec4((L + R + B + T - d) * 0.25, 0.0, 0.0, 1.0);
}`,
  gradient: `${HEAD}
uniform sampler2D uPressure; uniform sampler2D uVelocity;
void main () {
  float L = texture(uPressure, vL).x; float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x; float B = texture(uPressure, vB).x;
  vec2 v = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  fragColor = vec4(v, 0.0, 1.0);
}`,
  drop: `${HEAD}
uniform sampler2D uTarget; uniform vec2 center; uniform float aspectRatio;
uniform float area; uniform vec3 pigment; uniform float softness;
void main () {
  vec2 d = vUv - center; d.x *= aspectRatio;
  float r2 = dot(d, d);
  float a = area / 3.14159265;
  vec4 base = vec4(pigment, 1.0);
  if (r2 > a) {
    vec2 src = d * sqrt((r2 - a) / r2);
    src.x /= aspectRatio;
    base = texture(uTarget, center + src);
  }
  float k = smoothstep(sqrt(a) - softness, sqrt(a) + softness, sqrt(r2));
  fragColor = mix(vec4(pigment, 1.0), base, k);
}`,
  display: `${HEAD}
uniform sampler2D uTexture; uniform vec3 paper; uniform vec2 dyeTexel;
float hash (vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main () {
  vec3 c = texture(uTexture, vUv).rgb;
  vec2 o = dyeTexel * 1.5;
  vec3 blur = (texture(uTexture, vUv + vec2(o.x, 0.0)).rgb + texture(uTexture, vUv - vec2(o.x, 0.0)).rgb
             + texture(uTexture, vUv + vec2(0.0, o.y)).rgb + texture(uTexture, vUv - vec2(0.0, o.y)).rgb) * 0.25;
  vec3 a = max(c + (c - blur) * 1.1, 0.0);
  vec3 col = paper * exp(-a);
  col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  fragColor = vec4(col, 1.0);
}`,
};

type Prog = { program: WebGLProgram; uniforms: Record<string, WebGLUniformLocation | null> };
type FBO = {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (unit: number) => number;
};
type DoubleFBO = {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap: () => void;
};

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

function link(gl: WebGL2RenderingContext, vs: WebGLShader, fs: string): Prog {
  const p = gl.createProgram()!;
  gl.attachShader(p, vs);
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.bindAttribLocation(p, 0, "aPosition");
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(p) ?? "link");
  const uniforms: Prog["uniforms"] = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const name = gl.getActiveUniform(p, i)!.name;
    uniforms[name] = gl.getUniformLocation(p, name);
  }
  return { program: p, uniforms };
}

function createFBO(gl: WebGL2RenderingContext, w: number, h: number, internal: number, format: number): FBO {
  gl.activeTexture(gl.TEXTURE0);
  const texture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, gl.HALF_FLOAT, null);
  const fbo = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.viewport(0, 0, w, h);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  return {
    texture,
    fbo,
    width: w,
    height: h,
    texelSizeX: 1 / w,
    texelSizeY: 1 / h,
    attach(unit: number) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      return unit;
    },
  };
}

function createDouble(gl: WebGL2RenderingContext, w: number, h: number, internal: number, format: number): DoubleFBO {
  let a = createFBO(gl, w, h, internal, format);
  let b = createFBO(gl, w, h, internal, format);
  return {
    width: w,
    height: h,
    texelSizeX: 1 / w,
    texelSizeY: 1 / h,
    get read() {
      return a;
    },
    get write() {
      return b;
    },
    swap() {
      const t = a;
      a = b;
      b = t;
    },
  };
}

function resolution(gl: WebGL2RenderingContext, res: number) {
  let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
  if (aspect < 1) aspect = 1 / aspect;
  const min = Math.round(res);
  const max = Math.round(res * aspect);
  return gl.drawingBufferWidth > gl.drawingBufferHeight ? { w: max, h: min } : { w: min, h: max };
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

type Drop = {
  kind: "drop";
  at: number;
  x: number;
  y: number;
  area: number;
  pigment: [number, number, number];
  frames: number;
  done: number;
};
type Stroke = {
  kind: "stroke";
  at: number;
  dur: number;
  force: number;
  path: (t: number) => [number, number];
  last?: [number, number];
};
type Event = Drop | Stroke;

/** Bir nuqtaga ketma-ket halqali tomchilar (marmar «nishoni») */
function rings(x: number, y: number, count: number, area: number, at: number, gap = 0.2): Drop[] {
  const out: Drop[] = [];
  for (let i = 0; i < count; i++) {
    const last = i === count - 1;
    const pigmented = (count - 1 - i) % 2 === 0;
    out.push({
      kind: "drop",
      at: at + i * gap,
      x,
      y,
      area: area * (pigmented ? 1 : 0.75) * rand(0.7, 1.3),
      pigment: last ? LACQUER : pigmented ? PIGMENTS[Math.floor(Math.random() * PIGMENTS.length)] : CLEAR,
      frames: 9,
      done: 0,
    });
  }
  return out;
}

export function InkBasin({
  auto = true,
  onInkDrop,
  className,
  children,
  ...rest
}: ComponentProps<"div"> & { auto?: boolean; onInkDrop?: (n: number) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);
  const cb = useRef(onInkDrop);
  cb.current = onInkDrop;

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.className = "absolute inset-0 -z-10 block size-full touch-none";
    el.prepend(canvas);
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    });
    if (!gl || !(gl.getExtension("EXT_color_buffer_float") || gl.getExtension("EXT_color_buffer_half_float"))) {
      canvas.remove();
      setFallback(true);
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let P: Record<keyof typeof FRAG, Prog>;
    try {
      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      P = Object.fromEntries(Object.entries(FRAG).map(([k, src]) => [k, link(gl, vs, src)])) as typeof P;
    } catch (err) {
      console.warn("InkBasin: shader failed", err);
      canvas.remove();
      setFallback(true);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    const blit = (target: FBO | null) => {
      if (target) {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      } else {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };
    const use = (p: Prog) => (gl.useProgram(p.program), p.uniforms);

    let dye!: DoubleFBO;
    let velocity!: DoubleFBO;
    let divergence!: FBO;
    let curl!: FBO;
    let pressure!: DoubleFBO;

    const resize = (t: DoubleFBO, w: number, h: number, internal: number, format: number) => {
      if (t.width === w && t.height === h) return t;
      const next = createDouble(gl, w, h, internal, format);
      const u = use(P.copy);
      gl.uniform2f(u.texelSize, 1 / w, 1 / h);
      gl.uniform1i(u.uTexture, t.read.attach(0));
      blit(next.write);
      next.swap();
      return next;
    };
    const initFramebuffers = (first: boolean) => {
      const sim = resolution(gl, CFG.simRes);
      const dyeR = resolution(gl, CFG.dyeRes);
      gl.disable(gl.BLEND);
      if (first) {
        dye = createDouble(gl, dyeR.w, dyeR.h, gl.RGBA16F, gl.RGBA);
        velocity = createDouble(gl, sim.w, sim.h, gl.RG16F, gl.RG);
      } else {
        dye = resize(dye, dyeR.w, dyeR.h, gl.RGBA16F, gl.RGBA);
        velocity = resize(velocity, sim.w, sim.h, gl.RG16F, gl.RG);
      }
      divergence = createFBO(gl, sim.w, sim.h, gl.R16F, gl.RED);
      curl = createFBO(gl, sim.w, sim.h, gl.R16F, gl.RED);
      pressure = createDouble(gl, sim.w, sim.h, gl.R16F, gl.RED);
    };
    const fitCanvas = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(r.width * dpr));
      const h = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width === w && canvas.height === h) return false;
      canvas.width = w;
      canvas.height = h;
      return true;
    };
    fitCanvas();
    initFramebuffers(true);

    const aspect = () => canvas.width / canvas.height;
    const splat = (x: number, y: number, dx: number, dy: number) => {
      const u = use(P.splat);
      gl.uniform1i(u.uTarget, velocity.read.attach(0));
      gl.uniform1f(u.aspectRatio, aspect());
      gl.uniform2f(u.point, x, y);
      gl.uniform3f(u.color, dx, dy, 0);
      gl.uniform1f(u.radius, CFG.splatRadius * (aspect() > 1 ? aspect() : 1));
      blit(velocity.write);
      velocity.swap();
    };
    const drop = (d: Drop) => {
      const u = use(P.drop);
      gl.uniform1i(u.uTarget, dye.read.attach(0));
      gl.uniform2f(u.center, d.x, d.y);
      gl.uniform1f(u.aspectRatio, aspect());
      gl.uniform1f(u.area, d.area / d.frames);
      gl.uniform3f(u.pigment, d.pigment[0], d.pigment[1], d.pigment[2]);
      gl.uniform1f(u.softness, 1.2 / dye.height);
      blit(dye.write);
      dye.swap();
    };
    const simulate = (dt: number) => {
      gl.disable(gl.BLEND);
      let u = use(P.curl);
      gl.uniform2f(u.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(u.uVelocity, velocity.read.attach(0));
      blit(curl);

      u = use(P.vorticity);
      gl.uniform2f(u.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(u.uVelocity, velocity.read.attach(0));
      gl.uniform1i(u.uCurl, curl.attach(1));
      gl.uniform1f(u.curl, CFG.curl);
      gl.uniform1f(u.dt, dt);
      blit(velocity.write);
      velocity.swap();

      u = use(P.divergence);
      gl.uniform2f(u.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(u.uVelocity, velocity.read.attach(0));
      blit(divergence);

      u = use(P.clear);
      gl.uniform1i(u.uTexture, pressure.read.attach(0));
      gl.uniform1f(u.value, CFG.pressure);
      blit(pressure.write);
      pressure.swap();

      u = use(P.pressure);
      gl.uniform2f(u.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(u.uDivergence, divergence.attach(0));
      for (let i = 0; i < CFG.pressureIterations; i++) {
        gl.uniform1i(u.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      u = use(P.gradient);
      gl.uniform2f(u.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(u.uPressure, pressure.read.attach(0));
      gl.uniform1i(u.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      u = use(P.advection);
      gl.uniform2f(u.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      const v = velocity.read.attach(0);
      gl.uniform1i(u.uVelocity, v);
      gl.uniform1i(u.uSource, v);
      gl.uniform1f(u.dt, dt);
      gl.uniform1f(u.dissipation, CFG.velocityDissipation);
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(u.uVelocity, velocity.read.attach(0));
      gl.uniform1i(u.uSource, dye.read.attach(1));
      gl.uniform1f(u.dissipation, CFG.densityDissipation);
      blit(dye.write);
      dye.swap();
    };
    const display = () => {
      const u = use(P.display);
      gl.uniform1i(u.uTexture, dye.read.attach(0));
      gl.uniform3f(u.paper, PAPER[0], PAPER[1], PAPER[2]);
      gl.uniform2f(u.dyeTexel, dye.texelSizeX, dye.texelSizeY);
      blit(null);
    };

    let time = 0;
    let drops = 0;
    let lastTouch = -10;
    let nextAuto = 11;

    /* Ochilish xoreografiyasi: uchta lak «nishoni», keyin taroq bilan tortish */
    const queue: Event[] = [
      ...rings(0.72, 0.55, 11, 0.0068, 0.15, 0.16),
      ...rings(0.8, 0.16, 7, 0.0042, 0.9, 0.16),
      ...rings(0.6, 0.9, 5, 0.0026, 1.6, 0.16),
      {
        kind: "stroke",
        at: 3.6,
        dur: 3.2,
        force: 0.3,
        path: (t) => [0.42 + t * 0.6, 0.98 - t * 0.95 + Math.sin(t * Math.PI * 2) * 0.08],
      },
      ...[0.3, 0.44, 0.58, 0.72].map(
        (y, i): Stroke => ({
          kind: "stroke",
          at: 5.2 + i * 0.35,
          dur: 2.4,
          force: 0.34,
          path: (t) =>
            i % 2 === 0
              ? [0.48 + t * 0.56, y + Math.sin(t * Math.PI) * 0.02]
              : [1.04 - t * 0.56, y - Math.sin(t * Math.PI) * 0.02],
        }),
      ),
      {
        kind: "stroke",
        at: 8.4,
        dur: 2.6,
        force: 0.26,
        path: (t) => [1.02 - t * 0.5, 0.44 + Math.sin(t * Math.PI * 3) * 0.05],
      },
    ];
    const enqueue = (evts: Event[]) => queue.push(...evts);

    const runQueue = () => {
      for (let i = queue.length - 1; i >= 0; i--) {
        const e = queue[i];
        if (time < e.at) continue;
        if (e.kind === "drop") {
          if (e.done === 0 && e.pigment !== CLEAR) {
            drops += 1;
            cb.current?.(drops);
          }
          drop(e);
          e.done += 1;
          if (e.done >= e.frames) queue.splice(i, 1);
        } else {
          const t = Math.min(1, (time - e.at) / e.dur);
          const p = e.path(t);
          if (e.last)
            splat(
              p[0],
              p[1],
              (p[0] - e.last[0]) * CFG.splatForce * e.force,
              (p[1] - e.last[1]) * CFG.splatForce * e.force,
            );
          e.last = p;
          if (t >= 1) queue.splice(i, 1);
        }
      }
    };

    /* Tinch turganda vaqti-vaqti bilan o‘zi tomchi tashlaydi */
    const autoDrop = () => {
      if (!auto || reduced || time < nextAuto) return;
      if (time - lastTouch < 5) {
        nextAuto = time + 3;
        return;
      }
      const x = rand(0.56, 0.82);
      const y = rand(0.15, 0.85);
      enqueue(rings(x, y, 3 + Math.floor(Math.random() * 3) * 2, rand(0.0025, 0.005), time + 0.05, 0.22));
      const ang = rand(0, Math.PI * 2);
      const len = rand(0.25, 0.45);
      const sx = x + Math.cos(ang) * 0.25;
      const sy = y + Math.sin(ang) * 0.25;
      queue.push({
        kind: "stroke",
        at: time + 2.4,
        dur: 1.8,
        force: 0.2,
        path: (t) => [sx - Math.cos(ang) * len * t, sy - Math.sin(ang) * len * t + Math.sin(t * Math.PI * 2) * 0.03],
      });
      nextAuto = time + rand(8, 11);
    };

    let pointer: { x: number; y: number; down: boolean; moved: number } | null = null;
    const toUv = (e: PointerEvent): [number, number] => {
      const r = canvas.getBoundingClientRect();
      return [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height];
    };
    const onMove = (e: PointerEvent) => {
      if (reduced) return;
      const [x, y] = toUv(e);
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      if (pointer) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        if (Math.abs(dx) + Math.abs(dy) > 0) {
          splat(x, y, dx * CFG.splatForce, dy * CFG.splatForce);
          pointer.moved += Math.hypot(dx, dy);
        }
        pointer.x = x;
        pointer.y = y;
      } else pointer = { x, y, down: false, moved: 0 };
      lastTouch = time;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      const [x, y] = toUv(e);
      pointer = { x, y, down: true, moved: 0 };
    };
    const onUp = (e: PointerEvent) => {
      if (!pointer?.down || (e.target as HTMLElement).closest("a,button")) return;
      if (pointer.moved < 0.02) {
        const [x, y] = toUv(e);
        enqueue(rings(x, y, 3, rand(0.003, 0.0055), time, 0.18));
        lastTouch = time;
        wake();
      }
      pointer.down = false;
    };
    const onLeave = () => {
      pointer = null;
    };

    let raf = 0;
    let prev = performance.now();
    let visible = true;
    const limit = reduced ? 9 : Infinity;
    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min((now - prev) / 1000, 1 / 60);
      prev = now;
      time += dt;
      if (fitCanvas()) initFramebuffers(false);
      runQueue();
      autoDrop();
      simulate(dt);
      display();
      if (visible && !document.hidden && time < limit) raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!raf && visible && !document.hidden) {
        prev = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
        if (visible) wake();
      },
      { threshold: 0 },
    );
    io.observe(el);
    const ro = new ResizeObserver(() => wake());
    ro.observe(el);
    const onVis = () => wake();
    document.addEventListener("visibilitychange", onVis);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onLeave);
    wake();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onLeave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [auto]);

  return (
    <div ref={host} className={cn("relative isolate overflow-hidden bg-paper", className)} {...rest}>
      {fallback && <StaticRings />}
      {children}
    </div>
  );
}

/** WebGL bo‘lmasa — statik lak halqalari */
function StaticRings() {
  const radii = [300, 262, 230, 196, 170, 138, 112, 84, 60, 36];
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 -z-10 size-full"
      viewBox="0 0 1000 700"
      preserveAspectRatio="xMidYMid slice"
    >
      {radii.map((r, i) => (
        <circle
          key={r}
          cx="690"
          cy="320"
          r={r}
          fill={i % 2 === 0 ? (i === radii.length - 1 ? "#8f1d14" : "#d9b8a8") : "#f8f5ef"}
          opacity={0.25 + i * 0.05}
        />
      ))}
    </svg>
  );
}
