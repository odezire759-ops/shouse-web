//==CFG==
/* ------------------------------------------------------------------
   S.House Standard Window 27 sq.m. Metres. Origin = centre of the bedroom floor. Room 3.7 (x) x 5.2 (z).
   Plan (from the 11 room photos; approximate, no tape measure):
   - SOUTH wall (+z): the brown ENTRANCE door at the west end; the bed lies along this wall, head against the east wall.
   - WEST wall (-x), from the south: honey-wood TV cabinet with drawers, wall pier with the breaker box (high),
     desk with a wooden-framed mirror and a pink shell chair, 2-door honey-wood wardrobe in the north-west corner.
   - NORTH wall (-z), from the west: grey-blue bathroom door (louvre vent), then the 2-pane aluminium balcony slider
     (brown curtains, split A/C above). Bathroom wing and balcony lie outside this wall.
   - EAST wall (+x), from the north: window (brown curtains) over the corner table nook (white table, two black chairs,
     green/white pendant), a pier, a small wooden bedside table, and the built-in glass-shelf niche above the bed head.
   - Bed = 1.5 m wide, black mattress on a honey-wood storage base. Floor = glossy white marble-look tiles.
------------------------------------------------------------------- */
const ROOM = { W:3.7, D:5.2, H:2.6, T:0.14 };

const TXT = {
  th:{
    title:'ห้อง Standard Window 27 ตร.ม.',
    meta:['หน้าต่างบานใหญ่ · ระเบียงส่วนตัว','ชั้นกระจกหัวเตียง · มุมโต๊ะนั่งริมหน้าต่าง · ห้องน้ำในตัว'],
    note:'ภาพจำลอง 3 มิติ ขนาดและของตกแต่งอาจต่างจากห้องจริงเล็กน้อย',
    hintOrbit:'ลากเพื่อหมุนห้อง · บีบเพื่อซูม · แตะชื่อจุดเพื่อเข้าไปดู',
    hintWalk:'ลากเพื่อมองรอบห้อง · แตะที่พื้นเพื่อเดิน · บีบเพื่อซูม' + (fine ? ' · WASD' : ''),
    aria:'ภาพ 3 มิติของห้อง Standard Window 27 ตร.ม. ที่ S.House',
    fail:'อุปกรณ์หรือเบราว์เซอร์นี้แสดงภาพ 3 มิติไม่ได้ ลองเปิดด้วย Chrome หรือ Safari เวอร์ชันล่าสุด'
  },
  en:{
    title:'Standard Window Room 27 sq.m.',
    meta:['Large window · Private balcony','Glass shelves above the bed · Window-side table nook · En-suite bathroom'],
    note:'3D model. Size and furnishings may differ slightly from the actual room.',
    hintOrbit:'Drag to rotate · Pinch to zoom · Tap a label to step inside',
    hintWalk:'Drag to look around · Tap the floor to walk · Pinch to zoom' + (fine ? ' · WASD' : ''),
    aria:'3D view of the Standard Window 27 sq.m. room at S.House',
    fail:'This device or browser cannot show 3D. Try the latest Chrome or Safari.'
  }
};

const VIEWS = [
  { id:'overview', th:'ภาพรวม',              en:'Overview' },
  { id:'entry',   th:'ทางเข้า',                en:'Entrance',        pos:[-0.95,1.55,2.15], at:[0.5,0.9,-1.6],    fov:78, tag:[-1.0,2.2,2.5] },
  { id:'bed',     th:'เตียง · ชั้นกระจก',       en:'Bed & shelves',   pos:[-0.8,1.5,0.2],    at:[1.5,0.9,1.9],     fov:78, tag:[1.5,2.4,1.8] },
  { id:'window',  th:'หน้าต่าง · โต๊ะนั่ง',     en:'Window nook',     pos:[-0.2,1.5,-0.1],   at:[1.6,1.0,-2.0],    fov:80, tag:[1.35,1.95,-2.05] },
  { id:'desk',    th:'โต๊ะ · กระจก',          en:'Desk & mirror',   pos:[0.9,1.5,0.1],     at:[-1.8,1.1,-0.35],  fov:80, tag:[-1.6,2.15,-0.35] },
  { id:'closet',  th:'ตู้เสื้อผ้า',             en:'Wardrobe',        pos:[0.6,1.5,0.0],     at:[-1.7,1.0,-1.9],   fov:82, tag:[-1.5,2.25,-1.95] },
  { id:'tvcab',   th:'ตู้ลิ้นชัก',              en:'Drawer cabinet',  pos:[0.5,1.5,0.1],     at:[-1.7,0.7,1.7],    fov:80, tag:[-1.5,1.1,1.7] },
  { id:'balcony', th:'ระเบียง',                en:'Balcony',         pos:[0.45,1.5,-2.0],   at:[0.5,0.3,-4.6],    fov:78, tag:[0.45,1.25,-3.3] },
  { id:'bath',    th:'ห้องน้ำ',                en:'Bathroom',        pos:[-0.85,1.55,-1.9], at:[-1.2,0.95,-4.4],  fov:92, tag:[-1.1,1.9,-3.3] }
];

