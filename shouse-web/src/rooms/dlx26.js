//==CFG==
/* ------------------------------------------------------------------
   S.House Deluxe Studio 26 sq.m. (renovated). Metres. Origin = centre of the room floor. Room 5.8 (x) x 4.5 (z).
   Plan (rev 4, from the owner's three corrections):
   - WEST wall (-x, short wall) = bed head: wood + marble headboard wall, bed, then the blue sofa niche to its south.
   - NORTH wall (-z, long wall), starting right beside the bed: bathroom door, split A/C, then the balcony slider.
     The bathroom (all marble, rain shower, glass screen) and the balcony lie outside this wall.
   - EAST wall (+x, short wall) = directly OPPOSITE the bed head: open wardrobe, TV recess (TV + yellow shelf +
     mini fridge + pedal bin), then a small column in the south-east corner.
   - SOUTH wall (+z, long wall, the wall beside the sofa): the ENTRANCE door, just past the column.
------------------------------------------------------------------- */
const ROOM = { W:5.8, D:4.5, H:2.6, T:0.14 };

const TXT = {
  th:{
    title:'ห้อง Deluxe Studio 26 ตร.ม.',
    meta:['ทีวี · ตู้เย็นเล็ก · ห้องน้ำหินอ่อน Rain Shower','ระเบียงส่วนตัว · ตู้เสื้อผ้าบิลท์อิน · พื้นไม้ลามิเนต'],
    note:'ภาพจำลอง 3 มิติ ขนาดและของตกแต่งอาจต่างจากห้องจริงเล็กน้อย',
    hintOrbit:'ลากเพื่อหมุนห้อง · บีบเพื่อซูม · แตะชื่อจุดเพื่อเข้าไปดู',
    hintWalk:'ลากเพื่อมองรอบห้อง · แตะที่พื้นเพื่อเดิน · บีบเพื่อซูม' + (fine ? ' · WASD' : ''),
    aria:'ภาพ 3 มิติของห้อง Deluxe Studio 26 ตร.ม. ที่ S.House',
    fail:'อุปกรณ์หรือเบราว์เซอร์นี้แสดงภาพ 3 มิติไม่ได้ ลองเปิดด้วย Chrome หรือ Safari เวอร์ชันล่าสุด'
  },
  en:{
    title:'Deluxe Studio 26 sq.m.',
    meta:['TV · Mini fridge · Marble rain-shower bathroom','Private balcony · Built-in wardrobe · Wood-look floor'],
    note:'3D model. Size and furnishings may differ slightly from the actual room.',
    hintOrbit:'Drag to rotate · Pinch to zoom · Tap a label to step inside',
    hintWalk:'Drag to look around · Tap the floor to walk · Pinch to zoom' + (fine ? ' · WASD' : ''),
    aria:'3D view of the Deluxe Studio 26 sq.m. room at S.House',
    fail:'This device or browser cannot show 3D. Try the latest Chrome or Safari.'
  }
};

const VIEWS = [
  { id:'overview', th:'ภาพรวม',            en:'Overview' },
  { id:'entry',   th:'ทางเข้า',              en:'Entrance',    pos:[1.9,1.55,1.75],   at:[-0.2,0.95,-1.2],  fov:78, tag:[1.9,2.2,2.1] },
  { id:'bed',     th:'เตียง · ผนังหินอ่อน',   en:'Bed',         pos:[0.3,1.5,1.1],     at:[-2.5,0.95,-0.6],  fov:80, tag:[-1.6,1.35,-0.55] },
  { id:'sofa',    th:'โซฟา',                en:'Sofa',        pos:[0.4,1.5,0.4],     at:[-2.5,0.8,1.6],    fov:80, tag:[-2.2,1.2,1.5] },
  { id:'closet',  th:'ตู้เสื้อผ้า',           en:'Wardrobe',    pos:[0.2,1.5,0.1],     at:[2.6,1.2,-0.35],   fov:84, tag:[2.2,2.5,-0.33] },
  { id:'tv',      th:'ทีวี · ตู้เย็น',        en:'TV & fridge', pos:[0.3,1.5,-0.3],    at:[2.7,0.95,0.5],    fov:74, tag:[2.3,0.95,0.55] },
  { id:'balcony', th:'ระเบียง',              en:'Balcony',     pos:[0.0,1.5,-2.6],    at:[0.0,-0.3,-6.0],   fov:74, tag:[0.0,1.2,-3.2] },
  { id:'bath',    th:'ห้องน้ำหินอ่อน',        en:'Bathroom',    pos:[-1.7,1.6,-2.9],   at:[-2.0,1.05,-4.55], fov:96, tag:[-2.2,1.4,-2.9] },
  { id:'shower',  th:'ฝักบัว Rain Shower',    en:'Rain shower', pos:[-2.2,1.5,-2.8],   at:[-1.0,1.75,-4.0],  fov:90, tag:[-1.1,2.15,-3.9] }
];

