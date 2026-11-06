//==CFG==
/* ------------------------------------------------------------------
   S.House Standard Window 31 sq.m. Metres. Origin = centre of the bedroom floor. Room 4.0 (x) x 5.6 (z).
   Plan (from the 12 room photos; approximate):
   - EAST wall (+x) = bed head: arched wooden headboard, black leatherette mattress on a wooden storage base,
     small wooden bedside table at the south end. The brown entrance door is in the south wall right next to the south-east corner.
   - SOUTH wall (+z): wall pier + breaker box (high), honey-wood 2-door wardrobe, pier beside the south-west corner.
   - WEST wall (-x), from the south: sliding balcony door (navy curtains) with the split A/C above, wooden-framed mirror + black-glass desk
     + beige chair, light switch, the grey-framed bathroom door.
   - NORTH wall (-z): big 2-pane window with navy curtains + pendant lamp, small black-glass table with two pink shell chairs.
   - Bathroom = a wing west of the room (door in the west wall): vanity + oval basin along its south wall, toilet at the far (west) end,
     curved tiled shower corner next to the door. Balcony wing outside the sliding door.
------------------------------------------------------------------- */
const ROOM = { W:4.0, D:5.6, H:2.6, T:0.14 };

const TXT = {
  th:{
    title:'ห้อง Standard Window 31 ตร.ม.',
    meta:['หน้าต่างบานใหญ่ · ระเบียงส่วนตัว','มุมโต๊ะนั่งริมหน้าต่าง · ห้องน้ำในตัว'],
    note:'ภาพจำลอง 3 มิติ ขนาดและของตกแต่งอาจต่างจากห้องจริงเล็กน้อย · ทีวี-ตู้เย็นนำมาเองหรือเช่าได้',
    hintOrbit:'ลากเพื่อหมุนห้อง · บีบเพื่อซูม · แตะชื่อจุดเพื่อเข้าไปดู',
    hintWalk:'ลากเพื่อมองรอบห้อง · แตะที่พื้นเพื่อเดิน · บีบเพื่อซูม' + (fine ? ' · WASD' : ''),
    aria:'ภาพ 3 มิติของห้อง Standard Window 31 ตร.ม. ที่ S.House',
    fail:'อุปกรณ์หรือเบราว์เซอร์นี้แสดงภาพ 3 มิติไม่ได้ ลองเปิดด้วย Chrome หรือ Safari เวอร์ชันล่าสุด'
  },
  en:{
    title:'Standard Window Room 31 sq.m.',
    meta:['Large window · Private balcony','Window-side table nook · En-suite bathroom'],
    note:'3D model. Size and furnishings may differ slightly from the actual room. TV and fridge: bring your own or rent from us.',
    hintOrbit:'Drag to rotate · Pinch to zoom · Tap a label to step inside',
    hintWalk:'Drag to look around · Tap the floor to walk · Pinch to zoom' + (fine ? ' · WASD' : ''),
    aria:'3D view of the Standard Window 31 sq.m. room at S.House',
    fail:'This device or browser cannot show 3D. Try the latest Chrome or Safari.'
  }
};

const VIEWS = [
  { id:'overview', th:'ภาพรวม',          en:'Overview' },
  { id:'entry',   th:'ทางเข้า',            en:'Entrance',       pos:[1.45,1.55,2.3],   at:[-0.6,0.95,-1.6],  fov:78, tag:[1.5,2.0,2.35] },
  { id:'bed',     th:'เตียง',              en:'Bed',            pos:[-1.2,1.5,-0.7],   at:[2.0,0.7,-0.7],   fov:74, tag:[1.7,1.5,-0.75] },
  { id:'closet',  th:'ตู้เสื้อผ้า',         en:'Wardrobe',       pos:[0.2,1.5,0.9],     at:[-0.95,1.0,2.8],   fov:80, tag:[-0.95,2.05,2.45] },
  { id:'desk',    th:'โต๊ะ · กระจก',       en:'Desk & mirror',  pos:[0.3,1.5,0.7],     at:[-2.0,1.0,0.2],    fov:82, tag:[-1.75,1.6,0.2] },
  { id:'window',  th:'หน้าต่าง · โต๊ะนั่ง',  en:'Window nook',    pos:[-0.8,1.5,-0.6],   at:[0.05,0.9,-2.8],   fov:80, tag:[0.05,1.75,-2.4] },
  { id:'balcony', th:'ระเบียง',            en:'Balcony',        pos:[-2.7,1.5,1.3],    at:[-6.0,0.1,0.6],   fov:74, tag:[-3.0,1.3,1.7] },
  { id:'bath',    th:'ห้องน้ำ',            en:'Bathroom',       pos:[-2.35,1.55,-1.7], at:[-4.3,0.95,-2.0],  fov:100, tag:[-3.3,1.85,-1.9] }
];

