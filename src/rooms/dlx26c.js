//==CFG==
/* ------------------------------------------------------------------
   S.House Deluxe Studio - CORNER room (renovated), 27 sq.m. Metres. Origin = centre of the room floor. Room 3.7 (x) x 5.2 (z).
   FLOOR PLAN = exactly the Standard Window 27 plan (std27) - same room box, entrance, bed position, bathroom wing and balcony -
   dressed with the Deluxe finishes seen in the corner-room photos (rev 5, owner: "the plan is the same as std27"):
   - SOUTH wall (+z): the ENTRANCE door at the west end; the bed lies along this wall, head against the east wall
     (wood + backlit marble headboard wall).
   - WEST wall (-x), from the south: TV recess (TV + pale-yellow shelf + mini fridge + pedal bin), wall pier with the
     breaker box (high), clear wall, open built-in wardrobe with LED in the north-west corner.
   - NORTH wall (-z), from the west: bathroom door (white leaf), then the black-framed 2-pane balcony slider
     (mauve curtains, split A/C above). Marble bathroom (rain shower, glass screen) and the balcony lie outside this wall.
   - EAST wall (+x), from the north: large aluminium sliding WINDOW with the grey-green sofa + coffee table in a blue niche,
     a pier, then the bed-head wall.
   - Floor = laminate wood; walls warm beige.
------------------------------------------------------------------- */
const ROOM = { W:3.7, D:5.2, H:2.6, T:0.14 };

const TXT = {
  th:{
    title:'ห้อง Deluxe Studio หัวมุม 27 ตร.ม.',
    meta:['หน้าต่างบานใหญ่หลังโซฟา · ระเบียงส่วนตัว','ทีวี · ตู้เย็นเล็ก · ห้องน้ำหินอ่อน Rain Shower · ตู้เสื้อผ้าบิลท์อิน'],
    note:'ภาพจำลอง 3 มิติ ขนาดและของตกแต่งอาจต่างจากห้องจริงเล็กน้อย',
    hintOrbit:'ลากเพื่อหมุนห้อง · บีบเพื่อซูม · แตะชื่อจุดเพื่อเข้าไปดู',
    hintWalk:'ลากเพื่อมองรอบห้อง · แตะที่พื้นเพื่อเดิน · บีบเพื่อซูม' + (fine ? ' · WASD' : ''),
    aria:'ภาพ 3 มิติของห้อง Deluxe Studio หัวมุม 27 ตร.ม. ที่ S.House',
    fail:'อุปกรณ์หรือเบราว์เซอร์นี้แสดงภาพ 3 มิติไม่ได้ ลองเปิดด้วย Chrome หรือ Safari เวอร์ชันล่าสุด'
  },
  en:{
    title:'Deluxe Studio Corner Room 27 sq.m.',
    meta:['Big window behind the sofa · Private balcony','TV · Mini fridge · Marble rain-shower bathroom · Built-in wardrobe'],
    note:'3D model. Size and furnishings may differ slightly from the actual room.',
    hintOrbit:'Drag to rotate · Pinch to zoom · Tap a label to step inside',
    hintWalk:'Drag to look around · Tap the floor to walk · Pinch to zoom' + (fine ? ' · WASD' : ''),
    aria:'3D view of the Deluxe Studio corner room 27 sq.m. at S.House',
    fail:'This device or browser cannot show 3D. Try the latest Chrome or Safari.'
  }
};