/* Where a visitor may stand ([x0,x1,z0,z1]) and what blocks them */
const WALK = [
  [-1.5,1.5,-2.3,2.3],                              // the room
  [-1.2,-0.5,-2.8,-2.25],                           // bathroom doorway
  [-1.8,-0.35,-4.4,-2.7],                           // bathroom
  [-0.05,0.95,-2.8,-2.25],                          // balcony door threshold
  [-0.15,1.5,-3.9,-2.7]                             // balcony
];
const BLOCK = [
  [-0.25,1.9,1.0,2.6],                              // bed
  [1.45,1.9,0.55,1.0],                              // bedside table
  [-1.9,-1.35,1.05,2.35],                           // drawer cabinet
  [-1.9,-1.5,0.5,0.9],                              // pier
  [-1.9,-1.25,-1.0,0.3], [-1.35,-0.75,-0.7,-0.0],   // desk + chair
  [-1.9,-1.25,-2.6,-1.3],                           // wardrobe
  [0.95,1.75,-2.45,-1.65], [0.4,0.85,-2.3,-1.8], [1.1,1.6,-1.6,-1.1],   // table + two black chairs
  [-1.5,-0.9,-4.5,-3.85],                           // toilet
  [-1.95,-1.35,-4.0,-3.0],                          // vanity
  [-0.55,-0.35,-3.55,-2.75]                         // bathroom door leaf (open)
];
const FIT = [                                    // room box + bathroom wing + balcony wing
  [-2.0,0,2.75],[-2.0,2.7,2.75],[-2.0,0,-2.75],[-2.0,2.7,-2.75],[2.0,0,2.75],[2.0,2.7,2.75],[2.0,0,-2.75],[2.0,2.7,-2.75],
  [-2.0,0,-4.55],[-2.0,2.4,-4.55],[-0.2,0,-4.55],[-0.2,2.4,-4.55],
  [1.6,0,-3.95],[1.6,1.2,-3.95],[-0.2,0,-3.95],[-0.2,1.2,-3.95]
];
const ORBIT = { el:.98, t:[0.0,0.3,-1.7] };
const OVAZ = a => (-1.5*a);                        // phone (narrow): look north along the long axis; wide screens: look east from the west
const START = Object.assign({ x:-0.95, y:1.55, z:2.15, fov:78 }, anglesTo([-0.95,1.55,2.15],[0.5,0.9,-1.6]));

//==BUILD==
/* ---------------- environment + lights ---------------- */
sky();
skyline([{ x0:-110, x1:110, z0:-125, z1:-30, n:22 }, { x0:35, x1:125, z0:-60, z1:60, n:10 }, { x0:-125, x1:-40, z0:-40, z1:60, n:8 }]);
/* nearby low roofs, so the balcony and the window look out over rooftops before the towers */
{ const roofs = [0xE8E2D6,0xE3A27C,0xF2F0EC,0xCFC6B4,0xE9B58A,0xDAD7D0];
  const blk = (x0,x1,z0,z1,top,c) => { const m = new THREE.Mesh(new THREE.BoxGeometry(x1-x0,14+top,z1-z0), new THREE.MeshStandardMaterial({ color:c, roughness:.9 })); m.position.set((x0+x1)/2,(top-14)/2,(z0+z1)/2); scene.add(m); };
  [[-6,1,-19,-9,-1.4],[2,9,-15,-8,-2.6],[10,18,-18,-9,-1.0],[-9,-2,-24,-17,0.6],[3,12,-27,-19,1.4]].forEach((b,i) => blk(b[0],b[1],b[2],b[3],b[4],roofs[i%roofs.length]));
  [[8,15,-8,-1,-3.4],[9,17,4,11,-3.0],[22,31,-14,-4,-1.2]].forEach((b,i) => blk(b[0],b[1],b[2],b[3],b[4],roofs[(i+1)%roofs.length])); }
scene.add(new THREE.HemisphereLight(0xEFF3F4, 0xBBA98F, .6));
const sun = new THREE.DirectionalLight(0xFFF0D8, .55);
sun.position.set(-2,7,-16); sun.target.position.set(0,0,0);
sun.castShadow = true; sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{ left:-10, right:10, top:10, bottom:-10, near:1, far:45 });
sun.shadow.bias = -.0006;
scene.add(sun, sun.target);
const lamp = new THREE.PointLight(0xFFF0DD, .5, 15, 1.3);
lamp.position.set(0,2.3,.3); lamp.castShadow = true; lamp.shadow.mapSize.set(1024,1024);
lamp.shadow.camera.near = .2; lamp.shadow.camera.far = 15; lamp.shadow.bias = -.002;
scene.add(lamp);
const pendL = new THREE.PointLight(0xFFEBD2, .3, 4, 1.4); pendL.position.set(1.35,1.7,-2.05); scene.add(pendL);
const bathL = new THREE.PointLight(0xF8F4EA, .55, 3.8, 1.4); bathL.position.set(-1.1,2.15,-3.6); scene.add(bathL);

