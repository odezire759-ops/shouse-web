//==CFG==
/* ------------------------------------------------------------------
   S.House Standard 26 sq.m. Metres. Origin = centre of the bedroom floor.
   Balcony and bathroom are at -z (north). Looking north from the door side:
   the bed head is on the west wall (-x); the east wall (+x) holds, from north to south,
   the wardrobe, desk + mirror, a column and the entrance door. The sliding balcony door and the
   bathroom door are in the north wall. Plan reconstructed from the room photos (approximate).
------------------------------------------------------------------- */
const ROOM = { W:4.2, D:5.0, H:2.55, T:0.14 };

const TXT = {
  th:{
    title:'ห้อง Standard 26 ตร.ม.',
    meta:['ระเบียงส่วนตัว · ห้องน้ำในตัว','ตู้เสื้อผ้า · โต๊ะเครื่องแป้ง · แอร์'],
    note:'ภาพจำลอง 3 มิติ ขนาดและของตกแต่งอาจต่างจากห้องจริงเล็กน้อย · ทีวี-ตู้เย็นนำมาเองหรือเช่าได้',
    hintOrbit:'ลากเพื่อหมุนห้อง · บีบเพื่อซูม · แตะชื่อจุดเพื่อเข้าไปดู',
    hintWalk:'ลากเพื่อมองรอบห้อง · แตะที่พื้นเพื่อเดิน · บีบเพื่อซูม' + (fine ? ' · WASD' : ''),
    aria:'ภาพ 3 มิติของห้อง Standard 26 ตร.ม. ที่ S.House',
    fail:'อุปกรณ์หรือเบราว์เซอร์นี้แสดงภาพ 3 มิติไม่ได้ ลองเปิดด้วย Chrome หรือ Safari เวอร์ชันล่าสุด'
  },
  en:{
    title:'Standard Room 26 sq.m.',
    meta:['Private balcony · En-suite bathroom','Wardrobe · Dressing desk · Air-con'],
    note:'3D model. Size and furnishings may differ slightly from the actual room. TV and fridge: bring your own or rent from us.',
    hintOrbit:'Drag to rotate · Pinch to zoom · Tap a label to step inside',
    hintWalk:'Drag to look around · Tap the floor to walk · Pinch to zoom' + (fine ? ' · WASD' : ''),
    aria:'3D view of the Standard 26 sq.m. room at S.House',
    fail:'This device or browser cannot show 3D. Try the latest Chrome or Safari.'
  }
};

const VIEWS = [
  { id:'overview', th:'ภาพรวม',      en:'Overview' },
  { id:'entry',   th:'ทางเข้า',        en:'Entrance', pos:[1.45,1.55,1.95],  at:[-1.2,1.0,-1.6],   fov:76, tag:[1.5,1.95,1.8] },
  { id:'bed',     th:'เตียง',          en:'Bed',      pos:[0.55,1.5,1.15],   at:[-2.0,0.8,-0.25],  fov:80, tag:[-1.0,1.35,-0.25] },
  { id:'desk',    th:'ตู้ · โต๊ะแต่งตัว', en:'Wardrobe & desk', pos:[0.3,1.5,0.95], at:[2.1,1.0,-1.0], fov:82, tag:[1.7,2.05,-1.0] },
  { id:'balcony', th:'ระเบียง',        en:'Balcony',  pos:[1.0,1.5,-3.05],   at:[1.0,0.75,-7.0],   fov:74, tag:[0.9,1.2,-3.4] },
  { id:'bath',    th:'ห้องน้ำ',        en:'Bathroom', pos:[-0.85,1.55,-2.95], at:[-0.85,1.05,-4.5], fov:86, tag:[-0.85,1.7,-3.5] }
];

