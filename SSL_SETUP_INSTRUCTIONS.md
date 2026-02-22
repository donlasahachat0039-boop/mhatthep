# 🔒 SSL Certificate Setup Instructions

## สถานะปัจจุบัน

✅ VPS Deployment: สำเร็จ  
✅ Node.js, pnpm, PM2, Nginx: ติดตั้งเรียบร้อย  
✅ Application: รันอยู่ (2 instances)  
✅ DNS Records: แก้ไขเรียบร้อย  
⏳ DNS Propagation: กำลังดำเนินการ (5-30 นาที)  
⏳ SSL Certificate: รอ DNS propagate  

---

## ✅ ขั้นตอนการ Setup SSL Certificate

### 1️⃣ ตรวจสอบ DNS Propagation

**ใช้ Online Tool:**
- https://www.nslookup.io/
- https://mxtoolbox.com/
- ค้นหา: `เอ็มหัตถ์เทพ.com` หรือ `xn--12c1c6abc6bc6p0d.com`
- ควรได้ผลลัพธ์: `150.95.84.201`

**หรือใช้ Command Line:**
```bash
nslookup เอ็มหัตถ์เทพ.com
# หรือ
nslookup xn--12c1c6abc6bc6p0d.com
```

### 2️⃣ ทดสอบเข้าชมเว็บไซต์ผ่าน IP

```bash
curl http://150.95.84.201
# ควรได้ HTML response
```

### 3️⃣ SSH เข้า VPS

```bash
ssh root@150.95.84.201
# Password: Laline1812@
```

### 4️⃣ รัน Certbot เพื่อ Setup SSL

```bash
sudo certbot --nginx -d เอ็มหัตถ์เทพ.com -d www.เอ็มหัตถ์เทพ.com
```

**ตอบคำถาม:**

1. **Email address:**
   ```
   ใส่ email ของคุณ (เช่น: your-email@example.com)
   ```

2. **Agree to the terms of service:**
   ```
   y
   ```

3. **Share your email address with the Electronic Frontier Foundation:**
   ```
   n
   ```

4. **Please choose how to authenticate with the ACME CA:**
   ```
   1: Spin up a temporary webserver (standalone)
   2: Place files in webroot of a web server I have running on this machine
   ```
   **เลือก:** `2` (Nginx จะจัดการให้อัตโนมัติ)

5. **Redirect HTTP traffic to HTTPS:**
   ```
   1: No redirect
   2: Redirect
   ```
   **เลือก:** `2` (ใช่ ให้ redirect HTTP ไป HTTPS)

### 5️⃣ ตรวจสอบ SSL Certificate

```bash
# ตรวจสอบ Nginx status
sudo systemctl status nginx

# ดู SSL Certificate info
sudo certbot certificates

# ตรวจสอบ PM2 status
pm2 status
pm2 logs mhatthep
```

### 6️⃣ เข้าชมเว็บไซต์

```
https://เอ็มหัตถ์เทพ.com
https://www.เอ็มหัตถ์เทพ.com
```

---

## 🔄 Auto-Renewal SSL Certificate

Certbot จะตั้งค่า auto-renewal อัตโนมัติ

**ตรวจสอบ Auto-Renewal:**

```bash
# ดู renewal schedule
sudo systemctl list-timers certbot

# Test renewal (dry-run)
sudo certbot renew --dry-run
```

---

## 🆘 Troubleshooting

### ❌ DNS ยังไม่ propagate

**สาเหตุ:** DNS records เพิ่งแก้ไข ยังไม่ได้ propagate ไปทั่วโลก

**วิธีแก้:**
1. รอ 5-30 นาที
2. ตรวจสอบ DNS ด้วย https://www.nslookup.io/
3. ลองใช้ DNS server อื่น (8.8.8.8, 1.1.1.1)

### ❌ Certbot error: "No valid IP found"

**สาเหตุ:** DNS ยังไม่ propagate หรือ A record ไม่ถูกต้อง

**วิธีแก้:**
1. ตรวจสอบ DNS Records:
   ```
   @ -> 150.95.84.201
   www -> 150.95.84.201
   ```
2. รอ DNS propagate
3. ลองใหม่อีกครั้ง

### ❌ Certbot error: "Connection refused"

**สาเหตุ:** Nginx ไม่ได้รัน หรือ port 80/443 ถูก block

**วิธีแก้:**
```bash
# ตรวจสอบ Nginx
sudo systemctl status nginx

# Start Nginx
sudo systemctl start nginx

# ตรวจสอบ port 80/443
sudo netstat -tlnp | grep -E ':(80|443)'
```

### ❌ Certbot error: "Timeout during connect"

**สาเหตุ:** Firewall block port 80/443

**วิธีแก้:**
```bash
# ตรวจสอบ Firewall
sudo ufw status

# Allow port 80 และ 443
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

---

## 📋 SSL Certificate Info

**Certificate Location:**
```
/etc/letsencrypt/live/เอ็มหัตถ์เทพ.com/
```

**Nginx Configuration:**
```
/etc/nginx/sites-available/mhatthep
```

**Certbot Configuration:**
```
/etc/letsencrypt/
```

---

## ✅ หลังจาก SSL Setup เสร็จ

1. ✅ เข้าชมเว็บไซต์ผ่าน HTTPS
2. ✅ ตรวจสอบ SSL Certificate (green lock icon)
3. ✅ ทดสอบ Admin Panel
4. ✅ ทดสอบ Line OA Integration
5. ✅ Setup Google Search Console

---

## 📞 Support

- **Line OA:** @mhathtep
- **Website:** https://เอ็มหัตถ์เทพ.com
- **Admin Panel:** https://เอ็มหัตถ์เทพ.com/admin (Password: admin123)

---

**Happy SSL Setup! 🔒**

Last Updated: 2026-02-23
