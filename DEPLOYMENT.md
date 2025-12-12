# Deployment Guide - Vercel

This guide will help you deploy the GenAI Newsletter application to Vercel.

## Prerequisites

- GitHub account with repository access
- Vercel account (sign up at [vercel.com](https://vercel.com))
- PostgreSQL database (recommended: Vercel Postgres, Neon, or Supabase)
- Google Gemini API key

## Step 1: Set Up Database

### Option A: Vercel Postgres (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Storage" → "Create Database" → "Postgres"
3. Choose a name and region
4. Copy the `DATABASE_URL` connection string

### Option B: Neon (Free Tier)

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

### Option C: Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (use "Session pooler" for serverless)

## Step 2: Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the API key

## Step 3: Deploy to Vercel

### Using Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository: `Hemant5harma/GenAI-Newsletter`
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

4. Add Environment Variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `GOOGLE_API_KEY`: Your Gemini API key

5. Click "Deploy"

### Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts and add environment variables when asked
```

## Step 4: Initialize Database

After deployment, you need to push the Prisma schema to your database:

### Option A: Using Vercel CLI

```bash
# Set environment variable locally
export DATABASE_URL="your-production-database-url"

# Push schema
npx prisma db push
```

### Option B: Using Vercel Dashboard

1. Go to your project → Settings → Environment Variables
2. Ensure `DATABASE_URL` is set
3. Go to Deployments → Click on latest deployment
4. Click "..." → "Redeploy"
5. In the build logs, you should see Prisma migrations running

### Option C: Manual SQL (if needed)

You can manually run the SQL schema from Prisma:

```bash
npx prisma migrate dev --name init
```

Then copy the generated SQL and run it in your database console.

## Step 5: Verify Deployment

1. Visit your Vercel deployment URL (e.g., `your-project.vercel.app`)
2. You should see the landing page
3. Click "Get Started" or navigate to `/brands/new`
4. Create your first brand
5. Generate a test newsletter

## Environment Variables Reference

Add these in Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
GOOGLE_API_KEY=your-gemini-api-key-here
```

**Important**: Mark both as available for:
- ✅ Production
- ✅ Preview
- ✅ Development

## Troubleshooting

### Database Connection Issues

**Error**: `Can't reach database server`
- Check your `DATABASE_URL` is correct
- For Vercel Postgres, ensure you're using the pooled connection string
- For Neon/Supabase, enable connection pooling

**Fix for Neon**:
Add `?pgbouncer=true` to your connection string:
```
DATABASE_URL="postgresql://user:pass@host.neon.tech/db?pgbouncer=true"
```

### Prisma Client Issues

**Error**: `Prisma Client not generated`
- Make sure `postinstall` script runs: `"postinstall": "prisma generate"`
- Redeploy the project

**Fix**: Add to `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Build Errors

**Error**: TypeScript errors
- Run `npm run build` locally first
- Fix any type errors
- Commit and push

### API Rate Limits

**Error**: Gemini API quota exceeded
- Check your Google Cloud project quota
- Upgrade your Gemini API plan if needed

## Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate to provision (automatic)

## Monitoring

- **Logs**: Vercel Dashboard → Your Project → Deployments → View Function Logs
- **Analytics**: Enable Vercel Analytics in Settings
- **Error Tracking**: Consider adding Sentry

## Updating Deployment

All you need to do is push to GitHub:

```bash
git add .
git commit -m "Update newsletter features"
git push origin main
```

Vercel will automatically deploy the changes.

## Production Checklist

- [ ] Database is set up and accessible
- [ ] Environment variables are configured
- [ ] Prisma schema is pushed to database
- [ ] Test newsletter generation works
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled (optional)

## Support

For deployment issues:
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- GitHub Issues: Create an issue in the repository
