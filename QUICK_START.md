# CampusNest - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Set Up Supabase (2 minutes)

1. Go to https://supabase.com and sign up (free)
2. Click "New Project"
3. Fill in:
   - **Name**: CampusNest
   - **Database Password**: (create a strong password - save it!)
   - **Region**: Choose closest to you
4. Wait for project to be created (~2 minutes)

### Step 2: Get Your Credentials (1 minute)

1. In Supabase Dashboard, go to **Settings** > **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

### Step 3: Set Up Database (1 minute)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open each file in `supabase/migrations/` folder (in order)
4. Copy the SQL content and paste into the query editor
5. Click **Run** for each migration
6. Repeat for all 15 migration files (00001 through 00015)

### Step 4: Configure Local Environment (30 seconds)

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and paste your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_APP_ID=campusnest-local
   VITE_API_ENV=development
   ```

### Step 5: Run Locally (30 seconds)

```bash
# Install dependencies (first time only)
npm install

# Start the app
npm run dev
```

**Done!** Open http://localhost:5173 in your browser 🎉

---

## 🌐 Deploy to Netlify (5 minutes)

### Option 1: Deploy via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/campusnest.git
   git push -u origin master
   ```

2. **Connect to Netlify**
   - Go to https://netlify.com and sign up
   - Click "Add new site" > "Import an existing project"
   - Choose GitHub and authorize
   - Select your repository

3. **Configure Build**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Show advanced" and add environment variables:
     ```
     VITE_SUPABASE_URL = https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY = your-anon-key
     VITE_APP_ID = campusnest-production
     VITE_API_ENV = production
     ```

4. **Deploy**
   - Click "Deploy site"
   - Wait 2-3 minutes
   - Your site is live! 🚀

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify init
netlify deploy --prod
```

---

## 🔧 Common Issues & Solutions

### Issue: "Cannot connect to Supabase"
**Solution**: Check your `.env` file
- Ensure `VITE_SUPABASE_URL` is correct
- Ensure `VITE_SUPABASE_ANON_KEY` is correct
- Restart the dev server after changing `.env`

### Issue: "Database error" or "RLS policy violation"
**Solution**: Run all migrations
- Go to Supabase Dashboard > SQL Editor
- Run each migration file in order (00001 to 00015)
- Check for any SQL errors

### Issue: "Port 5173 already in use"
**Solution**: Kill the process
```bash
# Mac/Linux
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Issue: Build fails on Netlify
**Solution**: Check environment variables
- Go to Netlify Dashboard > Site settings > Environment variables
- Ensure all 4 variables are set correctly
- Redeploy the site

---

## 📚 Next Steps

### Create Admin Account

1. Register a new account through the UI
2. Go to Supabase Dashboard > Authentication > Users
3. Copy your user UUID
4. Go to SQL Editor and run:
   ```sql
   UPDATE profiles 
   SET role = 'admin'::user_role 
   WHERE id = 'your-user-uuid-here';
   ```
5. Refresh the page and access `/admin`

### Add Sample Data (Optional)

The database is empty by default. You can:
- Add properties through the admin panel
- Or run sample data SQL (if provided)

### Customize

- Update colors in `src/index.css`
- Modify logo and branding
- Add your own content
- Configure email templates in Supabase

---

## 📖 Full Documentation

For detailed information, see:
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment guide
- **[LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md)** - Development workflow
- **[README.md](./README.md)** - Project overview

---

## 🆘 Need Help?

- 📖 Read the documentation
- 🐛 Check GitHub Issues
- 💬 Ask in discussions
- 📧 Contact support

---

## ✅ Checklist

### Local Development
- [ ] Supabase project created
- [ ] Database migrations run
- [ ] `.env` file configured
- [ ] Dependencies installed
- [ ] App running on localhost:5173

### Production Deployment
- [ ] Code pushed to GitHub
- [ ] Netlify site created
- [ ] Environment variables set
- [ ] Site deployed successfully
- [ ] Admin account created
- [ ] Sample data added (optional)

---

**Congratulations!** You now have CampusNest running locally and deployed to production! 🎉

For questions or issues, refer to the full documentation or create a GitHub issue.