/* ---------------- palette (taken from the photos) ---------------- */
const PAINT = 0xF1EFE9, TRIM = 0xDAD5C8;
const T_FLOOR = tileCanvas('#F3F2EE','#D2D0C9',.1,'rgba(150,150,145,');
const pine = M(0xC38E3E,{roughness:.55}), pineD = M(0xA8742A,{roughness:.6}), pineL = M(0xCFA050,{roughness:.5});
const brownDoor = () => M(0x8F5028,{roughness:.55}), brownPan = () => M(0x7E4521,{roughness:.55});
const greyFr = () => M(0x8E979B,{roughness:.55});
const alu = (n) => fm(n,M(0xC9CED0,{roughness:.4,metalness:.55}));
const brownC = (n) => { const m = new THREE.MeshStandardMaterial({ color:0x6A4A36, roughness:1, side:THREE.DoubleSide }); fm(n,m,1); return m; };
const rodM = (n) => fm(n,M(0xB8BEC0,{roughness:.4,metalness:.6}));
const plate = (n) => fm(n,M(0xF2F0E8,{roughness:.5}));
const brass = M(0xC9A24E,{roughness:.35,metalness:.6});

/* ---------------- plan constants ---------------- */
const BDOOR = { a:-1.25, b:-0.45 };                // bathroom door (north wall, along x)
const SL = { a:-0.1, b:1.0 };                      // balcony slider (north wall)
const EW = { a:-2.2, b:-0.9, y0:.95, y1:2.1 };     // east window (along z)
const BX0 = -1.9, BX1 = -0.3, BZ0 = -hz-T, BZ1 = -4.45;   // bathroom interior: x BX0..BX1, z BZ1..BZ0
const BAL = { x0:-0.2, x1:1.55, z1:-3.94 };        // balcony outside the slider
const gN = fadeGroup('N'), gS = fadeGroup('S'), gW = fadeGroup('W'), gE = fadeGroup('E'), gC = fadeGroup('C'), gP = fadeGroup('P');

