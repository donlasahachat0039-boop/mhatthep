# คำแนะนำการ Deploy เอ็มหัตถ์เทพ บน VPS

## ข้อมูล VPS

- **IP Address**: 150.95.84.201
- **Username**: root
- **Domain**: เอ็มหัตถ์เทพ.com
- **DNS**: ตั้งค่าแล้ว (A record ชี้ไปที่ 150.95.84.201)

## ขั้นตอน Deployment

### 1. SSH เข้า VPS

```bash
ssh root@150.95.84.201
# Password: Laline1812@
```

### 2. Download และรัน Setup Script

```bash
cd /tmp
wget https://raw.githubusercontent.com/donlasahachat0039-boop/mhatthep/main/vps-setup.sh
chmod +x vps-setup.sh
./vps-setup.sh
```

หรือ copy script จากโปรเจกต์ และรัน:

```bash
bash vps-setup.sh
```

### 3. ตั้งค่า SSL Certificate

หลังจาก setup script เสร็จ รัน:

```bash
sudo certbot --nginx -d เอ็มหัตถ์เทพ.com -d www.เอ็มหัตถ์เทพ.com
```

ตอบคำถาม:
- Email: ใส่ email ของคุณ
- Agree to terms: y
- Share email: n (หรือ y ตามต้องการ)
- Redirect HTTP to HTTPS: 2 (Yes)

### 4. ตั้งค่า Environment Variables

```bash
sudo su - mhatthep
cd /home/mhatthep/app
nano .env.production
```

ใส่ค่า:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://user:password@localhost:3306/mhatthep_db
JWT_SECRET=your-secret-key-here
VITE_APP_TITLE=เอ็มหัตถ์เทพ - เช่าพระเครื่อง พระแท้ ราคามาตรฐาน
VITE_APP_LOGO=/logo.png
```

### 5. สร้าง Database

```bash
# ถ้าใช้ Supabase ให้ทำการ setup ผ่าน Supabase Dashboard
# ถ้าใช้ MySQL ให้รัน:

mysql -u root -p << EOF
CREATE DATABASE mhatthep_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'mhatthep_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON mhatthep_db.* TO 'mhatthep_user'@'localhost';
FLUSH PRIVILEGES;
EOF
```

### 6. รัน Database Migration

```bash
cd /home/mhatthep/app
pnpm db:push
```

### 7. สตาร์ท PM2

```bash
cd /home/mhatthep/app
pm2 start ecosystem.config.js
pm2 save
sudo pm2 startup
```

### 8. ตรวจสอบสถานะ

```bash
pm2 status
pm2 logs mhatthep
```

### 9. ตรวจสอบ Nginx

```bash
sudo nginx -t
sudo systemctl status nginx
```

## ตรวจสอบ Website

เปิด browser และไปที่:
- https://เอ็มหัตถ์เทพ.com
- https://www.เอ็มหัตถ์เทพ.com

## Troubleshooting

### PM2 ไม่ start

```bash
# ดู error logs
pm2 logs mhatthep

# Restart PM2
pm2 restart mhatthep

# Kill และ start ใหม่
pm2 kill
pm2 start ecosystem.config.js
```

### Nginx error

```bash
# ตรวจสอบ syntax
sudo nginx -t

# ดู error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### Database connection error

```bash
# ตรวจสอบ DATABASE_URL ใน .env.production
cat /home/mhatthep/app/.env.production

# ทดสอบ connection
mysql -u mhatthep_user -p -h localhost mhatthep_db
```

### SSL Certificate error

```bash
# Renew certificate
sudo certbot renew --dry-run

# Manual renew
sudo certbot renew
```

## Maintenance

### Update project

```bash
cd /home/mhatthep/app
git pull origin main
pnpm install
pnpm build
pm2 restart mhatthep
```

### View logs

```bash
# PM2 logs
pm2 logs mhatthep

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Monitor resources

```bash
# PM2 monitoring
pm2 monit

# System resources
top
```

## Security

### Firewall setup

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

### Backup database

```bash
# Backup MySQL
mysqldump -u mhatthep_user -p mhatthep_db > /home/mhatthep/backup_$(date +%Y%m%d).sql

# Backup Supabase
# ใช้ Supabase Dashboard เพื่อ backup
```

## Performance Optimization

### Enable gzip compression

```bash
# Edit Nginx config
sudo nano /etc/nginx/nginx.conf

# Add under http block:
gzip on;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
gzip_min_length 1000;

# Restart Nginx
sudo systemctl restart nginx
```

### Setup caching

```bash
# Edit Nginx config to add caching headers
sudo nano /etc/nginx/sites-available/mhatthep

# Add:
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

## Monitoring

### Setup monitoring with PM2+

```bash
# Install PM2+ (optional)
pm2 install pm2-auto-pull

# Setup PM2 monitoring
pm2 web
# Access at http://localhost:9615
```

## Support

หากมีปัญหา ติดต่อ:
- Line OA: @mhathtep
- Email: mhatthep@example.com

---

**Last Updated**: 2026-02-23