const VIEWS = [
  { id:'overview', th:'ภาพรวม',              en:'Overview' },
  { id:'entry',   th:'ทางเข้า',                en:'Entrance',      pos:[-0.95,1.55,2.15], at:[0.5,0.9,-1.6],    fov:78, tag:[-1.0,2.2,2.5] },
  { id:'bed',     th:'เตียง · ผนังหินอ่อน',     en:'Bed',           pos:[-0.8,1.5,0.2],    at:[1.5,0.95,1.8],    fov:78, tag:[1.5,2.3,1.7] },
  { id:'sofa',    th:'โซฟา · หน้าต่าง',         en:'Sofa & window', pos:[-0.2,1.5,-0.1],   at:[1.6,1.05,-1.65],  fov:80, tag:[1.5,2.3,-1.6] },
  { id:'closet',  th:'ตู้เสื้อผ้า',             en:'Wardrobe',      pos:[0.6,1.5,0.0],     at:[-1.7,1.0,-1.9],   fov:82, tag:[-1.5,2.5,-2.1] },
  { id:'tv',      th:'ทีวี · ตู้เย็น',          en:'TV & fridge',   pos:[0.5,1.5,0.1],     at:[-1.7,0.9,1.7],    fov:80, tag:[-1.6,1.95,1.75] },
  { id:'balcony', th:'ระเบียง',                en:'Balcony',       pos:[0.45,1.5,-2.0],   at:[0.5,0.3,-4.6],    fov:78, tag:[0.45,1.25,-3.3] },
  { id:'bath',    th:'ห้องน้ำหินอ่อน',          en:'Bathroom',      pos:[-0.95,1.55,-2.45], at:[-1.15,1.0,-4.4],  fov:80, tag:[-1.1,1.9,-3.3] },
  { id:'shower',  th:'ฝักบัว Rain Shower',      en:'Rain shower',   pos:[-1.15,1.6,-2.5], at:[-0.6,1.75,-4.1],  fov:62, tag:[-0.58,2.25,-4.0] }
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
  [-0.25,1.9,0.7,2.6],                              // bed
  [1.0,1.9,-2.3,-0.85],                             // sofa
  [0.2,0.9,-1.85,-1.25],                            // coffee table
  [1.6,1.9,-0.5,0.0],                               // east pier
  [-1.9,-1.3,1.4,2.3],                              // bin + mini fridge + TV shelf
  [-1.9,-1.5,0.5,0.9],                              // west pier
  [-1.9,-1.25,-2.6,-1.55],                          // wardrobe
  [-1.5,-0.9,-4.5,-3.85],                           // toilet
  [-1.95,-1.4,-3.9,-3.05],                          // basin
  [-0.95,-0.8,-4.5,-3.6],                           // shower glass screen
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
scene.add(new THREE.HemisphereLight(0xF1F2F2, 0xBBA98F, .58));
const sun = new THREE.DirectionalLight(0xFFF0D8, .55);
sun.position.set(-2,7,-16); sun.target.position.set(0,0,0);
sun.castShadow = true; sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{ left:-10, right:10, top:10, bottom:-10, near:1, far:45 });
sun.shadow.bias = -.0006;
scene.add(sun, sun.target);
const lamp = new THREE.PointLight(0xFFEBD2, .65, 15, 1.3);
lamp.position.set(0,2.3,.3); lamp.castShadow = true; lamp.shadow.mapSize.set(1024,1024);
lamp.shadow.camera.near = .2; lamp.shadow.camera.far = 15; lamp.shadow.bias = -.002;
scene.add(lamp);
const ledL = new THREE.PointLight(0xFFE8C0, .35, 3.2, 1.5); ledL.position.set(1.45,1.2,1.5); scene.add(ledL);
const bathL = new THREE.PointLight(0xFFF8F0, .7, 4.2, 1.4); bathL.position.set(-1.1,2.2,-3.6); scene.add(bathL);
const dayL = new THREE.PointLight(0xEAF3FF, .45, 4.5, 1.5); dayL.position.set(1.2,1.7,-1.55); scene.add(dayL);

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
const alu = (n) => fm(n,M(0xC9CED0,{roughness:.4,metalness:.55}));
const plate = (n) => fm(n,M(0xF2F0E8,{roughness:.5}));

/* ---------------- plan constants (identical to std27) ---------------- */
const BDOOR = { a:-1.25, b:-0.45 };                // bathroom door (north wall, along x)
const SL = { a:-0.1, b:1.0 };                      // balcony slider (north wall)
const EW = { a:-2.2, b:-0.9, y0:.95, y1:2.1 };     // east window (along z), sofa sits under it
const BX0 = -1.9, BX1 = -0.3, BZ0 = -hz-T, BZ1 = -4.45;   // bathroom interior: x BX0..BX1, z BZ1..BZ0
const BAL = { x0:-0.2, x1:1.55, z1:-3.94 };        // balcony outside the slider
const gN = fadeGroup('N'), gS = fadeGroup('S'), gW = fadeGroup('W'), gE = fadeGroup('E'), gC = fadeGroup('C'), gP = fadeGroup('P');

