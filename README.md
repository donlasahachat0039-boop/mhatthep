# เอ็มหัตถ์เทพ - ร้านเช่าพระเครื่อง

เว็บไซต์ร้านเช่าพระเครื่องพระแท้ ราคามาตรฐาน สร้างด้วย Next.js 14, Tailwind CSS, Supabase และ tRPC

## ✨ ฟีเจอร์

- **หน้าแรก (Homepage)**: แสดงรายการพระเครื่องแบบ Grid พร้อมรูปภาพ ชื่อ ราคา และสถานะ
- **SEO Optimization**: Meta Tags ครบถ้วน JSON-LD Schema สำหรับ Product และ ItemList
- **Semantic HTML**: ใช้ `<h1>`, `<article>`, `<footer>` เพื่อการค้นหาที่ดีขึ้น
- **Admin Panel**: หน้าเรียบๆ สำหรับเพิ่ม/ลบ/แก้ไข ข้อมูลพระเครื่อง พร้อมระบบรหัสผ่าน
- **ดีไซน์ Minimal**: โทนสีขาว-ครีม-ทอง ให้ความรู้สึกสงบ สง่างาม
- **Responsive Design**: รองรับการใช้งานบนมือถือได้อย่างสมบูรณ์
- **Line OA Integration**: ปุ่ม 'เช่าบูชา' ลิงก์ไปยัง Line OA (@mhathtep)

## 🛠️ เทคโนโลยี

- **Frontend**: React 19, Tailwind CSS 4, TypeScript
- **Backend**: Express 4, tRPC 11, Node.js
- **Database**: MySQL/Supabase, Drizzle ORM
- **Authentication**: Manus OAuth
- **Testing**: Vitest
- **Build Tool**: Vite

## 📋 ข้อกำหนด

- Node.js 22.x หรือสูงกว่า
- pnpm 10.x หรือสูงกว่า
- MySQL/Supabase Database

## 🚀 การติดตั้ง

### 1. Clone Repository

```bash
git clone https://github.com/donlasahachat0039-boop/mhatthep.git
cd mhatthep
```

### 2. ติดตั้ง Dependencies

```bash
pnpm install
```

### 3. ตั้งค่า Environment Variables

```bash
cp .env.example .env.local
```

แล้วแก้ไข `.env.local` ด้วยค่า Configuration ของคุณ

### 4. ตั้งค่า Database

```bash
pnpm db:push
```

### 5. รัน Development Server

```bash
pnpm dev
```

เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

## 📁 โครงสร้างโปรเจกต์

```
mhatthep-web/
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── lib/              # Utilities
│   │   └── index.css         # Global styles
│   └── public/               # Static assets
├── server/                    # Backend (Express + tRPC)
│   ├── routers.ts            # tRPC procedures
│   ├── db.ts                 # Database queries
│   └── _core/                # Core server logic
├── drizzle/                   # Database schema & migrations
├── shared/                    # Shared types & constants
└── package.json
```

## 🔐 Admin Panel

เข้าถึง Admin Panel ที่ `/admin` พร้อมรหัสผ่าน (ค่าเริ่มต้น: `admin123`)

**ฟีเจอร์:**
- เพิ่มพระเครื่องใหม่
- แก้ไขข้อมูลพระเครื่อง
- ลบพระเครื่อง
- ดูรายการพระเครื่องทั้งหมด

## 🧪 Testing

รัน Vitest tests:

```bash
pnpm test
```

## 🏗️ Build

Build สำหรับ Production:

```bash
pnpm build
```

รัน Production build:

```bash
pnpm start
```

## 📊 SEO

เว็บไซต์มี SEO Optimization ดังนี้:

- **Meta Tags**: Title, Description, Keywords, Open Graph Tags
- **JSON-LD Schema**: Product และ ItemList schemas สำหรับ Rich Snippets
- **Semantic HTML**: ใช้ `<h1>`, `<article>`, `<footer>` tags
- **Image Optimization**: Alt text สำหรับทุกรูปภาพ
- **robots.txt**: กำหนด crawling rules
- **sitemap.xml**: แสดง URL structure

## 🔗 Line OA Integration

ปุ่ม 'เช่าบูชา' ลิงก์ไปยัง Line OA:
- **Line ID**: @mhathtep
- **URL**: https://line.me/ti/p/@mhathtep

## 📝 Keyword Strategy

**Keyword หลัก:**
- เช่าพระ
- เอ็มหัตถ์เทพ
- ปล่อยเช่าพระเครื่อง

**Keyword รอง:**
- หลวงปู่โต๊ะ วัดประดู่ฉิมพลี
- เช่าบูชา
- พระเครื่องพระแท้

## 🚀 Deployment

### VPS Deployment

ใช้ script `vps-setup.sh` เพื่อ setup VPS:

```bash
chmod +x vps-setup.sh
./vps-setup.sh
```

Script จะ:
1. สร้าง User ใหม่ (`mhatthep`)
2. ติดตั้ง Node.js, pnpm, PM2
3. ติดตั้ง Nginx
4. ติดตั้ง Certbot สำหรับ SSL
5. Clone repository และ build project
6. ตั้งค่า PM2 ecosystem

### Manual Setup

```bash
# SSH to VPS
ssh root@150.95.84.201

# Run setup script
bash vps-setup.sh

# Setup SSL
sudo certbot --nginx -d เอ็มหัตถ์เทพ.com -d www.เอ็มหัตถ์เทพ.com

# Start PM2
cd /home/mhatthep/app
sudo -u mhatthep pm2 start ecosystem.config.js
sudo -u mhatthep pm2 save
sudo pm2 startup
```

## 📞 ติดต่อ

- **Line OA**: @mhathtep
- **โดเมน**: เอ็มหัตถ์เทพ.com
- **Email**: mhatthep@example.com

## 📄 License

MIT License

## 👨‍💻 Developer

สร้างโดย Manus Team

---

**หมายเหตุ**: โปรเจกต์นี้ใช้ Manus Platform สำหรับ OAuth, Storage, และ Built-in APIs