/* Where a visitor may stand ([x0,x1,z0,z1]) and what blocks them */
const WALK = [
  [-2.7,2.7,-2.1,2.1],
  [-2.45,-1.8,-2.7,-2.05], [-2.7,-0.9,-4.4,-2.65],
  [-0.5,0.5,-2.7,-2.05], [-0.6,2.9,-3.5,-2.65]
];
const BLOCK = [
  [-2.95,-0.75,-1.5,0.4],                          // bed
  [-2.95,-2.0,0.75,2.3], [-1.95,-1.25,1.15,1.8],   // sofa + coffee table
  [2.25,2.95,-0.85,0.2],                           // wardrobe
  [2.3,2.95,0.2,1.15], [2.3,2.95,1.85,2.3],        // shelf / fridge / bin, column
  [-2.8,-2.2,-4.6,-3.9], [-2.25,-1.55,-4.6,-4.1], [-1.55,-0.8,-4.6,-3.05]    // toilet, basin, shower
];
const FIT = [                                    // room box + bathroom wing + balcony wing
  [-3.05,0,2.4],[-3.05,2.7,2.4],[-3.05,0,-2.4],[-3.05,2.7,-2.4],[3.05,0,2.4],[3.05,2.7,2.4],[3.05,0,-2.4],[3.05,2.7,-2.4],
  [-2.95,0,-4.7],[-2.95,2.7,-4.7],[-0.65,0,-4.7],[-0.65,2.7,-4.7],
  [3.1,0,-3.75],[3.1,1.2,-3.75],[-0.7,0,-3.75],[-0.7,1.2,-3.75]
];
const ORBIT = { el:.98, t:[0.05,0.3,-1.2] };
const OVAZ = a => (-1.55+0.1*a);
const START = { x:1.9, y:1.55, z:1.75, yaw:0.6190, pitch:-0.164, fov:78 };

//==BUILD==
/* ---------------- environment + lights ---------------- */
sky();
skyline([{ x0:-110, x1:110, z0:-125, z1:-30, n:20 }, { x0:35, x1:125, z0:-30, z1:70, n:10 }]);
scene.add(new THREE.HemisphereLight(0xF1F2F2, 0xBBA98F, .55));
const sun = new THREE.DirectionalLight(0xFFF0D8, .5);
sun.position.set(-2,7,-16); sun.target.position.set(0,0,0);
sun.castShadow = true; sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{ left:-10, right:10, top:10, bottom:-10, near:1, far:45 });
sun.shadow.bias = -.0006;
scene.add(sun, sun.target);
const lamp = new THREE.PointLight(0xFFEBD2, .7, 14, 1.3);
lamp.position.set(0,2.3,.2); lamp.castShadow = true; lamp.shadow.mapSize.set(1024,1024);
lamp.shadow.camera.near = .2; lamp.shadow.camera.far = 14; lamp.shadow.bias = -.002;
scene.add(lamp);
const ledL = new THREE.PointLight(0xFFE8C0, .35, 3.2, 1.5); ledL.position.set(-2.4,1.2,-.55); scene.add(ledL);
const bathL = new THREE.PointLight(0xFFF8F0, .7, 4.2, 1.4); bathL.position.set(-1.8,2.3,-3.5); scene.add(bathL);