/* ---------------- shell ---------------- */
{
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W,D), tileM(T_WOOD,W,D,1,1,{roughness:.42}));
  floor.rotation.x = -Math.PI/2; floor.receiveShadow = true; root.add(floor);
  const pn = (n) => fm(n,M(PAINT)), sk = (n) => fm(n,M(TRIM,{roughness:.5}));
  wall('N', pn('N'), [{ a:BDOOR.a, b:BDOOR.b, y0:0, y1:2.05 }, { a:SL.a, b:SL.b, y0:0, y1:2.1 }], gN, sk('N'));
  wall('S', pn('S'), [], gS, sk('S'));
  wall('W', pn('W'), [], gW, sk('W'));
  wall('E', pn('E'), [{ a:EW.a, b:EW.b, y0:EW.y0, y1:EW.y1 }], gE, sk('E'));

  // ---- east wall, north part: blue niche around the big sliding window (sofa underneath), light cove above ----
  { const nv = fm('E',navy), o = { noCast:true };
    WB('E',-hz,EW.a,0,2.2,0,.02,nv,gE,o); WB('E',EW.b,-.45,0,2.2,0,.02,nv,gE,o);
    WB('E',EW.a,EW.b,0,EW.y0,0,.02,nv,gE,o); WB('E',EW.a,EW.b,EW.y1,2.2,0,.02,nv,gE,o);
    // aluminium 2-pane sliding window: frame, middle mullion, glass, white sill
    const a = EW.a, b = EW.b, y0 = EW.y0, y1 = EW.y1, mid = (a+b)/2, fr = alu('E');
    WB('E',a,b,y0,y0+.05,-.05,.05,fr,gE,o); WB('E',a,b,y1-.05,y1,-.05,.05,fr,gE,o);
    WB('E',a,a+.05,y0,y1,-.05,.05,fr,gE,o); WB('E',b-.05,b,y0,y1,-.05,.05,fr,gE,o);
    WB('E',mid-.03,mid+.03,y0,y1,-.07,.07,fr,gE,o);
    const gl = glassM(); fm('E',gl,gl.opacity); const gp = WP('E',mid,(y0+y1)/2,0,b-a-.1,y1-y0-.1,gl,gE); gp.renderOrder = 2;
    WB('E',a-.04,b+.04,y0-.035,y0,-.02,.1,fm('E',M(0xEFEDE6,{roughness:.5})),gE,o); }
  WB('E',-hz,-.45,2.2,H,0,.2,fm('E',M(0xF3F1EC,{roughness:.9})),gE);
  WB('E',-hz+.03,-.48,2.17,2.2,.02,.2,fm('E',new THREE.MeshBasicMaterial({color:0xD6E6FF})),gE,{noCast:true});
  WB('E',-.45,-.05,0,H,0,.25,pn('E'),gE);                                              // pier beside the bed-head wall
  WB('E',-.4,-.32,1.2,1.3,.25,.262,plate('E'),gE,{noCast:true});                        // light switch on the pier

  // ---- east wall, south part (bed head): wood panel, marble above it, backlit ----
  { const mm = fm('E',tileM(T_MARBLE,2.65,1.62,1.2,1.2,{roughness:.3}));
    WB('E',-.05,hz,0.98,H,0,.03,mm,gE,{noCast:true});
    WB('E',-.05,hz,0.38,0.98,0,.05,fm('E',M(0xD8B07A,{roughness:.55})),gE);
    WB('E',-.05,hz,0.965,0.985,.03,.06,fm('E',new THREE.MeshBasicMaterial({ color:0xFFF0CF })),gE,{noCast:true});
    WB('E',.6,.73,.55,.72,.05,.056,fm('E',M(0xEDEDEA,{roughness:.5})),gE,{noCast:true}); }

  // ---- north wall: bathroom door frame + open white leaf, black balcony slider, A/C, mauve curtains ----
  { const gf = () => fm('N',M(0xF1F0EC,{roughness:.5})), o = { noCast:true };
    WB('N',BDOOR.a-.04,BDOOR.a,0,2.1,-.02,.035,gf(),gN,o); WB('N',BDOOR.b,BDOOR.b+.04,0,2.1,-.02,.035,gf(),gN,o); WB('N',BDOOR.a-.04,BDOOR.b+.04,2.05,2.1,-.02,.035,gf(),gN,o);
    const leaf = doorLeaf('N',BDOOR.b,-1,.78,2.0,fm('P',M(0xF4F3EF,{roughness:.45})),-1.45,gP);
    const kb = new THREE.Mesh(new THREE.SphereGeometry(.03,10,8), fm('P',chrome)); kb.position.set(.68,1.0,.04); leaf.group.add(kb); }
  slider('N',SL.a,SL.b,{ g:gN, fr:fm('N',M(0x1B1B1C,{roughness:.4,metalness:.4})), name:'N', y1:2.1, panes:2 });
  B(SL.a,SL.b,-.14,0,-hz-T,-hz,M(0xD8D5CC,{roughness:.8}));                              // threshold under the slider
  WB('N',.46,.48,.9,1.35,-.12,-.1,fm('N',chrome),gN,{noCast:true});                       // slider handle
  acUnit('N',0.0,.95,2.16,2.5,gN,'N');
  { const cm = new THREE.MeshStandardMaterial({ color:0x6E5A62, roughness:1, side:THREE.DoubleSide }); fm('N',cm,1);
    curtain('N',-0.02,.45,.02,2.08,cm,gN,.1); curtain('N',.92,.45,.02,2.08,cm,gN,.1);
    curtainRod('N',-.3,1.2,2.1,fm('N',M(0x8E8E90,{roughness:.4,metalness:.6})),gN); }

  // ---- south wall: entrance door (wood-grain slats, closed) with smart lock ----
  { const a = -1.45, b = -0.6;
    const slat = canvasTex(64,256,(g,w,h) => { g.fillStyle = '#C48B4B'; g.fillRect(0,0,w,h); for(let y=0;y<h;y+=18){ g.fillStyle = 'rgba(80,45,15,.45)'; g.fillRect(0,y,w,2); g.fillStyle = 'rgba(255,225,170,'+(rnd()*.2)+')'; g.fillRect(0,y+3,w,12); } });
    const ds = fm('S',M(0xffffff,{map:slat,roughness:.5})), gf = () => fm('S',M(0x7E848A,{roughness:.55}));
    WB('S',a,b,0,2.03,-.015,.045,ds,gS);
    WB('S',b-.14,b-.06,.9,1.1,.045,.07,fm('S',M(0x1D1E20,{roughness:.4,metalness:.4})),gS,{noCast:true});
    WB('S',a-.03,a,0,2.07,-.02,.035,gf(),gS,{noCast:true}); WB('S',b,b+.03,0,2.07,-.02,.035,gf(),gS,{noCast:true}); WB('S',a-.03,b+.03,2.03,2.07,-.02,.035,gf(),gS,{noCast:true}); }
  WB('S',-.42,-.34,1.2,1.42,0,.025,fm('S',M(0xF4F4F1,{roughness:.4})),gS,{noCast:true});
  WB('S',-.3,-.2,1.2,1.3,0,.012,plate('S'),gS,{noCast:true});

  // ---- west wall: pier with the breaker box (high) ----
  WB('W',.5,.9,0,H,0,.3,pn('W'),gW);
  WB('W',.54,.86,1.55,1.88,.3,.37,fm('W',M(0xE7E9E8,{roughness:.5})),gW,{noCast:true});
  WB('W',.57,.83,1.6,1.82,.37,.375,fm('W',M(0x59646A,{roughness:.4})),gW,{noCast:true});
  WB('W',.66,.74,1.62,1.8,.375,.38,fm('W',M(0xBFC6C8,{roughness:.4})),gW,{noCast:true});

  // ---- ceiling with recessed square downlights ----
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W,D), fm('C',M(0xF6F5F2,{roughness:1,side:THREE.DoubleSide})));
  ceil.rotation.x = Math.PI/2; ceil.position.y = H; gC.add(ceil);
  const dlm = fm('C',new THREE.MeshBasicMaterial({color:0xFFFBEF}));
  [[-0.8,-1.9],[0.8,-1.9],[-0.8,-0.2],[0.8,-0.2],[-0.8,1.5],[0.8,1.5]].forEach(p => {
    const d = new THREE.Mesh(new THREE.BoxGeometry(.12,.012,.12), dlm); d.position.set(p[0],H-.006,p[1]); gC.add(d);
  });
}