/* Where a visitor may stand ([x0,x1,z0,z1]) and what blocks them */
const WALK = [
  [-1.95,1.95,-2.3,2.3],
  [-1.3,-0.6,-2.7,-2.3], [-1.55,-0.2,-4.35,-2.65],
  [0.25,1.45,-2.7,-2.3], [0.15,2.0,-3.6,-2.65]
];
const BLOCK = [
  [-2.15,0.12,-1.1,0.62],                        // bed
  [-2.15,-1.6,0.5,1.05],                         // side table
  [1.4,2.15,-2.55,-1.4],                         // wardrobe
  [1.5,2.15,-1.3,0.0], [1.0,1.5,-0.95,-0.35],    // desk + chair
  [1.75,2.15,0.1,0.75],                          // column
  [-1.25,-0.65,-4.4,-3.95], [-0.5,-0.1,-3.8,-3.0], [-1.75,-1.35,-3.7,-3.1]   // toilet, basin, water heater
];
const FIT = [-2.5,2.5,0,2.6,-4.8,2.8];
const ORBIT = { el:.96, t:[-0.15,0.3,-1.0] };
const OVAZ = a => -(0.3+0.85*a);
const START = { x:1.45, y:1.55, z:1.95, yaw:0.62, pitch:-0.1, fov:76 };

//==BUILD==
/* ---------------- environment + lights ---------------- */
sky();
skyline([{ x0:-110, x1:110, z0:-125, z1:-30, n:24 }]);
scene.add(new THREE.HemisphereLight(0xEFF3F4, 0xBBA98F, .62));
const sun = new THREE.DirectionalLight(0xFFF0D8, .55);
sun.position.set(-2,7,-16); sun.target.position.set(0,0,0);
sun.castShadow = true; sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{ left:-10, right:10, top:10, bottom:-10, near:1, far:45 });
sun.shadow.bias = -.0006;
scene.add(sun, sun.target);
const lamp = new THREE.PointLight(0xFFF0DD, .6, 14, 1.3);
lamp.position.set(.15,2.3,.1); lamp.castShadow = true; lamp.shadow.mapSize.set(1024,1024);
lamp.shadow.camera.near = .2; lamp.shadow.camera.far = 14; lamp.shadow.bias = -.002;
scene.add(lamp);
const bathL = new THREE.PointLight(0xEAF6F2, .55, 3.6, 1.4); bathL.position.set(-.9,2.2,-3.5); scene.add(bathL);

/* ---------------- palette (taken from the photos) ---------------- */
const PAINT = 0xF1EAD6, TRIM = 0xE3DCC8;
const T_FLOOR = tileCanvas('#E9E3D2','#C9C2B0',.1);
const T_TEAL = tileCanvas('#82BBAF','#DDEEE8',.05);
const T_BFLOOR = tileCanvas('#6F8E8C','#A5BAB8',.05);
const wood = M(0x84452A,{roughness:.45}), woodD = M(0x6E3720,{roughness:.5}), woodL = M(0x9A5632,{roughness:.45});
const greyDoor = M(0x8D9296,{roughness:.55});
const vinyl = M(0x17181B,{roughness:.32,metalness:.06});

