/* fiona v1 — WebGL stage: real Fiona photos/videos on a shader plane.
   Noise-dissolve "liquid" transitions + mouse-driven depth parallax.
   Falls back silently to the DOM crossfade (app.js) if WebGL / CDN is unavailable. */
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const stage = document.getElementById('stage');
const col = stage && stage.parentElement;

function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (_) { return false; }
}

if (stage && !RM && webglOK()) {
  // lazy-init only when the stage becomes visible
  const io = new IntersectionObserver(es => {
    if (es.some(e => e.isIntersecting)) { io.disconnect(); init().catch(e => console.warn('fiona stage3d disabled:', e && e.message)); }
  }, { rootMargin: '200px' });
  io.observe(stage);
}

async function init() {
  const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');

  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // pass-through: textures are sampled raw
  const canvas = renderer.domElement;
  canvas.className = 'stage-gl';
  canvas.setAttribute('aria-hidden', 'true');
  stage.insertBefore(canvas, stage.querySelector('.stage-layers').nextSibling);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const blank = new THREE.DataTexture(new Uint8Array([246, 211, 199, 255]), 1, 1);
  blank.needsUpdate = true;

  const U = {
    tA: { value: blank }, tB: { value: blank },
    sA: { value: new THREE.Vector2(1, 1) }, sB: { value: new THREE.Vector2(1, 1) },
    aA: { value: 1 }, aB: { value: 1 },
    p: { value: 0 }, uTime: { value: 0 },
    uM: { value: new THREE.Vector2(0, 0) },
    uAspect: { value: 1 }
  };
  const mat = new THREE.ShaderMaterial({
    uniforms: U,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: `
      precision highp float;
      uniform sampler2D tA, tB; uniform vec2 sA, sB; uniform float p, uTime; uniform vec2 uM;
      varying vec2 vUv;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
        return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y); }
      float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a*noise(p); p *= 2.03; a *= 0.5; } return v; }
      vec2 cover(vec2 uv, vec2 s){ return (uv - 0.5) * s + 0.5; }
      void main(){
        vec2 uv = vUv;
        vec2 c = uv - 0.5;
        float bulge = 1.0 - dot(c, c) * 1.6;            // centre feels closer than the rim
        vec2 par = uM * 0.022 * bulge;                   // depth parallax
        vec2 base = c * 0.95 + 0.5;                      // slight overscan so edges never show
        float n = fbm(uv * vec2(2.2, 3.0) + vec2(0.0, uTime * 0.06));
        float w = 0.16;
        float field = n * 0.62 + uv.y * 0.38;            // rises from the bottom like water in a vase
        float f = smoothstep(field - w, field + w, p * (1.0 + 2.0 * w) - w);
        vec2 d = vec2(fbm(uv * 3.0 + 1.7), fbm(uv * 3.0 + 9.2)) - 0.5;
        vec2 uA = base + par + d * 0.32 * f;
        vec2 uB = base + par * 1.25 + d * 0.32 * (1.0 - f);
        vec3 a = texture2D(tA, cover(uA, sA)).rgb;
        vec3 b = texture2D(tB, cover(uB, sB)).rgb;
        vec3 col = mix(a, b, f);
        float seam = f * (1.0 - f) * 4.0;
        col += vec3(0.99, 0.84, 0.78) * pow(seam, 1.5) * 0.42;   // petal-coloured glow on the seam
        gl_FragColor = vec4(col, 1.0);
      }`
  });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

  /* ---------- sizing ---------- */
  let W = 1, H = 1;
  const coverScale = (iw, ih, out) => {
    const ca = W / H, ia = iw / ih;
    if (ia > ca) out.set(ca / ia, 1); else out.set(1, ia / ca);
  };
  const resize = () => {
    const r = stage.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    renderer.setSize(W, H, false);
    coverScale(U.aA.value, 1, U.sA.value); coverScale(U.aB.value, 1, U.sB.value);
  };
  new ResizeObserver(resize).observe(stage);
  resize();

  /* ---------- textures ---------- */
  const loader = new THREE.TextureLoader();
  const cache = new Map();
  const prep = t => { t.colorSpace = THREE.NoColorSpace; t.minFilter = THREE.LinearFilter; t.generateMipmaps = false; return t; };
  const loadImg = src => cache.get(src) || (() => {
    const pr = new Promise((res, rej) => loader.load(src, t => res(prep(t)), undefined, rej));
    cache.set(src, pr);
    if (cache.size > 24) { const k = cache.keys().next().value; cache.get(k).then(t => t.dispose()).catch(() => {}); cache.delete(k); }
    return pr;
  })();
  const aspectOf = t => t.image ? ((t.image.videoWidth || t.image.width) / (t.image.videoHeight || t.image.height)) : 1;

  /* ---------- transitions ---------- */
  let token = 0, anim = null, video = null, videoTex = null, glReady = false;
  const setSlot = (slot, tex) => {
    U['t' + slot].value = tex; U['a' + slot].value = aspectOf(tex);
    coverScale(U['a' + slot].value, 1, U['s' + slot].value);
  };
  async function show({ img, vid }) {
    const my = ++token;
    let tex;
    try { tex = await loadImg(img); } catch (_) { return; }
    if (my !== token) return;
    // if a transition is mid-way, settle on whichever image is dominant
    if (anim) { if (U.p.value > 0.5) setSlot('A', U.tB.value); anim = null; }
    if (U.tA.value === blank) { setSlot('A', tex); setSlot('B', tex); U.p.value = 0; }   // first image: no dissolve from empty
    else { setSlot('B', tex); U.p.value = 0; anim = { t0: performance.now(), d: 1400 }; }
    const oldVideo = video;
    video = null;
    if (vid) {
      const v = document.createElement('video');
      Object.assign(v, { muted: true, loop: true, playsInline: true, preload: 'auto', crossOrigin: 'anonymous' });
      v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
      v.src = vid;
      video = v;
      const swap = () => {
        if (my !== token || video !== v) return;
        const vt = prep(new THREE.VideoTexture(v));
        const prevTex = videoTex; videoTex = vt;
        // poster == first frame, so the swap is seamless
        if (anim) setSlot('B', vt); else setSlot('A', vt);
        if (prevTex) setTimeout(() => prevTex.dispose(), 1500);
      };
      v.addEventListener('playing', swap, { once: true });
      v.play().catch(() => {});
    }
    if (oldVideo) setTimeout(() => { oldVideo.pause(); oldVideo.removeAttribute('src'); oldVideo.load(); }, 1500);
    glReady = true;
  }

  /* ---------- pointer depth + tilt ---------- */
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const m = { x: 0, y: 0, tx: 0, ty: 0 };
  if (fine) {
    col.addEventListener('pointermove', e => {
      const r = stage.getBoundingClientRect();
      m.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      m.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    }, { passive: true });
    col.addEventListener('pointerleave', () => { m.tx = 0; m.ty = 0; });
  }

  /* ---------- loop (paused off-screen / hidden tab) ---------- */
  let visible = true, raf = 0;
  const clock = performance.now();
  function frame(now) {
    raf = 0;
    if (!visible || document.hidden) return;
    U.uTime.value = (now - clock) / 1000;
    if (!fine) { m.tx = Math.sin(U.uTime.value * 0.35) * 0.35; m.ty = Math.cos(U.uTime.value * 0.27) * 0.25; }
    m.x += (m.tx - m.x) * 0.06; m.y += (m.ty - m.y) * 0.06;
    U.uM.value.set(m.x, -m.y);
    stage.style.setProperty('--tilt-x', (-m.y * 2.6).toFixed(3) + 'deg');
    stage.style.setProperty('--tilt-y', (m.x * 3.4).toFixed(3) + 'deg');
    if (anim) {
      const k = Math.min(1, (now - anim.t0) / anim.d);
      U.p.value = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      if (k >= 1) { setSlot('A', U.tB.value); U.p.value = 0; anim = null; }
    }
    renderer.render(scene, camera);
    if (glReady && !stage.classList.contains('gl-on')) stage.classList.add('gl-on');
    raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
  new IntersectionObserver(es => {
    visible = es.some(e => e.isIntersecting);
    if (video) visible ? video.play().catch(() => {}) : video.pause();
    kick();
  }).observe(stage);
  document.addEventListener('visibilitychange', kick);
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); stage.classList.remove('gl-on'); window.FionaStage = null; });

  window.FionaStage = { show: p => { show(p); kick(); }, state: () => ({ p: U.p.value, anim: !!anim, video: !!video }) };
  if (window.__fionaStage) window.FionaStage.show(window.__fionaStage);
  kick();
}
