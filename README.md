# Welcome to Your Miaoda Project
Miaoda Application Link URL
    URL:https://medo.dev/projects/app-7xyosp4kpcld

# CampusNest - Student Accommodation Platform

<div align="center">
  <h3>🏠 Find Your Perfect Student Home</h3>
  <p>A comprehensive platform for students to search, explore, and book nearby accommodations including PGs, flats, hostels, and rooms for rent.</p>
</div>

---

## 🌟 Features

### Core Features
- 🔍 **Advanced Search**: Location-based search with filters for accommodation type, price, and amenities
- 🏘️ **Property Listings**: Browse PGs, flats, hostels, and rooms for rent
- 📸 **Rich Media**: Property images, 360° virtual tours, and detailed information
- 🔐 **User Authentication**: Secure registration and login system
- 📅 **Booking System**: Schedule visits and book rooms online
- 🍽️ **Mess Information**: Find nearby mess facilities with pricing

### Advanced Features
- ⚖️ **Property Comparison**: Compare up to 4 properties side-by-side with intelligent scoring
- 📊 **Smart Analytics**: AI-powered recommendations based on user behavior
- 💾 **Anonymous Support**: Full functionality without login requirement
- 🎯 **Best Value Detection**: Automatic highlighting of best-value properties
- 📱 **Responsive Design**: Seamless experience across all devices
- 🌓 **Dark Mode**: Built-in dark mode support

### Admin Features
- 📋 **Property Management**: Add, edit, and manage property listings
- 👥 **User Management**: Manage user accounts and permissions
- 📊 **Analytics Dashboard**: Track bookings, views, and user engagement
- 🏷️ **Category Management**: Organize properties by type and location

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- A Supabase account (free tier available)

### Local Development

1. **Clone and Install**
   ```bash
   cd /workspace/app-7xyosp4kpcld
   pnpm install
   ```

2. **Set Up Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Configure Supabase**
   - Create a project at https://supabase.com
   - Run migrations from `supabase/migrations/` in SQL Editor
   - Copy your project URL and anon key to `.env`

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Visit http://localhost:5173

### Deployment

**Frontend (Netlify):**
- Push to GitHub
- Connect repository to Netlify
- Set environment variables
- Deploy automatically

**Backend (Supabase):**
- Already cloud-hosted
- No additional deployment needed

📖 See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📚 Documentation

- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Complete deployment instructions for Netlify
- **[Local Development](./LOCAL_DEVELOPMENT.md)** - Detailed local development guide
- **[Advanced Features](./ADVANCED_FEATURES_OVERVIEW.md)** - Overview of advanced features
- **[Property Comparison](./PROPERTY_COMPARISON_FEATURE.md)** - Comparison feature documentation
- **[PRD](./docs/prd.md)** - Product Requirements Document

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router v7
- **State Management**: React Context API
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: Auto-generated REST API
- **Real-time**: Supabase Realtime

### Deployment
- **Frontend Hosting**: Netlify
- **Backend**: Supabase Cloud
- **CDN**: Netlify Edge Network
- **SSL**: Automatic HTTPS

## 📁 Project Directory

