//==CFG==
/* ------------------------------------------------------------------
   S.House Deluxe Room 35 sq.m. (corner room). Metres. Origin = centre of the bedroom floor. Room 5.4 (x) x 4.8 (z).
   Plan (rev 2, rebuilt from the four room photos):
   - EAST wall (+x) = bed head. Teal accent wall, king bed with a wooden headboard + small bedside cabinet on its south side.
     A lowered bulkhead (warm LED strip) runs over the bed niche.
   - NORTH wall (-z) = balcony side. From the bed's corner westwards: 3-pane aluminium slider + navy curtains, split A/C on the
     wall above it, a wall pier, then the window bay (bay pushes out to the north) with the green glass dining table.
   - Bathroom = a block in the SOUTH-EAST corner, right next to the bed. Its door is on the block's WEST face (faces the room),
     the door leaf swings into the bathroom. Inside: counter + sink on the north wall, toilet on the east (window) wall,
     shower behind a tiled half wall in the south-east corner.
   - SOUTH wall (+z): louvred 3-door wardrobe (west of the bathroom block), breaker box high near the south-west corner.
   - WEST wall (-x): the entrance door right beside the south-west corner, then the mirror + black-glass desk + pink chair,
     then the chest of drawers.
------------------------------------------------------------------- */
const ROOM = { W:5.4, D:4.8, H:2.6, T:0.14 };

const TXT = {
  th:{
    title:'ห้อง Deluxe 35 ตร.ม.',
    meta:['ห้องหัวมุม · ระเบียงส่วนตัววิวเมือง','มีมุมนั่งทานข้าวริมหน้าต่าง · ห้องน้ำในตัว'],
    note:'ภาพจำลอง 3 มิติ ขนาดและของตกแต่งอาจต่างจากห้องจริงเล็กน้อย · ทีวี-ตู้เย็นนำมาเองหรือเช่าได้',
    hintOrbit:'ลากเพื่อหมุนห้อง · บีบเพื่อซูม · แตะชื่อจุดเพื่อเข้าไปดู',
    hintWalk:'ลากเพื่อมองรอบห้อง · แตะที่พื้นเพื่อเดิน · บีบเพื่อซูม' + (fine ? ' · WASD' : ''),
    aria:'ภาพ 3 มิติของห้อง Deluxe 35 ตร.ม. ที่ S.House',
    fail:'อุปกรณ์หรือเบราว์เซอร์นี้แสดงภาพ 3 มิติไม่ได้ ลองเปิดด้วย Chrome หรือ Safari เวอร์ชันล่าสุด'
  },
  en:{
    title:'Deluxe Room 35 sq.m.',
    meta:['Corner room · Private balcony with city view','Window alcove with dining table · En-suite bathroom'],
    note:'3D model. Size and furnishings may differ slightly from the actual room. TV and fridge: bring your own or rent from us.',
    hintOrbit:'Drag to rotate · Pinch to zoom · Tap a label to step inside',
    hintWalk:'Drag to look around · Tap the floor to walk · Pinch to zoom' + (fine ? ' · WASD' : ''),
    aria:'3D view of the Deluxe 35 sq.m. room at S.House',
    fail:'This device or browser cannot show 3D. Try the latest Chrome or Safari.'
  }
};

const VIEWS = [
  { id:'overview', th:'ภาพรวม',           en:'Overview' },
  { id:'entry',   th:'ทางเข้า',             en:'Entrance',    pos:[-2.0,1.55,1.75],  at:[1.4,1.0,-0.7],    fov:78, tag:[-2.45,2.05,1.8] },
  { id:'bed',     th:'เตียง',               en:'Bed',         pos:[-2.1,1.5,-1.1],   at:[2.7,1.0,-1.1],   fov:74, tag:[2.2,1.55,-1.1] },
  { id:'closet',  th:'ตู้เสื้อผ้า',          en:'Wardrobe',    pos:[-0.65,1.5,-0.5],  at:[-0.65,1.0,2.4],   fov:80, tag:[-0.65,2.05,2.1] },
  { id:'desk',    th:'โต๊ะ · ตู้ลิ้นชัก',     en:'Desk',        pos:[0.1,1.5,-0.1],    at:[-2.7,1.0,0.3],    fov:82, tag:[-2.3,1.65,0.0] },
  { id:'dining',  th:'มุมทานข้าว',          en:'Dining nook', pos:[-0.2,1.5,0.5],    at:[-1.4,0.85,-2.9],  fov:80, tag:[-1.3,1.6,-2.85] },
  { id:'balcony', th:'ระเบียง',             en:'Balcony',     pos:[1.3,1.5,-2.2],    at:[1.3,-0.2,-6.2],   fov:74, tag:[1.4,1.3,-3.3] },
  { id:'bath',    th:'ห้องน้ำ',             en:'Bathroom',    pos:[0.85,1.55,0.85],  at:[2.4,0.95,1.4],    fov:100, tag:[1.6,1.75,1.3] }
];

