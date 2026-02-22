#!/bin/bash

# VPS Setup Script for เอ็มหัตถ์เทพ
# This script will setup the VPS with Node.js, PM2, Nginx, and SSL
# Run this script on the VPS as root

set -e

echo "=== VPS Setup for เอ็มหัตถ์เทพ ==="

# 1. Create new user
echo "1. Creating new user..."
if ! id -u mhatthep > /dev/null 2>&1; then
    useradd -m -s /bin/bash mhatthep
    echo "User 'mhatthep' created"
else
    echo "User 'mhatthep' already exists"
fi

# 2. Update system
echo "2. Updating system packages..."
apt-get update
apt-get upgrade -y

# 3. Install Node.js
echo "3. Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
apt-get install -y nodejs

# 4. Install pnpm
echo "4. Installing pnpm..."
npm install -g pnpm

# 5. Install PM2
echo "5. Installing PM2..."
npm install -g pm2

# 6. Install Nginx
echo "6. Installing Nginx..."
apt-get install -y nginx

# 7. Install Certbot for SSL
echo "7. Installing Certbot..."
apt-get install -y certbot python3-certbot-nginx

# 8. Create app directory
echo "8. Creating app directory..."
mkdir -p /home/mhatthep/app
chown -R mhatthep:mhatthep /home/mhatthep/app

# 9. Clone repository
echo "9. Cloning repository..."
cd /home/mhatthep/app
sudo -u mhatthep git clone https://github.com/donlasahachat0039-boop/mhatthep.git .

# 10. Install dependencies
echo "10. Installing dependencies..."
cd /home/mhatthep/app
sudo -u mhatthep pnpm install

# 11. Build project
echo "11. Building project..."
sudo -u mhatthep pnpm build

# 12. Create PM2 ecosystem file
echo "12. Creating PM2 ecosystem file..."
cat > /home/mhatthep/app/ecosystem.config.js << 'ECOEOF'
module.exports = {
  apps: [
    {
      name: 'mhatthep',
      script: './dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
ECOEOF

# 13. Create Nginx configuration
echo "13. Creating Nginx configuration..."
cat > /etc/nginx/sites-available/mhatthep << 'NGINXEOF'
upstream mhatthep_backend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name เอ็มหัตถ์เทพ.com www.เอ็มหัตถ์เทพ.com;

    location / {
        proxy_pass http://mhatthep_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINXEOF

# 14. Enable Nginx site
echo "14. Enabling Nginx site..."
ln -sf /etc/nginx/sites-available/mhatthep /etc/nginx/sites-enabled/mhatthep

# 15. Test Nginx configuration
echo "15. Testing Nginx configuration..."
nginx -t

# 16. Start Nginx
echo "16. Starting Nginx..."
systemctl start nginx
systemctl enable nginx

# 17. Setup SSL with Certbot
echo "17. Setting up SSL with Certbot..."
echo "Run this command manually to setup SSL:"
echo "sudo certbot --nginx -d เอ็มหัตถ์เทพ.com -d www.เอ็มหัตถ์เทพ.com"

echo "=== VPS Setup Complete ==="
echo "Next steps:"
echo "1. SSH to VPS: ssh root@150.95.84.201"
echo "2. Setup SSL: sudo certbot --nginx -d เอ็มหัตถ์เทพ.com -d www.เอ็มหัตถ์เทพ.com"
echo "3. Start PM2: cd /home/mhatthep/app && sudo -u mhatthep pm2 start ecosystem.config.js"
echo "4. Save PM2: sudo -u mhatthep pm2 save"
echo "5. Setup PM2 startup: sudo pm2 startup"
