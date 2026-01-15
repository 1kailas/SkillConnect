#!/bin/bash

echo "🚀 SkillConnect Cloudflare Deployment Script"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ Wrangler CLI not found${NC}"
    echo "Installing wrangler globally..."
    npm install -g wrangler
fi

# Login check
echo -e "${YELLOW}📝 Checking Cloudflare authentication...${NC}"
if ! wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}Please login to Cloudflare:${NC}"
    wrangler login
fi

echo ""
echo -e "${GREEN}✅ Authentication successful${NC}"
echo ""

# Deploy backend
echo -e "${YELLOW}📦 Deploying Backend to Cloudflare Workers...${NC}"
cd backend

# Check if secrets are set
echo ""
echo -e "${YELLOW}⚠️  Make sure you have set these secrets:${NC}"
echo "   - MONGODB_URI"
echo "   - JWT_SECRET"
echo "   - GROQ_API_KEY"
echo "   - FRONTEND_URL"
echo ""
read -p "Have you set all secrets? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Run these commands to set secrets:"
    echo "  wrangler secret put MONGODB_URI"
    echo "  wrangler secret put JWT_SECRET"
    echo "  wrangler secret put GROQ_API_KEY"
    echo "  wrangler secret put FRONTEND_URL"
    exit 1
fi

npm run deploy

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Backend deployed successfully!${NC}"
    echo ""
    echo -e "${YELLOW}📋 Copy your Worker URL from above${NC}"
    read -p "Enter your Worker URL: " WORKER_URL
    
    cd ../frontend
    
    # Update frontend env
    echo "VITE_API_URL=$WORKER_URL" > .env.production
    
    echo ""
    echo -e "${YELLOW}📦 Building Frontend...${NC}"
    npm install
    npm run build
    
    echo ""
    echo -e "${YELLOW}🚀 Deploying Frontend to Cloudflare Pages...${NC}"
    npx wrangler pages deploy dist --project-name=skillconnect
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Frontend deployed successfully!${NC}"
        echo ""
        echo -e "${YELLOW}⚠️  Don't forget to:${NC}"
        echo "1. Copy your Pages URL"
        echo "2. Update FRONTEND_URL secret in backend:"
        echo "   cd backend && wrangler secret put FRONTEND_URL"
        echo "3. Redeploy backend: npm run deploy"
    else
        echo -e "${RED}❌ Frontend deployment failed${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Backend deployment failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