/* Where a visitor may stand ([x0,x1,z0,z1]) and what blocks them */
const WALK = [
  [-2.5,0.35,-2.25,2.25],                         // west half of the room
  [0.35,0.62,-2.25,0.05],                         // foot of the bed
  [0.35,2.55,-2.3,-2.05],                         // strip between the bed and the balcony slider
  [-2.1,-0.5,-3.3,-2.25],                         // dining bay
  [0.3,2.5,-3.55,-2.3],                           // balcony
  [0.3,0.75,0.4,1.1],                             // bathroom doorway
  [0.75,2.6,0.3,2.3]                              // bathroom
];
const BLOCK = [
  [0.62,2.7,-2.0,-0.2],                           // bed
  [2.3,2.7,-0.2,0.1],                             // bedside cabinet
  [-1.5,0.2,1.8,2.4],                             // wardrobe
  [-2.7,-2.1,-0.3,1.0], [-2.2,-1.65,0.0,0.7],     // desk + chair
  [-2.7,-2.2,-1.2,-0.2],                          // chest of drawers
  [-1.75,-0.55,-3.2,-2.4], [-1.65,-0.6,-2.4,-1.85], [-2.2,-1.75,-3.05,-2.5],   // dining table + chairs
  [0.6,1.45,0.28,0.42], [1.5,2.3,0.2,0.78],       // bathroom door leaf, counter
  [2.2,2.7,0.8,1.3], [1.55,2.7,1.45,1.65]         // toilet, half wall
];
const FIT = [                                    // room box + dining bay + balcony
  [-2.85,0,2.55],[-2.85,2.7,2.55],[-2.85,0,-2.55],[-2.85,2.7,-2.55],[2.85,0,2.55],[2.85,2.7,2.55],[2.85,0,-2.55],[2.85,2.7,-2.55],
  [-2.35,0,-3.6],[-2.35,2.7,-3.6],[-0.25,0,-3.6],[-0.25,2.7,-3.6],
  [0.05,0,-3.9],[0.05,1.2,-3.9],[2.65,0,-3.9],[2.65,1.2,-3.9]
];
const ORBIT = { el:.98, t:[0.0,0.3,-0.45] };
const OVAZ = a => (-1.52+0.12*a);
const START = Object.assign({ x:-2.0, y:1.55, z:1.75, fov:78 }, anglesTo([-2.0,1.55,1.75],[1.4,1.0,-0.7]));

//==BUILD==
/* ---------------- environment + lights ---------------- */
sky();
skyline([{ x0:-110, x1:110, z0:-125, z1:-32, n:24 }, { x0:-125, x1:-48, z0:-60, z1:55, n:9 }]);
scene.add(new THREE.HemisphereLight(0xEFF3F4, 0xBBA98F, .62));
const sun = new THREE.DirectionalLight(0xFFF0D8, .55);
sun.position.set(-2,7,-16); sun.target.position.set(0,0,0);
sun.castShadow = true; sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{ left:-10, right:10, top:10, bottom:-10, near:1, far:45 });
sun.shadow.bias = -.0006;
scene.add(sun, sun.target);
const lamp = new THREE.PointLight(0xFFF0DD, .6, 15, 1.3);
lamp.position.set(-.5,2.4,.1); lamp.castShadow = true; lamp.shadow.mapSize.set(1024,1024);
lamp.shadow.camera.near = .2; lamp.shadow.camera.far = 15; lamp.shadow.bias = -.002;
scene.add(lamp);
const bayL = new THREE.PointLight(0xFFEBD2, .3, 4, 1.4); bayL.position.set(-1.3,2.2,-2.7); scene.add(bayL);
const ledL = new THREE.PointLight(0xFFC98A, .32, 4.2, 1.5); ledL.position.set(.8,2.4,-1.0); scene.add(ledL);
const bathL = new THREE.PointLight(0xFFF3E4, .55, 3.6, 1.4); bathL.position.set(1.7,2.15,1.3); scene.add(bathL);

/* ---------------- palette (taken from the photos) ---------------- */
const PAINT = 0xF0E7C8, TRIM = 0xE2D8B8, TEAL = 0x3A9A9A;
const T_FLOOR = tileCanvas('#EBDDC9','#CFC1AA',.1,'rgba(150,100,70,');
const T_ORANGE = tileCanvas('#DE8B5B','#F3E7D7',.05);
const T_WHITE = tileCanvas('#F6F6F2','#D4D7D2',.03);
const T_CREAM = tileCanvas('#F4E7C9','#DCCFB0',.03);
const T_GREYF = tileCanvas('#7F9391','#A7B5B0',.06);
const pine = M(0xC98B3F,{roughness:.55}), pineD = M(0xB07430,{roughness:.6}), pineL = M(0xD9A257,{roughness:.5});
const brownDoor = M(0x9B5A2C,{roughness:.55}), brownPan = M(0x8A4D24,{roughness:.55});
const frameGrey = M(0x8E979B,{roughness:.55});