/* ---------------- shell ---------------- */
{
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W,D), tileM(T_FLOOR,W,D,.6,.6,{roughness:.16}));
  floor.rotation.x = -Math.PI/2; floor.receiveShadow = true; root.add(floor);
  const pn = (n) => fm(n,M(PAINT)), sk = (n) => fm(n,M(TRIM,{roughness:.6}));
  wall('N', pn('N'), [{ a:BDOOR.a, b:BDOOR.b, y0:0, y1:2.05 }, { a:SL.a, b:SL.b, y0:0, y1:2.1 }], gN, sk('N'));
  wall('S', pn('S'), [], gS, sk('S'));
  wall('W', pn('W'), [], gW, sk('W'));
  wall('E', pn('E'), [{ a:EW.a, b:EW.b, y0:EW.y0, y1:EW.y1 }], gE, sk('E'));

  // ---- east window: aluminium 2-pane slider + sill, brown curtains, rod ----
  { const a = EW.a, b = EW.b, y0 = EW.y0, y1 = EW.y1, fr = alu('E'), mid = (a+b)/2, o = { noCast:true };
    WB('E',a,b,y0,y0+.05,-.05,.05,fr,gE,o); WB('E',a,b,y1-.05,y1,-.05,.05,fr,gE,o);
    WB('E',a,a+.05,y0,y1,-.05,.05,fr,gE,o); WB('E',b-.05,b,y0,y1,-.05,.05,fr,gE,o);
    WB('E',mid-.03,mid+.03,y0,y1,-.07,.07,fr,gE,o);
    const gl = glassM(); fm('E',gl,gl.opacity); const p = WP('E',mid,(y0+y1)/2,0,b-a-.1,y1-y0-.1,gl,gE); p.renderOrder = 2;
    WB('E',a-.06,b+.06,y0-.04,y0,-.03,.1,fm('E',M(0xEFEDE6,{roughness:.5})),gE,o);
    const cn = brownC('E'); curtain('E',a-.18,.4,.05,2.22,cn,gE,.12,46); curtain('E',b+.18,.4,.05,2.22,cn,gE,.12,46);
    curtainRod('E',a-.4,b+.4,2.24,rodM('E'),gE); }
  WB('E',-.45,-.05,0,H,0,.25,pn('E'),gE);                                              // pier beside the bedside table
  WB('E',-.4,-.32,1.2,1.3,.25,.262,plate('E'),gE,{noCast:true});                        // light switch on the pier

  // ---- north wall: grey-blue bathroom door (open, louvre vent), balcony slider, A/C, brown curtains ----
  { const g = () => fm('N',greyFr()), o = { noCast:true };
    WB('N',BDOOR.a-.04,BDOOR.a,0,2.1,-.02,.035,g(),gN,o); WB('N',BDOOR.b,BDOOR.b+.04,0,2.1,-.02,.035,g(),gN,o); WB('N',BDOOR.a-.04,BDOOR.b+.04,2.05,2.1,-.02,.035,g(),gN,o);
    const leaf = doorLeaf('N',BDOOR.b,-1,.78,2.0,fm('P',M(0x8FA6B5,{roughness:.5})),-1.45,gP);
    const vm = fm('P',M(0x5F7686,{roughness:.5})), sm = fm('P',M(0xB9CAD5,{roughness:.5}));
    [.027,-.027].forEach(zz => { const v = new THREE.Mesh(new THREE.BoxGeometry(.32,.24,.012), vm); v.position.set(.39,.32,zz); leaf.group.add(v);
      for(let i=0;i<5;i++){ const s = new THREE.Mesh(new THREE.BoxGeometry(.3,.012,.016), sm); s.position.set(.39,.23+i*.04,zz*1.1); leaf.group.add(s); } });
    const kb = new THREE.Mesh(new THREE.SphereGeometry(.03,10,8), fm('P',chrome)); kb.position.set(.68,1.0,.04); leaf.group.add(kb); }
  slider('N',SL.a,SL.b,{ g:gN, fr:alu('N'), name:'N', y1:2.1, panes:2 });
  B(SL.a,SL.b,-.14,0,-hz-T,-hz,M(0xD8D5CC,{roughness:.8}));                              // threshold under the slider
  acUnit('N',0.0,.95,2.16,2.5,gN,'N');
  { const cn = brownC('N'); curtain('N',-0.02,.45,.02,2.08,cn,gN,.1); curtain('N',.92,.45,.02,2.08,cn,gN,.1);
    curtainRod('N',-.3,1.2,2.1,rodM('N'),gN); }

  // ---- south wall: entrance door (brown, closed), A/C remote near the foot of the bed ----
  { const a = -1.45, b = -0.6, m = (a+b)/2, dw = fm('S',brownDoor()), dp = fm('S',brownPan()), gf = () => fm('S',greyFr());
    WB('S',a,b,0,2.03,-.015,.045,dw,gS);
    [[a+.07,m-.03],[m+.03,b-.07]].forEach(r => { WB('S',r[0],r[1],1.15,1.93,.045,.06,dp,gS,{noCast:true}); WB('S',r[0],r[1],.12,1.0,.045,.06,dp,gS,{noCast:true}); });
    { const q = XZ('S',b-.1,.075); const k = new THREE.Mesh(new THREE.SphereGeometry(.033,12,8), fm('S',chrome)); k.position.set(q[0],1.0,q[1]); gS.add(k);
      WB('S',b-.16,b-.06,.86,.92,.06,.09,fm('S',chrome),gS,{noCast:true}); }
    WB('S',a-.03,a,0,2.07,-.02,.035,gf(),gS,{noCast:true}); WB('S',b,b+.03,0,2.07,-.02,.035,gf(),gS,{noCast:true}); WB('S',a-.03,b+.03,2.03,2.07,-.02,.035,gf(),gS,{noCast:true}); }
  WB('S',-.42,-.34,1.2,1.42,0,.025,fm('S',M(0xF4F4F1,{roughness:.4})),gS,{noCast:true});
  WB('S',-.3,-.2,1.2,1.3,0,.012,plate('S'),gS,{noCast:true});

  // ---- west wall: pier with the breaker box (high) ----
  WB('W',.5,.9,0,H,0,.3,pn('W'),gW);
  WB('W',.54,.86,1.55,1.88,.3,.37,fm('W',M(0xE7E9E8,{roughness:.5})),gW,{noCast:true});
  WB('W',.57,.83,1.6,1.82,.37,.375,fm('W',M(0x59646A,{roughness:.4})),gW,{noCast:true});
  WB('W',.66,.74,1.62,1.8,.375,.38,fm('W',M(0xBFC6C8,{roughness:.4})),gW,{noCast:true});
  { const q = XZ('W',.7,.15); const c = new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,H-1.88,8), fm('W',M(0xE9E6DA,{roughness:.6}))); c.position.set(q[0],1.88+(H-1.88)/2,q[1]); gW.add(c); }

  // ---- ceiling: plain white, round LED lamp, pendant over the table nook (green/white shade) ----
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W,D), fm('C',M(0xF6F5F2,{roughness:1,side:THREE.DoubleSide})));
  ceil.rotation.x = Math.PI/2; ceil.position.y = H; gC.add(ceil);
  const lr = new THREE.Mesh(new THREE.CylinderGeometry(.27,.27,.04,36), fm('C',M(0xEDEDEA,{roughness:.5}))); lr.position.set(0,H-.02,.3); gC.add(lr);
  const lf = new THREE.Mesh(new THREE.CylinderGeometry(.235,.235,.01,36), fm('C',new THREE.MeshBasicMaterial({color:0xF4F8FF}))); lf.position.set(0,H-.045,.3); gC.add(lf);
  { const px = 1.35, pz = -2.05, wh = fm('C',M(0xF3F2EE,{roughness:.45,side:THREE.DoubleSide,emissive:0x555450}));
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(.004,.004,H-1.88,6), fm('C',M(0xEDEDE8,{roughness:.6}))); cord.position.set(px,1.88+(H-1.88)/2,pz); gC.add(cord);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(.013,.013,.24,10), fm('C',M(0x6FAE5A,{roughness:.5}))); rod.position.set(px,1.76,pz); gC.add(rod);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(.15,28,12,0,Math.PI*2,0,Math.PI/2), wh); dome.scale.y = .8; dome.position.set(px,1.52,pz); gC.add(dome);
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(.152,.152,.035,28,1,true), fm('C',M(0x6FAE5A,{roughness:.5,side:THREE.DoubleSide}))); ring.position.set(px,1.525,pz); gC.add(ring);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(.04,12,8), fm('C',new THREE.MeshBasicMaterial({color:0xFFE2A8}))); bulb.position.set(px,1.5,pz); gC.add(bulb); }
}