/* Where a visitor may stand ([x0,x1,z0,z1]) and what blocks them */
const WALK = [
  [-1.95,1.95,-2.65,2.65],                          // the room
  [-2.25,-1.9,-1.9,-1.15],                          // bathroom doorway
  [-4.45,-2.2,-2.75,-1.15],                         // bathroom
  [-2.25,-1.9,0.95,2.35],                           // balcony door threshold
  [-3.3,-2.2,0.2,2.3]                               // balcony
];
const BLOCK = [
  [-0.1,2.0,-1.7,0.2],                              // bed
  [1.55,2.0,0.2,0.68],                              // bedside table
  [-1.6,-0.3,2.2,2.8],                              // wardrobe
  [0.45,0.9,2.45,2.8], [-2.0,-1.6,2.45,2.8],        // piers
  [-2.0,-1.45,-0.5,0.85], [-1.5,-0.95,-0.1,0.45],   // desk + chair
  [-0.35,0.45,-2.75,-1.95],                         // window table
  [-0.9,-0.4,-2.65,-2.05], [0.5,1.0,-2.65,-2.05],   // pink chairs
  [-2.8,-2.05,-1.25,-1.1],                          // bathroom door leaf
  [-4.5,-2.95,-1.65,-1.1],                          // vanity counter
  [-4.5,-3.75,-2.35,-1.85],                         // toilet
  [-2.3,-2.14,-2.8,-2.2], [-2.6,-2.14,-2.8,-2.5], [-2.94,-2.14,-2.8,-2.7]    // rounded shower corner
];
const FIT = [
  [-2.15,0,2.95],[-2.15,2.7,2.95],[-2.15,0,-2.95],[-2.15,2.7,-2.95],[2.15,0,2.95],[2.15,2.7,2.95],[2.15,0,-2.95],[2.15,2.7,-2.95],
  [-4.65,0,-2.95],[-4.65,2.4,-2.95],[-4.65,0,-0.95],[-4.65,2.4,-0.95],
  [-3.5,0,0.05],[-3.5,1.2,0.05],[-3.5,0,2.5],[-3.5,1.2,2.5]
];
const ORBIT = { el:.98, t:[-0.9,0.3,0.0] };
const OVAZ = a => (-1.5+1.0*a);
const START = Object.assign({ x:1.45, y:1.55, z:2.3, fov:78 }, anglesTo([1.45,1.55,2.3],[-0.6,0.95,-1.6]));

//==BUILD==
/* ---------------- environment + lights ---------------- */
sky();
skyline([{ x0:-110, x1:110, z0:-125, z1:-30, n:24 }, { x0:-95, x1:-26, z0:-60, z1:55, n:9 }]);
/* nearby low roofs, so the window and the balcony look out over rooftops before the towers */
{ const roofs = [0xE8E2D6,0xD9632E,0xF2F0EC,0xCFC6B4,0xE9B58A,0xDAD7D0];
  const blk = (x0,x1,z0,z1,top,c) => { const m = new THREE.Mesh(new THREE.BoxGeometry(x1-x0,14+top,z1-z0), new THREE.MeshStandardMaterial({ color:c, roughness:.9 })); m.position.set((x0+x1)/2,(top-14)/2,(z0+z1)/2); scene.add(m); };
  [[-14,-7,-16,-8,-2.2],[-6,1,-19,-9,-1.4],[2,9,-15,-8,-2.6],[10,18,-18,-9,-1.0],[-24,-15,-14,-8,-3.0],[-9,-2,-24,-17,0.6],[3,12,-27,-19,1.4]].forEach((b,i) => blk(b[0],b[1],b[2],b[3],b[4],roofs[i%roofs.length]));
  [[-30,-22,-8,-2,-3.2],[-28,-20,4,12,-3.4],[-42,-31,-6,6,-1.0],[-36,-27,14,22,-2.0]].forEach((b,i) => blk(b[0],b[1],b[2],b[3],b[4],roofs[(i+2)%roofs.length])); }
{ const wr = new THREE.Mesh(new THREE.BoxGeometry(3.8,14,6.4), new THREE.MeshStandardMaterial({ color:0xF2F0EC, roughness:.85 })); wr.position.set(-6.7,-1.4-7,2.3); scene.add(wr); }   // white roof below the balcony
scene.add(new THREE.HemisphereLight(0xEFF3F4, 0xBBA98F, .6));
const sun = new THREE.DirectionalLight(0xFFF0D8, .55);
sun.position.set(-2,7,-16); sun.target.position.set(0,0,0);
sun.castShadow = true; sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{ left:-10, right:10, top:10, bottom:-10, near:1, far:45 });
sun.shadow.bias = -.0006;
scene.add(sun, sun.target);
const lamp = new THREE.PointLight(0xFFF0DD, .5, 15, 1.3);
lamp.position.set(0,2.3,.2); lamp.castShadow = true; lamp.shadow.mapSize.set(1024,1024);
lamp.shadow.camera.near = .2; lamp.shadow.camera.far = 15; lamp.shadow.bias = -.002;
scene.add(lamp);
const pendL = new THREE.PointLight(0xFFEBD2, .3, 4, 1.4); pendL.position.set(.05,1.7,-2.2); scene.add(pendL);
const bathL = new THREE.PointLight(0xF2F7FA, .55, 3.8, 1.4); bathL.position.set(-3.3,2.15,-1.95); scene.add(bathL);

