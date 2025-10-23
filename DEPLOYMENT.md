# 🚀 Deployment Guide for Sunrise Chat

## Quick Deploy Options

### 🌟 **Option 1: Vercel (Recommended - Easiest)**

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables:**
   - Go to your Vercel dashboard
   - Add `OPENAI_API_KEY` in Settings > Environment Variables
   - Redeploy

### 🌐 **Option 2: Netlify + Railway**

**Frontend (Netlify):**
1. Connect your GitHub repo to Netlify
2. Build command: `cd frontend && npm run build`
3. Publish directory: `frontend/build`

**Backend (Railway):**
1. Connect your GitHub repo to Railway
2. Set root directory to `backend`
3. Add environment variable: `OPENAI_API_KEY`

### 🚂 **Option 3: Railway (Full-stack)**

1. Connect your GitHub repo to Railway
2. Set environment variables:
   - `OPENAI_API_KEY=your_key_here`
   - `NODE_ENV=production`
3. Railway will auto-deploy

### 🐳 **Option 4: Docker (Any platform)**

Create a Dockerfile:

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN cd frontend && npm install && npm run build

EXPOSE 5000
CMD ["npm", "run", "start:prod"]
```

## 🔧 **Pre-deployment Checklist**

### 1. **Fix the background image path:**
```css
/* In frontend/src/index.css */
background: url('/sean-oulashin-KMn4VEeEPR8-unsplash.jpg') center/cover no-repeat;
```

### 2. **Update API URLs for production:**
```javascript
// In frontend/src/App.js, change:
const response = await fetch('/api/chat', {
  // to:
const response = await fetch('https://your-backend-url.com/api/chat', {
```

### 3. **Environment Variables:**
- `OPENAI_API_KEY` - Your OpenAI API key
- `NODE_ENV=production`
- `PORT=5000` (or let the platform choose)

### 4. **Build the frontend:**
```bash
cd frontend && npm run build
```

## 🌍 **Domain & SSL**

Most platforms provide:
- ✅ Automatic SSL certificates
- ✅ Custom domain support
- ✅ CDN for fast loading

## 📊 **Monitoring**

Add these for production monitoring:
- **Uptime monitoring**: UptimeRobot, Pingdom
- **Error tracking**: Sentry
- **Analytics**: Google Analytics

## 🔒 **Security for Production**

1. **Rate limiting** (already implemented)
2. **CORS configuration** (already implemented)
3. **Input validation** (already implemented)
4. **Environment variables** (never commit .env files)

## 💰 **Cost Estimates**

- **Vercel**: Free tier (100GB bandwidth/month)
- **Netlify**: Free tier (100GB bandwidth/month)
- **Railway**: $5/month for backend
- **OpenAI API**: Pay-per-use (~$0.002 per message)

## 🚀 **Quick Start Commands**

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod
```

---

**Recommended**: Start with **Vercel** for the easiest deployment experience!
