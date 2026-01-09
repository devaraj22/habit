# Deployment to Vercel

## Prerequisites
1. **Vercel Account** - Sign up at https://vercel.com
2. **GitHub Connection** - Your repository is already at https://github.com/devaraj22/habit

## Step-by-Step Deployment

### 1. Connect to Vercel
- Go to https://vercel.com/dashboard
- Click "Add New..." → "Project"
- Select "Import Git Repository"
- Find and select `devaraj22/habit`
- Click "Import"

### 2. Configure Environment Variables
In the Vercel dashboard, go to **Settings** → **Environment Variables** and add:

```
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=production
```

### 3. Project Settings
- **Framework Preset**: React
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### 4. Deploy
- Click "Deploy"
- Wait for build to complete (~3-5 minutes)
- Your app will be live at `https://your-project-name.vercel.app`

## API Endpoints on Vercel
Your backend API will be available at:
- `https://your-project-name.vercel.app/api/auth/login`
- `https://your-project-name.vercel.app/api/auth/register`
- `https://your-project-name.vercel.app/api/habits`
- `https://your-project-name.vercel.app/api/weekly-habits`

## Troubleshooting
- Check **Deployments** tab for build logs
- Verify environment variables are set
- Check **Functions** to ensure serverless functions are deployed

## Update Frontend API URL
In `src/api.js` or where you make API calls, update the base URL:

```javascript
const API_BASE_URL = 'https://your-project-name.vercel.app/api';
```