/* ---------------- bathroom wing (north of the room, door in the north wall): all marble, glass screen, rain shower, LED mirror ---------------- */
{
  const Hc = H-.1, pm = fm('P',M(0xF2F1EE));
  B(BX0-.1,BX0,0,H,BZ1-.1,BZ0,pm,gP); B(BX1,BX1+.1,0,H,BZ1-.1,BZ0,pm,gP); B(BX0-.1,BX1+.1,0,H,BZ1-.1,BZ1,pm,gP);
  const mar = (x0,x1,z0,z1,y0,y1) => { const L = Math.max(x1-x0,z1-z0); B(x0,x1,y0,y1,z0,z1,fm('P',tileM(T_SLAB,L,y1-y0,.6,.6,{roughness:.2})),gP,{noCast:true}); };
  mar(BX0,BX0+.012,BZ1,BZ0,0,Hc); mar(BX1-.012,BX1,BZ1,BZ0,0,Hc); mar(BX0,BX1,BZ1,BZ1+.012,0,Hc);
  mar(BX0,BDOOR.a,BZ0-.012,BZ0,0,Hc); mar(BDOOR.b,BX1,BZ0-.012,BZ0,0,Hc); mar(BDOOR.a,BDOOR.b,BZ0-.012,BZ0,2.05,Hc);
  const bw = BX1-BX0, bd = BZ0-BZ1, bcx = (BX0+BX1)/2, bcz = (BZ0+BZ1)/2;
  const bf = new THREE.Mesh(new THREE.PlaneGeometry(bw,bd), tileM(T_BFLOOR,bw,bd,.3,.3,{roughness:.25}));
  bf.rotation.x = -Math.PI/2; bf.position.set(bcx,.004,bcz); bf.receiveShadow = true; root.add(bf);
  B(BDOOR.a,BDOOR.b,0,.02,BZ0-.12,BZ0+.1,fm('P',M(0xB8C0C6,{roughness:.4})),gP,{noCast:true});    // door threshold
  const bc = new THREE.Mesh(new THREE.PlaneGeometry(bw,bd), fm('C',M(0xF6F5F2,{roughness:1,side:THREE.DoubleSide})));
  bc.rotation.x = Math.PI/2; bc.position.set(bcx,Hc,bcz); gC.add(bc);
  { const d = new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.012,18), fm('C',new THREE.MeshBasicMaterial({color:0xFFFFFF}))); d.position.set(bcx,Hc-.006,bcz); gC.add(d); }

  // toilet (one-piece) with bidet spray, against the north wall
  const tx = -1.2;
  B(tx-.19,tx+.19,.4,.85,BZ1+.02,BZ1+.22,white);
  const bowl = cyl(.19,.16,.4,white,tx,.2,BZ1+.5,root,24); bowl.scale.z = 1.5;
  const seat = cyl(.2,.2,.035,M(0xFAFAF8,{roughness:.35}),tx,.42,BZ1+.5,root,24); seat.scale.z = 1.5;
  B(tx-.04,tx+.04,.85,.88,BZ1+.1,BZ1+.16,chrome);
  B(tx+.26,tx+.28,.55,.7,BZ1+.02,BZ1+.04,chrome,root,{noCast:true});

  // wall-hung rectangular basin with a square tap on the west wall, small water heater below
  const zb = -3.45;
  B(BX0+.02,BX0+.45,.78,.9,zb-.3,zb+.3,white);
  B(BX0+.08,BX0+.4,.86,.9,zb-.25,zb+.25,M(0xF4F4F2,{roughness:.2}));
  B(BX0+.05,BX0+.08,.9,1.04,zb-.015,zb+.015,chrome); B(BX0+.05,BX0+.15,1.0,1.04,zb-.015,zb+.015,chrome);
  B(BX0+.02,BX0+.17,.5,.74,zb-.2,zb+.2,M(0xF4F4F2,{roughness:.4}),root,{noCast:true});
  // frameless mirror with an LED glow behind it
  B(BX0+.01,BX0+.02,1.1,1.94,zb-.58,zb+.58,glowM,root,{noCast:true});
  const mirTex = canvasTex(256,256,(g,w,h) => { const gr = g.createLinearGradient(0,0,w,h); gr.addColorStop(0,'#E3ECEF'); gr.addColorStop(.55,'#C4D3D9'); gr.addColorStop(1,'#AFC0C8'); g.fillStyle = gr; g.fillRect(0,0,w,h); g.fillStyle = 'rgba(255,255,255,.38)'; g.beginPath(); g.moveTo(w*.15,0); g.lineTo(w*.4,0); g.lineTo(w*.05,h); g.lineTo(-w*.2,h); g.fill(); });
  B(BX0+.02,BX0+.03,1.16,1.88,zb-.5,zb+.5,new THREE.MeshBasicMaterial({ map:mirTex }),root,{noCast:true});

  // glass shower screen (x=-0.88), curb and drain; rain shower head on an arm from the east wall; mixer + lit niche on the back wall
  const sx = -0.88, sz0 = BZ1, sz1 = -3.6, hxp = -0.58, hzp = (sz0+sz1)/2;
  const gl = glassM(); gl.opacity = .24;
  const pane = new THREE.Mesh(new THREE.PlaneGeometry(sz1-sz0,2.0), gl); pane.rotation.y = Math.PI/2; pane.position.set(sx,1.0,hzp); pane.renderOrder = 2; root.add(pane);
  [sz0+.02,sz1-.02].forEach(z => B(sx-.03,sx+.03,.2,.3,z-.02,z+.02,M(0x9AA0A4,{roughness:.4,metalness:.6}),root,{noCast:true}));   // glass clamps
  B(sx-.02,sx+.02,0,.03,sz0,sz1,M(0x9AA0A4,{roughness:.4,metalness:.6}),root,{noCast:true});
  cyl(.05,.05,.006,M(0xA9AFB3,{roughness:.3,metalness:.7}),hxp,.01,hzp,root,14);
  B(hxp,BX1-.02,2.03,2.07,hzp-.02,hzp+.02,chrome); cyl(.13,.13,.014,chrome,hxp,2.0,hzp,root,28);
  B(BX1-.08,BX1-.02,1.98,2.1,hzp-.05,hzp+.05,chrome,root,{noCast:true});
  { const mx = cyl(.05,.05,.02,chrome,hxp,1.1,BZ1+.02,root,18); mx.rotation.x = Math.PI/2; B(hxp-.02,hxp+.02,1.1,1.16,BZ1+.03,BZ1+.1,chrome,root,{noCast:true}); }
  B(hxp-.2,hxp+.2,1.3,1.62,BZ1+.001,BZ1+.02,M(0xF6F2E0,{roughness:.9,emissive:0x8A8064}),root,{noCast:true});
  B(hxp-.2,hxp+.2,1.28,1.3,BZ1,BZ1+.1,M(0xEFEAD9,{roughness:.4}),root,{noCast:true});
  cyl(.03,.03,.2,M(0x7DBF55,{roughness:.5}),hxp-.09,1.4,BZ1+.06,root,10); cyl(.03,.03,.18,M(0xE87A8A,{roughness:.5}),hxp+.06,1.39,BZ1+.06,root,10);
  blob(tx,BZ1+.5,.9,1.0,.4); blob(BX0+.25,zb,.8,1.0,.3); blob(hxp,hzp,.8,1.0,.25);
}