/* ---------------- plan constants ---------------- */
const BAY = { x0:-2.2, x1:-0.4, z1:-3.4 };                    // dining bay pushes out to the north
const SLD = { a:0.15, b:2.6 };                                // balcony slider along the north wall
const BATH = { x0:0.5, z0:0.1 };                              // bathroom block: west face x, north face z (it runs to the east + south walls)
const IX0 = BATH.x0+.1, IZ0 = BATH.z0+.1;                     // bathroom inside faces
const BAL = 1.3, bz1 = -hz-T-BAL;
const gN = fadeGroup('N'), gS = fadeGroup('S'), gW = fadeGroup('W'), gE = fadeGroup('E'), gC = fadeGroup('C'), gP = fadeGroup('P');

/* a stack of tile bands on a thin face: orange diagonals, a mint stripe, white/cream above, a teal paint band at the top */
function clad(x0,x1,z0,z1,o){
  o = o || {};
  const L = Math.max(x1-x0,z1-z0), og = o.orange == null ? .93 : o.orange, gr = o.green == null ? .12 : o.green, top = o.top == null ? 1.95 : o.top;
  const upper = o.cream ? T_CREAM : T_WHITE;
  const orange = tileM(T_ORANGE,L,og,.2,.2,{roughness:.3}); orange.map.center.set(.5,.5); orange.map.rotation = Math.PI/4;
  B(x0,x1,0,og,z0,z1,fm('P',orange),gP,{noCast:true});
  B(x0,x1,og,og+gr,z0,z1,fm('P',M(0xA9D6B0,{roughness:.35})),gP,{noCast:true});
  const up = (ya,yb) => { if(yb-ya < .01) return; B(x0,x1,ya,yb,z0,z1,fm('P',tileM(upper,L,yb-ya,.2,.2,{roughness:.3})),gP,{noCast:true}); };
  if(o.win){ up(og+gr,o.win[0]); up(o.win[1],top); } else up(og+gr,top);
  if(o.teal !== false) B(x0,x1,top,2.3,z0,z1,fm('P',M(0x4FA9A2,{roughness:.8})),gP,{noCast:true});
}
const diag = (mat) => { mat.map.center.set(.5,.5); mat.map.rotation = Math.PI/4; return mat; };

