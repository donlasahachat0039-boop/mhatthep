# 🚀 Quick Start Guide - VPS Deployment

## ข้อมูล VPS ของคุณ

| ข้อมูล | ค่า |
|------|-----|
| IP Address | 150.95.84.201 |
| Username | root |
| Password | Laline1812@ |
| Domain | เอ็มหัตถ์เทพ.com |
| DNS | ตั้งค่าแล้ว (A record ชี้ไปที่ 150.95.84.201) |

## ขั้นตอนการ Deploy (5 นาที)

### Step 1: SSH เข้า VPS

```bash
ssh root@150.95.84.201
# Password: Laline1812@
```

### Step 2: Download Deploy Script

```bash
cd /tmp
wget https://raw.githubusercontent.com/donlasahachat0039-boop/mhatthep/main/vps-deploy.sh
chmod +x vps-deploy.sh
```

### Step 3: รัน Deploy Script

```bash
./vps-deploy.sh
```

Script จะทำการ:
- ✅ สร้าง User ใหม่ (mhatthep)
- ✅ ติดตั้ง Node.js, pnpm, PM2, Nginx
- ✅ Clone Repository จาก GitHub
- ✅ Install dependencies และ build project
- ✅ ตั้งค่า Nginx reverse proxy
- ✅ Start PM2 application server

**เวลา: ~5-10 นาที**

### Step 4: Setup SSL Certificate

หลังจาก script เสร็จ รัน:

```bash
sudo certbot --nginx -d เอ็มหัตถ์เทพ.com -d www.เอ็มหัตถ์เทพ.com
```

ตอบคำถาม:
- Email: ใส่ email ของคุณ
- Agree to terms: `y`
- Share email: `n` (หรือ `y` ตามต้องการ)
- Redirect HTTP to HTTPS: `2` (Yes)

**เวลา: ~2 นาที**

### Step 5: ตรวจสอบสถานะ

```bash
# ตรวจสอบ PM2
pm2 status
pm2 logs mhatthep

# ตรวจสอบ Nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

## ✅ เสร็จแล้ว!

เข้าชมเว็บไซต์ของคุณ:
- **Homepage**: https://เอ็มหัตถ์เทพ.com
- **Admin Panel**: https://เอ็มหัตถ์เทพ.com/admin

## 📋 Troubleshooting

### ❌ PM2 ไม่ start

```bash
# ดู error logs
pm2 logs mhatthep

# Restart PM2
pm2 restart mhatthep

# Kill และ start ใหม่
pm2 kill
cd /home/mhatthep/app
sudo -u mhatthep pm2 start ecosystem.config.js
```

### ❌ Nginx error

```bash
# ตรวจสอบ syntax
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# ดู error logs
sudo tail -f /var/log/nginx/error.log
```

### ❌ Domain ไม่ชี้ไปที่ VPS

```bash
# ตรวจสอบ DNS
nslookup เอ็มหัตถ์เทพ.com

# ตรวจสอบ A record ชี้ไปที่ 150.95.84.201
```

### ❌ SSL Certificate error

```bash
# Renew certificate
sudo certbot renew --dry-run

# Manual renew
sudo certbot renew
```

## 🔄 Update Project

เมื่อต้องการ update project:

```bash
cd /home/mhatthep/app
sudo -u mhatthep git pull origin main
sudo -u mhatthep pnpm install
sudo -u mhatthep pnpm build
pm2 restart mhatthep
```

## 📊 Monitor & Logs

### ดู PM2 Logs

```bash
# Real-time logs
pm2 logs mhatthep

# Last 100 lines
pm2 logs mhatthep --lines 100

# Error logs
pm2 logs mhatthep --err
```

### ดู Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Monitor Resources

```bash
# PM2 monitoring
pm2 monit

# System resources
top
```

## 🔐 Security Tips

### 1. Change Root Password

```bash
passwd
```

### 2. Setup Firewall

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

### 3. Backup Database

```bash
# Backup MySQL
mysqldump -u user -p database_name > /home/mhatthep/backup_$(date +%Y%m%d).sql

# Backup Supabase
# ใช้ Supabase Dashboard
```

## 📞 Support

- **Line OA**: @mhathtep
- **Email**: mhatthep@example.com
- **Website**: เอ็มหัตถ์เทพ.com

---

**Happy Deploying! 🎉**
