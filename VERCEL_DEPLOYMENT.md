# TechBlog Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free tier available)
- Your TechBlog code pushed to GitHub

## Step 1: Prepare for Deployment

### 1.1 Create Vercel Configuration
Create `vercel.json` in your project root (already done if exists):

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### 1.2 Update Environment Variables
Add the strong JWT secret to your `.env.local`:

```bash
JWT_SECRET=a9b21698a690997ac1bf7cccb7fd78045c474ce879785b67f6d94ac0a57560eed1ee49223db87ee64c4676048fd336aa9e81fb1969c8dfdde8a7154f8b04e3fa
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Sign in with GitHub

2. **Import Project**
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose your TechBlog repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (leave default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

4. **Add Environment Variables**
   Click "Environment Variables" and add:

   ```
   NODE_ENV = production
   NEXTAUTH_URL = https://your-project-name.vercel.app
   JWT_SECRET = a9b21698a690997ac1bf7cccb7fd78045c474ce879785b67f6d94ac0a57560eed1ee49223db87ee64c4676048fd336aa9e81fb1969c8dfdde8a7154f8b04e3fa
   MONGODB_URI = your_mongodb_atlas_connection_string
   GMAIL_USER = techtrendinnovation0@gmail.com
   GMAIL_APP_PASSWORD = your_gmail_app_password
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = your_ga_id (optional)
   NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID = your_adsense_id (optional)
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Add Environment Variables**
   ```bash
   vercel env add NODE_ENV
   vercel env add JWT_SECRET
   vercel env add MONGODB_URI
   vercel env add GMAIL_USER
   vercel env add GMAIL_APP_PASSWORD
   ```

## Step 3: Configure Custom Domain (Optional)

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables**
   - Change `NEXTAUTH_URL` to your custom domain
   - Redeploy if needed

## Step 4: Post-Deployment Setup

### 4.1 Create Admin User
Run the admin creation script on your local machine pointing to production:

```bash
# Update MONGODB_URI in .env.local to production database
node create-admin.js
```

### 4.2 Test Functionality
- Visit your deployed site
- Test login at `/admin`
- Create a test post
- Test contact form
- Test newsletter subscription

### 4.3 Monitor Performance
- Check Vercel Analytics dashboard
- Monitor function execution times
- Watch for any deployment errors

## Step 5: Continuous Deployment

Vercel automatically redeploys when you push to your main branch:

1. **Make changes locally**
2. **Commit and push to GitHub**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
3. **Vercel automatically deploys**

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript errors are fixed

2. **Environment Variables**
   - Double-check all required variables are set
   - Ensure no trailing spaces in values
   - Restart deployment after adding variables

3. **Database Connection**
   - Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
   - Check connection string format
   - Ensure database user has proper permissions

4. **Email Issues**
   - Verify Gmail app password is correct
   - Check Gmail account has 2FA enabled
   - Test email functionality locally first

## Security Notes

- Never commit `.env.local` to Git
- Use Vercel's environment variable system
- Enable Vercel's security headers
- Monitor function execution logs

## Performance Optimization

- Enable Vercel Analytics
- Use Vercel's Image Optimization
- Monitor Core Web Vitals
- Set up proper caching headers

Your TechBlog is now live on Vercel! 🚀

**Default URL**: `https://your-project-name.vercel.app`