/* ---------------- textures ---------------- */
function marbleTex(brick,cool){
  return canvasTex(512,512,(g,w,h) => {
    g.fillStyle = cool ? '#F8F8F7' : '#F2F0EA'; g.fillRect(0,0,w,h);
    const rows = brick ? 4 : 1, rh = h/rows, bw = brick ? w/2 : w;
    for(let r=0;r<rows;r++){
      const off = brick ? (r%2)*bw/2 : 0;
      for(let c=-1;c<(brick?3:1);c++){
        const x0 = c*bw+off, y0 = r*rh;
        g.save(); g.beginPath(); g.rect(x0,y0,bw,rh); g.clip();
        g.fillStyle = cool ? 'rgba(205,208,210,'+(rnd()*.18)+')' : 'rgba(210,205,195,'+(rnd()*.25)+')'; g.fillRect(x0,y0,bw,rh);
        const nv = (cool ? 4 : 3)+Math.floor(rnd()*4);
        for(let v=0;v<nv;v++){
          g.strokeStyle = cool ? 'rgba(92,96,100,'+(.35+rnd()*.35)+')' : (rnd() > .45 ? 'rgba(115,115,112,'+(.25+rnd()*.3)+')' : 'rgba(190,158,96,'+(.25+rnd()*.25)+')');
          g.lineWidth = cool ? 1.2+rnd()*3 : .8+rnd()*2.4; g.beginPath();
          let x = x0+rnd()*bw, y = y0+rnd()*rh; g.moveTo(x,y);
          for(let k=0;k<4;k++){ const nx = x+(rnd()-.25)*bw*.45, ny = y+(rnd()-.5)*rh*.8; g.quadraticCurveTo((x+nx)/2+(rnd()-.5)*30,(y+ny)/2+(rnd()-.5)*30,nx,ny); x = nx; y = ny; }
          g.stroke();
        }
        g.restore();
        g.strokeStyle = cool ? 'rgba(150,152,152,.5)' : 'rgba(95,95,92,.55)'; g.lineWidth = 1.5; g.strokeRect(x0,y0,bw,rh);
      }
    }
  });
}
const T_MARBLE = marbleTex(true), T_SLAB = marbleTex(false,true);
const T_WOOD = canvasTex(256,256,(g,w,h) => {
  const rows = 5, rh = h/rows, tones = ['#C8985A','#BE8C4E','#D0A263','#C39355'];
  for(let r=0;r<rows;r++){
    let x = -rnd()*w*.6;
    while(x < w){
      const len = 110+rnd()*110; g.fillStyle = tones[Math.floor(rnd()*tones.length)]; g.fillRect(x,r*rh,len,rh);
      for(let k=0;k<5;k++){ g.fillStyle = 'rgba(120,75,35,'+(.05+rnd()*.07)+')'; g.fillRect(x+rnd()*len,r*rh+rnd()*rh,10+rnd()*50,1+rnd()*1.5); }
      g.fillStyle = 'rgba(90,55,25,.55)'; g.fillRect(x,r*rh,1.5,rh); x += len;
    }
    g.fillStyle = 'rgba(90,55,25,.55)'; g.fillRect(0,r*rh,w,1.5);
  }
});
const T_BFLOOR = tileCanvas('#3C4145','#6E757A',.05);

/* ---------------- palette ---------------- */
const PAINT = 0xCBB39F, TRIM = 0xC9965A;
const oak = M(0xD9B27A,{roughness:.5}), oakD = M(0xC39A60,{roughness:.55});
const navy = M(0x23406E,{roughness:.95}), glowM = new THREE.MeshBasicMaterial({ color:0xFFF0CF });