/* ---------------- palette (taken from the photos) ---------------- */
const PAINT = 0xF4F3EF, TRIM = 0xE6E3DB, NAVY = 0x27396A;
const T_FLOOR = tileCanvas('#E8E4DC','#CDC8BE',.12,'rgba(140,125,110,');
const pine = M(0xC38E3E,{roughness:.55}), pineD = M(0xA8742A,{roughness:.6}), pineL = M(0xCFA050,{roughness:.5});
const brownDoor = () => M(0x8F5028,{roughness:.55}), brownPan = () => M(0x7E4521,{roughness:.55});
const greyFr = () => M(0x8E979B,{roughness:.55});
const alu = (n) => fm(n,M(0xC9CED0,{roughness:.4,metalness:.55}));
const navy = (n) => { const m = new THREE.MeshStandardMaterial({ color:NAVY, roughness:1, side:THREE.DoubleSide }); fm(n,m,1); return m; };

/* ---------------- plan constants ---------------- */
const WX = -hx-T;                                  // outer face of the west wall
const BX0 = -4.5, BZ0 = -2.8, BZ1 = -1.1;          // bathroom interior: x BX0..WX, z BZ0..BZ1
const BAL = 1.3, BALX = WX-BAL, BALZ0 = .1, BALZ1 = 2.5;   // balcony west of the sliding door
const gN = fadeGroup('N'), gS = fadeGroup('S'), gW = fadeGroup('W'), gE = fadeGroup('E'), gC = fadeGroup('C'), gP = fadeGroup('P');
const rodM = (n) => fm(n,M(0xB8BEC0,{roughness:.4,metalness:.6}));
const plate = (n) => fm(n,M(0xF2F0E8,{roughness:.5}));