/* ---------------- bathroom wing (north of the room, door in the north wall) ---------------- */
{
  const Hb = 2.3, pm = () => fm('P',M(0xEFE8D0));
  B(BX0-.1,BX0,0,Hb,BZ1-.1,BZ0,pm(),gP); B(BX1,BX1+.1,0,Hb,BZ1-.1,BZ0,pm(),gP); B(BX0-.1,BX1+.1,0,Hb,BZ1-.1,BZ1,pm(),gP);
  // ochre lower tiles, white upper tiles, teal band under the ceiling
  const T_OCH = tileCanvas('#C79B58','#E4D2A8',.07), T_WHT = tileCanvas('#F6F5F1','#CDCCC5',.05), teal = () => fm('P',M(0x2F8E8A,{roughness:.5}));
  const face = (x0,x1,z0,z1) => { const L = Math.max(x1-x0,z1-z0), o = { noCast:true };
    B(x0,x1,0,1.1,z0,z1,fm('P',tileM(T_OCH,L,1.1,.3,.3,{roughness:.3})),gP,o);
    B(x0,x1,1.1,2.05,z0,z1,fm('P',tileM(T_WHT,L,.95,.3,.3,{roughness:.3})),gP,o);
    B(x0,x1,2.05,Hb,z0,z1,teal(),gP,o); };
  face(BX0,BX0+.012,BZ1,BZ0); face(BX1-.012,BX1,BZ1,BZ0); face(BX0,BX1,BZ1,BZ1+.012);
  face(BX0,BDOOR.a,BZ0-.012,BZ0); face(BDOOR.b,BX1,BZ0-.012,BZ0);
  B(BDOOR.a,BDOOR.b,2.05,Hb,BZ0-.012,BZ0,teal(),gP,{noCast:true});
  // beige floor, T-bar ceiling at 2.3 m with a downlight
  const bw = BX1-BX0, bd = BZ0-BZ1, bcx = (BX0+BX1)/2, bcz = (BZ0+BZ1)/2;
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(bw,bd), tileM(tileCanvas('#D8C7A0','#B8A57E',.07,'rgba(120,100,60,'),bw,bd,.3,.3,{roughness:.3}));
  fl.rotation.x = -Math.PI/2; fl.position.set(bcx,.004,bcz); fl.receiveShadow = true; root.add(fl);
  B(BDOOR.a,BDOOR.b,0,.02,BZ0-.12,BZ0+.1,fm('P',M(0xB8C0C6,{roughness:.4})),gP,{noCast:true});    // door threshold
  const tb = canvasTex(128,128,(g,w,h) => { g.fillStyle = '#F4F5F2'; g.fillRect(0,0,w,h); g.strokeStyle = '#B9BDBA'; g.lineWidth = 4; g.strokeRect(0,0,w,h); });
  tb.repeat.set(bw/.6,bd/.6);
  const bc = new THREE.Mesh(new THREE.PlaneGeometry(bw,bd), fm('C',M(0xffffff,{map:tb,roughness:1,side:THREE.DoubleSide,emissive:0x777776,emissiveMap:tb})));
  bc.rotation.x = Math.PI/2; bc.position.set(bcx,Hb,bcz); gC.add(bc);
  { const d = new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.012,18), fm('C',new THREE.MeshBasicMaterial({color:0xFFFFFF}))); d.position.set(-1.1,Hb-.006,-3.6); gC.add(d); }

  // vanity along the west wall: black granite counter, dark cabinet, oval basin, tap, mirror
  const gran = M(0x17181A,{roughness:.22,metalness:.1});
  B(BX0,-1.4,.84,.88,-3.95,-3.05,gran); B(BX0,-1.42,.1,.84,-3.93,-3.07,M(0x3A2E26,{roughness:.5})); B(BX0,-1.44,0,.1,-3.93,-3.07,M(0x101012,{roughness:.5}));
  B(-1.422,-1.414,.14,.8,-3.9,-3.1,M(0x4A3A2C,{roughness:.45}),root,{noCast:true});
  { const bs = new THREE.Mesh(new THREE.SphereGeometry(.21,26,12,0,Math.PI*2,Math.PI/2,Math.PI/2), M(0xFAFAF8,{roughness:.2,side:THREE.DoubleSide}));
    bs.position.set(-1.66,.9,-3.5); bs.scale.set(1,.5,1.28); bs.rotation.x = Math.PI; bs.castShadow = true; root.add(bs);
    cyl(.27,.27,.012,M(0xFAFAF8,{roughness:.2}),-1.66,.886,-3.5,root,28).scale.x = .78; }
  B(BX0+.02,BX0+.04,.88,1.02,-3.51,-3.49,chrome); B(BX0+.02,BX0+.16,1.0,1.02,-3.51,-3.49,chrome);
  B(BX0+.012,BX0+.02,1.14,2.01,-3.91,-3.09,M(0xB9C0C2,{roughness:.3}),root,{noCast:true});
  B(BX0+.02,BX0+.027,1.15,2.0,-3.9,-3.1,mirrorM,root,{noCast:true});

  // toilet against the north wall (two-piece, lid up) + sprayer holder
  { const tx = -1.2, tz = BZ1+.5, wm = M(0xFAFAF8,{roughness:.4});
    B(tx-.19,tx+.19,.42,.86,BZ1+.02,BZ1+.22,white);
    cyl(.12,.14,.24,white,tx,.12,BZ1+.45,root,18);
    const bowl = new THREE.Mesh(new THREE.SphereGeometry(.2,24,14), white); bowl.scale.set(1,.82,1.55); bowl.position.set(tx,.33,tz); bowl.castShadow = true; root.add(bowl);
    const seat = cyl(.2,.2,.03,wm,tx,.43,tz,root,22); seat.scale.z = 1.5;
    B(tx-.17,tx+.17,.45,.8,BZ1+.215,BZ1+.235,wm);
    B(tx-.04,tx+.04,.86,.89,BZ1+.1,BZ1+.16,chrome);
    B(-.93,-.91,.55,.65,BZ1+.012,BZ1+.05,chrome,root,{noCast:true}); }
  // water-meter pipes in the north-west corner, towel rail
  { const pc = M(0xB5BCBF,{roughness:.35,metalness:.5});
    cyl(.014,.014,.45,pc,-1.84,.225,BZ1+.03,root,8);
    const ph = cyl(.014,.014,.34,pc,-1.67,.45,BZ1+.03,root,8); ph.rotation.z = Math.PI/2;
    const mt = cyl(.045,.045,.05,M(0x9CA3A8,{roughness:.5}),-1.6,.45,BZ1+.045,root,16); mt.rotation.x = Math.PI/2;
    [-1.78,-1.5].forEach(x => cyl(.02,.02,.014,M(0xC8312B,{roughness:.5}),x,.45,BZ1+.05,root,10).rotation.x = Math.PI/2);
    B(-.86,-.4,1.2,1.22,BZ1+.012,BZ1+.06,chrome,root,{noCast:true}); }
  // electric water heater, hose, hand shower and soap dish on the east wall (group's local +z points into the room)
  { const g = new THREE.Group(); g.position.set(BX1-.012,0,-3.95); g.rotation.y = -Math.PI/2; gP.add(g);
    const cr = fm('P',chrome), wh = fm('P',M(0xF4F3EF,{roughness:.4}));
    const hb = new THREE.Mesh(new THREE.BoxGeometry(.2,.38,.11), fm('P',M(0xF1ECD8,{roughness:.4}))); hb.position.set(0,1.65,.055); g.add(hb);
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.02,14), wh); dial.rotation.x = Math.PI/2; dial.position.set(0,1.72,.12); g.add(dial);
    const hose = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(.05,1.45,.06),new THREE.Vector3(.1,1.15,.13),new THREE.Vector3(-.05,.96,.13),new THREE.Vector3(-.2,1.15,.1),new THREE.Vector3(-.3,1.45,.07)]),24,.011,6,false), wh); g.add(hose);
    const head = new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,.02,16), cr); head.position.set(-.3,1.55,.09); head.rotation.x = Math.PI/2-.4; g.add(head);
    const hold = new THREE.Mesh(new THREE.BoxGeometry(.04,.07,.06), cr); hold.position.set(-.3,1.45,.04); g.add(hold);
    const valve = new THREE.Mesh(new THREE.CylinderGeometry(.015,.015,.07,8), cr); valve.rotation.x = Math.PI/2; valve.position.set(-.05,.9,.035); g.add(valve);
    const soap = new THREE.Mesh(new THREE.BoxGeometry(.2,.07,.1), wh); soap.position.set(.2,1.0,.05); g.add(soap); }
  cyl(.05,.05,.006,M(0x555A5C,{roughness:.5}),-.75,.01,-3.8,root,14);                   // floor drain
  blob(-1.2,-4.1,1.0,.8,.3); blob(-1.65,-3.5,.8,1.2,.3); blob(-.75,-3.5,.7,1.4,.15);
}