/* ---------------- shell ---------------- */
const BX0 = -2.8, BX1 = -0.8, BZ1 = -4.55;          // bathroom (north strip, west part) inner x / back wall z
const BALC = 1.3, bz1 = -hz-T-BALC;
const gN = fadeGroup('N'), gS = fadeGroup('S'), gW = fadeGroup('W'), gE = fadeGroup('E'), gC = fadeGroup('C'), gP = fadeGroup('P');
{
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W,D), tileM(T_WOOD,W,D,1,1,{roughness:.42}));
  floor.rotation.x = -Math.PI/2; floor.receiveShadow = true; root.add(floor);

  const pn = n => fm(n,M(PAINT)), sk = n => fm(n,M(TRIM,{roughness:.5}));
  wall('N', pn('N'), [{ a:-2.5, b:-1.75, y0:0, y1:2.05 }, { a:-0.55, b:0.55, y0:0, y1:2.1 }], gN, sk('N'));
  wall('S', pn('S'), [{ a:1.45, b:2.35, y0:0, y1:2.05 }], gS, sk('S'));
  wall('W', pn('W'), [], gW, sk('W'));
  wall('E', pn('E'), [], gE, sk('E'));

  // ---- west wall: wood headboard panel, marble above it, backlit; blue niche for the sofa ----
  const mm = fm('W',tileM(T_MARBLE,2.9,1.62,1.2,1.2,{roughness:.3}));
  WB('W',-hz,0.65,0.98,H,0,.03,mm,gW,{noCast:true});
  WB('W',-hz,0.65,0.38,0.98,0,.05,fm('W',M(0xD8B07A,{roughness:.55})),gW);
  WB('W',-hz,0.65,0.965,0.985,.03,.06,fm('W',new THREE.MeshBasicMaterial({ color:0xFFF0CF })),gW,{noCast:true});
  WB('W',0.42,0.55,0.55,0.72,.05,.056,fm('W',M(0xEDEDEA,{roughness:.5})),gW,{noCast:true});
  WB('W',0.65,hz,0,2.2,0,.02,fm('W',navy),gW,{noCast:true});
  WB('W',0.65,hz,2.2,H,0,.2,fm('W',M(0xF3F1EC,{roughness:.9})),gW);
  WB('W',0.68,hz-.03,2.17,2.2,.02,.2,fm('W',new THREE.MeshBasicMaterial({color:0xD6E6FF})),gW,{noCast:true});

  // ---- south wall (beside the sofa): entrance door (wood-grain slats) with smart lock, breaker box ----
  const slat = canvasTex(64,256,(g,w,h) => { g.fillStyle = '#C48B4B'; g.fillRect(0,0,w,h); for(let y=0;y<h;y+=18){ g.fillStyle = 'rgba(80,45,15,.45)'; g.fillRect(0,y,w,2); g.fillStyle = 'rgba(255,225,170,'+(rnd()*.2)+')'; g.fillRect(0,y+3,w,12); } });
  const ds = fm('S',M(0xffffff,{map:slat,roughness:.5}));
  WB('S',1.47,2.33,0,2.03,-.015,.045,ds,gS);
  WB('S',2.17,2.25,.9,1.1,.045,.07,fm('S',M(0x1D1E20,{roughness:.4,metalness:.4})),gS,{noCast:true});
  WB('S',1.42,2.38,2.03,2.07,-.02,.035,fm('S',M(0x7E848A,{roughness:.55})),gS,{noCast:true});
  WB('S',0.9,1.2,2.12,2.4,0,.04,fm('S',M(0xC9CDCE,{roughness:.5})),gS,{noCast:true});
  WB('S',0.94,1.16,2.16,2.36,.04,.045,fm('S',M(0x59646A,{roughness:.4})),gS,{noCast:true});

  // ---- north wall: bathroom door frame + open white leaf, black sliding door, A/C, curtain ----
  const gf = fm('N',M(0xF1F0EC,{roughness:.5}));
  [[-2.54,-2.5],[-1.75,-1.71]].forEach(r => WB('N',r[0],r[1],0,2.08,0,.035,gf,gN,{noCast:true}));
  WB('N',-2.54,-1.71,2.05,2.08,0,.035,gf,gN,{noCast:true});
  const bd = doorLeaf('N',-2.5,1,.76,2.0,fm('P',M(0xF4F3EF,{roughness:.45})),-1.45,gP);
  { const kb = new THREE.Mesh(new THREE.SphereGeometry(.03,10,8), fm('P',chrome)); kb.position.set(.68,1.0,.04); bd.group.add(kb); }
  slider('N',-0.55,0.55,{ g:gN, fr:fm('N',M(0x1B1B1C,{roughness:.4,metalness:.4})), name:'N', y1:2.1, panes:2 });
  WB('N',0.42,0.44,.9,1.35,-.12,-.1,fm('N',chrome),gN,{noCast:true});
  acUnit('N',-1.6,-0.75,2.1,2.42,gN,'N');
  const cm = new THREE.MeshStandardMaterial({ color:0x6E5A62, roughness:1, side:THREE.DoubleSide }); fm('N',cm,1);
  curtain('N',-0.12,.8,.02,2.2,cm,gN,.1);
  curtainRod('N',-.6,.6,2.22,fm('N',M(0x8E8E90,{roughness:.4,metalness:.6})),gN);
  // small column in the south-east corner (south of the TV recess, next to the entrance door)
  WB('E',1.9,hz,0,H,0,.32,pn('E'),gE);

  // ---- ceiling with recessed square downlights ----
  const cmat = fm('C',M(0xF6F5F2,{roughness:1,side:THREE.DoubleSide}));
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W,D), cmat); ceil.rotation.x = Math.PI/2; ceil.position.y = H; gC.add(ceil);
  const dlm = fm('C',new THREE.MeshBasicMaterial({color:0xFFFBEF}));
  [[-2.0,-1.0],[-2.0,1.0],[-0.5,-1.0],[-0.5,1.2],[1.0,0.0],[1.0,1.6],[2.0,-0.9]].forEach(p => {
    const d = new THREE.Mesh(new THREE.BoxGeometry(.12,.012,.12), dlm); d.position.set(p[0],H-.006,p[1]); gC.add(d);
  });
}