/* ---------------- shell ---------------- */
{
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W,D), tileM(T_FLOOR,W,D,.4,.4,{roughness:.22}));
  floor.rotation.x = -Math.PI/2; floor.receiveShadow = true; root.add(floor);
  const pn = (n) => fm(n,M(PAINT)), sk = (n) => fm(n,M(TRIM,{roughness:.6}));
  wall('N', pn('N'), [{ a:-0.85, b:0.95, y0:.95, y1:2.1 }], gN, sk('N'));
  wall('S', pn('S'), [], gS, sk('S'));
  wall('W', pn('W'), [{ a:-1.95, b:-1.1, y0:0, y1:2.05 }, { a:.95, b:2.35, y0:0, y1:2.05 }], gW, sk('W'));
  wall('E', pn('E'), [], gE, sk('E'));

  // ---- wall piers + ceiling soffits ----
  WB('S',.45,.85,0,H,0,.3,pn('S'),gS); WB('S',-2.0,-1.65,0,H,0,.3,pn('S'),gS);
  WB('E',-hz,hz,2.3,H,0,.28,pn('E'),gE); WB('N',-hx,hx,2.3,H,0,.25,pn('N'),gN); WB('S',-hx,hx,2.3,H,0,.25,pn('S'),gS);

  // ---- north window: aluminium 2-pane slider + sill, navy curtains, rod ----
  { const a = -.85, b = .95, y0 = .95, y1 = 2.1, fr = alu('N'), mid = (a+b)/2, o = { noCast:true };
    WB('N',a,b,y0,y0+.05,-.05,.05,fr,gN,o); WB('N',a,b,y1-.05,y1,-.05,.05,fr,gN,o);
    WB('N',a,a+.05,y0,y1,-.05,.05,fr,gN,o); WB('N',b-.05,b,y0,y1,-.05,.05,fr,gN,o);
    WB('N',mid-.03,mid+.03,y0,y1,-.07,.07,fr,gN,o);
    const gl = glassM(); fm('N',gl,gl.opacity); const p = WP('N',mid,(y0+y1)/2,0,b-a-.1,y1-y0-.1,gl,gN); p.renderOrder = 2;
    WB('N',a-.06,b+.06,y0-.04,y0,-.03,.1,fm('N',M(0xEFEDE6,{roughness:.5})),gN,o);
    const cn = navy('N'); curtain('N',-1.0,.5,.05,2.22,cn,gN,.12,46); curtain('N',1.1,.5,.05,2.22,cn,gN,.12,46);
    curtainRod('N',-1.3,1.4,2.24,rodM('N'),gN); }

  // ---- west wall: sliding balcony door (2 panes), A/C, navy curtains ----
  slider('W',.95,2.35,{ g:gW, fr:alu('W'), name:'W', y1:2.05, panes:2 });
  acUnit('W',.35,1.4,2.12,2.5,gW,'W');
  { const cn = navy('W'); curtain('W',1.15,.5,.02,2.12,cn,gW,.1); curtain('W',2.2,.45,.02,2.12,cn,gW,.1);
    curtainRod('W',.9,2.45,2.12,rodM('W'),gW); }
  WB('W',-.78,-.66,1.2,1.3,0,.012,plate('W'),gW,{noCast:true});                  // light switch
  WB('W',.68,.78,.95,1.05,0,.012,plate('W'),gW,{noCast:true}); WB('W',.68,.78,1.1,1.2,0,.012,plate('W'),gW,{noCast:true});   // sockets
  { const q = XZ('W',-.72,.014); const c = new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,H-1.3,8), fm('W',M(0xE9E6DA,{roughness:.6}))); c.position.set(q[0],1.3+(H-1.3)/2,q[1]); gW.add(c); }

  // ---- bathroom door frame (grey) on the west wall ----
  { const g = () => fm('W',greyFr()), o = { noCast:true };
    WB('W',-2.0,-1.95,0,2.1,-.02,.035,g(),gW,o); WB('W',-1.1,-1.06,0,2.1,-.02,.035,g(),gW,o); WB('W',-2.0,-1.06,2.05,2.1,-.02,.035,g(),gW,o); }

  // ---- entrance door (closed, brown wood) in the south wall beside the south-east corner ----
  { const dw = fm('S',brownDoor()), dp = fm('S',brownPan()), gf = () => fm('S',greyFr());
    WB('S',1.05,1.9,0,2.03,-.015,.045,dw,gS);
    [[1.12,1.45],[1.5,1.83]].forEach(r => { WB('S',r[0],r[1],1.15,1.93,.045,.06,dp,gS,{noCast:true}); WB('S',r[0],r[1],.12,1.0,.045,.06,dp,gS,{noCast:true}); });
    { const q = XZ('S',1.74,.075); const k = new THREE.Mesh(new THREE.SphereGeometry(.033,12,8), fm('S',chrome)); k.position.set(q[0],1.0,q[1]); gS.add(k);
      WB('S',1.68,1.78,.86,.92,.06,.09,fm('S',chrome),gS,{noCast:true}); }
    WB('S',1.02,1.05,0,2.07,-.02,.035,gf(),gS,{noCast:true}); WB('S',1.9,1.93,0,2.07,-.02,.035,gf(),gS,{noCast:true}); WB('S',1.02,1.93,2.03,2.07,-.02,.035,gf(),gS,{noCast:true}); }
  // A/C remote holder + switch on the east wall beside the door, conduit up to the ceiling
  WB('E',2.28,2.36,1.2,1.42,0,.025,fm('E',M(0xF4F4F1,{roughness:.4})),gE,{noCast:true});
  WB('E',2.1,2.2,1.2,1.3,0,.012,plate('E'),gE,{noCast:true});
  { const q = XZ('E',2.2,.014); const c = new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,H-1.4,8), fm('E',M(0xE9E6DA,{roughness:.6}))); c.position.set(q[0],1.4+(H-1.4)/2,q[1]); gE.add(c); }
  // north-east corner: switch + low socket
  WB('E',-2.5,-2.4,1.2,1.3,0,.012,plate('E'),gE,{noCast:true}); WB('E',-2.5,-2.4,.3,.4,0,.012,plate('E'),gE,{noCast:true});

  // ---- breaker box high on the south wall beside the pier ----
  WB('S',.08,.4,1.55,1.88,0,.07,fm('S',M(0xE7E9E8,{roughness:.5})),gS,{noCast:true});
  WB('S',.11,.37,1.6,1.82,.07,.075,fm('S',M(0x59646A,{roughness:.4})),gS,{noCast:true});
  WB('S',.2,.28,1.62,1.8,.075,.08,fm('S',M(0xBFC6C8,{roughness:.4})),gS,{noCast:true});
  { const q = XZ('S',.45,.015); const c = new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,H-1.88,8), fm('S',M(0xE9E6DA,{roughness:.6}))); c.position.set(q[0],1.88+(H-1.88)/2,q[1]); gS.add(c); }

  // ---- plank ceiling, round LED lamp, pendant over the window table ----
  const pt = plankTex(1,true); pt.repeat.set(D/.3,1);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W,D), fm('C',M(0xffffff,{map:pt,roughness:1,side:THREE.DoubleSide,emissive:0x8A8984,emissiveMap:pt})));
  ceil.rotation.x = Math.PI/2; ceil.position.y = H; gC.add(ceil);
  const lr = new THREE.Mesh(new THREE.CylinderGeometry(.27,.27,.04,36), fm('C',M(0xEDEDEA,{roughness:.5}))); lr.position.set(0,H-.02,.2); gC.add(lr);
  const lf = new THREE.Mesh(new THREE.CylinderGeometry(.235,.235,.01,36), fm('C',new THREE.MeshBasicMaterial({color:0xF4F8FF}))); lf.position.set(0,H-.045,.2); gC.add(lf);
  { const px = .05, pz = -2.3, wm = fm('C',M(0xC99A58,{roughness:.5})), wh = fm('C',M(0xF3F2EE,{roughness:.45,side:THREE.DoubleSide,emissive:0x555450}));
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(.004,.004,H-1.88,6), fm('C',M(0xEDEDE8,{roughness:.6}))); cord.position.set(px,1.88+(H-1.88)/2,pz); gC.add(cord);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(.013,.013,.24,10), wm); rod.position.set(px,1.76,pz); gC.add(rod);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(.15,28,12,0,Math.PI*2,0,Math.PI/2), wh); dome.scale.y = .8; dome.position.set(px,1.52,pz); gC.add(dome);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(.04,12,8), fm('C',new THREE.MeshBasicMaterial({color:0xFFE2A8}))); bulb.position.set(px,1.5,pz); gC.add(bulb); }
}
/* diagonal-laid tile floor (rotated 45 degrees) */
function diagT(tex,w,h){ const m = tileM(tex,w,h,.3,.3,{roughness:.3}); m.map.center.set(.5,.5); m.map.rotation = Math.PI/4; return m; }