/* ---------------- balcony (north of the slider): slotted cream parapet, low side parapet, drain ---------------- */
{
  const x0 = BAL.x0, x1 = BAL.x1, bz1 = BAL.z1, bz0 = BZ0;
  B(x0,x1,-.14,0,bz1,bz0,tileM(tileCanvas('#D8D5CC','#B6B2A6',.08),x1-x0,bz0-bz1,.3,.3,{roughness:.8}));
  const cr = () => fm('N',M(0xEEE8D8,{roughness:.8})), cap = () => fm('N',M(0xE0DAC8,{roughness:.6}));
  B(x1-.1,x1,0,1.0,bz1,bz0,cr(),gN); B(x1-.12,x1+.02,1.0,1.05,bz1-.02,bz0,cap(),gN);          // east parapet
  B(x0,x1,0,.5,bz1,bz1+.1,cr(),gN); B(x0,x1,.84,1.0,bz1,bz1+.1,cr(),gN);                       // north parapet with vertical slots
  const xs = []; for(let x = x0+.45; x < x1-.3; x += .45) xs.push(x);
  let xc = x0; xs.forEach(x => { B(xc,x,.5,.84,bz1,bz1+.1,cr(),gN); xc = x+.1; }); B(xc,x1,.5,.84,bz1,bz1+.1,cr(),gN);
  B(x0,x1+.02,1.0,1.05,bz1-.02,bz1+.12,cap(),gN);
  const dr = new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.006,14), M(0x555A5C,{roughness:.5})); dr.position.set(.9,.003,bz1+.45); root.add(dr);
  blob((x0+x1)/2,(bz0+bz1)/2,1.7,1.2,.2);
}