/* ---------------- bathroom (north strip): all marble, glass screen, rain shower, LED mirror ---------------- */
{
  const pm = fm('P',M(0xF2F1EE));
  B(BX0-.1,BX0,0,H,BZ1-.1,-hz-T,pm,gP); B(BX1,BX1+.1,0,H,BZ1-.1,-hz-T,pm,gP); B(BX0-.1,BX1+.1,0,H,BZ1-.1,BZ1,pm,gP);
  const mar = (x0,x1,z0,z1) => { const L = Math.max(x1-x0,z1-z0); B(x0,x1,0,H-.1,z0,z1,fm('P',tileM(T_SLAB,L,H-.1,.6,.6,{roughness:.2})),gP,{noCast:true}); };
  mar(BX0,BX0+.012,BZ1,-hz-T); mar(BX1-.012,BX1,BZ1,-hz-T); mar(BX0,BX1,BZ1,BZ1+.012);
  mar(BX0,-2.54,-hz-T-.012,-hz-T); mar(-1.71,BX1,-hz-T-.012,-hz-T);
  const bd0 = -hz-T-BZ1, bzc = (BZ1-hz-T)/2;
  const bf = new THREE.Mesh(new THREE.PlaneGeometry(BX1-BX0,bd0), tileM(T_BFLOOR,BX1-BX0,bd0,.3,.3,{roughness:.25}));
  bf.rotation.x = -Math.PI/2; bf.position.set((BX0+BX1)/2,.004,bzc); bf.receiveShadow = true; root.add(bf);
  const bc = new THREE.Mesh(new THREE.PlaneGeometry(BX1-BX0,bd0), fm('C',M(0xF6F5F2,{roughness:1,side:THREE.DoubleSide})));
  bc.rotation.x = Math.PI/2; bc.position.set((BX0+BX1)/2,H-.1,bzc); gC.add(bc);

  // toilet (one-piece) with bidet spray, in the north-west corner
  const tx = -2.5;
  B(tx-.19,tx+.19,.4,.85,BZ1+.02,BZ1+.22,white);
  const bowl = cyl(.19,.16,.4,white,tx,.2,BZ1+.5,root,24); bowl.scale.z = 1.5;
  const seat = cyl(.2,.2,.035,M(0xFAFAF8,{roughness:.35}),tx,.42,BZ1+.5,root,24); seat.scale.z = 1.5;
  B(tx-.04,tx+.04,.85,.88,BZ1+.1,BZ1+.16,chrome);
  B(tx+.26,tx+.28,.55,.7,BZ1+.02,BZ1+.04,chrome,root,{noCast:true});
  // wall-hung rectangular basin with a square tap, small water heater below
  const bx = -1.95;
  B(bx-.3,bx+.3,.78,.9,BZ1+.02,BZ1+.45,white);
  B(bx-.25,bx+.25,.86,.9,BZ1+.08,BZ1+.4,M(0xF4F4F2,{roughness:.2}));
  B(bx-.015,bx+.015,.9,1.04,BZ1+.05,BZ1+.08,chrome); B(bx-.015,bx+.015,1.0,1.04,BZ1+.05,BZ1+.15,chrome);
  B(bx-.2,bx+.2,.5,.74,BZ1+.02,BZ1+.17,M(0xF4F4F2,{roughness:.4}),root,{noCast:true});
  // wide frameless mirror with an LED glow behind it
  B(-2.76,-1.5,1.1,1.94,BZ1+.01,BZ1+.02,glowM,root,{noCast:true});
  const mirTex = canvasTex(256,256,(g,w,h) => { const gr = g.createLinearGradient(0,0,w,h); gr.addColorStop(0,'#E3ECEF'); gr.addColorStop(.55,'#C4D3D9'); gr.addColorStop(1,'#AFC0C8'); g.fillStyle = gr; g.fillRect(0,0,w,h); g.fillStyle = 'rgba(255,255,255,.38)'; g.beginPath(); g.moveTo(w*.15,0); g.lineTo(w*.4,0); g.lineTo(w*.05,h); g.lineTo(-w*.2,h); g.fill(); });
  B(-2.7,-1.56,1.16,1.88,BZ1+.02,BZ1+.03,new THREE.MeshBasicMaterial({ map:mirTex }),root,{noCast:true});
  // glass shower screen (x=-1.5), curb, floor drain
  const gl = glassM(); gl.opacity = .24;
  const pane = new THREE.Mesh(new THREE.PlaneGeometry(1.5,2.0), gl); pane.rotation.y = Math.PI/2; pane.position.set(-1.5,1.0,-3.8); pane.renderOrder = 2; root.add(pane);
  [[-4.45],[-3.15]].forEach(z => B(-1.53,-1.47,.2,.3,z[0]-.02,z[0]+.02,M(0x9AA0A4,{roughness:.4,metalness:.6}),root,{noCast:true}));   // glass clamps
  B(-1.52,-1.48,0,.03,BZ1,-3.05,M(0x9AA0A4,{roughness:.4,metalness:.6}),root,{noCast:true});
  B(-1.25,-1.05,.004,.014,-3.95,-3.75,M(0xA9AFB3,{roughness:.3,metalness:.7}),root,{noCast:true});
  // rain shower: arm from the east wall + wide round head, mixer and a lit niche on the back wall
  const hxp = -1.05, hzp = -3.8;
  B(hxp,BX1-.02,2.03,2.07,hzp-.02,hzp+.02,chrome); cyl(.13,.13,.014,chrome,hxp,2.0,hzp,root,28);
  B(BX1-.08,BX1-.02,1.98,2.1,hzp-.05,hzp+.05,chrome,root,{noCast:true});
  { const mx = cyl(.05,.05,.02,chrome,-1.15,1.1,BZ1+.02,root,18); mx.rotation.x = Math.PI/2; B(-1.17,-1.13,1.1,1.16,BZ1+.03,BZ1+.1,chrome,root,{noCast:true}); }
  B(-1.45,-0.9,1.18,1.52,BZ1+.001,BZ1+.02,M(0xF6F2E0,{roughness:.9,emissive:0x8A8064}),root,{noCast:true});
  B(-1.45,-0.9,1.16,1.18,BZ1,BZ1+.1,M(0xEFEAD9,{roughness:.4}),root,{noCast:true});
  cyl(.03,.03,.2,M(0x7DBF55,{roughness:.5}),-1.33,1.28,BZ1+.06,root,10); cyl(.03,.03,.18,M(0xE87A8A,{roughness:.5}),-1.2,1.27,BZ1+.06,root,10);
  // blue-framed window on the east wall, beside the shower head
  B(BX1-.03,BX1,1.85,2.25,-4.5,-4.0,M(0x1F4FA8,{roughness:.5}),root,{noCast:true});
  B(BX1-.035,BX1-.03,1.9,2.2,-4.45,-4.05,M(0xDDEBFA,{roughness:.2,emissive:0x8CA8C8}),root,{noCast:true});
  blob(tx,BZ1+.45,.9,1.0,.4); blob(bx,BZ1+.3,1.0,.8,.3);
}

