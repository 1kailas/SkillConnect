# SkillConnect Cloudflare Deployment Script
Write-Host "🚀 SkillConnect Cloudflare Deployment Script" -ForegroundColor Cyan
Write-Host ""

# Check if wrangler is installed
if (!(Get-Command wrangler -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Wrangler CLI not found" -ForegroundColor Red
    Write-Host "Installing wrangler globally..." -ForegroundColor Yellow
    npm install -g wrangler
}

# Login check
Write-Host "📝 Checking Cloudflare authentication..." -ForegroundColor Yellow
$loginCheck = wrangler whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Cloudflare:" -ForegroundColor Yellow
    wrangler login
}

Write-Host ""
Write-Host "✅ Authentication successful" -ForegroundColor Green
Write-Host ""

# Deploy backend
Write-Host "📦 Deploying Backend to Cloudflare Workers..." -ForegroundColor Yellow
Set-Location backend

# Check if secrets are set
Write-Host ""
Write-Host "⚠️  Make sure you have set these secrets:" -ForegroundColor Yellow
Write-Host "   - MONGODB_URI"
Write-Host "   - JWT_SECRET"
Write-Host "   - GROQ_API_KEY"
Write-Host "   - FRONTEND_URL"
Write-Host ""
$response = Read-Host "Have you set all secrets? (y/n)"
if ($response -notmatch '^[Yy]$') {
    Write-Host ""
    Write-Host "Run these commands to set secrets:" -ForegroundColor Yellow
    Write-Host "  wrangler secret put MONGODB_URI"
    Write-Host "  wrangler secret put JWT_SECRET"
    Write-Host "  wrangler secret put GROQ_API_KEY"
    Write-Host "  wrangler secret put FRONTEND_URL"
    exit 1
}

npm run deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Backend deployed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Copy your Worker URL from above" -ForegroundColor Yellow
    $workerUrl = Read-Host "Enter your Worker URL"
    
    Set-Location ../frontend
    
    # Update frontend env
    "VITE_API_URL=$workerUrl" | Out-File -FilePath .env.production -Encoding utf8
    
    Write-Host ""
    Write-Host "📦 Building Frontend..." -ForegroundColor Yellow
    npm install
    npm run build
    
    Write-Host ""
    Write-Host "🚀 Deploying Frontend to Cloudflare Pages..." -ForegroundColor Yellow
    npx wrangler pages deploy dist --project-name=skillconnect
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Frontend deployed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  Don't forget to:" -ForegroundColor Yellow
        Write-Host "1. Copy your Pages URL"
        Write-Host "2. Update FRONTEND_URL secret in backend:"
        Write-Host "   cd backend; wrangler secret put FRONTEND_URL"
        Write-Host "3. Redeploy backend: npm run deploy"
    } else {
        Write-Host "❌ Frontend deployment failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Backend deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Deployment complete!" -ForegroundColor Green