/* ---------------- balcony (north of the slider): glass-and-steel railing, same size as std27 ---------------- */
{
  const bz0 = -hz-T, bz1 = BAL.z1, X0 = BAL.x0, X1 = BAL.x1, len = bz0-bz1;
  B(X0,X1,-.14,0,bz1,bz0,tileM(tileCanvas('#D8D5CC','#B6B2A6',.08),X1-X0,len,.3,.3,{roughness:.8}));
  const rail = M(0x2E3338,{roughness:.5,metalness:.4});
  B(X0,X1,1.0,1.04,bz1,bz1+.04,rail); B(X0,X0+.04,1.0,1.04,bz1,bz0,rail); B(X1-.04,X1,1.0,1.04,bz1,bz0,rail);
  [X0,(X0+X1)/2,X1-.04].forEach(x => B(x,x+.04,0,1.0,bz1,bz1+.04,rail));
  [bz1+len/2].forEach(z => { B(X0,X0+.04,0,1.0,z,z+.04,rail); B(X1-.04,X1,0,1.0,z,z+.04,rail); });
  const g1 = new THREE.Mesh(new THREE.PlaneGeometry(X1-X0,.96), glassM()); g1.position.set((X0+X1)/2,.52,bz1+.02); g1.renderOrder = 2; root.add(g1);
  [X0+.02,X1-.02].forEach(x => { const s = new THREE.Mesh(new THREE.PlaneGeometry(len,.96), glassM()); s.rotation.y = Math.PI/2; s.position.set(x,.52,(bz0+bz1)/2); s.renderOrder = 2; root.add(s); });
  const dr = new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.006,14), M(0x555A5C,{roughness:.5})); dr.position.set(.9,.003,bz1+.45); root.add(dr);
  blob((X0+X1)/2,(bz0+bz1)/2,1.7,1.2,.2);
}