/* ---------------- bathroom wing (west of the room, door in the west wall) ---------------- */
{
  const pm = () => fm('P',M(0xEFE8D0)), BXW = BX0-.14;
  const wx0 = -4.2, wx1 = -3.1, wy0 = 1.4, wy1 = 2.0;                       // awning window in the north wall
  // partitions
  B(BXW,wx0,0,H,-hz-T,BZ0,pm(),gP); B(wx1,WX,0,H,-hz-T,BZ0,pm(),gP); B(wx0,wx1,0,wy0,-hz-T,BZ0,pm(),gP); B(wx0,wx1,wy1,H,-hz-T,BZ0,pm(),gP);
  B(BXW,WX,0,H,BZ1,BZ1+.14,pm(),gP);                                          // south wall
  B(BXW,BX0,0,H,-hz-T,BZ1+.14,pm(),gP);                                       // west end wall
  // grey-blue mosaic-look wall tiles (30 cm tiles made of small squares)
  const T_MOS = canvasTex(128,128,(g,w,h) => {
    const cols = ['#B4BFC9','#C6CFD7','#D3D9DF','#A8B4C0','#BFC9D2'], n = 12, c = w/n;
    for(let i=0;i<n;i++) for(let j=0;j<n;j++){ g.fillStyle = cols[Math.floor(rnd()*cols.length)]; g.fillRect(i*c,j*c,c,c); }
    g.strokeStyle = '#E8EBEC'; g.lineWidth = 1; for(let i=0;i<=n;i++){ g.beginPath(); g.moveTo(i*c,0); g.lineTo(i*c,h); g.stroke(); g.beginPath(); g.moveTo(0,i*c); g.lineTo(w,i*c); g.stroke(); }
    g.strokeStyle = '#E2E6E7'; g.lineWidth = 4; g.strokeRect(0,0,w,h);
  });
  const mos = (x0,x1,z0,z1,y0,y1) => B(x0,x1,y0,y1,z0,z1,fm('P',tileM(T_MOS,Math.max(x1-x0,z1-z0),y1-y0,.3,.3,{roughness:.3})),gP,{noCast:true});
  const band = (x0,x1,z0,z1) => B(x0,x1,2.05,2.3,z0,z1,fm('P',M(0xEDE6D3,{roughness:.8})),gP,{noCast:true});
  const R = .8, cx = WX-R, cz = BZ0+R;                                        // rounded shower corner (concave, north-east of the bath)
  mos(BX0,wx0,BZ0,BZ0+.012,0,2.05); mos(wx1,cx,BZ0,BZ0+.012,0,2.05); mos(wx0,wx1,BZ0,BZ0+.012,0,wy0); band(BX0,cx,BZ0,BZ0+.012);
  mos(BX0,WX,BZ1-.012,BZ1,0,2.05); band(BX0,WX,BZ1-.012,BZ1);
  mos(BX0,BX0+.012,BZ0,BZ1,0,2.05); band(BX0,BX0+.012,BZ0,BZ1);
  { const am = tileM(T_MOS,R*Math.PI/2,2.05,.3,.3,{roughness:.3,side:THREE.DoubleSide}); fm('P',am);
    const arc = new THREE.Mesh(new THREE.CylinderGeometry(R,R,2.05,28,1,true,Math.PI/2,Math.PI/2), am); arc.position.set(cx,1.025,cz); gP.add(arc);
    const ab = new THREE.Mesh(new THREE.CylinderGeometry(R,R,.25,28,1,true,Math.PI/2,Math.PI/2), fm('P',M(0xEDE6D3,{roughness:.8,side:THREE.DoubleSide}))); ab.position.set(cx,2.175,cz); gP.add(ab);
    // electric heater, hose, hand shower and soap dish on the curve (group's local +z points into the room)
    const g = new THREE.Group(); g.position.set(cx+R*Math.SQRT1_2,0,cz-R*Math.SQRT1_2); g.rotation.y = -Math.PI/4; gP.add(g);
    const cr = fm('P',chrome), wh = fm('P',M(0xF4F3EF,{roughness:.4}));
    const hb = new THREE.Mesh(new THREE.BoxGeometry(.2,.38,.11), fm('P',M(0xF1ECD8,{roughness:.4}))); hb.position.set(0,1.65,.055); g.add(hb);
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.02,14), wh); dial.rotation.x = Math.PI/2; dial.position.set(0,1.72,.12); g.add(dial);
    const hose = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(.05,1.45,.06),new THREE.Vector3(.1,1.15,.13),new THREE.Vector3(-.05,.96,.13),new THREE.Vector3(-.2,1.15,.1),new THREE.Vector3(-.3,1.45,.07)]),24,.011,6,false), wh); g.add(hose);
    const head = new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,.02,16), cr); head.position.set(-.3,1.55,.09); head.rotation.x = Math.PI/2-.4; g.add(head);
    const hold = new THREE.Mesh(new THREE.BoxGeometry(.04,.07,.06), cr); hold.position.set(-.3,1.45,.04); g.add(hold);
    const valve = new THREE.Mesh(new THREE.CylinderGeometry(.015,.015,.07,8), cr); valve.rotation.x = Math.PI/2; valve.position.set(-.05,.9,.035); g.add(valve);
    const soap = new THREE.Mesh(new THREE.BoxGeometry(.2,.07,.1), wh); soap.position.set(.2,1.0,.05); g.add(soap); }
  // floor (dark blue diagonal tiles), T-bar ceiling at 2.3 m with two downlights
  const bw = WX-BX0, bd = BZ1-BZ0;
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(bw,bd), diagT(tileCanvas('#3D5F86','#9FB3C6',.06),bw,bd));
  fl.rotation.x = -Math.PI/2; fl.position.set((BX0+WX)/2,.004,(BZ0+BZ1)/2); fl.receiveShadow = true; root.add(fl);
  B(WX,-2.0,0,.02,-1.95,BZ1,fm('P',M(0xB8C0C6,{roughness:.4})),gP,{noCast:true});    // door threshold
  const tb = canvasTex(128,128,(g,w,h) => { g.fillStyle = '#F4F5F2'; g.fillRect(0,0,w,h); g.strokeStyle = '#B9BDBA'; g.lineWidth = 4; g.strokeRect(0,0,w,h); });
  tb.repeat.set(bw/.6,bd/.6);
  const bc = new THREE.Mesh(new THREE.PlaneGeometry(bw,bd), fm('C',M(0xffffff,{map:tb,roughness:1,side:THREE.DoubleSide,emissive:0x777776,emissiveMap:tb})));
  bc.rotation.x = Math.PI/2; bc.position.set((BX0+WX)/2,2.3,(BZ0+BZ1)/2); gC.add(bc);
  [[-2.75,-2.15],[-3.7,-1.95]].forEach(p => { const d = new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.012,18), fm('C',new THREE.MeshBasicMaterial({color:0xFFFFFF}))); d.position.set(p[0],2.294,p[1]); gC.add(d); });

  // door leaf, standing open against the vanity wall
  { const leaf = doorLeaf('W',-1.12,-1,.78,2.0,fm('P',M(0xCBD3D6,{roughness:.5})),-1.45,gP);
    const kn = new THREE.Mesh(new THREE.SphereGeometry(.032,12,8), fm('P',M(0xB9C0C2,{roughness:.3,metalness:.6}))); kn.position.set(.7,1.0,.04); leaf.group.add(kn); }

  // vanity: black granite counter, oval basin, tap, frameless mirror (south wall)
  const gran = M(0x17181A,{roughness:.22,metalness:.1});
  B(BX0,-2.95,.84,.88,-1.62,BZ1,gran); B(BX0,-2.97,.1,.84,-1.6,BZ1,M(0x1D1E20,{roughness:.4})); B(BX0,-2.97,0,.1,-1.6,BZ1,M(0x101012,{roughness:.5}));
  const bs = new THREE.Mesh(new THREE.SphereGeometry(.21,26,12,0,Math.PI*2,Math.PI/2,Math.PI/2), M(0xFAFAF8,{roughness:.2,side:THREE.DoubleSide}));
  bs.position.set(-3.55,.9,-1.36); bs.scale.set(1.25,.5,1); bs.rotation.x = Math.PI; bs.castShadow = true; root.add(bs);
  cyl(.27,.27,.012,M(0xFAFAF8,{roughness:.2}),-3.55,.886,-1.36,root,28).scale.z = .82;
  B(-3.56,-3.54,.88,1.02,-1.2,-1.18,chrome); B(-3.56,-3.54,1.0,1.02,-1.2,-1.1,chrome);
  B(-4.05,-3.05,1.15,2.0,-1.119,-1.112,mirrorM,root,{noCast:true}); B(-4.06,-3.04,1.14,2.01,-1.113,-1.1,M(0xB9C0C2,{roughness:.3}),root,{noCast:true});

  // toilet at the west end (two-piece, lid up) + paper holder + hose sprayer
  { const tz = -2.1, tk = BX0;
    B(tk+.02,tk+.22,.42,.86,tz-.19,tz+.19,white);
    cyl(.12,.14,.24,white,tk+.46,.12,tz,root,18);
    const bowl = new THREE.Mesh(new THREE.SphereGeometry(.2,24,14), white); bowl.scale.set(1.55,.82,1); bowl.position.set(tk+.5,.33,tz); bowl.castShadow = true; root.add(bowl);
    const seat = cyl(.2,.2,.03,M(0xFAFAF8,{roughness:.4}),tk+.5,.43,tz,root,22); seat.scale.x = 1.5;
    const lid = cyl(.19,.19,.025,M(0xFAFAF8,{roughness:.4}),tk+.27,.62,tz,root,22); lid.rotation.z = -(Math.PI/2-.12); lid.scale.x = 1.3;
    B(-3.5,-3.4,.9,.98,BZ0+.002,BZ0+.1,white,root,{noCast:true});
    B(tk,tk+.03,.55,.65,-1.86,-1.82,chrome,root,{noCast:true}); }

  // awning windows: two frosted panes in the north wall
  { const fa = fm('P',M(0xDCE1E3,{roughness:.4,metalness:.3})), o = { noCast:true }, zz = BZ0-.02, mx = (wx0+wx1)/2;
    B(wx0,wx1,wy0,wy0+.04,zz-.04,zz+.06,fa,gP,o); B(wx0,wx1,wy1-.04,wy1,zz-.04,zz+.06,fa,gP,o);
    B(wx0,wx0+.04,wy0,wy1,zz-.04,zz+.06,fa,gP,o); B(wx1-.04,wx1,wy0,wy1,zz-.04,zz+.06,fa,gP,o); B(mx-.025,mx+.025,wy0,wy1,zz-.04,zz+.06,fa,gP,o);
    const fg = new THREE.Mesh(new THREE.PlaneGeometry(wx1-wx0-.08,wy1-wy0-.08), fm('P',M(0xE6EEF2,{roughness:.3,emissive:0xB4C6CE,side:THREE.DoubleSide})));
    fg.position.set(mx,(wy0+wy1)/2,zz+.02); gP.add(fg); }
  blob(-3.5,-1.4,1.7,.9,.3); blob(-4.0,-2.1,1.0,.9,.35); blob(-2.9,-2.3,1.3,1.1,.2);
}