/* ---------------- bed: honey-wood storage base, black mattress, wooden bedside table ---------------- */
{
  const bz1 = hz-.05, bz0 = bz1-1.5, bc = (bz0+bz1)/2, bx0 = hx-2.05, bx1 = hx-.02, bxm = (bx0+bx1)/2;
  B(bx0,bx1,.08,.42,bz0,bz1,pine); B(bx0+.04,bx1-.04,0,.08,bz0+.04,bz1-.04,pineD);
  rbox(1.96,.24,1.44,.05,.04,M(0x1B1819,{roughness:.35,metalness:.05}),bxm,.54,bc);
  blob(bxm,bc,2.6,2.0,.4);
  // bedside table (north of the head)
  const tz0 = .55, tz1 = .97, tx0 = hx-.4;
  B(tx0,hx,.48,.52,tz0,tz1,pineL); B(tx0+.02,hx-.02,.4,.48,tz0+.02,tz1-.02,pineD);
  [[tx0+.02,tz0+.02],[tx0+.02,tz1-.04],[hx-.04,tz0+.02],[hx-.04,tz1-.04]].forEach(p => B(p[0],p[0]+.02,0,.48,p[1],p[1]+.02,pine));
  B(tx0+.02,hx-.02,.14,.17,tz0+.02,tz1-.02,pine); blob(hx-.2,(tz0+tz1)/2,.8,.8,.3);
}

/* ---------------- east wall above the bed head: built-in niche, 2 columns of glass shelves with brass pins ---------------- */
{
  const s0 = 1.15, s1 = 2.5, sm = (s0+s1)/2, y0 = .95, y1 = 2.2, dp = .2, o = { noCast:true };
  const fw = () => fm('E',M(0xC9985A,{roughness:.55}));
  WB('E',s0,s1,y0,y1,0,.02,fm('E',M(0xF4F2EC,{roughness:.9})),gE,o);
  WB('E',s0,s0+.03,y0,y1,0,dp,fw(),gE); WB('E',s1-.03,s1,y0,y1,0,dp,fw(),gE);
  WB('E',s0,s1,y1-.03,y1,0,dp,fw(),gE); WB('E',s0,s1,y0,y0+.03,0,dp,fw(),gE);
  WB('E',sm-.015,sm+.015,y0,y1,0,dp,fw(),gE);
  const gl = () => fm('E',new THREE.MeshStandardMaterial({ color:0xDDEFEA, roughness:.08, transparent:true, opacity:.45, depthWrite:false, side:THREE.DoubleSide }),.45);
  [[s0+.03,sm-.015],[sm+.015,s1-.03]].forEach(c => { for(let i=1;i<=4;i++){ const y = y0+(y1-y0)*i/5;
    WB('E',c[0],c[1],y-.006,y+.006,.01,dp-.01,gl(),gE,o);
    [c[0],c[1]-.012].forEach(s => [.05,.15].forEach(d => WB('E',s,s+.012,y-.016,y-.006,d,d+.012,fm('E',brass),gE,o))); } });
}

