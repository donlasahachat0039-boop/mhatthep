#!/bin/bash
set -e

echo "=== Starting VPS Deployment for เอ็มหัตถ์เทพ ==="
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}[1/10] Updating system packages...${NC}"
apt-get update && apt-get upgrade -y

echo -e "${YELLOW}[2/10] Installing Node.js 22.x...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get install -y nodejs
fi
echo -e "${GREEN}✓ Node.js: $(node -v)${NC}"

echo -e "${YELLOW}[3/10] Installing pnpm...${NC}"
npm install -g pnpm 2>/dev/null || true
echo -e "${GREEN}✓ pnpm: $(pnpm -v)${NC}"

echo -e "${YELLOW}[4/10] Installing PM2...${NC}"
npm install -g pm2 2>/dev/null || true

echo -e "${YELLOW}[5/10] Installing Nginx...${NC}"
apt-get install -y nginx

echo -e "${YELLOW}[6/10] Installing Certbot...${NC}"
apt-get install -y certbot python3-certbot-nginx

echo -e "${YELLOW}[7/10] Creating app user and directory...${NC}"
useradd -m -s /bin/bash mhatthep 2>/dev/null || true
mkdir -p /home/mhatthep/app/logs
chown -R mhatthep:mhatthep /home/mhatthep/app

echo -e "${YELLOW}[8/10] Cloning repository...${NC}"
cd /home/mhatthep/app
if [ ! -d .git ]; then
    sudo -u mhatthep git clone https://github.com/donlasahachat0039-boop/mhatthep.git .
else
    sudo -u mhatthep git pull origin main
fi

echo -e "${YELLOW}[9/10] Installing dependencies and building...${NC}"
sudo -u mhatthep pnpm install
sudo -u mhatthep pnpm build

echo -e "${YELLOW}[10/10] Setting up PM2 and Nginx...${NC}"

# Create ecosystem.config.js
cat > /home/mhatthep/app/ecosystem.config.js << 'ECOEOF'
module.exports = {
  apps: [{
    name: 'mhatthep',
    script: './dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: { NODE_ENV: 'production', PORT: 3000 },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    autorestart: true,
    max_memory_restart: '500M'
  }]
};
ECOEOF

chown mhatthep:mhatthep /home/mhatthep/app/ecosystem.config.js

# Create Nginx config
cat > /etc/nginx/sites-available/mhatthep << 'NGINXEOF'
upstream mhatthep_backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name เอ็มหัตถ์เทพ.com www.เอ็มหัตถ์เทพ.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name เอ็มหัตถ์เทพ.com www.เอ็มหัตถ์เทพ.com;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
    gzip_min_length 1000;

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

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        proxy_pass http://mhatthep_backend;
    }
}
NGINXEOF

# Enable Nginx site
ln -sf /etc/nginx/sites-available/mhatthep /etc/nginx/sites-enabled/mhatthep
if [ -L /etc/nginx/sites-enabled/default ]; then
    unlink /etc/nginx/sites-enabled/default
fi

# Test and start Nginx
nginx -t
systemctl start nginx
systemctl enable nginx

# Start PM2
cd /home/mhatthep/app
sudo -u mhatthep pm2 start ecosystem.config.js
sudo -u mhatthep pm2 save
pm2 startup systemd -u mhatthep --hp /home/mhatthep

echo ""
echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo ""
echo -e "${YELLOW}Next: Setup SSL Certificate${NC}"
echo "sudo certbot --nginx -d เอ็มหัตถ์เทพ.com -d www.เอ็มหัตถ์เทพ.com"
echo ""
echo -e "${YELLOW}Check Status:${NC}"
echo "pm2 status"
echo "pm2 logs mhatthep"
echo ""
echo -e "${YELLOW}Website:${NC}"
echo "http://เอ็มหัตถ์เทพ.com (after SSL)"
echo "Admin: http://เอ็มหัตถ์เทพ.com/admin (Password: admin123)"