/* ---------------- balcony (west of the sliding door): slotted parapet, side wall with a tap, drain ---------------- */
{
  const slab = tileM(tileCanvas('#D8D5CC','#B6B2A6',.08),WX-BALX,BALZ1-BALZ0,.3,.3,{roughness:.8});
  B(BALX,WX,-.14,0,BALZ0,BALZ1,slab);
  B(WX,-hx,-.14,0,.95,2.35,M(0xD8D5CC,{roughness:.8}));                                   // threshold under the slider
  const cr = () => fm('W',M(0xEEE8D8,{roughness:.8}));
  B(BALX,WX,0,2.45,BALZ0,BALZ0+.1,cr(),gW);                                               // north side wall (full height)
  B(BALX,WX,0,1.0,BALZ1-.1,BALZ1,cr(),gW);                                                // south parapet
  const zs = []; for(let z = BALZ0+.5; z < BALZ1-.3; z += .45) zs.push(z);
  const px0 = BALX, px1 = BALX+.1;                                                        // west parapet with vertical slots
  B(px0,px1,0,.5,BALZ0,BALZ1,cr(),gW); B(px0,px1,.84,1.0,BALZ0,BALZ1,cr(),gW);
  let zc = BALZ0; zs.forEach(z => { B(px0,px1,.5,.84,zc,z,cr(),gW); zc = z+.1; }); B(px0,px1,.5,.84,zc,BALZ1,cr(),gW);
  B(BALX-.02,BALX+.12,1.0,1.05,BALZ0,BALZ1,fm('W',M(0xE0DAC8,{roughness:.6})),gW);        // cap
  B(BALX,WX,1.0,1.05,BALZ1-.12,BALZ1+.02,fm('W',M(0xE0DAC8,{roughness:.6})),gW);
  // tap with a red lever on the side wall, floor drain
  { const t = new THREE.Mesh(new THREE.CylinderGeometry(.014,.014,.1,8), fm('W',chrome)); t.rotation.x = Math.PI/2; t.position.set(-3.0,.62,BALZ0+.15); gW.add(t);
    const l = new THREE.Mesh(new THREE.BoxGeometry(.1,.012,.012), fm('W',M(0xC8312B,{roughness:.5}))); l.position.set(-2.96,.68,BALZ0+.12); gW.add(l); }
  const dr = new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.006,14), M(0x555A5C,{roughness:.5})); dr.position.set(-3.1,.003,1.9); root.add(dr);
  blob((BALX+WX)/2,(BALZ0+BALZ1)/2,1.4,2.3,.2);
}

