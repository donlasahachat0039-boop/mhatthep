# เอ็มหัตถ์เทพ - Project TODO

## Phase 1: โครงสร้างพื้นฐาน
- [x] สร้างโครงสร้างไฟล์และ Component ทั้งหมด
- [x] ตั้งค่า Tailwind CSS โทนสีขาว-ครีม-ทอง
- [x] สร้าง Layout หลัก (Header, Footer, Navigation)
- [x] ตั้งค่า Supabase และสร้าง Database Schema

## Phase 2: หน้าแรก (Homepage) - SEO Focused
- [x] สร้างหน้าแรกแสดงรายการพระเครื่อง Grid Layout
- [x] เพิ่ม Meta Tags (Title, Description, Keywords, OG Tags)
- [x] เขียน JSON-LD Schema (Product, ItemList, Organization)
- [x] ใช้ Semantic HTML (<h1>, <article>, <footer>)
- [x] เพิ่ม Image Optimization (ใช้ img tag + alt text)
- [x] เพิ่มปุ่ม 'เช่าบูชา' ลิงก์ไปยัง Line OA
- [ ] ทดสอบ SEO ด้วย Google Search Console

## Phase 3: หน้า Admin
- [x] สร้างหน้า Admin Dashboard
- [x] สร้างฟอร์มเพิ่มพระเครื่อง (Add Product) - UI เสร็จแล้ว
- [x] สร้างฟอร์มแก้ไขพระเครื่อง (Edit Product) - UI เสร็จแล้ว
- [x] สร้างฟังก์ชันลบพระเครื่อง (Delete Product) - UI เสร็จแล้ว
- [x] เพิ่มระบบรหัสผ่าน Admin (Password Protection)
- [ ] เพิ่มระบบ Upload รูปภาพ

## Phase 4: ระบบฐานข้อมูล
- [x] สร้าง Table Products ใน Supabase
- [x] สร้าง API Endpoint สำหรับ CRUD Products (List, GetById)
- [x] เขียน Vitest สำหรับ API Endpoints
- [ ] ตั้งค่า Storage สำหรับรูปภาพ (S3/Supabase Storage)

## Phase 5: ฟีเจอร์เพิ่มเติม
- [ ] เพิ่ม Search/Filter ฟังก์ชัน
- [ ] เพิ่ม Pagination สำหรับรายการพระเครื่อง
- [ ] เพิ่ม Contact Form
- [ ] เพิ่ม About Us Section
- [ ] เพิ่ม Testimonials/Reviews

## Phase 6: SEO & Performance
- [x] สร้าง robots.txt
- [x] สร้าง sitemap.xml
- [x] เพิ่ม Structured Data (Schema.org) - JSON-LD
- [ ] ทดสอบ Mobile Responsiveness
- [ ] ทดสอบ Page Speed (Core Web Vitals)
- [ ] เพิ่ม Canonical Tags

## Phase 7: GitHub & Deployment
- [ ] Push โค้ดขึ้น GitHub Repository
- [ ] ตั้งค่า Environment Variables
- [ ] สร้าง .env.example
- [ ] เขียน README.md พร้อมคำแนะนำการติดตั้ง

## Phase 8: VPS Deployment
- [ ] สร้าง User ใหม่บน VPS
- [ ] ติดตั้ง Node.js, PM2, Nginx
- [ ] ตั้งค่า SSL Certificate (Let's Encrypt)
- [ ] Deploy โปรเจกต์บน VPS
- [ ] ทดสอบ Production Environment
- [ ] ตั้งค่า Domain Pointing

## Phase 9: Testing & QA
- [ ] ทดสอบทั้ง Desktop และ Mobile
- [ ] ทดสอบ Admin Panel
- [ ] ทดสอบ Line OA Integration
- [ ] ทดสอบ SEO (Google Search Console)
- [ ] ทดสอบ Performance

## Phase 10: Final Delivery
- [ ] สร้าง Checkpoint สำหรับ Production
- [ ] รายงานผลและส่งมอบเว็บไซต์
- [ ] เขียนคำแนะนำการใช้งาน