/* ---------------- shell ---------------- */
{
  const tf = tileM(T_FLOOR,W,D,.4,.4,{roughness:.22});
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W,D), tf);
  floor.rotation.x = -Math.PI/2; floor.receiveShadow = true; root.add(floor);
  const bw = BAY.x1-BAY.x0, bd = -hz-BAY.z1;
  const bf = new THREE.Mesh(new THREE.PlaneGeometry(bw,bd), tileM(T_FLOOR,bw,bd,.4,.4,{roughness:.22}));
  bf.rotation.x = -Math.PI/2; bf.position.set((BAY.x0+BAY.x1)/2,.001,(-hz+BAY.z1)/2); bf.receiveShadow = true; root.add(bf);

  const pn = (n) => fm(n,M(PAINT)), sk = (n) => fm(n,M(TRIM,{roughness:.6}));
  wall('N', pn('N'), [{ a:BAY.x0, b:BAY.x1, y0:0, y1:H }, { a:SLD.a, b:SLD.b, y0:0, y1:2.05 }], gN, sk('N'));
  wall('S', pn('S'), [], gS);
  wall('W', pn('W'), [{ a:1.35, b:2.25, y0:0, y1:2.05 }], gW, sk('W'));
  wall('E', pn('E'), [{ a:0.35, b:1.35, y0:1.25, y1:1.9 }], gE);

  // ---- dining bay: side walls, back wall with the window, ceiling ----
  const bm = pn('N');
  B(BAY.x0-T,BAY.x0,0,H,BAY.z1-T,-hz-T,bm,gN); B(BAY.x1,BAY.x1+T,0,H,BAY.z1-T,-hz-T,bm,gN);
  const wx0 = -1.85, wx1 = -0.75, wy0 = .95, wy1 = 2.1;
  B(BAY.x0-T,wx0,0,H,BAY.z1-T,BAY.z1,bm,gN); B(wx1,BAY.x1+T,0,H,BAY.z1-T,BAY.z1,bm,gN);
  B(wx0,wx1,0,wy0,BAY.z1-T,BAY.z1,bm,gN); B(wx0,wx1,wy1,H,BAY.z1-T,BAY.z1,bm,gN);
  { const fmat = fm('N',M(0xC9CED0,{roughness:.4,metalness:.5})), zz = BAY.z1+.03, mx = (wx0+wx1)/2;
    B(wx0,wx1,wy0-.03,wy0+.03,zz-.03,zz+.03,fmat,gN); B(wx0,wx1,wy1-.03,wy1+.03,zz-.03,zz+.03,fmat,gN);
    B(wx0,wx0+.04,wy0,wy1,zz-.03,zz+.03,fmat,gN); B(wx1-.04,wx1,wy0,wy1,zz-.03,zz+.03,fmat,gN);
    B(mx-.03,mx+.03,wy0,wy1,zz-.03,zz+.03,fmat,gN);
    const gl = glassM(); fm('N',gl,gl.opacity);
    const p = new THREE.Mesh(new THREE.PlaneGeometry(wx1-wx0,wy1-wy0), gl); p.position.set(mx,(wy0+wy1)/2,zz); p.renderOrder = 2; gN.add(p);
    B(wx0-.04,wx1+.04,wy0-.05,wy0-.03,zz-.06,zz+.04,fm('N',M(0xEFE8D4,{roughness:.5})),gN,{noCast:true}); }
  const nav = new THREE.MeshStandardMaterial({ color:0x434E69, roughness:1, side:THREE.DoubleSide }); fm('N',nav,1);
  [-2.0,-0.6].forEach(x => curtain('N',x,.38,.05,2.22,nav,gN,BAY.z1+hz+.12,46));       // d is measured from the north wall plane
  { const r = new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,BAY.x1-BAY.x0-.1,10), fm('N',M(0xB8BEC0,{roughness:.4,metalness:.6})));
    r.rotation.z = Math.PI/2; r.position.set((BAY.x0+BAY.x1)/2,2.24,BAY.z1+.12); gN.add(r); }
  const bc = new THREE.Mesh(new THREE.PlaneGeometry(bw,bd), fm('C',M(0xF6F5EF,{roughness:1,side:THREE.DoubleSide,emissive:0x777670})));
  bc.rotation.x = Math.PI/2; bc.position.set((BAY.x0+BAY.x1)/2,H,(-hz+BAY.z1)/2); gC.add(bc);

  // ---- teal accent wall over the bed ----
  WB('E',-hz,BATH.z0,0,H,0,.012,fm('E',M(TEAL,{roughness:.9})),gE,{noCast:true});

  // ---- entrance door (closed) in the west wall, right next to the south-west corner ----
  const dw = fm('W',brownDoor), dp = fm('W',brownPan);
  WB('W',1.38,2.22,0,2.03,-.015,.045,dw,gW);
  [[1.45,1.78],[1.82,2.15]].forEach(r => { WB('W',r[0],r[1],1.15,1.93,.045,.06,dp,gW,{noCast:true}); WB('W',r[0],r[1],.12,1.0,.045,.06,dp,gW,{noCast:true}); });
  { const q = XZ('W',1.46,.075); const k = new THREE.Mesh(new THREE.SphereGeometry(.033,12,8), fm('W',chrome)); k.position.set(q[0],1.0,q[1]); gW.add(k);
    WB('W',1.43,1.62,.98,1.02,.06,.1,fm('W',chrome),gW,{noCast:true}); }
  const fr = fm('W',frameGrey);
  WB('W',1.35,1.38,0,2.07,-.02,.035,fr,gW,{noCast:true}); WB('W',2.22,2.25,0,2.07,-.02,.035,fr,gW,{noCast:true}); WB('W',1.35,2.25,2.03,2.07,-.02,.035,fr,gW,{noCast:true});
  WB('W',1.22,1.31,1.2,1.3,0,.012,fm('W',M(0xF2F0E8,{roughness:.5})),gW,{noCast:true});       // light switch
  { const q = XZ('W',1.265,.014); const c = new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,H-1.3,8), fm('W',M(0xE9E6DA,{roughness:.6}))); c.position.set(q[0],1.3+(H-1.3)/2,q[1]); gW.add(c); }

  // ---- breaker box on the south wall (high, near the south-west corner) ----
  WB('S',-2.33,-2.08,1.6,1.86,0,.07,fm('S',M(0xE7E9E8,{roughness:.5})),gS,{noCast:true});
  WB('S',-2.3,-2.11,1.64,1.8,.07,.075,fm('S',M(0x59646A,{roughness:.4})),gS,{noCast:true});

  // ---- sliding door to the balcony (3 panes), A/C, navy curtains ----
  slider('N',SLD.a,SLD.b,{ g:gN, fr:fm('N',M(0xC9CED0,{roughness:.4,metalness:.55})), name:'N', y1:2.05, panes:3 });
  acUnit('N',-0.35,0.5,2.17,2.5,gN,'N');
  const cn = new THREE.MeshStandardMaterial({ color:0x434E69, roughness:1, side:THREE.DoubleSide }); fm('N',cn,1);
  curtain('N',0.6,.8,.02,2.12,cn,gN,.1); curtain('N',2.48,.34,.02,2.12,cn,gN,.1);
  curtainRod('N',0.05,2.65,2.12,fm('N',M(0xB8BEC0,{roughness:.4,metalness:.6})),gN);
  WB('N',-0.33,-0.2,1.2,1.3,0,.012,fm('N',M(0xF2F0E8,{roughness:.5})),gN,{noCast:true});    // switch on the wall pier

  // ---- plank ceiling, round lamp, lowered bulkhead with a warm LED strip over the bed ----
  const pt = plankTex(1,true); pt.repeat.set(D/.3,1);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W,D), fm('C',M(0xffffff,{map:pt,roughness:1,side:THREE.DoubleSide,emissive:0x8A8984,emissiveMap:pt})));
  ceil.rotation.x = Math.PI/2; ceil.position.y = H; gC.add(ceil);
  const lm = fm('C',new THREE.MeshBasicMaterial({color:0xF4F8FF}));
  const lampD = new THREE.Mesh(new THREE.CylinderGeometry(.245,.245,.05,32), fm('C',M(0x23386B,{roughness:.5}))); lampD.position.set(-.5,H-.025,.1); gC.add(lampD);
  const lampF = new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.01,32), lm); lampF.position.set(-.5,H-.052,.1); gC.add(lampF);
  B(BATH.x0,hx,2.22,H,-hz,BATH.z0,fm('C',M(0xF1EBD6,{roughness:.9,emissive:0x7D7662})),gC);
  B(BATH.x0-.03,BATH.x0,2.46,2.52,-hz,BATH.z0,fm('C',new THREE.MeshBasicMaterial({color:0xFFD7A0})),gC,{noCast:true});
  { const gt = canvasTex(64,64,(g,w,h) => { const gr = g.createLinearGradient(w,0,0,0); gr.addColorStop(0,'rgba(255,178,120,.55)'); gr.addColorStop(1,'rgba(255,178,120,0)'); g.fillStyle = gr; g.fillRect(0,0,w,h); });
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.0,hz+BATH.z0), fm('C',new THREE.MeshBasicMaterial({ map:gt, transparent:true, depthWrite:false, side:THREE.DoubleSide }),.99));
    glow.rotation.x = Math.PI/2; glow.position.set(BATH.x0-.5,H-.004,(-hz+BATH.z0)/2); glow.renderOrder = 1; gC.add(glow); }
}