```
campusnest/
├── README.md                    # Project documentation
├── DEPLOYMENT_GUIDE.md          # Deployment instructions
├── LOCAL_DEVELOPMENT.md         # Local dev guide
├── netlify.toml                 # Netlify configuration
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
├── tailwind.config.mjs          # Tailwind CSS configuration
├── index.html                   # Entry HTML file
├── public/                      # Static assets
│   ├── favicon.png
│   └── images/
├── src/                         # Source code
│   ├── main.tsx                # Application entry point
│   ├── App.tsx                 # Root component
│   ├── routes.tsx              # Route configuration
│   ├── index.css               # Global styles
│   ├── components/             # React components
│   │   ├── common/            # Shared components
│   │   ├── property/          # Property-related components
│   │   ├── comparison/        # Comparison feature
│   │   ├── admin/             # Admin panel components
│   │   └── ui/                # shadcn/ui components
│   ├── pages/                  # Page components
│   │   ├── Home.tsx
│   │   ├── Properties.tsx
│   │   ├── PropertyDetails.tsx
│   │   ├── Compare.tsx
│   │   └── admin/
│   ├── contexts/               # React contexts
│   │   └── ComparisonContext.tsx
│   ├── db/                     # Database layer
│   │   ├── supabase.ts        # Supabase client
│   │   └── api.ts             # API methods
│   ├── types/                  # TypeScript types
│   │   └── types.ts
│   └── lib/                    # Utility functions
│       └── utils.ts
├── supabase/                    # Supabase configuration
│   └── migrations/             # Database migrations
│       ├── 00001_*.sql
│       ├── 00002_*.sql
│       └── ...
└── docs/                        # Additional documentation
    └── prd.md                  # Product requirements
```

## 🔧 Development

### Available Scripts

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linter and type checking
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Biome
- **Prettier**: Code formatting (via Biome)
- **Git Hooks**: Pre-commit checks (optional)

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_ID=campusnest-local
VITE_API_ENV=development
```

See `.env.example` for a template.

## 🗄️ Database Schema

### Main Tables

- **properties**: Property listings with details
- **property_images**: Property image gallery
- **mess_facilities**: Nearby mess information
- **bookings**: Room booking records
- **visit_schedules**: Visit appointment scheduling
- **profiles**: User profiles and roles
- **property_comparisons**: Comparison tracking
- **comparison_analytics**: Analytics for recommendations

### Security

- Row Level Security (RLS) enabled on all tables
- Policies for authenticated and anonymous users
- Secure API access with Supabase Auth

## 🎨 Design System

### Color Scheme

- **Primary**: Deep blue (#2C3E50) - Trust and stability
- **Secondary**: Vibrant orange (#E67E22) - Call-to-action
- **Background**: Clean white with light gray sections
- **Accent**: Complementary colors for highlights

### Typography

- **Font Family**: Inter / Roboto
- **Headings**: Clear size hierarchy
- **Body**: 1.6 line height for readability

### Components

All UI components follow shadcn/ui design system with Tailwind CSS for styling.

## 🔐 Security

### Best Practices

- ✅ Environment variables for sensitive data
- ✅ Row Level Security (RLS) on database
- ✅ Input validation on all forms
- ✅ XSS protection
- ✅ HTTPS enforced in production
- ✅ Secure authentication with Supabase Auth

### Authentication

- Email/password authentication
- Social login (optional)
- JWT-based sessions
- Automatic token refresh

## 📊 Analytics & Monitoring

### Built-in Analytics

- Property view tracking
- Comparison analytics for recommendations
- User behavior tracking (privacy-compliant)
- Booking conversion metrics

### Monitoring

- Supabase Dashboard for database metrics
- Netlify Analytics for traffic (optional)
- Error logging with console
- Performance monitoring with Lighthouse

## 🤝 Contributing

### Development Workflow

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` to check code quality
4. Commit with descriptive message
5. Push and create a pull request

### Commit Convention

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

## 📝 License

This project is proprietary software. All rights reserved.

## 🆘 Support

### Getting Help

- 📖 Check the documentation files
- 🐛 Report bugs via GitHub Issues
- 💬 Ask questions in discussions
- 📧 Contact support team

### Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## 🎯 Roadmap

### Completed ✅
- Property search and filtering
- Property comparison system
- User authentication
- Booking system
- Admin panel
- Responsive design

### In Progress 🚧
- Wishlist with price tracking
- Smart commute calculator
- AI-powered recommendations

### Planned 📋
- Roommate matching system
- Neighborhood insights dashboard
- Virtual tour booking
- Student community hub
- Mobile app (React Native)

## 👥 Team

Built with ❤️ by the CampusNest team

---

<div align="center">
  <p>Made with React, TypeScript, and Supabase</p>
  <p>© 2025 CampusNest</p>
</div>