/* ---------------- balcony ---------------- */
{
  const bz0 = -hz-T, X0 = BX1+.1, X1 = hx+T;
  const slab = tileM(tileCanvas('#D8D5CC','#B6B2A6',.08),X1-X0,BALC+T,.3,.3,{roughness:.8});
  B(X0,X1,-.14,0,bz1,bz0,slab);
  const rail = M(0x2E3338,{roughness:.5,metalness:.4});
  B(X0,X1,1.0,1.04,bz1,bz1+.04,rail); B(X0,X0+.04,1.0,1.04,bz1,bz0,rail); B(X1-.04,X1,1.0,1.04,bz1,bz0,rail);
  [X0,(X0+X1)/2,X1-.04].forEach(x => B(x,x+.04,0,1.0,bz1,bz1+.04,rail)); [bz1+.65].forEach(z => { B(X0,X0+.04,0,1.0,z,z+.04,rail); B(X1-.04,X1,0,1.0,z,z+.04,rail); });
  const g1 = new THREE.Mesh(new THREE.PlaneGeometry(X1-X0,.96), glassM()); g1.position.set((X0+X1)/2,.52,bz1+.02); g1.renderOrder = 2; root.add(g1);
  [X0+.02,X1-.02].forEach(x => { const s = new THREE.Mesh(new THREE.PlaneGeometry(BALC+T,.96), glassM()); s.rotation.y = Math.PI/2; s.position.set(x,.52,(bz0+bz1)/2); s.renderOrder = 2; root.add(s); });
  blob((X0+X1)/2,bz1+.5,2.4,.8,.25);
}

