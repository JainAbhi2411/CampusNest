# Local Development Guide

## Quick Start

### 1. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_ID=campusnest-local
VITE_API_ENV=development
```

**Get your Supabase credentials:**
1. Go to https://supabase.com/dashboard
2. Select your project (or create a new one)
3. Go to Settings > API
4. Copy the Project URL and anon/public key

### 3. Set Up Database

Run the migrations in Supabase SQL Editor (in order):

```bash
# Go to Supabase Dashboard > SQL Editor
# Run each file from supabase/migrations/ in order:
# 00001_*.sql
# 00002_*.sql
# ...
# 00015_*.sql
```

### 4. Start Development Server

```bash
# Start the dev server
npm run dev

# Or with pnpm
pnpm dev
```

The application will be available at: **http://localhost:5173**

---

## Project Structure

```
campusnest/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Shared components (Header, Footer)
│   │   ├── property/       # Property-related components
│   │   ├── comparison/     # Comparison feature components
│   │   ├── admin/          # Admin panel components
│   │   └── ui/             # shadcn/ui components
│   ├── pages/              # Page components (routes)
│   ├── contexts/           # React contexts (state management)
│   ├── db/                 # Database and API logic
│   │   ├── supabase.ts    # Supabase client
│   │   └── api.ts         # API methods
│   ├── types/              # TypeScript type definitions
│   ├── lib/                # Utility functions
│   ├── routes.tsx          # Route configuration
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── supabase/
│   └── migrations/         # Database migrations
├── public/                 # Static assets
├── .env                    # Environment variables (create this)
├── netlify.toml           # Netlify configuration
└── package.json           # Dependencies
```

---

## Development Workflow

### Making Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Edit files in `src/`
   - Hot reload will update the browser automatically

3. **Test your changes**
   ```bash
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

### Adding New Features

#### 1. Add a New Page

```typescript
// src/pages/NewPage.tsx
import React from 'react';
import PageMeta from '@/components/common/PageMeta';

export default function NewPage() {
  return (
    <>
      <PageMeta 
        title="New Page - CampusNest"
        description="Description of the new page"
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">New Page</h1>
      </div>
    </>
  );
}
```

```typescript
// src/routes.tsx
import NewPage from '@/pages/NewPage';

const routes: RouteConfig[] = [
  // ... existing routes
  {
    path: '/new-page',
    element: <NewPage />,
  },
];
```

#### 2. Add a New Component

```typescript
// src/components/common/NewComponent.tsx
import React from 'react';

interface NewComponentProps {
  title: string;
  description?: string;
}

export default function NewComponent({ title, description }: NewComponentProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-xl font-semibold">{title}</h3>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
```

#### 3. Add Database Tables

Create a new migration file:

```sql
-- supabase/migrations/00016_add_new_table.sql

/*
# Add New Feature Table

1. New Tables
  - `new_table`
    - `id` (uuid, primary key)
    - `name` (text)
    - `created_at` (timestamptz)

2. Security
  - Enable RLS
  - Add policies for access control
*/

CREATE TABLE IF NOT EXISTS new_table (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON new_table
  FOR SELECT TO public USING (true);
```

Then run it in Supabase SQL Editor.

#### 4. Add API Methods

```typescript
// src/db/api.ts

export const newFeatureApi = {
  async getItems() {
    const { data, error } = await supabase
      .from('new_table')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createItem(name: string) {
    const { data, error } = await supabase
      .from('new_table')
      .insert({ name })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};
```

---

## Common Tasks

### Update Dependencies

```bash
# Check for outdated packages
npm outdated

# Update specific package
npm update package-name

# Update all packages (be careful!)
npm update
```

### Clear Cache

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Clear all node_modules
rm -rf node_modules
npm install
```

### Database Tasks

#### Reset Database
```sql
-- In Supabase SQL Editor
-- WARNING: This deletes all data!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Then re-run all migrations
```

#### View Database Logs
- Go to Supabase Dashboard > Logs
- Filter by severity or table

#### Backup Database
- Go to Supabase Dashboard > Database > Backups
- Click "Create backup"

---

## Debugging

### Check Browser Console

Open browser DevTools (F12) and check:
- Console tab for JavaScript errors
- Network tab for API errors
- Application tab for localStorage/cookies

### Check Supabase Logs

1. Go to Supabase Dashboard
2. Click on "Logs" in the sidebar
3. Filter by:
   - API logs
   - Database logs
   - Auth logs

### Common Issues

**1. "Cannot find module" error**
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**2. "Supabase client not initialized"**
```bash
# Solution: Check .env file
# Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set
```

**3. "RLS policy violation"**
```sql
-- Solution: Check RLS policies in Supabase
-- Temporarily disable RLS for testing:
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

**4. Port already in use**
```bash
# Solution: Kill the process using port 5173
# On Mac/Linux:
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

## Testing

### Manual Testing Checklist

- [ ] Homepage loads correctly
- [ ] Search functionality works
- [ ] Property cards display properly
- [ ] Property details page shows all information
- [ ] Comparison feature works
- [ ] User registration works
- [ ] User login works
- [ ] Admin panel accessible (for admin users)
- [ ] Forms validate correctly
- [ ] Error messages display properly
- [ ] Mobile responsive design works
- [ ] Dark mode toggle works (if implemented)

### Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile browsers (Chrome, Safari)

---

## Performance Optimization

### Check Bundle Size

```bash
# Build and analyze
npm run build

# Check dist/ folder size
du -sh dist/
```

### Optimize Images

- Use WebP format
- Compress images before uploading
- Use appropriate image sizes
- Implement lazy loading

### Code Splitting

Vite automatically code-splits by route. For manual splitting:

```typescript
// Lazy load components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

// Use with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <HeavyComponent />
</Suspense>
```

---

## Git Workflow

### Commit Message Convention

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

### Before Committing

```bash
# Check what changed
git status

# Review changes
git diff

# Run linter
npm run lint

# Stage changes
git add .

# Commit with message
git commit -m "feat: add property comparison feature"
```

---

## Environment Variables

### Available Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=          # Your Supabase project URL
VITE_SUPABASE_ANON_KEY=     # Your Supabase anon/public key

# App Configuration
VITE_APP_ID=                # Unique app identifier
VITE_API_ENV=               # Environment (development/production)
```

### Adding New Variables

1. Add to `.env` file
2. Access in code:
   ```typescript
   const myVar = import.meta.env.VITE_MY_VAR;
   ```
3. Add to Netlify environment variables (for production)

**Important**: All Vite env vars must start with `VITE_`

---

## Resources

### Documentation
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Vite Docs](https://vitejs.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

### Tools
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Supabase Studio](https://supabase.com/dashboard)
- [Postman](https://www.postman.com) - API testing

### Community
- [React Discord](https://discord.gg/react)
- [Supabase Discord](https://discord.supabase.com)

---

## Getting Help

1. **Check Documentation**: Look at project docs and official docs
2. **Search Issues**: Check if someone else had the same problem
3. **Ask in Community**: Post in Discord or forums
4. **Create Issue**: If it's a bug, create a GitHub issue

---

## Next Steps

- [ ] Set up your development environment
- [ ] Run the app locally
- [ ] Explore the codebase
- [ ] Make a small change
- [ ] Test your change
- [ ] Commit and push
- [ ] Deploy to Netlify

Happy coding! 🚀
