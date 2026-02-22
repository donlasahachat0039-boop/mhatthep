#!/bin/bash

# VPS Deployment Script for เอ็มหัตถ์เทพ
# This script will deploy the application on VPS
# Run this script on the VPS as root

set -e

echo "=== VPS Deployment for เอ็มหัตถ์เทพ ==="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Create new user
echo -e "${YELLOW}1. Creating new user...${NC}"
if ! id -u mhatthep > /dev/null 2>&1; then
    useradd -m -s /bin/bash mhatthep
    echo -e "${GREEN}✓ User 'mhatthep' created${NC}"
else
    echo -e "${GREEN}✓ User 'mhatthep' already exists${NC}"
fi

# 2. Update system
echo -e "${YELLOW}2. Updating system packages...${NC}"
apt-get update
apt-get upgrade -y
echo -e "${GREEN}✓ System updated${NC}"

# 3. Install Node.js
echo -e "${YELLOW}3. Installing Node.js 22.x...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
    echo -e "${GREEN}✓ Node.js installed: $(node -v)${NC}"
else
    echo -e "${GREEN}✓ Node.js already installed: $(node -v)${NC}"
fi

# 4. Install pnpm
echo -e "${YELLOW}4. Installing pnpm...${NC}"
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
    echo -e "${GREEN}✓ pnpm installed: $(pnpm -v)${NC}"
else
    echo -e "${GREEN}✓ pnpm already installed: $(pnpm -v)${NC}"
fi

# 5. Install PM2
echo -e "${YELLOW}5. Installing PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    echo -e "${GREEN}✓ PM2 installed${NC}"
else
    echo -e "${GREEN}✓ PM2 already installed${NC}"
fi

# 6. Install Nginx
echo -e "${YELLOW}6. Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    apt-get install -y nginx
    echo -e "${GREEN}✓ Nginx installed${NC}"
else
    echo -e "${GREEN}✓ Nginx already installed${NC}"
fi

# 7. Install Certbot for SSL
echo -e "${YELLOW}7. Installing Certbot...${NC}"
if ! command -v certbot &> /dev/null; then
    apt-get install -y certbot python3-certbot-nginx
    echo -e "${GREEN}✓ Certbot installed${NC}"
else
    echo -e "${GREEN}✓ Certbot already installed${NC}"
fi

# 8. Create app directory
echo -e "${YELLOW}8. Creating app directory...${NC}"
mkdir -p /home/mhatthep/app
mkdir -p /home/mhatthep/app/logs
chown -R mhatthep:mhatthep /home/mhatthep/app
echo -e "${GREEN}✓ App directory created${NC}"

# 9. Clone or update repository
echo -e "${YELLOW}9. Setting up repository...${NC}"
cd /home/mhatthep/app

if [ ! -d .git ]; then
    echo "Cloning repository..."
    sudo -u mhatthep git clone https://github.com/donlasahachat0039-boop/mhatthep.git .
    echo -e "${GREEN}✓ Repository cloned${NC}"
else
    echo "Updating repository..."
    sudo -u mhatthep git pull origin main
    echo -e "${GREEN}✓ Repository updated${NC}"
fi

# 10. Install dependencies
echo -e "${YELLOW}10. Installing dependencies...${NC}"
cd /home/mhatthep/app
sudo -u mhatthep pnpm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# 11. Build project
echo -e "${YELLOW}11. Building project...${NC}"
sudo -u mhatthep pnpm build
echo -e "${GREEN}✓ Project built${NC}"

# 12. Create PM2 ecosystem file
echo -e "${YELLOW}12. Creating PM2 ecosystem file...${NC}"
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
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M'
    }
  ]
};
ECOEOF

chown mhatthep:mhatthep /home/mhatthep/app/ecosystem.config.js
echo -e "${GREEN}✓ PM2 ecosystem file created${NC}"

# 13. Create Nginx configuration
echo -e "${YELLOW}13. Creating Nginx configuration...${NC}"
cat > /etc/nginx/sites-available/mhatthep << 'NGINXEOF'
upstream mhatthep_backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name เอ็มหัตถ์เทพ.com www.เอ็มหัตถ์เทพ.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name เอ็มหัตถ์เทพ.com www.เอ็มหัตถ์เทพ.com;

    # SSL configuration (will be added by Certbot)
    # ssl_certificate /etc/letsencrypt/live/เอ็มหัตถ์เทพ.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/เอ็มหัตถ์เทพ.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
    gzip_min_length 1000;
    gzip_vary on;

    # Proxy settings
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
        proxy_buffering off;
        proxy_request_buffering off;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        proxy_pass http://mhatthep_backend;
    }
}
NGINXEOF

echo -e "${GREEN}✓ Nginx configuration created${NC}"

# 14. Enable Nginx site
echo -e "${YELLOW}14. Enabling Nginx site...${NC}"
ln -sf /etc/nginx/sites-available/mhatthep /etc/nginx/sites-enabled/mhatthep

# Remove default site if exists
if [ -L /etc/nginx/sites-enabled/default ]; then
    rm /etc/nginx/sites-enabled/default
fi

echo -e "${GREEN}✓ Nginx site enabled${NC}"

# 15. Test Nginx configuration
echo -e "${YELLOW}15. Testing Nginx configuration...${NC}"
if nginx -t; then
    echo -e "${GREEN}✓ Nginx configuration is valid${NC}"
else
    echo -e "${RED}✗ Nginx configuration error${NC}"
    exit 1
fi

# 16. Start Nginx
echo -e "${YELLOW}16. Starting Nginx...${NC}"
systemctl start nginx
systemctl enable nginx
echo -e "${GREEN}✓ Nginx started and enabled${NC}"

# 17. Setup SSL with Certbot
echo -e "${YELLOW}17. Setting up SSL Certificate...${NC}"
echo -e "${YELLOW}Please run this command manually to setup SSL:${NC}"
echo -e "${YELLOW}sudo certbot --nginx -d เอ็มหัตถ์เทพ.com -d www.เอ็มหัตถ์เทพ.com${NC}"
echo ""

# 18. Start PM2
echo -e "${YELLOW}18. Starting PM2...${NC}"
cd /home/mhatthep/app
sudo -u mhatthep pm2 start ecosystem.config.js
sudo -u mhatthep pm2 save
echo -e "${GREEN}✓ PM2 started${NC}"

# 19. Setup PM2 startup
echo -e "${YELLOW}19. Setting up PM2 startup...${NC}"
pm2 startup systemd -u mhatthep --hp /home/mhatthep
echo -e "${GREEN}✓ PM2 startup configured${NC}"

echo ""
echo -e "${GREEN}=== VPS Deployment Complete ===${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Setup SSL Certificate:"
echo "   sudo certbot --nginx -d เอ็มหัตถ์เทพ.com -d www.เอ็มหัตถ์เทพ.com"
echo ""
echo "2. Check PM2 status:"
echo "   pm2 status"
echo "   pm2 logs mhatthep"
echo ""
echo "3. Check Nginx status:"
echo "   sudo systemctl status nginx"
echo "   sudo tail -f /var/log/nginx/error.log"
echo ""
echo "4. Access your website:"
echo "   http://เอ็มหัตถ์เทพ.com (will redirect to HTTPS after SSL setup)"
echo ""
echo -e "${YELLOW}Admin Panel:${NC}"
echo "   http://เอ็มหัตถ์เทพ.com/admin"
echo ""
echo -e "${YELLOW}Support:${NC}"
echo "   Line OA: @mhathtep"
echo "   Email: mhatthep@example.com"