/* ---------------- bed: dark platform, white linen, blue throw (head against the marble wall, east side) ---------------- */
{
  const X = u => hx-u, bz = 1.65, base = M(0x3A4045,{roughness:.7});
  B(X(2.1),X(.05),.1,.34,bz-.9,bz+.9,base);
  [[.25,-.8],[.25,.8],[1.9,-.8],[1.9,.8]].forEach(p => B(X(p[0])-.03,X(p[0])+.03,0,.1,bz+p[1]-.03,bz+p[1]+.03,M(0x1A1C1E,{roughness:.4,metalness:.5})));
  rbox(1.98,.22,1.72,.05,.04,M(0xF6F3EC,{roughness:.95}),X(1.08),.45,bz);
  rbox(1.4,.09,1.76,.05,.04,M(0xffffff,{map:duvetTex('#F6F2E7','rgba(150,140,122,.35)',6),roughness:.95}),X(1.38),.595,bz);
  rbox(.5,.03,1.78,.015,.01,M(0x274C93,{roughness:1}),X(1.75),.66,bz);
  [-.4,.4].forEach(d => rbox(.42,.13,.7,.07,.05,M(0xFAFAF8,{roughness:.95}),X(.3),.62,bz+d));
  [-.3,.3].forEach(d => rbox(.38,.14,.64,.07,.05,M(0xFAFAF8,{roughness:.95}),X(.2),.76,bz+d).rotation.z = .35);
  rbox(.4,.12,.55,.05,.04,M(0xF3EEDF,{roughness:1}),X(1.78),.725,bz+.2);
  rbox(.42,.1,.55,.05,.04,M(0xF7F3E6,{roughness:1}),X(1.8),.835,bz+.2);
  blob(X(1.1),bz,2.6,2.2,.4);
}