/* ---------------- bed: arched wooden headboard, storage base, black leatherette mattress, bedside table ---------------- */
{
  const bz0 = -1.65, bz1 = .15, bc = (bz0+bz1)/2, bx0 = hx-2.05, bx1 = hx-.04, bxm = (bx0+bx1)/2;
  const arch = (w,h0,h1) => { const s = new THREE.Shape(); s.moveTo(-w/2,0); s.lineTo(w/2,0); s.lineTo(w/2,h0); s.quadraticCurveTo(0,h0+(h1-h0)*2,-w/2,h0); s.lineTo(-w/2,0); return s; };
  const hb = new THREE.Mesh(new THREE.ExtrudeGeometry(arch(1.9,.88,1.02),{ depth:.05, bevelEnabled:false }), pineL);
  hb.rotation.y = -Math.PI/2; hb.position.set(hx,.1,bc); hb.castShadow = true; hb.receiveShadow = true; root.add(hb);
  const hp = new THREE.Mesh(new THREE.ExtrudeGeometry(arch(1.62,.66,.76),{ depth:.02, bevelEnabled:false }), pine);
  hp.rotation.y = -Math.PI/2; hp.position.set(hx-.05,.22,bc); hp.castShadow = false; root.add(hp);
  B(bx0,bx1,.08,.42,bz0,bz1,pine); B(bx0+.04,bx1-.04,0,.08,bz0+.04,bz1-.04,pineD);
  const vin = M(0x1B1819,{roughness:.35,metalness:.05});
  rbox(1.96,.24,1.76,.05,.04,vin,bxm,.54,bc);
  const blue = M(0x6F86B3,{roughness:.6}), cord = M(0xB9A98A,{roughness:.7}), L = bxm-.98;
  [bz0+.06,bz1-.06].forEach((z,i) => { const zz = i ? bz1-.045 : bz0+.045;
    B(bxm-.98,bxm+.98,.47,.52,zz-.0,zz+(i?.008:-.008),blue,root,{noCast:true}); B(bxm-.98,bxm+.98,.645,.66,zz,zz+(i?.008:-.008),cord,root,{noCast:true}); });
  B(L-.004,L+.004,.47,.52,bz0+.06,bz1-.06,blue,root,{noCast:true}); B(L-.004,L+.004,.645,.66,bz0+.06,bz1-.06,cord,root,{noCast:true});
  blob(bxm,bc,2.8,2.3,.4);
  // bedside table (south of the head)
  const tz0 = .22, tz1 = .64, tx0 = hx-.4;
  B(tx0,hx,.48,.52,tz0,tz1,pineL); B(tx0+.02,hx-.02,.4,.48,tz0+.02,tz1-.02,pineD);
  [[tx0+.02,tz0+.02],[tx0+.02,tz1-.04],[hx-.04,tz0+.02],[hx-.04,tz1-.04]].forEach(p => B(p[0],p[0]+.02,0,.48,p[1],p[1]+.02,pine));
  B(tx0+.02,hx-.02,.14,.17,tz0+.02,tz1-.02,pine); blob(hx-.2,(tz0+tz1)/2,.8,.8,.3);
}