/* ---------------- bed: dark platform, white linen, blue throw (head against the marble wall) ---------------- */
{
  const L = -hx, base = M(0x3A4045,{roughness:.7});
  B(L+.05,L+2.1,.1,.34,-1.45,.35,base);
  [[L+.25,-1.35],[L+.25,.25],[L+1.9,-1.35],[L+1.9,.25]].forEach(p => B(p[0]-.03,p[0]+.03,0,.1,p[1]-.03,p[1]+.03,M(0x1A1C1E,{roughness:.4,metalness:.5})));
  rbox(1.98,.22,1.72,.05,.04,M(0xF6F3EC,{roughness:.95}),L+1.08,.45,-.55);
  rbox(1.4,.09,1.76,.05,.04,M(0xffffff,{map:duvetTex('#F6F2E7','rgba(150,140,122,.35)',6),roughness:.95}),L+1.38,.595,-.55);
  rbox(.5,.03,1.78,.015,.01,M(0x274C93,{roughness:1}),L+1.75,.66,-.55);
  [-.95,-.15].forEach(z => rbox(.42,.13,.7,.07,.05,M(0xFAFAF8,{roughness:.95}),L+.3,.62,z));
  [-.85,-.25].forEach(z => rbox(.38,.14,.64,.07,.05,M(0xFAFAF8,{roughness:.95}),L+.2,.76,z).rotation.z = -.35);
  rbox(.4,.12,.55,.05,.04,M(0xF3EEDF,{roughness:1}),L+1.78,.725,-.35);
  rbox(.42,.1,.55,.05,.04,M(0xF7F3E6,{roughness:1}),L+1.8,.835,-.35);
  blob(L+1.1,-.55,2.6,2.2,.4);
}

/* ---------------- grey-green sofa + white glass-top coffee table in the blue niche ---------------- */
{
  const L = -hx, z0 = .8, Lz = 1.35, zc = z0+Lz/2;
  const sofa = M(0x5F6D63,{roughness:.95}), sofaD = M(0x56635A,{roughness:.95});
  rbox(.8,.34,Lz,.06,.05,sofa,L+.45,.21,zc);
  rbox(.22,.55,Lz,.06,.05,sofaD,L+.14,.5,zc);
  [z0+.09,z0+Lz-.09].forEach(z => rbox(.8,.46,.18,.06,.05,sofaD,L+.45,.27,z));
  [zc-.31,zc+.31].forEach(z => rbox(.58,.12,.5,.05,.04,sofa,L+.52,.42,z));
  [zc-.31,zc+.31].forEach(z => rbox(.18,.45,.5,.07,.05,sofa,L+.24,.65,z));
  [[L+.1,z0+.05],[L+.1,z0+Lz-.05],[L+.8,z0+.05],[L+.8,z0+Lz-.05]].forEach(p => B(p[0]-.025,p[0]+.025,0,.03,p[1]-.025,p[1]+.025,M(0x1A1C1E,{roughness:.5})));
  blob(L+.5,zc,1.3,1.8,.4);
  const tx = L+1.3, tz = zc, wh = M(0xF4F2EA,{roughness:.5});
  B(tx-.28,tx+.28,.43,.46,tz-.25,tz+.25,wh);
  [[-.25,-.22],[.25,-.22],[-.25,.22],[.25,.22]].forEach(p => B(tx+p[0]-.022,tx+p[0]+.022,0,.43,tz+p[1]-.022,tz+p[1]+.022,wh));
  const tg = new THREE.Mesh(new THREE.BoxGeometry(.5,.012,.44), new THREE.MeshStandardMaterial({ color:0xCFE6DC, roughness:.06, transparent:true, opacity:.5, depthWrite:false })); tg.position.set(tx,.466,tz); root.add(tg);
  blob(tx,tz,.9,.9,.3);
}