/* ---------------- grey-green sofa + white glass-top coffee table in the blue niche under the east window ---------------- */
{
  const Lz = 1.35, zc = (EW.a+EW.b)/2, z0 = zc-Lz/2;
  const sofa = M(0x5F6D63,{roughness:.95}), sofaD = M(0x56635A,{roughness:.95});
  rbox(.8,.34,Lz,.06,.05,sofa,hx-.45,.21,zc);
  rbox(.22,.55,Lz,.06,.05,sofaD,hx-.14,.5,zc);
  [z0+.09,z0+Lz-.09].forEach(z => rbox(.8,.46,.18,.06,.05,sofaD,hx-.45,.27,z));
  [zc-.31,zc+.31].forEach(z => rbox(.58,.12,.5,.05,.04,sofa,hx-.52,.42,z));
  [zc-.31,zc+.31].forEach(z => rbox(.18,.45,.5,.07,.05,sofa,hx-.24,.65,z));
  [[hx-.1,z0+.05],[hx-.1,z0+Lz-.05],[hx-.8,z0+.05],[hx-.8,z0+Lz-.05]].forEach(p => B(p[0]-.025,p[0]+.025,0,.03,p[1]-.025,p[1]+.025,M(0x1A1C1E,{roughness:.5})));
  blob(hx-.5,zc,1.3,1.8,.4);
  const tx = hx-1.3, tz = zc, wh = M(0xF4F2EA,{roughness:.5});
  B(tx-.28,tx+.28,.43,.46,tz-.25,tz+.25,wh);
  [[-.25,-.22],[.25,-.22],[-.25,.22],[.25,.22]].forEach(p => B(tx+p[0]-.022,tx+p[0]+.022,0,.43,tz+p[1]-.022,tz+p[1]+.022,wh));
  const tg = new THREE.Mesh(new THREE.BoxGeometry(.5,.012,.44), new THREE.MeshStandardMaterial({ color:0xCFE6DC, roughness:.06, transparent:true, opacity:.5, depthWrite:false })); tg.position.set(tx,.466,tz); root.add(tg);
  blob(tx,tz,.9,.9,.3);
}

