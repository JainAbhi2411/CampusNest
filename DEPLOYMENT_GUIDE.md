# CampusNest Deployment Guide

## Architecture Overview

**CampusNest uses a modern JAMstack architecture:**
- **Frontend**: React + TypeScript + Vite (Static Site)
- **Backend**: Supabase (Fully managed cloud service)
  - PostgreSQL Database
  - Authentication
  - Storage
  - Edge Functions
  - Real-time subscriptions

**Important**: You don't need a separate backend server like Render because Supabase provides all backend functionality as a managed service.

---

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- npm or pnpm package manager
- Git installed
- A Supabase account (free tier available)
- A Netlify account (free tier available)

---

## Part 1: Local Development Setup

### Step 1: Clone and Install Dependencies

```bash
# Navigate to project directory
cd /workspace/app-7xyosp4kpcld

# Install dependencies (if not already installed)
pnpm install
# or
npm install
```

### Step 2: Set Up Supabase

1. **Create a Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Fill in project details:
     - Name: CampusNest
     - Database Password: (create a strong password)
     - Region: (choose closest to your users)

2. **Get Your Supabase Credentials**
   - Go to Project Settings > API
   - Copy:
     - Project URL (e.g., `https://xxxxx.supabase.co`)
     - Anon/Public Key (starts with `eyJ...`)

3. **Run Database Migrations**
   - Go to SQL Editor in Supabase Dashboard
   - Run each migration file in order from `supabase/migrations/` folder
   - Start with `00001_*.sql` and go sequentially to `00015_*.sql`

### Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```bash
# .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_ID=campusnest-local
VITE_API_ENV=development
```

**Replace with your actual Supabase credentials!**

### Step 4: Run the Application Locally

```bash
# Development server
npm run dev
# or
pnpm dev

# The app will be available at http://localhost:5173
```

### Step 5: Create Admin Account (Optional)

To access admin features:

1. Register a new account through the UI
2. Go to Supabase Dashboard > Authentication > Users
3. Find your user and copy the UUID
4. Go to SQL Editor and run:

```sql
UPDATE profiles 
SET role = 'admin'::user_role 
WHERE id = 'your-user-uuid-here';
```

---

## Part 2: Netlify Deployment (Frontend)

### Option A: Deploy via Netlify UI (Recommended for Beginners)

1. **Push Code to GitHub**
   ```bash
   # If not already on GitHub
   git remote add origin https://github.com/yourusername/campusnest.git
   git push -u origin master
   ```

2. **Connect to Netlify**
   - Go to https://netlify.com
   - Click "Add new site" > "Import an existing project"
   - Choose "GitHub" and authorize
   - Select your repository

3. **Configure Build Settings**
   - Build command: `npm run build` or `pnpm build`
   - Publish directory: `dist`
   - Click "Show advanced" > "New variable" to add environment variables:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
     - `VITE_APP_ID`: `campusnest-production`
     - `VITE_API_ENV`: `production`

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `https://random-name.netlify.app`

5. **Custom Domain (Optional)**
   - Go to Site settings > Domain management
   - Add your custom domain
   - Follow DNS configuration instructions

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Netlify Site**
   ```bash
   netlify init
   ```

4. **Set Environment Variables**
   ```bash
   netlify env:set VITE_SUPABASE_URL "https://your-project.supabase.co"
   netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key"
   netlify env:set VITE_APP_ID "campusnest-production"
   netlify env:set VITE_API_ENV "production"
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Netlify Configuration File

A `netlify.toml` file has been created in your project root with optimal settings for React Router and performance.

---

## Part 3: Backend Setup (Supabase - Already Cloud Hosted!)

**Important**: Supabase is your backend and it's already cloud-hosted. You don't need Render or any other backend hosting service.

### What Supabase Provides:

1. **Database**: PostgreSQL with automatic backups
2. **API**: Auto-generated REST and GraphQL APIs
3. **Authentication**: User management and auth flows
4. **Storage**: File uploads and CDN
5. **Edge Functions**: Serverless functions (if needed)
6. **Real-time**: WebSocket subscriptions

### Supabase Production Setup:

1. **Database is Already Live**
   - Your migrations created all tables
   - Data is automatically backed up
   - Scales automatically

2. **Configure Row Level Security (RLS)**
   - Already configured in migrations
   - Policies control data access
   - No additional setup needed

3. **Set Up Storage Buckets (If Using File Uploads)**
   - Go to Storage in Supabase Dashboard
   - Buckets are created via migrations
   - Configure CORS if needed

4. **Monitor Usage**
   - Go to Supabase Dashboard > Settings > Usage
   - Free tier includes:
     - 500 MB database space
     - 1 GB file storage
     - 2 GB bandwidth
     - 50,000 monthly active users

5. **Upgrade Plan (When Needed)**
   - Pro plan: $25/month
   - Includes more resources and support

---

## Part 4: Environment Variables Reference

### Development (.env)
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_APP_ID=campusnest-local
VITE_API_ENV=development
```

