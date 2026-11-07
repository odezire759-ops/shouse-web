# shouse-web

เว็บไฟล์สถิตของ **S.House Apartment** (ซอยสุขุมวิท 81 · BTS อ่อนนุช) — ใช้กับ LINE OA S.HOUSE (@020eftbw)
โฮสต์บน GitHub Pages: `https://<owner>.github.io/<repo>/`

| ที่อยู่ | คืออะไร |
|---|---|
| `room-3d/<key>/?lang=th\|en` | หน้า 3 มิติของแต่ละห้อง (Three.js ไฟล์เดียว) — ปุ่ม "ดูห้อง 3 มิติ" ในการ์ด LINE ชี้มาที่นี่ |
| `room-3d/fx.js` | ส่วนเสริมของปุ่ม "สมจริง" (three.js r128 post-processing, ~370 KB / ~120 KB gzip) — โหลดเมื่อลูกค้ากดปุ่มครั้งแรกเท่านั้น |
| `<key>/1.jpg … · t2.jpg …` | รูปห้องในการ์ด LINE (รูปเต็ม + รูปย่อ) |
| `building-hero.jpg` · `map-location.jpg` | รูปตึก / แผนที่ในการ์ด |

ห้อง (`key`): `std26` Standard 26 · `std31` Standard Window 31 · `dlx26` Deluxe Studio 26 · `dlx35` Deluxe Room 35

## แก้/เพิ่มหน้า 3 มิติ
ซอร์สอยู่ `src/` — `engine.tpl.html` (เอนจินกลาง) + `rooms/<key>.js` (ส่วน `//==CFG==` ค่าห้อง/มุมกล้อง/ข้อความ th-en · ส่วน `//==BUILD==` โมเดลห้อง)

    python3 src/build.py room-3d std26 std31 dlx26 dlx35     # สร้าง room-3d/<key>/index.html

หน้า 3 มิติเป็นไฟล์เดียว โหลด three.js r128 จาก cdnjs · ภาษา th/en (เมนู LINE ภาษาอื่นเปิด `?lang=en`)

## ปุ่ม "สมจริง" (Realistic mode)
ปุ่มมุมขวาบนของหน้า 3 มิติ — **ปิดเป็นค่าเริ่มต้น** (หน้าตาเดิมทุกอย่าง) ลูกค้ากดเปิดเอง: แสงแดดตามหน้าต่างจริงของห้อง เงานุ่ม เงาสะท้อนบนพื้น โทนภาพยนตร์ · กดปิดแล้วกลับเป็นแบบเดิมเป๊ะ · เครื่องจำค่าที่เลือกไว้ (`localStorage sh-real`) · `?real=1` / `?real=0` บังคับเปิด/ปิด · `?q=1|2|3` บังคับระดับคุณภาพ (ปกติเลือกตามเครื่อง: ประหยัด/สมดุล/สูงสุด และลดเองถ้าเฟรมช้า)
- โค้ดอยู่ `src/real.js` (ใส่เข้าเอนจินตอน build ที่จุด `//==REAL==`) · ใช้ได้กับทุกห้องโดยไม่ต้องแก้ `rooms/<key>.js` (ตรวจหาหน้าต่าง/พื้น/แสงจากฉากเอง)
- `python3 src/build.py room-3d …` จะคัดลอก `src/vendor/three-r128-fx.js` → `room-3d/fx.js` ให้ด้วย — **commit `room-3d/fx.js` พร้อมหน้าห้องเสมอ** ไม่งั้นปุ่มจะขึ้นข้อความ "เปิดโหมดสมจริงไม่ได้" (หน้าห้องยังใช้ปกติ)
- three.js ต้องเป็น r128 ตรงกับ `fx.js` — ถ้าอัปเกรด three ต้องทำ bundle ใหม่จาก examples ของเวอร์ชันนั้น

## เพิ่มห้องใหม่ (ลำดับสำคัญ)
1. เพิ่ม `src/rooms/<key>.js` → build → commit/push → รอ Pages ขึ้น
2. แล้วค่อยใส่ `<key>` ใน `ROOM_3D_KEYS` (repo jresidence-v3 · `supabase/functions/_shared/shouseFlexCompact.ts`) และ deploy `line-webhook-shouse`
   (สลับลำดับ = ลูกค้ากดแล้วเจอ 404)

## ตั้งค่า Pages
Settings → Pages → Source: **Deploy from a branch** → Branch: `main` · Folder: `/ (root)` · ไฟล์ `.nojekyll` ต้องมี