/* ---------------- west wall, north-west corner: open built-in wardrobe with LED ---------------- */
{
  const s0 = -2.55, s1 = -1.6, sm = (s0+s1)/2;
  WB('W',s0,s0+.03,0,2.4,0,.58,oak); WB('W',s1-.03,s1,0,2.4,0,.58,oak); WB('W',s0,s1,0,2.4,0,.02,oakD);
  WB('W',s0,s1,2.37,2.4,0,.58,oak); WB('W',s0,s1,1.9,1.93,0,.58,oak); WB('W',s0,s1,.7,.73,0,.5,oak);
  WB('W',s0+.03,s1-.03,1.885,1.9,.04,.54,glowM,root,{noCast:true});
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,s1-s0-.07,10), M(0xC9CED0,{roughness:.3,metalness:.7})); rod.rotation.x = Math.PI/2;
  { const q = XZ('W',sm,.3); rod.position.set(q[0],1.78,q[1]); root.add(rod); }
  [[-.59,0x5C6B7A],[-.49,0xE8E2D4],[-.39,0x3E4A55],[-.29,0xB8A58C],[-.19,0x6B4A33]].forEach(c => { const h = B(0,.36,0,.5,0,.03,M(c[1],{roughness:.9}),root,{noCast:true}); const q = XZ('W',c[0]-1.75,.3); h.position.set(q[0],1.52,q[1]); });
  WB('W',s0+.03,s1-.03,.73,.9,.04,.62,M(0xD2AC72,{roughness:.5}));                  // pull-out drawer tray
  WB('W',s0+.05,s1-.05,.74,.9,.62,.64,oak);
  WB('W',s0+.04,s1-.04,.9,.92,.1,.55,new THREE.MeshStandardMaterial({ color:0xE9D8B0, roughness:.1, transparent:true, opacity:.5, depthWrite:false }),root,{noCast:true});
  { const q = XZ('W',sm,.7); blob(q[0],q[1],1.1,1.2,.4); }
}

/* ---------------- west wall, south end: TV recess with yellow shelf, mini fridge, pedal bin ---------------- */
{
  const TS = 1.7, TY = 1.4, HW = .36, HH = .21, o = TS-.5;      // o = shift of the original layout along the wall
  const shell = M(0x0E0F10,{roughness:.4,metalness:.2});
  WB('W',TS-HW,TS+HW,TY-HH,TY+HH,0,.05,shell); WB('W',TS-.1,TS+.1,TY-.06,TY+.06,.05,.07,dark,root,{noCast:true});
  const scr = canvasTex(512,288,(g,w,h) => {
    const gr = g.createLinearGradient(0,0,w,h); gr.addColorStop(0,'#1A1E22'); gr.addColorStop(1,'#050607'); g.fillStyle = gr; g.fillRect(0,0,w,h);
    const rf = g.createLinearGradient(0,h,w*.8,0); rf.addColorStop(0,'rgba(255,255,255,0)'); rf.addColorStop(.5,'rgba(255,255,255,.08)'); rf.addColorStop(.62,'rgba(255,255,255,0)');
    g.fillStyle = rf; g.fillRect(0,0,w,h);
  });
  { const p = WP('W',TS,TY,.052,(HW-.012)*2,(HH-.012)*2,new THREE.MeshStandardMaterial({ map:scr, roughness:.1, metalness:.3 }),root); p.receiveShadow = true; }
  // floating pale-yellow shelf (water bottles + remote) and a wall socket
  WB('W',.15+o,1.1+o,.8,.84,0,.3,M(0xE9D87F,{roughness:.6}));
  [.85,.92].forEach(s => { const q = XZ('W',s+o,.2); cyl(.03,.03,.2,M(0xDDEFF5,{roughness:.2,transparent:true,opacity:.8}),q[0],.94,q[1],root,10); });
  WB('W',.27+o,.37+o,.845,.855,.12,.2,M(0xE8E8E6,{roughness:.5}),root,{noCast:true});
  WB('W',.97+o,1.07+o,.95,1.05,0,.02,M(0xEDEDEA,{roughness:.5}),root,{noCast:true});
  // silver mini fridge below the shelf and a steel pedal bin beside it
  { const q = XZ('W',.7+o,.28); rbox(.5,.5,.46,.03,.02,M(0xB9BEC0,{roughness:.35,metalness:.35}),q[0],.27,q[1]); }
  { const q = XZ('W',.33+o,.2); cyl(.1,.09,.28,M(0xC9CED0,{roughness:.3,metalness:.7}),q[0],.16,q[1],root,16); }
  { const q = XZ('W',.6+o,.5); blob(q[0],q[1],1.0,1.1,.35); }
}