/* ---------------- shell ---------------- */
const BX0 = -1.7, BX1 = -0.1, BZ1 = -4.5;          // bathroom (north strip, west part)
const BALC = 1.25, bz1 = -hz-T-BALC;                // balcony depth
const gN = fadeGroup('N'), gS = fadeGroup('S'), gW = fadeGroup('W'), gE = fadeGroup('E'), gC = fadeGroup('C'), gP = fadeGroup('P');
{
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W,D), tileM(T_FLOOR,W,D,.4,.4,{roughness:.22}));
  floor.rotation.x = -Math.PI/2; floor.receiveShadow = true; root.add(floor);

  const skirt = fm('N',M(TRIM,{roughness:.6}));
  wall('N', fm('N',M(PAINT)), [{ a:-1.35, b:-0.55, y0:0, y1:2.02 }, { a:0.15, b:1.55, y0:0, y1:2.1 }], gN, skirt);
  wall('S', fm('S',M(PAINT)), [], gS, fm('S',M(TRIM,{roughness:.6})));
  wall('W', fm('W',M(PAINT)), [], gW, fm('W',M(TRIM,{roughness:.6})));
  wall('E', fm('E',M(PAINT)), [{ a:1.35, b:2.25, y0:0, y1:2.05 }], gE, fm('E',M(TRIM,{roughness:.6})));

  // a tall column on the east wall between the desk and the entrance door
  WB('E',0.15,0.72,0,H,0,.3,fm('E',M(PAINT)),gE);
  // breaker box above the door side
  WB('E',0.86,1.18,1.55,1.85,0,.04,fm('E',M(0xC9CDCE,{roughness:.5})),gE,{noCast:true});
  WB('E',0.9,1.14,1.6,1.8,.04,.045,fm('E',M(0x59646A,{roughness:.4})),gE,{noCast:true});

  // entrance door (closed): brown wood with raised panels
  const dwood = fm('E',M(0x9B5A2C,{roughness:.55})), dpan = fm('E',M(0x8A4D24,{roughness:.55}));
  WB('E',1.37,2.23,0,2.03,-.015,.045,dwood,gE);
  [[1.47,1.78],[1.82,2.13]].forEach(r => { WB('E',r[0],r[1],1.2,1.95,.045,.06,dpan,gE,{noCast:true}); WB('E',r[0],r[1],.12,1.08,.045,.06,dpan,gE,{noCast:true}); });
  { const q = XZ('E',1.5,.09); const k = new THREE.Mesh(new THREE.SphereGeometry(.033,12,8), fm('E',chrome)); k.position.set(q[0],1.0,q[1]); gE.add(k); }
  [[1.33,1.37],[2.23,2.27]].forEach(r => WB('E',r[0],r[1],0,2.07,-.02,.035,fm('E',M(0x7E848A,{roughness:.55})),gE,{noCast:true}));
  WB('E',1.33,2.27,2.03,2.07,-.02,.035,fm('E',M(0x7E848A,{roughness:.55})),gE,{noCast:true});

  // bathroom door frame (grey) + the leaf, standing open into the bathroom
  const gf = fm('N',greyDoor);
  [[-1.4,-1.35],[-.55,-.5]].forEach(r => WB('N',r[0],r[1],0,2.07,0,.035,gf,gN,{noCast:true}));
  WB('N',-1.4,-.5,2.02,2.07,0,.035,gf,gN,{noCast:true});
  const bd = doorLeaf('N',-1.35,1,.78,2.0,fm('P',greyDoor),-1.45,gP);
  { const vm = fm('P',M(0xA7915A,{roughness:.5})); for(let i=0;i<5;i++){ const s = new THREE.Mesh(new THREE.BoxGeometry(.3,.018,.012), vm); s.position.set(.39,.18+i*.04,.03); bd.group.add(s); } }
  { const kb = new THREE.Mesh(new THREE.SphereGeometry(.03,10,8), fm('P',chrome)); kb.position.set(.7,1.0,.045); bd.group.add(kb); }

  // sliding glass door onto the balcony
  const fr = fm('N',M(0xC9CED0,{roughness:.4,metalness:.55}));
  slider('N',0.15,1.55,{ g:gN, fr:fr, name:'N', y1:2.1, panes:2 });

  // plank ceiling, round surface lamp
  const pt = plankTex(1,true); pt.repeat.set(W/.3,1);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W,D), fm('C',M(0xffffff,{map:pt,roughness:1,side:THREE.DoubleSide})));
  ceil.rotation.x = Math.PI/2; ceil.position.y = H; gC.add(ceil);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(.27,28,10,0,Math.PI*2,0,Math.PI/2), fm('C',new THREE.MeshStandardMaterial({ color:0xFBFAF4, emissive:0xD8D6CC, roughness:.4 })));
  dome.scale.y = .32; dome.rotation.x = Math.PI; dome.position.set(.15,H-.003,.1); gC.add(dome);

  // air-conditioner above the wall between the bathroom door and the sliding door
  acUnit('N',-.5,.45,2.08,2.42,gN,'N');
  // curtains: slate-teal top band, mauve-grey lower part, pulled back to either side of the door
  const cTop = new THREE.MeshStandardMaterial({ color:0x4F6C7C, roughness:1, side:THREE.DoubleSide }); fm('N',cTop,1);
  const cLow = new THREE.MeshStandardMaterial({ color:0x8A828C, roughness:1, side:THREE.DoubleSide }); fm('N',cLow,1);
  [[0.1,.36],[1.6,.36]].forEach(c => { curtain('N',c[0],c[1],1.72,2.2,cTop,gN,.1); curtain('N',c[0],c[1],.02,1.72,cLow,gN,.1); });
  curtainRod('N',-.2,1.9,2.2,fm('N',M(0xB8BEC0,{roughness:.4,metalness:.6})),gN);
}