/* ---------------- bathroom block (south-east corner) ---------------- */
{
  const pm = fm('P',M(0xEFE8D0));
  // partitions: north wall (full length), west wall with the door opening
  B(BATH.x0,hx,0,H,BATH.z0,BATH.z0+.1,pm,gP);
  const dz0 = .32, dz1 = 1.17;
  B(BATH.x0,IX0,0,H,BATH.z0+.1,dz0,pm,gP); B(BATH.x0,IX0,0,H,dz1,hz,pm,gP); B(BATH.x0,IX0,2.1,H,dz0,dz1,pm,gP);
  // door frame + threshold + door leaf (open, swung into the bathroom against the north wall)
  const fgm = fm('P',frameGrey);
  B(BATH.x0-.02,IX0+.02,0,2.12,dz0-.04,dz0,fgm,gP,{noCast:true}); B(BATH.x0-.02,IX0+.02,0,2.12,dz1,dz1+.04,fgm,gP,{noCast:true}); B(BATH.x0-.02,IX0+.02,2.08,2.12,dz0,dz1,fgm,gP,{noCast:true});
  B(BATH.x0,IX0,0,.02,dz0,dz1,fm('P',M(0xA9D6B0,{roughness:.4})),gP,{noCast:true});
  { const leaf = doorLeaf('W',0,1,.85,2.0,M(0xCBD3D6,{roughness:.5}),0,root);
    const q = leaf.group; q.position.set(IX0-.01,0,dz0+.03); q.rotation.y = 0;
    const kn = new THREE.Mesh(new THREE.SphereGeometry(.032,12,8), M(0xB9C0C2,{roughness:.3,metalness:.6})); kn.position.set(.75,1.0,.04); q.add(kn); }
  B(0.62,0.7,1.2,1.3,BATH.z0-.012,BATH.z0,fm('P',M(0xF2F0E8,{roughness:.5})),gP,{noCast:true});            // light switch on the pier
  // tile cladding on the inside faces
  clad(IX0,IX0+.012,IZ0,dz0);  clad(IX0,IX0+.012,dz1,hz);                                   // west wall (either side of the door)
  clad(IX0,hx,IZ0,IZ0+.012);                                                                // north wall
  clad(hx-.012,hx,IZ0,.35); clad(hx-.012,hx,.35,1.35,{ win:[1.25,1.9] }); clad(hx-.012,hx,1.35,1.6);   // east wall (window)
  clad(hx-.012,hx,1.6,hz,{ orange:.85, cream:true });                                       // east wall of the shower
  clad(IX0,1.55,hz-.012,hz);                                                                // south wall
  clad(1.55,hx,hz-.012,hz,{ orange:.85, cream:true });                                      // south wall of the shower
  // half wall (shower screen) with the water heater behind it
  B(1.55,hx,0,1.2,1.5,1.6,fm('P',M(0xF1EEE6,{roughness:.4})),gP);
  clad(1.55,hx,1.488,1.5,{ top:1.2, teal:false });
  clad(1.55,hx,1.6,1.612,{ orange:.85, cream:true, top:1.2, teal:false });
  clad(1.538,1.55,1.5,1.6,{ top:1.2, teal:false });
  B(1.53,hx,1.2,1.24,1.48,1.62,fm('P',M(0xF4F4F1,{roughness:.3})),gP,{noCast:true});
  // floors (grey diagonals) + shower kerb
  const bf = new THREE.Mesh(new THREE.PlaneGeometry(hx-IX0,hz-IZ0), diag(tileM(T_GREYF,hx-IX0,hz-IZ0,.3,.3,{roughness:.3})));
  bf.rotation.x = -Math.PI/2; bf.position.set((IX0+hx)/2,.004,(IZ0+hz)/2); bf.receiveShadow = true; root.add(bf);
  B(1.55,1.62,0,.05,1.6,hz,fm('P',M(0xDD8A5A,{roughness:.4})),gP,{noCast:true});
  B(1.53,1.55,0,.05,1.6,hz,fm('P',M(0xA9D6B0,{roughness:.4})),gP,{noCast:true});
  // T-bar ceiling + downlight
  const tb = canvasTex(128,128,(g,w,h) => { g.fillStyle = '#F4F5F2'; g.fillRect(0,0,w,h); g.strokeStyle = '#B9BDBA'; g.lineWidth = 4; g.strokeRect(0,0,w,h); });
  tb.repeat.set((hx-IX0)/.6,(hz-IZ0)/.6);
  const bc = new THREE.Mesh(new THREE.PlaneGeometry(hx-IX0,hz-IZ0), fm('C',M(0xffffff,{map:tb,roughness:1,side:THREE.DoubleSide})));
  bc.rotation.x = Math.PI/2; bc.position.set((IX0+hx)/2,2.3,(IZ0+hz)/2); gC.add(bc);
  const dl = new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.012,18), fm('C',new THREE.MeshBasicMaterial({color:0xFFFFFF}))); dl.position.set(2.0,2.294,1.55); gC.add(dl);
  const dl2 = new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.012,18), fm('C',new THREE.MeshBasicMaterial({color:0xFFFFFF}))); dl2.position.set(1.0,2.294,1.2); gC.add(dl2);

  // counter (black granite), oval basin, tap, frameless mirror — north wall
  const gran = M(0x17181A,{roughness:.22,metalness:.1});
  B(1.5,2.3,.84,.88,IZ0,IZ0+.58,gran); B(1.5,2.3,.62,.84,IZ0,IZ0+.56,M(0x24262A,{roughness:.5}));
  [[1.52,IZ0+.52],[2.28,IZ0+.52]].forEach(p => cyl(.012,.012,.62,chrome,p[0],.31,p[1],root,8));
  const bs = new THREE.Mesh(new THREE.SphereGeometry(.2,24,12,0,Math.PI*2,Math.PI/2,Math.PI/2), M(0xFAFAF8,{roughness:.2,side:THREE.DoubleSide}));
  bs.position.set(1.9,.9,IZ0+.3); bs.scale.set(1.2,.5,1); bs.rotation.x = Math.PI; bs.castShadow = true; root.add(bs);
  B(1.89,1.91,.88,1.0,IZ0+.04,IZ0+.06,chrome); B(1.89,1.91,.98,1.0,IZ0+.04,IZ0+.14,chrome);
  B(1.45,2.35,1.15,1.95,IZ0+.012,IZ0+.02,M(0xB9C0C2,{roughness:.3}),root,{noCast:true});
  B(1.46,2.34,1.16,1.94,IZ0+.02,IZ0+.026,mirrorM,root,{noCast:true});
  [1.6,1.75].forEach(x => cyl(.014,.014,.04,chrome,x,1.12,IZ0+.04,root,8).rotation.x = Math.PI/2);
  // toilet (two-piece, lid up) against the east wall
  const tz = 1.05;
  B(hx-.22,hx-.02,.42,.86,tz-.19,tz+.19,white);
  cyl(.12,.14,.24,white,hx-.46,.12,tz,root,18);                                          // pedestal
  const bowl = new THREE.Mesh(new THREE.SphereGeometry(.2,24,14), white); bowl.scale.set(1.55,.82,1); bowl.position.set(hx-.5,.33,tz); bowl.castShadow = true; root.add(bowl);
  const seat = cyl(.2,.2,.03,M(0xFAFAF8,{roughness:.4}),hx-.5,.43,tz,root,22); seat.scale.x = 1.5;
  const lid = cyl(.19,.19,.025,M(0xFAFAF8,{roughness:.4}),hx-.27,.62,tz,root,22); lid.rotation.z = Math.PI/2-.12; lid.scale.x = 1.3;
  B(hx-.07,hx-.02,.62,.72,tz+.24,tz+.34,white,root,{noCast:true});                       // paper holder
  // awning windows (two panes, frosted) in the east wall
  { const fm_ = fm('E',M(0xC9CED0,{roughness:.4,metalness:.5})), zA = .35, zB = 1.35, zm = (zA+zB)/2, o = { noCast:true };
    B(hx,hx+.03,1.25,1.28,zA,zB,fm_,gE,o); B(hx,hx+.03,1.87,1.9,zA,zB,fm_,gE,o);
    B(hx,hx+.03,1.25,1.9,zA,zA+.03,fm_,gE,o); B(hx,hx+.03,1.25,1.9,zB-.03,zB,fm_,gE,o); B(hx,hx+.03,1.25,1.9,zm-.015,zm+.015,fm_,gE,o);
    const fg = new THREE.Mesh(new THREE.PlaneGeometry(zB-zA-.06,.6), fm('E',M(0xDCE8EC,{roughness:.3,emissive:0xA5BAC2,side:THREE.DoubleSide})));
    fg.rotation.y = -Math.PI/2; fg.position.set(hx+.015,1.575,zm); gE.add(fg); }
  // electric shower heater + hand shower hook
  B(hx-.2,hx-.02,1.55,1.98,1.9,2.16,M(0xF1F1EE,{roughness:.35}),root);
  B(hx-.2,hx-.02,1.62,1.66,1.93,2.13,M(0x4F8FC9,{roughness:.5}),root,{noCast:true});
  B(hx-.05,hx-.02,1.15,1.17,1.72,1.74,chrome,root,{noCast:true});
  blob(hx-.5,tz,.9,.8,.35); blob(1.9,IZ0+.3,1.0,.7,.3); blob(1.1,.9,.9,.8,.2);
}

