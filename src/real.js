/* ================= REALISTIC MODE (optional, per-visitor) =================
   Off  = the page exactly as before (nothing below touches the scene until the button is pressed).
   On   = linear-light workflow, golden-hour sun + soft window light (RectAreaLight) + warm lamps, glossy floors, wood grain,
          environment reflections, then (by device tier) SSAO contact shadows, HDR bloom, ACES filmic grade, vignette and grain.
   Every change made on enable() is recorded and undone on disable(), so toggling is lossless.
   Tiers: 1 light (direct render) · 2 balanced (half-res AO + bloom) · 3 max (full-res AO + bloom, MSAA).
   The tier is picked from the device, then lowered/raised at run time from measured frame times (dynamic resolution first).
   The heavy part (three.js post-processing + area-light tables, ~370 KB / 120 KB gzipped) lives in ../fx.js and is fetched only on the
   first press of the button, so a visitor who never presses it downloads nothing extra. */
const lin = h => new THREE.Color(h).convertSRGBToLinear();
const CINE = (function(){
  const EXPOSURE = .78;
  const NAMES = { th:{1:'ประหยัด',2:'สมดุล',3:'สูงสุด'}, en:{1:'Lite',2:'Mid',3:'Max'} };
  const LBL = {
    th:{ btn:'สมจริง', off:'ปิดอยู่', busy:'รอสักครู่…', on:'เปิด', tip:'โหมดสมจริง: แสงแดด เงา และเงาสะท้อนแบบภาพยนตร์ ปรับคุณภาพตามเครื่องอัตโนมัติ', fail:'เปิดโหมดสมจริงไม่ได้ในตอนนี้ ลองกดอีกครั้ง' },
    en:{ btn:'Realistic', off:'Off', busy:'Wait…', on:'On', tip:'Realistic mode: cinematic sunlight, shadows and reflections. Quality adapts to your device automatically.', fail:'Could not start Realistic mode. Please try again.' } };
  const st = { on:false, busy:false, built:false, tier:2, maxTier:3, res:1, undo:[], extras:[], meshes:[], composer:null, ao:null, bloom:null, grade:null,
               W:1, H:1, lang:'th', ema:0, cnt:0, skip:0, fc:0, caps:null, S:null, win:null, sunDir:null, env:null, grain:null, sun:null, err:null };

  /* ---------- AO on the HDR buffer: SSAOPass renders its own 8-bit "beauty"; we reuse only its depth/normal + AO maths ---------- */
  let HdrAO = null;                                  // defined lazily: SSAOPass only exists once ../fx.js has loaded
  const makeHdrAO = () => class HdrAO extends THREE.SSAOPass {
    constructor(scene,camera,w,h){ super(scene,camera,w,h); this.aoFar = 24; this.kernelRadius = .42; this.minDistance = .0007; this.maxDistance = .022; this.resScale = 1; this._w = w; this._h = h; }
    setSize(w,h){
      this._w = w; this._h = h; const s = this.resScale;
      super.setSize(Math.max(2,w*s|0), Math.max(2,h*s|0));
      this.beautyRenderTarget.setSize(2,2);            // never used, keep it tiny
    }
    render(renderer, writeBuffer, readBuffer){
      const cam = this.camera, farKeep = cam.far, u = this.ssaoMaterial.uniforms;
      cam.far = this.aoFar; cam.updateProjectionMatrix();
      u.cameraNear.value = cam.near; u.cameraFar.value = cam.far;
      u.cameraProjectionMatrix.value.copy(cam.projectionMatrix); u.cameraInverseProjectionMatrix.value.copy(cam.projectionMatrixInverse);
      u.kernelRadius.value = this.kernelRadius; u.minDistance.value = this.minDistance; u.maxDistance.value = this.maxDistance;
      const hide = st.meshes.filter(o => { const m = Array.isArray(o.material) ? o.material[0] : o.material; return m.transparent && (m.depthWrite === false || m.opacity < .9) && !o.userData.keepAO; });
      const vis = hide.map(o => o.visible); hide.forEach(o => { o.visible = false; });
      this.renderOverride(renderer, this.normalMaterial, this.normalRenderTarget, 0x7777ff, 1.0);
      hide.forEach((o,i) => { o.visible = vis[i]; });
      cam.far = farKeep; cam.updateProjectionMatrix();
      this.renderPass(renderer, this.ssaoMaterial, this.ssaoRenderTarget, 0xffffff, 1.0);
      this.renderPass(renderer, this.blurMaterial, this.blurRenderTarget, 0xffffff, 1.0);
      const out = this.renderToScreen ? null : writeBuffer;
      this.copyMaterial.uniforms.tDiffuse.value = readBuffer.texture; this.copyMaterial.blending = THREE.NoBlending;
      this.renderPass(renderer, this.copyMaterial, out);
      this.copyMaterial.uniforms.tDiffuse.value = this.blurRenderTarget.texture; this.copyMaterial.blending = THREE.CustomBlending;
      this.renderPass(renderer, this.copyMaterial, out);
    }
  };

  const GradeShader = {
    uniforms:{ tDiffuse:{value:null}, exposure:{value:EXPOSURE}, vig:{value:.4}, grain:{value:.028}, ca:{value:.0016}, sat:{value:1.06}, res:{value:new THREE.Vector2(1,1)} },
    vertexShader:'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader:[
      'uniform sampler2D tDiffuse; uniform float exposure, vig, grain, ca, sat; uniform vec2 res; varying vec2 vUv;',
      'vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.); }',
      'vec3 toSRGB(vec3 c){ return mix(c*12.92, 1.055*pow(c,vec3(1./2.4))-.055, step(.0031308,c)); }',
      'void main(){',
      '  vec2 d = vUv-.5;',
      '  vec3 c = vec3(texture2D(tDiffuse,vUv+d*ca).r, texture2D(tDiffuse,vUv).g, texture2D(tDiffuse,vUv-d*ca).b)*exposure;',
      '  c = aces(c);',
      '  float l = dot(c,vec3(.2126,.7152,.0722)); c = mix(vec3(l),c,sat);',
      '  c = toSRGB(c);',
      '  c = mix(c, c*c*(3.-2.*c), .22);',
      '  float v = smoothstep(.25,1.0,length(d*vec2(res.x/res.y,1.)*.95)); c *= 1.-vig*v;',
      '  float n = fract(sin(dot(vUv*res+17.,vec2(12.9898,78.233)))*43758.5453); c += (n-.5)*grain;',
      '  gl_FragColor = vec4(c,1.);',
      '}'].join('\n')
  };

  /* ---------- small helpers ---------- */
  /* fade-group materials (userData.base) flip .transparent with the camera mode (dollhouse view ghosts the furniture), so judge them by authored opacity */
  const ghostly = m => m.userData && m.userData.base != null ? m.userData.base < 1 : !!m.transparent;
  const rec = f => { st.undo.push(f); };
  const setCol = (c,v) => { const o = c.clone(); c.copy(v); rec(() => c.copy(o)); };
  const setP = (o,k,v) => { const old = o[k]; o[k] = v; rec(() => { o[k] = old; }); };
  const qs = k => { try{ return new URLSearchParams(location.search).get(k); }catch(e){ return null; } };

  function detect(){
    const ex = renderer.extensions, gl2 = renderer.capabilities.isWebGL2, gl = renderer.getContext();
    let gpu = ''; try{ const e = gl.getExtension('WEBGL_debug_renderer_info'); if(e) gpu = String(gl.getParameter(e.UNMASKED_RENDERER_WEBGL) || ''); }catch(e){}
    const mobile = (window.matchMedia && matchMedia('(pointer:coarse)').matches) || /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent || '');
    return { gl2, gpu, mobile, sw:/swiftshader|llvmpipe|software/i.test(gpu),
      floatRT: !!(gl2 && (ex.has('EXT_color_buffer_float') || ex.has('EXT_color_buffer_half_float'))),
      floatLin: !!ex.has('OES_texture_float_linear'), cores: navigator.hardwareConcurrency || 0, mem: navigator.deviceMemory || 0 };
  }
  function pickTier(c){
    const q = +(qs('q') || 0);
    if(q >= 1 && q <= 3) return Math.min(q, c.floatRT ? 3 : 1);
    let t = c.mobile ? 2 : 3;
    if(!c.floatRT || c.sw) t = 1;
    if(c.mem && c.mem <= 2) t = Math.min(t,1);
    if(c.mobile && c.cores && c.cores <= 4) t = Math.min(t,1);
    return t;
  }

  /* ---------- survey the scene once (before anything is changed) ---------- */
  function survey(){
    const S = { mats:new Set(), hemi:[], dir:[], point:[], glass:[], floors:[], blobs:[], sky:null, ground:null, towers:[], solid:[] };
    scene.updateMatrixWorld(true);
    scene.traverse(o => {
      if(o.isHemisphereLight) S.hemi.push(o); else if(o.isDirectionalLight) S.dir.push(o); else if(o.isPointLight) S.point.push(o);
      if(!o.isMesh) return;
      const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(m => S.mats.add(m));
      const m = ms[0], g = o.geometry && o.geometry.type;
      if(m.userData && m.userData.glass){ S.glass.push(o); return; }
      if(m.isMeshBasicMaterial){
        if(g === 'SphereGeometry' && m.side === THREE.BackSide) S.sky = o;
        else if(g === 'CircleGeometry') S.ground = o;
        else if(g === 'BoxGeometry' && m.map && m.color.getHex() === 0xE1EAF0) S.towers.push(o);
        else if(m.map === blobT) S.blobs.push(o);
        return;
      }
      if(g === 'PlaneGeometry' && m.isMeshStandardMaterial && Math.abs(o.rotation.x + Math.PI/2) < .01 && Math.abs(o.position.y) < .03){
        const p = o.geometry.parameters; if(p.width*p.height > 1.2) S.floors.push(o);
      }
      const op = m.userData && m.userData.base != null ? m.userData.base : m.opacity;
      if(!m.transparent || op > .5) if(o.visible !== false) S.solid.push(o);
    });
    return S;
  }

  /* ---------- find the real window openings: large vertical glass panes whose outside is open (not shower screens) ---------- */
  function findWindows(S){
    const rc = new THREE.Raycaster(), v = new THREE.Vector3(), box = new THREE.Box3(), cl = new Map();
    S.glass.forEach(o => {
      box.setFromObject(o); box.getSize(v);
      const ax = v.x < v.z ? 'x' : 'z', thin = v[ax], w = ax === 'x' ? v.z : v.x, h = v.y;
      if(thin > .16 || w*h < .45 || h < .6 || box.min.y > 1.3 || box.max.y < 1.2) return;
      const c = box.getCenter(new THREE.Vector3()), sign = c[ax] > 0 ? -1 : 1;   // inward = toward the room origin
      if(Math.abs(c[ax]) < .5) return;
      const origin = c.clone(); origin.y = box.min.y + h*.75;
      const dir = new THREE.Vector3(); dir[ax] = -sign;
      rc.set(origin, dir); rc.far = 2.2;
      if(rc.intersectObjects(S.solid, false).length) return;                       // enclosed -> not a window to the sky
      const key = ax + ':' + Math.round(c[ax]*8) + ':' + sign;
      if(!cl.has(key)) cl.set(key, { ax, sign, box:box.clone() }); else cl.get(key).box.union(box);
    });
    const out = [...cl.values()].map(k => {
      const sz = k.box.getSize(new THREE.Vector3()), c = k.box.getCenter(new THREE.Vector3());
      return { ax:k.ax, sign:k.sign, c, w:k.ax === 'x' ? sz.z : sz.x, h:sz.y, area:(k.ax === 'x' ? sz.z : sz.x)*sz.y };
    }).sort((a,b) => b.area - a.area).slice(0,4);
    return out;
  }

  /* ---------- sun: golden hour, from the biggest opening, side-stepped so the light patch lands on the floor inside ---------- */
  function placeSun(win){
    const up = .41, side = .42;                       // elevation / sideways bias (tan-ish)
    let best = null;
    const main = win[0];
    const out = new THREE.Vector3(); if(main) out[main.ax] = -main.sign; else out.set(0,0,-1);
    const tan = new THREE.Vector3(out.z, 0, -out.x);
    [-1,1].forEach(sg => {
      const d = out.clone().multiplyScalar(1).add(tan.clone().multiplyScalar(side*sg)).normalize();   // horizontal, toward the sun
      const dir = d.clone().multiplyScalar(Math.cos(Math.atan(up))); dir.y = Math.sin(Math.atan(up));  // unit vector toward the sun
      const c = main ? main.c : new THREE.Vector3(0,1.2,-2.4), t = (c.y - .02)/dir.y;
      const P = c.clone().addScaledVector(dir, -t);                                                      // where the beam through the window centre hits the floor
      const mg = Math.min(2.0 - Math.abs(P.x), 2.5 - Math.abs(P.z));
      if(!best || mg > best.mg) best = { dir, P, mg };
    });
    return best;
  }

  /* ---------- environment (HDR sky dome with a sun disc) for reflections ---------- */
  function envMap(sunDir){
    const pm = new THREE.PMREMGenerator(renderer), es = new THREE.Scene();
    const g = new THREE.SphereGeometry(60,64,32), pos = g.attributes.position, col = new Float32Array(pos.count*3);
    const zen = lin(0x5F93C8).multiplyScalar(1.4), hor = lin(0xFFD2A0).multiplyScalar(3.2), gnd = lin(0x8A7660).multiplyScalar(.9), c = new THREE.Color();
    for(let i=0;i<pos.count;i++){
      const y = pos.getY(i)/60;
      if(y > 0) c.copy(hor).lerp(zen, Math.pow(y,.55)); else c.copy(hor).lerp(gnd, Math.pow(-y,.4));
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col,3));
    const sky = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors:true, side:THREE.BackSide, depthWrite:false })); es.add(sky);
    const disc = new THREE.Mesh(new THREE.SphereGeometry(2.2,16,8), new THREE.MeshBasicMaterial({ color:new THREE.Color(1,.78,.5).multiplyScalar(60) }));
    disc.position.copy(sunDir).normalize().multiplyScalar(50); es.add(disc);
    const rt = pm.fromScene(es, .02); pm.dispose();
    g.dispose(); sky.material.dispose(); disc.geometry.dispose(); disc.material.dispose();
    return rt.texture;
  }

  function grainTex(){
    if(st.grain) return st.grain;
    st.grain = canvasTex(256,256,(g,w,h) => {
      g.fillStyle = '#F1E7D8'; g.fillRect(0,0,w,h);
      for(let i=0;i<90;i++){ const y = rnd()*h, t = .4+rnd()*1.8; g.strokeStyle = 'rgba('+(70+rnd()*50|0)+','+(40+rnd()*30|0)+',15,'+(.05+rnd()*.16)+')'; g.lineWidth = t;
        g.beginPath(); g.moveTo(0,y); for(let x=0;x<=w;x+=32) g.lineTo(x,y+Math.sin(x*.03+i)*2.2); g.stroke(); }
      for(let i=0;i<3;i++){ const kx = rnd()*w, ky = rnd()*h; const r = g.createRadialGradient(kx,ky,1,kx,ky,10+rnd()*8);
        r.addColorStop(0,'rgba(60,32,10,.35)'); r.addColorStop(1,'rgba(60,32,10,0)'); g.fillStyle = r; g.fillRect(kx-24,ky-24,48,48); }
    });
    st.grain.encoding = THREE.sRGBEncoding; st.grain.repeat.set(2,3);
    return st.grain;
  }
  const isWood = m => {
    if(!m.isMeshStandardMaterial || m.map || ghostly(m) || m.userData.hex == null) return false;
    const c = new THREE.Color(m.userData.hex), hsl = {}; c.getHSL(hsl);
    return hsl.h >= .04 && hsl.h <= .12 && hsl.s >= .35 && hsl.s <= .85 && hsl.l >= .18 && hsl.l <= .72 && m.roughness >= .3 && m.roughness <= .7;
  };

  /* ---------- on-demand loading of the post-processing bundle ---------- */
  const fxReady = () => !!(THREE.EffectComposer && THREE.RenderPass && THREE.ShaderPass && THREE.SSAOPass && THREE.UnrealBloomPass && THREE.RectAreaLightUniformsLib);
  let fxPromise = null;
  function loadFx(){
    if(fxReady()) return Promise.resolve();
    if(fxPromise) return fxPromise;
    fxPromise = new Promise((ok, no) => {
      const s = document.createElement('script'), tm = setTimeout(() => no(new Error('fx.js timed out')), 25000);   // a late arrival still counts on the next press
      s.async = true; s.src = new URL('../fx.js?v=1', location.href).href;        // pages live at room-3d/<key>/ ; the bundle at room-3d/fx.js
      s.onload = () => { clearTimeout(tm); fxReady() ? ok() : no(new Error('fx.js incomplete')); };
      s.onerror = () => { clearTimeout(tm); s.remove(); no(new Error('fx.js failed to load')); };
      document.head.appendChild(s);
    }).catch(e => { fxPromise = null; throw e; });
    return fxPromise;
  }

  /* ---------- the pipeline (composer) is built lazily and only for tier >= 2 ---------- */
  function buildPipeline(){
    if(st.composer || !st.caps.floatRT) return !!st.composer;
    try{
      const w = renderer.domElement.width || 2, h = renderer.domElement.height || 2;
      const rt = new THREE.WebGLMultisampleRenderTarget(w,h,{ type:THREE.HalfFloatType, format:THREE.RGBAFormat, minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter });
      rt.samples = st.caps.mobile ? 2 : 4;
      const c = new THREE.EffectComposer(renderer, rt);
      c.addPass(new THREE.RenderPass(scene,camera));
      if(!HdrAO) HdrAO = makeHdrAO();
      st.ao = new HdrAO(scene,camera,w,h); c.addPass(st.ao);
      st.bloom = new THREE.UnrealBloomPass(new THREE.Vector2(w,h), .8, .62, 1.6);
      [st.bloom.renderTargetBright].concat(st.bloom.renderTargetsHorizontal, st.bloom.renderTargetsVertical).forEach(t => { t.texture.type = THREE.HalfFloatType; });
      c.addPass(st.bloom);
      st.grade = new THREE.ShaderPass(GradeShader); c.addPass(st.grade);
      if(st.exp) st.grade.uniforms.exposure.value = st.exp;
      st.composer = c; return true;
    }catch(e){ st.err = e && e.message; st.composer = null; return false; }
  }

  /* ---------- apply / undo the look ---------- */
  function apply(){
    const S = st.S || (st.S = survey()), c = st.caps;
    if(!st.win){ st.win = findWindows(S); st.sunDir = placeSun(st.win); }
    const sunDir = st.sunDir.dir;

    const exp = EXPOSURE * (st.win.length < 2 ? 1.2 : 1);          // a room with a single window gets a little more fill
    st.exp = exp; if(st.grade) st.grade.uniforms.exposure.value = exp;
    setP(renderer,'outputEncoding',THREE.sRGBEncoding); setP(renderer,'toneMapping',THREE.ACESFilmicToneMapping); setP(renderer,'toneMappingExposure',exp);
    if(scene.fog) setCol(scene.fog.color, scene.fog.color.clone().convertSRGBToLinear());
    setP(scene,'environment',null);
    try{ if(c.floatRT){ if(!st.env) st.env = envMap(sunDir); scene.environment = st.env; } }catch(e){ st.err = e && e.message; }

    /* materials: colours -> linear, glow boosts, reflections, wood grain */
    const texOld = new Map();
    S.mats.forEach(m => {
      if(m.color){
        const c2 = m.color.clone().convertSRGBToLinear();
        if(m.isMeshStandardMaterial && !ghostly(m) && !m.map && m.metalness < .3){ const f = .035; c2.r = Math.max(c2.r,f); c2.g = Math.max(c2.g,f); c2.b = Math.max(c2.b,f); }   // real black cloth/plastic still reflects ~3-4%
        setCol(m.color, c2);
      }
      if(m.emissive) setCol(m.emissive, m.emissive.clone().convertSRGBToLinear());
      [m.map, m.emissiveMap].forEach(t => { if(t && !texOld.has(t)){ texOld.set(t, t.encoding); t.encoding = THREE.sRGBEncoding; } });
      m.needsUpdate = true;
      if(m.isMeshBasicMaterial && !ghostly(m)){
        const k = m.side === THREE.BackSide ? 6 : m.map ? 2.6 : 11; m.color.multiplyScalar(k);
      }
      if(m.isMeshStandardMaterial){
        const glossy = m.metalness > .25 || m.roughness < .2;
        setP(m,'envMapIntensity', m.userData.env != null ? m.userData.env : (glossy ? .2 : .10));
        if(isWood(m)){ setP(m,"map",grainTex()); m.color.multiplyScalar(1.02); }
      }
    });
    rec(() => { texOld.forEach((e,t) => { t.encoding = e; }); S.mats.forEach(m => { m.needsUpdate = true; }); });

    /* glossy floors (tile = lacquered, wood = satin) */
    S.floors.forEach(o => {
      const old = o.material, wood = (typeof T_WOOD !== 'undefined') && old.map === T_WOOD;
      const g = new THREE.MeshPhysicalMaterial({ color:old.color.clone(), map:old.map, roughness: wood ? .36 : .2, metalness:0, clearcoat: wood ? .5 : 1, clearcoatRoughness: wood ? .12 : .05 });
      g.envMapIntensity = wood ? .16 : .22; o.material = g; rec(() => { o.material = old; g.dispose(); });
    });

    /* sky / ground / skyline / contact-shadow blobs -> warm golden hour */
    if(S.sky){
      const tex = S.sky.material.map, cv2 = tex.image, g2 = cv2.getContext('2d');
      const paint = warm => { const h = cv2.height, gr = g2.createLinearGradient(0,0,0,h);
        if(warm){ gr.addColorStop(0,'#5A8DC4'); gr.addColorStop(.40,'#9FBFDD'); gr.addColorStop(.49,'#F2D2AA'); gr.addColorStop(.6,'#EBCDAE'); gr.addColorStop(1,'#EBCDAE'); }
        else { gr.addColorStop(0,'#6FA6CE'); gr.addColorStop(.48,'#BBD6E6'); gr.addColorStop(.6,'#D5E5EE'); gr.addColorStop(1,'#D5E5EE'); }
        g2.fillStyle = gr; g2.fillRect(0,0,cv2.width,h); tex.needsUpdate = true; };
      paint(true); rec(() => paint(false));
    }
    if(S.ground) setCol(S.ground.material.color, lin(0xCDB296).multiplyScalar(8));
    S.towers.forEach(o => setCol(o.material.color, lin(0xF0D6BC).multiplyScalar(2.6)));
    if(scene.fog) setCol(scene.fog.color, lin(0xE9CFB2));
    S.blobs.forEach(o => setP(o.material,'opacity', o.material.opacity*.3));

    /* lights */
    S.hemi.forEach(l => { setCol(l.color, lin(0xB9D1EC)); setCol(l.groundColor, lin(0xA98B69)); setP(l,'intensity',.34); });
    S.point.forEach(l => { setCol(l.color, l.color.clone().convertSRGBToLinear().lerp(lin(0xFFC48A), .45)); setP(l,'intensity', l.intensity*.8); });
    const sun = S.dir[0]; st.sun = sun;
    if(sun){
      const hi = st.tier >= 3, sc = sun.shadow.camera;
      const keep = { pos:sun.position.clone(), tgt:sun.target.position.clone(), l:sc.left, r:sc.right, t:sc.top, b:sc.bottom, n:sc.near, f:sc.far,
                     bias:sun.shadow.bias, nb:sun.shadow.normalBias, ms:sun.shadow.mapSize.clone(), map:sun.shadow.map, m:sun.shadow.matrix.clone() };
      setCol(sun.color, lin(0xFFC585)); setP(sun,'intensity',4.0);
      sun.target.position.set(0,0,0); sun.position.copy(sunDir).multiplyScalar(14);
      Object.assign(sc,{ left:-8, right:8, top:8, bottom:-8, near:1, far:40 }); sc.updateProjectionMatrix();
      sun.shadow.bias = -.0004; sun.shadow.normalBias = .018; sun.shadow.mapSize.set(hi ? 4096 : 2048, hi ? 4096 : 2048);
      sun.shadow.map = null;                                   // the realistic look bakes its own map; the engine's original one (keep.map) is left untouched
      rec(() => {
        sun.position.copy(keep.pos); sun.target.position.copy(keep.tgt);
        Object.assign(sc,{ left:keep.l, right:keep.r, top:keep.t, bottom:keep.b, near:keep.n, far:keep.f }); sc.updateProjectionMatrix();
        sun.shadow.bias = keep.bias; sun.shadow.normalBias = keep.nb; sun.shadow.mapSize.copy(keep.ms);
        if(sun.shadow.map && sun.shadow.map !== keep.map) sun.shadow.map.dispose();
        sun.shadow.map = keep.map; sun.shadow.matrix.copy(keep.m);      // back to the exact shadows the page had before (the map is static)
        if(!keep.map) renderer.shadowMap.needsUpdate = true;
      });
    }
    st.extras.forEach(l => { l.visible = true; });
    rec(() => { st.extras.forEach(l => { l.visible = false; }); });
    bakeShadows();
  }

  /* The engine renders its sun shadow once (shadowMap.autoUpdate = false) in whatever fade state the page happens to be in: in the overview the ceiling
     and the near walls are faded out and the furniture is ghosted, so they would not cast shadows. For the realistic look the map is baked once with every
     fade group switched on (the real architecture), so the picture does not depend on the camera mode the visitor was in when pressing the button. */
  function bakeShadows(){
    if(!st.sun) return;
    const keepVis = []; for(const k in FADE){ const g = FADE[k].group; keepVis.push([g, g.visible]); g.visible = true; }
    /* only the sun is re-baked: any other shadow-casting light keeps the map the engine rendered, so turning the mode off restores the page exactly */
    const others = []; scene.traverse(o => { if(o.isLight && o !== st.sun && o.castShadow){ others.push(o); o.castShadow = false; } });
    const rt = st.bakeRT || (st.bakeRT = new THREE.WebGLRenderTarget(2,2)), prev = renderer.getRenderTarget();
    renderer.shadowMap.needsUpdate = true;
    try{ renderer.setRenderTarget(rt); renderer.render(scene,camera); }
    finally{ renderer.setRenderTarget(prev); others.forEach(o => { o.castShadow = true; }); keepVis.forEach(v => { v[0].visible = v[1]; }); }
  }

  function buildExtras(){
    if(st.extras.length) return;
    const c = st.caps, win = st.win || [];
    win.forEach(w => {
      if(c.floatLin){
        RectLib();
        const l = new THREE.RectAreaLight(lin(0xB3D0F3), 3.5, w.w, w.h);
        const p = w.c.clone(); p[w.ax] += -w.sign*.04; l.position.copy(p);
        const look = w.c.clone(); look[w.ax] += w.sign*1; look.y = Math.max(.3, w.c.y - .45); l.lookAt(look);
        l.visible = false; scene.add(l); st.extras.push(l);
      }else{
        /* no float-linear textures (some phones): soft cool point fill instead of an area light */
        const l = new THREE.PointLight(lin(0xB3D0F3), 1.1, 7, 1.4);
        const p = w.c.clone(); p[w.ax] += w.sign*.35; l.position.copy(p); l.visible = false; scene.add(l); st.extras.push(l);
      }
    });
    /* warm bounce where the sun beam lands on the floor */
    const P = st.sunDir && st.sunDir.P;
    if(P && Math.abs(P.x) < 2.6 && Math.abs(P.z) < 3.2){
      const mk = (x,z,I,d) => { const l = new THREE.PointLight(lin(0xFFB873), I, d, 1.6); l.position.set(x,.55,z); l.visible = false; scene.add(l); st.extras.push(l); };
      mk(P.x, P.z, .17, 3.6); mk(P.x*.4, P.z*.4, .1, 3.2);
    }
  }
  let rectReady = false;
  function RectLib(){ if(!rectReady && THREE.RectAreaLightUniformsLib){ THREE.RectAreaLightUniformsLib.init(); rectReady = true; } }

  /* ---------- tier / resolution control ---------- */
  function pr(){
    const dpr = window.devicePixelRatio || 1;
    if(!st.on) return Math.min(dpr,2);
    const cap = st.tier >= 3 ? (st.caps.mobile ? 1.75 : 2) : st.tier === 2 ? 1.5 : 1.25;
    return Math.max(.6, Math.min(dpr,cap)*st.res);
  }
  function applyPR(){
    renderer.setPixelRatio(pr());
    const w = stage.clientWidth || innerWidth, h = stage.clientHeight || innerHeight;
    renderer.setSize(w,h,false); api.setSize(w,h); dirty = true;
  }
  function setTier(t){
    t = Math.max(1, Math.min(st.maxTier, t));
    if(t >= 2 && !buildPipeline()) t = 1;
    st.tier = t; st.ema = 0; st.cnt = 0; st.skip = 6;
    if(st.ao){ st.ao.resScale = t >= 3 ? 1 : .5; st.ao.setSize(st.ao._w, st.ao._h); }
    if(st.sun){
      const hi = t >= 3, ms = hi ? 4096 : 2048;
      if(st.sun.shadow.mapSize.x !== ms){ st.sun.shadow.mapSize.set(ms,ms); if(st.sun.shadow.map){ st.sun.shadow.map.dispose(); st.sun.shadow.map = null; } bakeShadows(); }
    }
    applyPR(); label();
  }
  /* Frame cost is measured directly: every few frames we force the GPU to finish (1-pixel read) and time the whole render.
     That works whatever the frame rate (a plain frame-to-frame timer cannot tell a slow frame from the viewer pausing). */
  const syncBuf = new Uint8Array(4);
  function adapt(t0){
    if(st.skip > 0){ st.skip--; return; }
    if(++st.fc % 3 !== 0 && st.cnt >= 6) return;
    const gl = renderer.getContext();
    try{ gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,syncBuf); }catch(e){ return; }
    let dt = performance.now() - t0;
    if(st.ema) dt = Math.min(dt, st.ema*4);                // one-off spikes (first draw after a pause) do not count
    st.ema = st.ema ? st.ema*.8 + dt*.2 : dt; st.cnt++;
    const need = st.ema > 100 ? 3 : st.ema > 50 ? 6 : 14;
    if(st.cnt < need) return;
    if(st.ema > 24){
      if(st.res > .62){ st.res = Math.max(.6, st.res*.84); applyPR(); }
      else if(st.tier > 1){ st.res = .85; setTier(st.tier-1); }
      st.cnt = 0; st.ema = 0; st.skip = 4; label();
    }else if(st.res < 1 && st.cnt >= 60 && st.ema < 10){
      st.res = Math.min(1, st.res*1.08); applyPR(); st.cnt = 0; st.ema = 0; st.skip = 4;
    }
  }

  /* ---------- button text ---------- */
  function label(){
    const b = document.getElementById('real'); if(!b) return;
    const L = LBL[st.lang] || LBL.th;
    document.getElementById('realT').textContent = L.btn;
    document.getElementById('realS').textContent = st.busy ? L.busy : st.on ? (L.on + ' · ' + NAMES[st.lang][st.tier]) : L.off;
    b.setAttribute('aria-pressed', String(st.on)); b.setAttribute('aria-busy', String(st.busy)); b.title = L.tip;
    b.setAttribute('aria-label', L.btn + ': ' + (st.busy ? L.busy : st.on ? L.on : L.off));
  }

  function failHint(){ try{ showHint((LBL[st.lang] || LBL.th).fail); }catch(e){} }

  function enable(){
    if(st.on) return;
    st.caps = st.caps || detect(); st.maxTier = pickTier(st.caps); if(!st.built) st.tier = st.maxTier;
    st.S = st.S || survey(); st.win = st.win || findWindows(st.S); st.sunDir = st.sunDir || placeSun(st.win);
    buildExtras();
    st.undo.length = 0;
    st.meshes = []; scene.traverse(o => { if(o.isMesh) st.meshes.push(o); });
    st.on = true; st.built = true;
    apply();
    st.res = 1; setTier(Math.min(st.tier, st.maxTier));
    dirty = true; label();
  }
  function disable(){
    if(!st.on) return;
    st.on = false;
    for(let i = st.undo.length-1; i >= 0; i--){ try{ st.undo[i](); }catch(e){} }
    st.undo.length = 0;
    applyPR(); label(); dirty = true;
  }

  const api = {
    get on(){ return st.on; },
    get busy(){ return st.busy; },
    lang(l){ st.lang = l === 'en' ? 'en' : 'th'; label(); },
    toggle(){
      if(st.busy) return;
      st.busy = true; label();
      /* let the "preparing" state paint before the heavy first build */
      const run = () => requestAnimationFrame(() => requestAnimationFrame(() => {
        const wasOn = st.on; let failed = false; st.err = null;
        try{ if(wasOn) disable(); else enable(); }catch(e){ st.err = e && e.message; failed = !wasOn; try{ disable(); }catch(_){} }
        st.busy = false; label();
        if(failed) failHint();
        else try{ localStorage.setItem('sh-real', st.on ? '1' : '0'); }catch(e){}
      }));
      if(st.on || fxReady()) run();
      else loadFx().then(run, e => { st.err = e && e.message; st.busy = false; label(); failHint(); });   // offline / blocked: stay in the normal look
    },
    auto(){ try{ const q = qs('real'); if(q === '1') return true; if(q === '0') return false; return localStorage.getItem('sh-real') === '1'; }catch(e){ return qs('real') === '1'; } },
    setSize(w,h){
      st.W = w; st.H = h;
      if(!st.composer) return;
      st.composer.setPixelRatio(renderer.getPixelRatio());
      st.composer.setSize(w,h);
      st.grade.uniforms.res.value.set(w*renderer.getPixelRatio(), h*renderer.getPixelRatio());
    },
    render(){
      const t0 = performance.now();
      if(st.on && st.tier >= 2 && st.composer){ st.composer.render(); adapt(t0); }
      else{ renderer.render(scene,camera); if(st.on) adapt(t0); }
    },
    state(){ return st; }
  };
  return api;
})();