/* ---------------- open built-in wardrobe with LED (east wall, opposite the bed head) ---------------- */
{
  const s0 = -.8, s1 = .15, sm = (s0+s1)/2;
  WB('E',s0,s0+.03,0,2.4,0,.58,oak); WB('E',s1-.03,s1,0,2.4,0,.58,oak); WB('E',s0,s1,0,2.4,0,.02,oakD);
  WB('E',s0,s1,2.37,2.4,0,.58,oak); WB('E',s0,s1,1.9,1.93,0,.58,oak); WB('E',s0,s1,.7,.73,0,.5,oak);
  WB('E',s0+.03,s1-.03,1.885,1.9,.04,.54,glowM,root,{noCast:true});
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,s1-s0-.07,10), M(0xC9CED0,{roughness:.3,metalness:.7})); rod.rotation.x = Math.PI/2;
  { const q = XZ('E',sm,.3); rod.position.set(q[0],1.78,q[1]); root.add(rod); }
  [[-.59,0x5C6B7A],[-.49,0xE8E2D4],[-.39,0x3E4A55],[-.29,0xB8A58C],[-.19,0x6B4A33]].forEach(c => { const h = B(0,.36,0,.5,0,.03,M(c[1],{roughness:.9}),root,{noCast:true}); const q = XZ('E',c[0],.3); h.position.set(q[0],1.52,q[1]); });
  WB('E',s0+.03,s1-.03,.73,.9,.04,.62,M(0xD2AC72,{roughness:.5}));                  // pull-out drawer tray
  WB('E',s0+.05,s1-.05,.74,.9,.62,.64,oak);
  WB('E',s0+.04,s1-.04,.9,.92,.1,.55,new THREE.MeshStandardMaterial({ color:0xE9D8B0, roughness:.1, transparent:true, opacity:.5, depthWrite:false }),root,{noCast:true});
  { const q = XZ('E',sm,.7); blob(q[0],q[1],1.1,1.2,.4); }
}

/* ---------------- east wall, south of the wardrobe: TV recess with yellow shelf, mini fridge, pedal bin ---------------- */
{
  const TS = .5, TY = 1.4, HW = .36, HH = .21;
  const shell = M(0x0E0F10,{roughness:.4,metalness:.2});
  WB('E',TS-HW,TS+HW,TY-HH,TY+HH,0,.05,shell); WB('E',TS-.1,TS+.1,TY-.06,TY+.06,.05,.07,dark,root,{noCast:true});
  const scr = canvasTex(512,288,(g,w,h) => {
    const gr = g.createLinearGradient(0,0,w,h); gr.addColorStop(0,'#1A1E22'); gr.addColorStop(1,'#050607'); g.fillStyle = gr; g.fillRect(0,0,w,h);
    const rf = g.createLinearGradient(0,h,w*.8,0); rf.addColorStop(0,'rgba(255,255,255,0)'); rf.addColorStop(.5,'rgba(255,255,255,.08)'); rf.addColorStop(.62,'rgba(255,255,255,0)');
    g.fillStyle = rf; g.fillRect(0,0,w,h);
  });
  { const p = WP('E',TS,TY,.052,(HW-.012)*2,(HH-.012)*2,new THREE.MeshStandardMaterial({ map:scr, roughness:.1, metalness:.3 }),root); p.receiveShadow = true; }
  // floating pale-yellow shelf (water bottles + remote) and a wall socket
  WB('E',.15,1.1,.8,.84,0,.3,M(0xE9D87F,{roughness:.6}));
  [.85,.92].forEach(s => { const q = XZ('E',s,.2); cyl(.03,.03,.2,M(0xDDEFF5,{roughness:.2,transparent:true,opacity:.8}),q[0],.94,q[1],root,10); });
  WB('E',.27,.37,.845,.855,.12,.2,M(0xE8E8E6,{roughness:.5}),root,{noCast:true});
  WB('E',.97,1.07,.95,1.05,0,.02,M(0xEDEDEA,{roughness:.5}),root,{noCast:true});
  // silver mini fridge below the shelf and a steel pedal bin beside it (next to the wardrobe)
  { const q = XZ('E',.7,.28); rbox(.5,.5,.46,.03,.02,M(0xB9BEC0,{roughness:.35,metalness:.35}),q[0],.27,q[1]); }
  { const q = XZ('E',.33,.2); cyl(.1,.09,.28,M(0xC9CED0,{roughness:.3,metalness:.7}),q[0],.16,q[1],root,16); }
  { const q = XZ('E',.6,.5); blob(q[0],q[1],1.0,1.1,.35); }
}