/* ---------------- balcony ---------------- */
{
  const bz0 = -hz-T, X0 = SLD.a, X1 = SLD.b;
  const slab = tileM(tileCanvas('#D8D5CC','#B6B2A6',.08),X1-X0,BAL+T,.3,.3,{roughness:.8});
  B(X0,X1,-.14,0,bz1,bz0,slab);
  B(X0,X1,-.14,0,bz0,-hz,M(0xD8D5CC,{roughness:.8}));                                   // threshold under the slider
  const para = M(0xEEE8D8,{roughness:.8});
  B(X0,X1,0,1.02,bz1,bz1+.1,para); B(X0,X0+.1,0,1.02,bz1,bz0,para); B(X1-.1,X1,0,1.02,bz1,bz0,para);
  B(X0-.02,X1+.02,1.02,1.07,bz1-.02,bz1+.12,M(0xE0DAC8,{roughness:.6}));
  blob((X0+X1)/2,bz1+.5,2.4,.8,.25);
}

/* ---------------- bed: teal wall, wooden headboard + bedside cabinet, white linen ---------------- */
{
  const bz0 = -2.0, bz2 = -0.2, bcz = (bz0+bz2)/2, bedW = M(0xC88A3C,{roughness:.5});
  WB('E',-1.85,-0.35,.45,1.02,0,.06,bedW); WB('E',-1.81,-0.39,.5,.97,.06,.075,pineD,root,{noCast:true});         // headboard + inset panel
  WB('E',-0.32,0.06,.62,1.02,0,.06,bedW); WB('E',-0.28,0.02,.66,.98,.06,.075,pineD,root,{noCast:true});         // tall side panel
  WB('E',-0.3,0.08,.25,.62,0,.4,pine);                                                                          // bedside cabinet (open shelf + drawer)
  WB('E',-0.26,0.04,.4,.58,.4,.412,M(0x4A2D12,{roughness:.9}),root,{noCast:true});
  WB('E',-0.26,0.04,.28,.38,.4,.43,pineL); WB('E',-0.14,-0.08,.31,.35,.43,.45,chrome,root,{noCast:true});
  [[-0.27,.05],[.05,.05],[-0.27,.35],[.05,.35]].forEach(p => WB('E',p[0]-.015,p[0]+.015,0,.25,p[1]-.015,p[1]+.015,pineD,root,{noCast:true}));
  WB('E',-0.1,0.0,.76,.86,.0,.014,M(0xF2F0E8,{roughness:.5}),root,{noCast:true});                               // wall socket
  // frosted square wall lamp
  WB('E',-1.2,-1.0,1.62,1.88,0,.09,M(0xCFE4E0,{emissive:0x5E8F8A,roughness:.4}),root,{noCast:true});
  { const lp = new THREE.PointLight(0xCFF1EC,.18,2.6,1.6); const q = XZ('E',-1.1,.3); lp.position.set(q[0],1.75,q[1]); scene.add(lp); }
  // base, mattress, duvet, pillows
  B(.64,hx-.06,.06,.4,bz0,bz2,pine); B(.68,hx-.1,0,.06,bz0+.04,bz2-.04,pineD);
  rbox(1.96,.24,1.78,.05,.04,M(0xF6F3EC,{roughness:.95}),hx-.06-.98,.52,bcz);
  rbox(1.5,.09,1.82,.05,.04,M(0xffffff,{map:duvetTex('#F7F4EC','rgba(150,140,122,.3)',6),roughness:.95}),hx-.06-1.2,.665,bcz);
  [bcz-.42,bcz+.42].forEach(z => { rbox(.42,.14,.64,.07,.05,M(0xFAFAF8,{roughness:.95}),hx-.4,.72,z); rbox(.3,.13,.62,.07,.05,M(0xFAFAF8,{roughness:.95}),hx-.2,.8,z).rotation.z = .22; });
  blob(1.7,bcz,2.9,2.3,.4);
}