/* ---------------- wardrobe (south wall): honey wood, two panelled doors, round knobs ---------------- */
{
  const x0 = -1.55, x1 = -.35, d = .55, h = 1.85, mid = (x0+x1)/2, ko = M(0xB4802F,{roughness:.5});
  WB('S',x0,x1,.02,h,0,d,pine); WB('S',x0-.02,x1+.02,h,h+.03,0,d+.02,pineL);
  [[x0+.005,mid-.003],[mid+.003,x1-.005]].forEach(r => {
    WB('S',r[0],r[1],.06,h-.03,d,d+.02,pineL,root,{noCast:true});
    WB('S',r[0]+.07,r[1]-.07,.14,h-.1,d+.02,d+.03,pine,root,{noCast:true});
    [[r[0]+.07,r[0]+.1],[r[1]-.1,r[1]-.07]].forEach(s => WB('S',s[0],s[1],.14,h-.1,d+.03,d+.036,pineD,root,{noCast:true})); });
  WB('S',mid-.004,mid+.004,.06,h-.03,d+.015,d+.025,M(0x3A2410,{roughness:.9}),root,{noCast:true});
  [mid-.045,mid+.045].forEach(x => { const q = XZ('S',x,d+.05); const k = new THREE.Mesh(new THREE.SphereGeometry(.026,10,8), ko); k.position.set(q[0],1.0,q[1]); root.add(k); });
  blob(mid,2.2,1.8,1.1,.4);
}

/* ---------------- west wall: wooden-framed mirror, black-glass desk with two drawers, beige chair ---------------- */
{
  const dkM = M(0x161617,{roughness:.2,metalness:.1}), z0 = -.45, z1 = .8;
  WB('W',z0,z1,.74,.78,0,.55,dkM);
  WB('W',z0+.02,z1-.02,.66,.74,.02,.53,pine);
  [[z0,z0+.05,0,.05],[z1-.05,z1,0,.05],[z0,z0+.05,.5,.55],[z1-.05,z1,.5,.55]].forEach(l => WB('W',l[0],l[1],0,.74,l[2],l[3],pine));
  WB('W',z0,z1,.14,.19,.26,.3,pine); WB('W',z0,z0+.03,.14,.19,.05,.5,pine); WB('W',z1-.03,z1,.14,.19,.05,.5,pine);
  [[z0+.06,z0+.58],[z0+.67,z1-.06]].forEach(r => { WB('W',r[0],r[1],.67,.73,.53,.56,pineL); WB('W',(r[0]+r[1])/2-.02,(r[0]+r[1])/2+.02,.69,.71,.56,.585,M(0xB4802F,{roughness:.5}),root,{noCast:true}); });
  WB('W',-.2,.5,1.08,2.0,0,.04,pine,root,{noCast:true});
  WB('W',-.15,.45,1.13,1.95,.04,.046,mirrorM,root,{noCast:true});
  blob(-1.7,.18,1.0,1.5,.35);
  shellChair(-1.2,.17,-Math.PI/2,M(0xD8D0BC,{roughness:.5}),M(0xCFC6B0,{roughness:.6}));
}

/* ---------------- window nook (north wall): black-glass table + two pink shell chairs ---------------- */
{
  const tx = .05, tz = -2.35, dkM = M(0x161617,{roughness:.2,metalness:.1}), fr = M(0x1B1B1D,{roughness:.4,metalness:.4});
  B(tx-.36,tx+.36,.725,.745,tz-.36,tz+.36,dkM);
  B(tx-.36,tx+.36,.69,.725,tz-.36,tz+.36,fr);
  [[-.33,-.33],[.33,-.33],[-.33,.33],[.33,.33]].forEach(p => B(tx+p[0]-.015,tx+p[0]+.015,0,.69,tz+p[1]-.015,tz+p[1]+.015,fr));
  const pink = M(0xE59AA1,{roughness:.45}), leg = M(0xD2B488,{roughness:.6});
  shellChair(tx-.62,tz,Math.PI/2+.12,pink,leg); shellChair(tx+.62,tz,-Math.PI/2-.12,pink,leg);
  blob(tx,tz,1.9,1.2,.4);
}