/* ---------------- west wall: honey-wood drawer cabinet (south end) ---------------- */
{
  const z0 = 1.1, z1 = 2.3, d = .45;
  WB('W',z0,z1,.08,.78,0,d,pine); WB('W',z0-.02,z1+.02,.78,.81,0,d+.02,pineL); WB('W',z0+.02,z1-.02,0,.08,.02,d-.04,pineD);
  [0,1,2].forEach(i => { const y = .12+i*.22;
    WB('W',z0+.03,z1-.03,y,y+.2,d,d+.015,pineL,root,{noCast:true});
    WB('W',(z0+z1)/2-.07,(z0+z1)/2+.07,y+.09,y+.11,d+.015,d+.04,brass,root,{noCast:true}); });
  blob(-1.5,(z0+z1)/2,.9,1.5,.35);
}

/* ---------------- west wall: wooden-framed mirror, desk with a drawer, pink shell chair ---------------- */
{
  const z0 = -.95, z1 = .25, topM = M(0xEAE1CB,{roughness:.4});
  WB('W',z0,z1,.74,.78,0,.55,topM);
  WB('W',z0+.02,z1-.02,.66,.74,.02,.53,pine);
  [[z0,z0+.05,0,.05],[z1-.05,z1,0,.05],[z0,z0+.05,.5,.55],[z1-.05,z1,.5,.55]].forEach(l => WB('W',l[0],l[1],0,.74,l[2],l[3],pine));
  WB('W',z0,z1,.14,.19,.26,.3,pine); WB('W',z0,z0+.03,.14,.19,.05,.5,pine); WB('W',z1-.03,z1,.14,.19,.05,.5,pine);
  { const m = (z0+z1)/2; WB('W',m-.25,m+.25,.67,.73,.53,.56,pineL); WB('W',m-.02,m+.02,.69,.71,.56,.585,brass,root,{noCast:true}); }
  WB('W',-.7,.0,1.08,2.0,0,.04,pine,root,{noCast:true});
  WB('W',-.65,-.05,1.13,1.95,.04,.046,mirrorM,root,{noCast:true});
  blob(-1.5,-.35,1.0,1.5,.35);
  shellChair(-hx+.95,-.35,-Math.PI/2,M(0xE59AA1,{roughness:.45}),M(0xD2B488,{roughness:.6}));
}

/* ---------------- west wall, north-west corner: honey-wood wardrobe with two panelled doors ---------------- */
{
  const z0 = -2.55, z1 = -1.35, d = .58, h = 2.0, mid = (z0+z1)/2;
  WB('W',z0,z1,.02,h,0,d,pine); WB('W',z0-.02,z1+.02,h,h+.03,0,d+.02,pineL);
  [[z0+.005,mid-.003],[mid+.003,z1-.005]].forEach(r => {
    WB('W',r[0],r[1],.06,h-.03,d,d+.02,pineL,root,{noCast:true});
    WB('W',r[0]+.07,r[1]-.07,.14,h-.1,d+.02,d+.03,pine,root,{noCast:true});
    [[r[0]+.07,r[0]+.1],[r[1]-.1,r[1]-.07]].forEach(s => WB('W',s[0],s[1],.14,h-.1,d+.03,d+.036,pineD,root,{noCast:true})); });
  WB('W',mid-.004,mid+.004,.06,h-.03,d+.015,d+.025,M(0x3A2410,{roughness:.9}),root,{noCast:true});
  [mid-.045,mid+.045].forEach(s => { const q = XZ('W',s,d+.05); const k = new THREE.Mesh(new THREE.SphereGeometry(.026,10,8), brass); k.position.set(q[0],1.0,q[1]); root.add(k); });
  blob(-1.4,mid,1.0,1.8,.4);
}

/* ---------------- north-east corner nook: white square table + two black chairs under the pendant ---------------- */
{
  const tx = 1.35, tz = -2.05, wh = M(0xF4F4F1,{roughness:.35}), blk = M(0x1B1B1D,{roughness:.5}), bl2 = M(0x2A2A2C,{roughness:.4,metalness:.3});
  B(tx-.375,tx+.375,.72,.75,tz-.375,tz+.375,wh);
  [[-.34,-.34],[.34,-.34],[-.34,.34],[.34,.34]].forEach(p => B(tx+p[0]-.02,tx+p[0]+.02,0,.72,tz+p[1]-.02,tz+p[1]+.02,wh));
  diningChair(tx-.73,tz,Math.PI/2,blk,blk,bl2);
  diningChair(tx,tz+.7,Math.PI,blk,blk,bl2);
  blob(tx,tz,1.9,1.5,.4);
}