### Production (Netlify Environment Variables)
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_APP_ID=campusnest-production
VITE_API_ENV=production
```

**Security Notes:**
- Never commit `.env` file to Git (already in .gitignore)
- Use the same Supabase project for both dev and production, or create separate projects
- The anon key is safe to expose (it's public)
- Never expose the service_role key

---

## Part 5: Post-Deployment Checklist

### After Deploying to Netlify:

- [ ] Test all pages load correctly
- [ ] Test user registration and login
- [ ] Test property search and filtering
- [ ] Test property comparison feature
- [ ] Test booking functionality
- [ ] Test admin panel (if applicable)
- [ ] Verify images load correctly
- [ ] Test on mobile devices
- [ ] Check browser console for errors
- [ ] Test all forms and validations

### Supabase Configuration:

- [ ] All migrations applied successfully
- [ ] RLS policies are active
- [ ] Storage buckets created (if needed)
- [ ] Authentication providers configured
- [ ] Email templates customized (optional)
- [ ] Database backups enabled (automatic on paid plans)

### Performance Optimization:

- [ ] Enable Netlify CDN (automatic)
- [ ] Configure caching headers
- [ ] Optimize images (use WebP format)
- [ ] Enable Gzip compression (automatic on Netlify)
- [ ] Set up monitoring (Netlify Analytics)

---

## Part 6: Continuous Deployment

### Automatic Deployments:

Once connected to GitHub, Netlify will automatically:
1. Deploy when you push to the main/master branch
2. Create preview deployments for pull requests
3. Run build checks before deploying
4. Rollback if deployment fails

### Manual Deployments:

```bash
# Deploy to production
netlify deploy --prod

# Create a preview deployment
netlify deploy
```

---

## Part 7: Monitoring and Maintenance

### Netlify Monitoring:

1. **Build Logs**
   - Go to Deploys tab
   - Click on any deployment
   - View build logs for errors

2. **Analytics** (Paid feature)
   - Real-time visitor data
   - Page views and performance
   - Traffic sources

3. **Functions Logs** (If using Netlify Functions)
   - View function execution logs
   - Monitor errors and performance

### Supabase Monitoring:

1. **Database Performance**
   - Go to Database > Performance
   - Monitor query performance
   - Identify slow queries

2. **API Usage**
   - Go to Settings > Usage
   - Monitor API requests
   - Track bandwidth usage

3. **Authentication**
   - Go to Authentication > Users
   - Monitor user signups
   - View authentication logs

4. **Logs**
   - Go to Logs Explorer
   - Filter by severity
   - Debug issues in production

---

## Part 8: Troubleshooting

### Common Issues:

**1. Build Fails on Netlify**
```
Solution: Check build logs for errors
- Ensure all dependencies are in package.json
- Verify environment variables are set
- Check for TypeScript errors
```

**2. Blank Page After Deployment**
```
Solution: Check browser console
- Verify VITE_SUPABASE_URL is correct
- Ensure environment variables are set
- Check for CORS issues
```

**3. Database Connection Errors**
```
Solution: Verify Supabase credentials
- Check VITE_SUPABASE_URL format
- Verify VITE_SUPABASE_ANON_KEY is correct
- Ensure Supabase project is active
```

**4. Authentication Not Working**
```
Solution: Configure Supabase Auth
- Go to Authentication > URL Configuration
- Add your Netlify URL to Site URL
- Add to Redirect URLs list
```

**5. Images Not Loading**
```
Solution: Check storage configuration
- Verify bucket policies
- Check CORS settings
- Ensure images are uploaded correctly
```

---

## Part 9: Scaling Considerations

### When to Upgrade:

**Supabase:**
- Database size exceeds 500 MB (free tier limit)
- Need more than 50,000 monthly active users
- Require daily backups
- Need priority support

**Netlify:**
- Exceed 100 GB bandwidth/month (free tier)
- Need more than 300 build minutes/month
- Require team collaboration features
- Need advanced analytics

### Performance Optimization:

1. **Database Indexing**
   - Add indexes to frequently queried columns
   - Use EXPLAIN ANALYZE to optimize queries

2. **Caching**
   - Implement client-side caching
   - Use Supabase cache headers
   - Enable Netlify Edge caching

3. **Image Optimization**
   - Use Supabase image transformations
   - Implement lazy loading
   - Use modern formats (WebP, AVIF)

4. **Code Splitting**
   - Already configured with Vite
   - Lazy load routes
   - Split large components

---

## Part 10: Security Best Practices

### Frontend Security:

- [ ] All API calls use HTTPS
- [ ] No sensitive data in localStorage
- [ ] Input validation on all forms
- [ ] XSS protection enabled
- [ ] CSRF tokens for state-changing operations

### Backend Security (Supabase):

- [ ] Row Level Security (RLS) enabled on all tables
- [ ] Proper authentication policies
- [ ] Service role key never exposed
- [ ] Regular security audits
- [ ] Database backups configured

### Deployment Security:

- [ ] Environment variables properly set
- [ ] No secrets in Git repository
- [ ] HTTPS enforced (automatic on Netlify)
- [ ] Security headers configured
- [ ] Regular dependency updates

---

## Support and Resources

### Documentation:
- **CampusNest Docs**: See project README.md
- **Supabase Docs**: https://supabase.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Vite Docs**: https://vitejs.dev

### Community:
- **Supabase Discord**: https://discord.supabase.com
- **Netlify Community**: https://answers.netlify.com

### Getting Help:
- Check documentation first
- Search for similar issues on GitHub
- Ask in community forums
- Contact support (paid plans)

---

## Conclusion

You now have a fully deployed, production-ready student accommodation platform! 

**Your Stack:**
- ✅ Frontend: Netlify (Global CDN, automatic HTTPS)
- ✅ Backend: Supabase (Managed database, auth, storage)
- ✅ Continuous Deployment: Automatic via GitHub
- ✅ Monitoring: Built-in dashboards
- ✅ Scalable: Grows with your user base

**Next Steps:**
1. Add custom domain
2. Set up monitoring alerts
3. Implement analytics
4. Add more advanced features
5. Gather user feedback and iterate

Happy deploying! 🚀