/* ---------------- bathroom (north strip) ---------------- */
{
  const pm = fm('P',M(0xEFEAD9));
  B(BX0-.1,BX0,0,H,BZ1-.1,-hz-T,pm,gP); B(BX1,BX1+.1,0,H,BZ1-.1,-hz-T,pm,gP); B(BX0-.1,BX1+.1,0,H,BZ1-.1,BZ1,pm,gP);
  const teal = (x0,x1,z0,z1) => {
    const L = Math.max(x1-x0,z1-z0);
    B(x0,x1,0,2.12,z0,z1,fm('P',tileM(T_TEAL,L,2.12,.2,.2,{roughness:.3})),gP,{noCast:true});
    B(x0,x1,2.12,H-.1,z0,z1,fm('P',M(0xF2EFE4)),gP,{noCast:true});
  };
  teal(BX0,BX0+.012,BZ1,-hz-T); teal(BX1-.012,BX1,BZ1,-hz-T); teal(BX0,BX1,BZ1,BZ1+.012);
  teal(BX0,-1.4,-hz-T-.012,-hz-T); teal(-.5,BX1,-hz-T-.012,-hz-T);
  const bf = new THREE.Mesh(new THREE.PlaneGeometry(BX1-BX0,-hz-BZ1), tileM(T_BFLOOR,BX1-BX0,-hz-BZ1,.3,.3,{roughness:.3}));
  bf.rotation.x = -Math.PI/2; bf.position.set((BX0+BX1)/2,.004,(BZ1-hz)/2); bf.receiveShadow = true; root.add(bf);
  // suspended ceiling grid
  const gridT = canvasTex(128,128,(g,w,h) => { g.fillStyle = '#F4F5F2'; g.fillRect(0,0,w,h); g.strokeStyle = '#9AA0A3'; g.lineWidth = 5; g.strokeRect(0,0,w,h); });
  gridT.repeat.set((BX1-BX0)/.6,(-hz-BZ1)/.6);
  const bc = new THREE.Mesh(new THREE.PlaneGeometry(BX1-BX0,-hz-BZ1), fm('C',M(0xffffff,{map:gridT,roughness:1,side:THREE.DoubleSide})));
  bc.rotation.x = Math.PI/2; bc.position.set((BX0+BX1)/2,H-.1,(BZ1-hz)/2); gC.add(bc);

  // toilet at the back wall
  const tx = -.95;
  B(tx-.19,tx+.19,.42,.85,BZ1+.02,BZ1+.2,white);
  const bowl = cyl(.19,.16,.4,white,tx,.2,BZ1+.46,root,22); bowl.scale.z = 1.45;
  const seat = cyl(.2,.2,.03,M(0xFAFAF8,{roughness:.4}),tx,.42,BZ1+.46,root,22); seat.scale.z = 1.45;
  B(tx-.03,tx+.03,.85,.88,BZ1+.1,BZ1+.15,chrome);
  // pedestal basin and mirror cabinet on the east wall
  const bz = -3.4;
  cyl(.06,.08,.68,white,BX1-.22,.36,bz,root,14);
  const bs = new THREE.Mesh(new THREE.SphereGeometry(.24,24,12,0,Math.PI*2,Math.PI/2,Math.PI/2), M(0xFAFAF8,{roughness:.2,side:THREE.DoubleSide}));
  bs.position.set(BX1-.25,.84,bz); bs.scale.set(.8,.5,1.15); bs.rotation.x = Math.PI; bs.castShadow = true; root.add(bs);
  B(BX1-.12,BX1-.06,.88,1.0,bz-.015,bz+.015,chrome); B(BX1-.12,BX1-.04,.98,1.0,bz-.015,bz+.015,chrome);
  B(BX1-.09,BX1-.0,1.2,1.92,bz-.3,bz+.3,M(0xC9CED0,{roughness:.4,metalness:.5}));
  B(BX1-.095,BX1-.088,1.24,1.88,bz-.27,bz+.27,mirrorM,root,{noCast:true});
  // electric water heater with hand shower on the west wall + towel bar + soap dish
  B(BX0,BX0+.12,1.5,1.92,-3.55,-3.25,M(0xF1F1EE,{roughness:.5}));
  cyl(.04,.04,.02,M(0xEDEDE9,{roughness:.4}),BX0+.13,1.78,-3.4,root,14).rotation.z = Math.PI/2;
  B(BX0+.01,BX0+.05,1.05,1.12,-3.43,-3.37,white);
  B(BX0,BX0+.07,1.4,1.43,-4.2,-3.8,chrome);
  B(BX0,BX0+.08,.95,1.0,-3.95,-3.8,white);
  blob(tx,BZ1+.4,.8,.9,.4); blob(BX1-.3,bz,.7,.9,.3);
}