/* ---------------- louvred 3-door wardrobe (south wall, west of the bathroom) ---------------- */
{
  const lv = canvasTex(256,256,(g,w,h) => {
    g.fillStyle = '#AE7A3C'; g.fillRect(0,0,w,h);
    for(let y=0;y<h;y+=12){ g.fillStyle = '#8F5A25'; g.fillRect(0,y,w,3); g.fillStyle = 'rgba(255,225,170,.25)'; g.fillRect(0,y+3,w,2); }
  });
  lv.repeat.set(1,1.7/.45);
  const lm = M(0xE2CDB0,{map:lv,roughness:.6}), kb = M(0x5A3414,{roughness:.5});
  WB('S',-1.45,.15,.02,1.75,0,.55,pineD);
  WB('S',-0.43,.13,.05,1.72,.55,.575,lm,root,{noCast:true});                                // east sliding door
  WB('S',-0.9,-0.41,.05,1.72,.575,.6,lm,root,{noCast:true});                                // middle sliding door (in front)
  WB('S',-1.43,-0.92,.62,1.73,.55,.575,lm,root,{noCast:true});                              // west hinged door
  [[.05,.2],[.22,.37],[.39,.55]].forEach(r => { WB('S',-1.43,-0.92,r[0],r[1],.55,.58,pineL,root,{noCast:true});
    const q = XZ('S',-1.175,.6); const k = new THREE.Mesh(new THREE.SphereGeometry(.022,10,8), kb); k.position.set(q[0],(r[0]+r[1])/2,q[1]); root.add(k); });
  { const q = XZ('S',-0.94,.585); const k = new THREE.Mesh(new THREE.SphereGeometry(.022,10,8), kb); k.position.set(q[0],1.0,q[1]); root.add(k); }
  WB('S',-0.42,-0.4,.05,1.72,.6,.61,M(0x5A3414,{roughness:.7}),root,{noCast:true});
  blob(-0.65,2.1,1.9,1.0,.4);
}

