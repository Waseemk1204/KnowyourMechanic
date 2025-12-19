# Vercel Deployment Guide

This guide covers deploying the KnowyourMechanic application to Vercel.

## Architecture

- **Frontend**: React + Vite SPA (Static Site)
- **Backend**: Express.js API (Serverless Functions)

## Prerequisites

1. Vercel account ([vercel.com](https://vercel.com))
2. GitHub repository connected to Vercel
3. MongoDB Atlas account (or MongoDB instance)
4. Firebase project (for authentication)
5. Razorpay account (for payments)

## Required Environment Variables

### Frontend Environment Variables

Create these in the Vercel dashboard for your frontend project:

| Variable Name | Description | Example |
|--------------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-backend.vercel.app` |
| `VITE_FIREBASE_API_KEY` | Firebase API key | From Firebase console |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `your-app.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `your-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `your-app.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | From Firebase console |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | From Firebase console |

### Backend Environment Variables

Create these in the Vercel dashboard for your backend project:

| Variable Name | Description | Example |
|--------------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | Random secure string (32+ chars) |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-app.vercel.app` |
| `RAZORPAY_KEY_ID` | Razorpay API key ID | From Razorpay dashboard |
| `RAZORPAY_KEY_SECRET` | Razorpay API key secret | From Razorpay dashboard |
| `FIREBASE_ADMIN_PROJECT_ID` | Firebase project ID | Same as frontend |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Firebase service account email | From Firebase service account JSON |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Firebase service account private key | From Firebase service account JSON |
| `NODE_ENV` | Environment (set to "production") | `production` |
| `OTP_MODE` | OTP mode (firebase or mock) | `firebase` |

## Deployment Steps

### 1. Deploy Backend First

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your repository
3. **Configure for backend:**
   - **Root Directory**: `server`
   - **Framework Preset**: Other
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
4. Add all backend environment variables
5. Click **Deploy**
6. Copy the deployed URL (you'll need it for the frontend)

### 2. Deploy Frontend

1. Go to [vercel.com/new](https://vercel.com/new) again
2. Import the same repository
3. **Configure for frontend:**
   - **Root Directory**: Leave as root (`.`)
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add all frontend environment variables
   - **Important**: Set `VITE_API_URL` to your backend URL from step 1
5. Click **Deploy**

## Post-Deployment Setup

### Update Firebase Configuration

1. Go to Firebase Console → Authentication → Settings
2. Add your Vercel domains to **Authorized domains**:
   - `your-app.vercel.app`
   - `your-backend.vercel.app`

### Update Razorpay Configuration

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-backend.vercel.app/api/payments/webhook`
3. Select events to listen to

### Update CORS Settings

1. Verify `FRONTEND_URL` in backend environment variables matches your deployed frontend URL
2. If you have a custom domain, update this variable accordingly

## Testing the Deployment

1. **Health Check**: Visit `https://your-backend.vercel.app/api/health`
   - Should return: `{"status":"ok","timestamp":"...","env":"production"}`

2. **Frontend**: Visit `https://your-app.vercel.app`
   - Test user registration/login
   - Test service browsing
   - Test garage features

## Troubleshooting

### Build Failures

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors: `npm run build` locally

### API Connection Issues

- Verify `VITE_API_URL` is set correctly in frontend
- Check backend logs in Vercel dashboard
- Ensure CORS is configured with correct frontend URL

### Database Connection Issues

- Verify `MONGODB_URI` is correct
- Whitelist Vercel IPs in MongoDB Atlas (or allow all: `0.0.0.0/0`)
- Check MongoDB connection string format

### Firebase Auth Issues

- Verify all Firebase environment variables are set
- Check authorized domains in Firebase Console
- Ensure `FIREBASE_ADMIN_PRIVATE_KEY` includes full key with `\n` characters

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update environment variables with new domain

## Monitoring

- **Vercel Dashboard**: Monitor deployment status, logs, and analytics
- **Error Tracking**: Consider adding Sentry or similar
- **Uptime Monitoring**: Use services like UptimeRobot

## Local Development

To run locally with environment variables:

```bash
# Frontend
npm run dev

# Backend
cd server
npm run dev
```

Create `.env` files locally (these are in `.gitignore`):

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your-key
# ... other Firebase vars
```

**Backend `server/.env`:**
```env
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret
FRONTEND_URL=http://localhost:5173
# ... other vars
```

## Important Notes

- Never commit `.env` files to Git
- Keep `JWT_SECRET` and API keys secure
- Regularly rotate sensitive credentials
- Monitor usage and costs in Vercel dashboard
- Set up billing alerts in Vercel settings