/* ---------------- balcony ---------------- */
{
  const bz0 = -hz-T, X0 = BX1+.1, X1 = hx+T;
  const slab = tileM(tileCanvas('#D8D5CC','#B6B2A6',.08),X1-X0,BALC+T,.3,.3,{roughness:.8});
  B(X0,X1,-.14,0,bz1,bz0,slab);
  const para = M(0xEEE8D8,{roughness:.8});
  B(X0,X1,0,1.0,bz1,bz1+.1,para); B(X0,X0+.1,0,1.0,bz1,bz0,para); B(X1-.1,X1,0,1.0,bz1,bz0,para);
  B(X0-.02,X1+.02,1.0,1.05,bz1-.02,bz1+.12,M(0xE0DAC8,{roughness:.6}));
  const slot = M(0x5F6A6E,{roughness:.7});
  for(let x = X0+.35; x < X1-.2; x += .5) B(x,x+.1,.4,.74,bz1+.1,bz1+.104,slot,root,{noCast:true});
  B(X1-.12,X1-.1,0,.02,bz1,bz0,para);
  blob((X0+X1)/2,bz1+.5,1.8,.8,.25);
}

/* ---------------- bed: wooden base, arched headboard, black vinyl mattress ---------------- */
{
  const L = -hx;
  // arched headboard on the west wall
  const r = .78, sh = new THREE.Shape(); sh.moveTo(-r,0); sh.absarc(0,0,r,Math.PI,0,true); sh.lineTo(-r,0);
  const hg = new THREE.ExtrudeGeometry(sh,{ depth:.06, bevelEnabled:false, curveSegments:28 });
  const hb = new THREE.Mesh(hg, woodL); hb.rotation.y = -Math.PI/2; hb.position.set(L+.06,.5,-.25); hb.castShadow = true; hb.receiveShadow = true; root.add(hb);
  const ln = M(0x5E2C16,{roughness:.6});
  [-.45,0,.45].forEach(a => { const l = B(L+.06,L+.066,.5,1.2,-.012,.012,ln,root,{noCast:true}); l.position.z = -.25; l.position.y = .5+.35*Math.cos(a)*.9; l.rotation.x = a; });
  // base with a plinth
  B(L+.06,L+2.04,.07,.46,-1.0,.5,wood); B(L+.1,L+2.0,0,.07,-.96,.46,woodD);
  B(L+1.94,L+2.04,.1,.4,-1.0,.5,woodD,root,{noCast:true});
  // mattress with a tan edge tape
  rbox(1.94,.2,1.46,.05,.03,vinyl,L+1.06,.56,-.25);
  rbox(1.96,.025,1.48,.05,.015,M(0x9A8A6B,{roughness:.6}),L+1.06,.5,-.25);
  blob(L+1.1,-.25,2.6,2.0,.4);
  // bedside table with a lower shelf (south of the head)
  const tz = .76, tx = L+.23;
  B(tx-.21,tx+.21,.48,.52,tz-.21,tz+.21,woodL);
  [[-.19,-.19],[.19,-.19],[-.19,.19],[.19,.19]].forEach(p => B(tx+p[0]-.02,tx+p[0]+.02,0,.48,tz+p[1]-.02,tz+p[1]+.02,wood));
  B(tx-.19,tx+.19,.14,.17,tz-.19,tz+.19,wood);
  blob(tx,tz,.7,.7,.3);
}

