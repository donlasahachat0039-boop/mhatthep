#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  VPS Full Stack Deployment${NC}"
echo -e "${YELLOW}  เอ็มหัตถ์เทพ - เช่าพระเครื่อง${NC}"
echo -e "${YELLOW}========================================${NC}"

echo -e "${YELLOW}[1/12] Updating system...${NC}"
apt-get update -qq && apt-get upgrade -y -qq
echo -e "${GREEN}✓ System updated${NC}"

echo -e "${YELLOW}[2/12] Installing Node.js 22.x...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - > /dev/null 2>&1
    apt-get install -y nodejs -qq
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

echo -e "${YELLOW}[3/12] Installing pnpm...${NC}"
npm install -g pnpm -qq 2>/dev/null || npm install -g pnpm
echo -e "${GREEN}✓ pnpm installed${NC}"

echo -e "${YELLOW}[4/12] Installing PM2...${NC}"
npm install -g pm2 -qq 2>/dev/null || npm install -g pm2
echo -e "${GREEN}✓ PM2 installed${NC}"

echo -e "${YELLOW}[5/12] Installing Nginx...${NC}"
apt-get install -y nginx -qq
echo -e "${GREEN}✓ Nginx installed${NC}"

echo -e "${YELLOW}[6/12] Installing Certbot...${NC}"
apt-get install -y certbot python3-certbot-nginx -qq
echo -e "${GREEN}✓ Certbot installed${NC}"

echo -e "${YELLOW}[7/12] Creating app user...${NC}"
useradd -m -s /bin/bash mhatthep 2>/dev/null || true
mkdir -p /home/mhatthep/app/logs
chown -R mhatthep:mhatthep /home/mhatthep/app
echo -e "${GREEN}✓ User 'mhatthep' created${NC}"

echo -e "${YELLOW}[8/12] Cloning repository...${NC}"
cd /home/mhatthep/app
if [ ! -d .git ]; then
    sudo -u mhatthep git clone https://github.com/donlasahachat0039-boop/mhatthep.git . 2>&1 | tail -1
else
    sudo -u mhatthep git pull origin main -q
fi
echo -e "${GREEN}✓ Repository cloned${NC}"

echo -e "${YELLOW}[9/12] Installing dependencies...${NC}"
sudo -u mhatthep pnpm install -q
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo -e "${YELLOW}[10/12] Building project...${NC}"
sudo -u mhatthep pnpm build -q
echo -e "${GREEN}✓ Project built${NC}"

echo -e "${YELLOW}[11/12] Configuring PM2 and Nginx...${NC}"

# Create PM2 ecosystem config
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

ln -sf /etc/nginx/sites-available/mhatthep /etc/nginx/sites-enabled/mhatthep
if [ -L /etc/nginx/sites-enabled/default ]; then
    unlink /etc/nginx/sites-enabled/default
fi

nginx -t > /dev/null 2>&1
systemctl start nginx
systemctl enable nginx

echo -e "${GREEN}✓ PM2 and Nginx configured${NC}"

echo -e "${YELLOW}[12/12] Starting PM2...${NC}"
cd /home/mhatthep/app
sudo -u mhatthep pm2 start ecosystem.config.js -s
sudo -u mhatthep pm2 save
pm2 startup systemd -u mhatthep --hp /home/mhatthep > /dev/null 2>&1

echo -e "${GREEN}✓ PM2 started${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ DEPLOYMENT COMPLETE${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}📋 NEXT STEPS:${NC}"
echo ""
echo -e "${YELLOW}1. Setup SSL Certificate:${NC}"
echo "   sudo certbot --nginx -d เอ็มหัตถ์เทพ.com -d www.เอ็มหัตถ์เทพ.com"
echo ""
echo -e "${YELLOW}2. Check Status:${NC}"
echo "   pm2 status"
echo "   pm2 logs mhatthep"
echo ""
echo -e "${YELLOW}3. Seed Sample Data (Optional):${NC}"
echo "   cd /home/mhatthep/app && node seed-products.mjs"
echo ""
echo -e "${YELLOW}4. Access Website:${NC}"
echo "   Homepage: http://เอ็มหัตถ์เทพ.com (after SSL)"
echo "   Admin: http://เอ็มหัตถ์เทพ.com/admin"
echo "   Admin Password: admin123"
echo ""
echo -e "${YELLOW}5. Monitor Application:${NC}"
echo "   pm2 monit"
echo ""