/* ---------------- west wall: mirror, black-glass desk, pink chair, chest of drawers ---------------- */
{
  const dkM = M(0x161617,{roughness:.2,metalness:.1});
  // desk (z -0.25 .. 0.95)
  WB('W',-0.25,0.95,.74,.78,0,.55,dkM);
  WB('W',-0.25,0.95,.66,.74,.02,.53,pine);
  [[-0.25,-0.2,0,.05],[0.9,0.95,0,.05],[-0.25,-0.2,.5,.55],[0.9,0.95,.5,.55]].forEach(l => WB('W',l[0],l[1],0,.74,l[2],l[3],pine));
  WB('W',-0.2,0.9,.14,.19,.26,.3,pine);
  WB('W',-0.2,0.28,.55,.7,.53,.56,pineL); WB('W',0.0,0.08,.62,.64,.56,.58,chrome,root,{noCast:true});
  // wooden-framed mirror above the desk
  WB('W',0.0,0.7,1.1,1.95,0,.04,pine,root,{noCast:true});
  WB('W',0.04,0.66,1.14,1.91,.04,.046,mirrorM,root,{noCast:true});
  // chest of drawers: open shelf over two drawers (z -1.15 .. -0.25)
  WB('W',-1.15,-0.25,0,.8,0,.45,pine);
  WB('W',-1.1,-0.3,.36,.74,.43,.452,M(0x6E4620,{roughness:.8}),root,{noCast:true});
  WB('W',-1.1,-0.3,.54,.56,.1,.452,pineL,root,{noCast:true});
  WB('W',-1.12,-0.72,.04,.33,.45,.47,pineL); WB('W',-0.68,-0.28,.04,.33,.45,.47,pineL);
  [-0.92,-0.48].forEach(z => WB('W',z-.04,z+.04,.17,.2,.47,.5,chrome,root,{noCast:true}));
  WB('W',-1.17,-0.23,.8,.83,-.01,.47,pineL);
  blob(-1.9,0.35,1.5,1.6,.35); blob(-2.0,-0.7,1.0,1.0,.3);
  shellChair(-1.95,0.35,-Math.PI/2,M(0xE8A3B6,{roughness:.45}),M(0xC9A272,{roughness:.6}));
}

/* ---------------- dining bay: glass table + 3 chairs ---------------- */
{
  const tx = -1.15, tz = -2.8, glassT = new THREE.MeshStandardMaterial({ color:0x1E3A33, roughness:.08, metalness:.1, transparent:true, opacity:.78, depthWrite:false });
  const tc = M(0x1B1B1D,{roughness:.4,metalness:.4});
  B(tx-.55,tx+.55,.72,.745,tz-.35,tz+.35,M(0xEFE9D2,{roughness:.5}),root,{noCast:true});
  const tg = new THREE.Mesh(new THREE.BoxGeometry(1.06,.012,.66), glassT); tg.position.set(tx,.752,tz); root.add(tg);
  [[-.45,-.25],[.45,-.25],[-.45,.25],[.45,.25]].forEach(p => B(tx+p[0]-.02,tx+p[0]+.02,0,.72,tz+p[1]-.02,tz+p[1]+.02,tc));
  const seat = M(0x6D2530,{roughness:.6}), back = M(0xD9894A,{roughness:.55}), leg = M(0xC9CFD1,{roughness:.3,metalness:.7});
  diningChair(tx-.28,tz+.62,Math.PI,seat,back,leg);       // south side, facing the window
  diningChair(tx+.3,tz+.62,Math.PI+.12,seat,back,leg);
  diningChair(tx-.78,tz,Math.PI/2,seat,back,leg);          // west end, facing the table (+x)
  blob(tx,tz+.2,1.9,1.7,.4);
}