/* ---------------- east wall: wardrobe, desk + mirror, chair ---------------- */
{
  // 2-door wardrobe in the north-east corner
  WB('E',-2.5,-1.45,0,1.95,0,.55,wood);
  WB('E',-2.5,-1.45,1.95,2.0,-.0,.58,woodD);
  WB('E',-1.985,-1.965,.06,1.9,.55,.558,M(0x3A1B0E,{roughness:.7}),root,{noCast:true});
  [[-2.03,-1.99],[-1.95,-1.91]].forEach(r => WB('E',r[0],r[1],.9,1.3,.555,.58,chrome,root,{noCast:true}));
  blob(hx-.7,-1.95,1.2,1.4,.4);
  // desk with side panels, two drawers and a thin glass top
  const dz0 = -1.25, dz1 = -0.05;
  WB('E',dz0,dz1,.72,.76,0,.55,woodL);
  WB('E',dz0,dz0+.03,0,.72,0,.55,wood); WB('E',dz1-.03,dz1,0,.72,0,.55,wood); WB('E',dz0,dz1,.1,.7,0,.03,wood);
  WB('E',dz0+.03,dz1-.03,.6,.72,.5,.55,woodD);
  [[dz0+.05,dz0+.57],[dz0+.63,dz1-.05]].forEach(r => { WB('E',r[0],r[1],.62,.71,.55,.575,woodL); WB('E',(r[0]+r[1])/2-.05,(r[0]+r[1])/2+.05,.665,.675,.575,.585,chrome,root,{noCast:true}); });
  { const gt = WB('E',dz0,dz1,.76,.772,0,.55,new THREE.MeshStandardMaterial({ color:0xD7E6E4, roughness:.06, transparent:true, opacity:.3, depthWrite:false }),root,{noCast:true}); }
  // wooden-framed mirror on the wall
  WB('E',-1.0,-.3,1.02,1.98,0,.03,wood,root,{noCast:true});
  WB('E',-.95,-.35,1.07,1.93,.03,.036,mirrorM,root,{noCast:true});
  blob(hx-.3,-.65,.9,1.6,.4);
  // light-blue shell chair at the desk (seat faces the desk, +x)
  shellChair(hx-.78,-.65,Math.PI/2,M(0x8DB3DD,{roughness:.45}),M(0xC9A272,{roughness:.6}));
  blob(hx-.78,-.65,.7,.7,.3);
}
