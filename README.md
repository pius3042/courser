# Smart Course Registration Portal - University of Port Harcourt

A modern, intelligent course registration system built with Next.js 16, React 19, and TypeScript. Features smart course suggestions, real-time validation, interactive tour guides, and a stunning glassmorphism UI with smooth animations powered by Framer Motion.

## 🌟 Features

### Interactive Tour Guide
- **First-time User Onboarding**: Automatic guided tour on first visit for both students and admins
- **Contextual Help**: Step-by-step walkthrough of key features and functionality
- **Always Accessible**: Floating help button to restart the tour anytime
- **Progress Tracking**: Visual indicators showing tour completion progress
- **Smart Persistence**: Uses localStorage to remember if user has seen the tour

### Smart Course Suggestions
- AI-powered recommendations based on department, level, and semester
- Automatic detection of compulsory courses
- Optional prerequisite validation (configurable by admin)
- Real-time unit calculation
- Semester-specific course filtering

### Intelligent Validation
- Compulsory course checking
- Maximum credit unit enforcement (24 units)
- Duplicate course prevention
- Prerequisite requirement validation (optional)
- Semester-specific registration tracking

### Modern UI/UX
- Glassmorphism design with beautiful animations
- Fully responsive design for mobile, tablet, and desktop
- Real-time progress indicators with animated counters
- Smooth micro-interactions and hover effects
- Loading states and skeleton screens
- Enhanced button designs with gradient effects and shadows

### Admin Panel
- Student management (add, edit, delete)
- Course management (add, edit, delete)
- Registration oversight (approve, reject, delete)
- Analytics dashboard with real-time statistics
- System settings (semester control, registration toggle, prerequisite enforcement)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)

### Installation

1. **Clone and setup:**
```bash
git clone <repository-url>
cd uniport-course-registration
npm install
```

2. **Configure environment variables:**
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/uniport-registration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

3. **Seed the database:**
```bash
npm run setup
```

The setup script will:
- Connect to MongoDB
- Clear existing data
- Seed sample courses (Computer Science 300-400 level)
- Create default admin account (admin@uniport.edu.ng / admin123)
- Create sample student accounts
- Set up system settings

4. **Start development server:**
```bash
npm run dev
```

5. **Open your browser:**
```
http://localhost:3000
```

### Default Login Credentials

**Student Account:**
- Email: `john.doe@uniport.edu.ng`
- Password: `student123`

**Admin Account:**
- Email: `admin@uniport.edu.ng`
- Password: `admin123`

### First-Time User Experience

When you first log in as either a student or admin, you'll be greeted with an **interactive tour guide** that walks you through the key features:

- **Student Tour**: Covers dashboard navigation, registration process, progress tracking, and quick actions
- **Admin Tour**: Explains system overview, student/course management, registration approval, and settings

You can restart the tour anytime by clicking the **help button** (?) in the bottom-right corner.

## 🛠 Tech Stack

- **Frontend:** Next.js 16.2.3 (App Router), React 19.2.4, TypeScript 5
- **Styling:** Tailwind CSS 4, Framer Motion 11
- **UI Components:** Custom components with shadcn/ui patterns, Lucide Icons
- **Animations:** Framer Motion for smooth transitions and micro-interactions
- **Backend:** Next.js API Routes with TypeScript
- **Database:** MongoDB with Mongoose 8.3
- **Authentication:** JWT (jose 5.2) with httpOnly cookies, bcryptjs for password hashing
- **Validation:** Zod 3.23 for schema validation
- **Charts:** Recharts 2.12 for dashboard analytics
- **Effects:** Canvas Confetti for celebration animations
- **State Management:** React Hooks (useState, useEffect, useCallback)
- **Form Handling:** Controlled components with real-time validation

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── students/     # Student CRUD operations
│   │   ├── courses/      # Course management
│   │   ├── registrations/ # Registration handling
│   │   ├── dashboard/    # Dashboard statistics
│   │   └── settings/     # System settings
│   ├── dashboard/         # Student dashboard
│   ├── register/          # Course registration flow
│   ├── history/          # Registration history
│   ├── profile/          # Student profile
│   ├── slip/             # Registration slip
│   ├── admin/            # Admin panel
│   │   ├── dashboard/   # Admin overview
│   │   ├── students/    # Student management
│   │   ├── courses/     # Course management
│   │   ├── registrations/ # Registration approval
│   │   ├── settings/    # System configuration
│   │   └── admins/      # Admin management
│   └── login/            # Authentication pages
├── components/            # Reusable components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── CourseCard.tsx    # Course selection card
│   ├── GlassCard.tsx     # Glassmorphism container
│   ├── TourGuide.tsx     # Interactive tour component
│   ├── RegistrationStepper.tsx # Multi-step progress
│   ├── SmartWarnings.tsx # Validation warnings
│   └── LoadingSpinner.tsx # Loading states
├── lib/                  # Utilities
│   ├── auth.ts          # JWT authentication helpers
│   ├── db.ts            # MongoDB connection
│   ├── types.ts         # TypeScript type definitions
│   └── utils.ts         # Helper functions
├── models/              # MongoDB schemas
│   ├── Student.ts       # Student model
│   ├── Course.ts        # Course model
│   ├── Registration.ts  # Registration model
│   ├── Admin.ts         # Admin model
│   └── Settings.ts      # System settings model
└── scripts/             # Setup and seed scripts
    ├── setup.js         # Initial setup
    └── seed.mjs         # Database seeding
```

## 🎯 Key Features Demonstration

### 1. Interactive Tour Guide
**First-time users** are automatically greeted with a guided tour:
- **Student Tour**: 5 steps covering dashboard, progress tracking, course registration, quick actions, and help access
- **Admin Tour**: 5 steps covering system overview, statistics, management tools, registration approval, and settings
- **Persistent State**: Tour completion is saved in localStorage
- **Always Accessible**: Floating help button (?) appears after tour completion
- **Smooth Animations**: Beautiful transitions and progress indicators

### 2. Smart Course Suggestions
The system automatically suggests courses based on:
- Student's department (e.g., Computer Science)
- Current level (e.g., 400 Level)
- Active semester (First or Second Semester)
- Previously completed courses
- Compulsory course requirements

### 3. Real-time Validation
- **Compulsory Course Check:** Prevents submission without required courses
- **Unit Limit:** Visual warnings when approaching or exceeding 24 units
- **Prerequisites:** Optional validation of course dependencies (configurable by admin)
- **Duplicates:** Prevents re-registration of completed courses
- **Semester-Specific:** Each semester has independent registration

### 4. Beautiful UI Elements
- **Animated Progress Bars:** Show registration completion with smooth transitions
- **Glassmorphism Cards:** Modern, translucent design with backdrop blur
- **Gradient Buttons:** Enhanced with shadows and hover effects
- **Micro-interactions:** Hover effects, scale animations, and smooth transitions
- **Smart Warnings:** Contextual validation messages with color coding
- **Responsive Design:** Fully optimized for mobile (320px+), tablet (768px+), and desktop (1024px+)

### 5. Registration Flow
1. **Course Selection:** Browse and select courses with real-time filtering
2. **Smart Validation:** Instant feedback on course selection
3. **Review Summary:** Confirm selected courses and total units
4. **Success Animation:** Celebration with visual feedback
5. **Registration Slip:** Downloadable PDF with course details

### 6. Admin Controls
- **Student Management:** Add, edit, delete student accounts
- **Course Management:** Create and modify course offerings
- **Registration Approval:** Review and approve/reject student registrations
- **System Settings:** 
  - Change current semester
  - Toggle registration open/closed
  - Enable/disable prerequisite checking
  - Manage admin accounts

### 7. Mobile Responsiveness
Every page is fully responsive with:
- **Flexible Grids:** Adapt from 1 column (mobile) to 2-4 columns (desktop)
- **Responsive Text:** Scales appropriately for screen size
- **Touch-Friendly:** Buttons and interactive elements sized for mobile
- **Scrollable Tables:** Horizontal scroll for data tables on small screens
- **Adaptive Layouts:** Headers, cards, and forms stack vertically on mobile

## 🔧 Configuration

### Environment Variables
Create `.env.local` in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/uniport-registration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

**Important Notes:**
- Change `JWT_SECRET` to a strong, random string in production
- For MongoDB Atlas (cloud), use the connection string provided by Atlas
- Never commit `.env.local` to version control

### Database Seeding
The system includes comprehensive sample data:
- **Computer Science courses** (300-400 level, both semesters)
- **Sample students** with varying levels and completed courses
- **Admin accounts** with full system access
- **Realistic course prerequisites** and dependencies
- **System settings** with default configuration

Run the seed script:
```bash
npm run setup
```

### System Settings (Admin Only)
Admins can configure:
- **Current Semester:** Switch between Semester 1 and 2
- **Registration Status:** Open or close registration period
- **Prerequisite Checking:** Enable/disable prerequisite validation
- **Session Year:** Set the current academic session

Access settings at: `/admin/settings`

## 🎨 Design Philosophy

The UI follows modern design principles with a focus on visual excellence:

- **Glassmorphism:** Translucent cards with backdrop blur (`backdrop-blur-sm`), subtle borders (`border-white/8`), and layered transparency
- **Gradient Accents:** Smooth color transitions using `bg-linear-to-r from-blue-500 to-violet-600` throughout the interface
- **Animated Backgrounds:** Glowing orbs with blur effects and grid overlays for depth
- **Micro-animations:** Smooth, purposeful motion using Framer Motion (`whileHover`, `whileTap`, `initial/animate`)
- **Accessibility:** Semantic HTML, proper ARIA labels, and keyboard navigation support
- **Mobile-first:** Fully responsive design starting from 320px width with breakpoints at 640px (sm), 768px (md), 1024px (lg)
- **Dark Theme:** Rich dark background (`#06091a`) with vibrant accent colors and glowing effects
- **Visual Hierarchy:** Clear information structure with proper spacing, typography scale, and color contrast
- **Interactive Feedback:** Hover states with scale transforms, loading indicators, success animations with confetti
- **Performance:** Optimized animations with `transform` and `opacity` for 60fps rendering

### Color Palette
- **Primary Gradient:** `from-blue-500 to-violet-600` for CTAs and highlights
- **Success:** Emerald/Green (`emerald-500`, `green-600`) for approved states
- **Warning:** Yellow/Orange (`yellow-500`, `orange-500`) for pending states
- **Error:** Red (`red-500`, `red-600`) for rejected/error states
- **Neutral:** White with varying opacity (`white/5`, `white/10`, `white/40`, `white/60`) for text and borders
- **Background:** Deep navy (`#06091a`, `#080d22`) with gradient overlays

### Typography
- **Headings:** Bold weights (600-700) with large sizes (`text-4xl` to `text-7xl`)
- **Body Text:** Regular weight (400) with proper line height (`leading-relaxed`)
- **Responsive Sizing:** Scales from mobile to desktop using Tailwind breakpoints (`text-base sm:text-lg md:text-xl`)
- **Font Stack:** System fonts for optimal performance and native feel

## 📊 Sample Course Data

The system includes realistic Computer Science courses:

**400 Level - First Semester (Compulsory):**
- CSC480: Research Methodology (2 units)
- CSC481: Software Engineering (3 units)
- CSC482: Computer Graphics (3 units)
- CSC483: Artificial Intelligence (3 units)
- CSC486: Computer Networks (3 units)
- CSC496: Project I (3 units)
- GES400: Entrepreneurship (2 units)

**400 Level - First Semester (Electives):**
- CSC484: Machine Learning (3 units)
- CSC485: Mobile Development (3 units)
- CSC487: Cybersecurity (3 units)
- CSC488: Cloud Computing (3 units)

**400 Level - Second Semester:**
- CSC497: Project II (6 units) - Compulsory
- CSC498: Industrial Training (6 units) - Compulsory
- Additional electives available

**300 Level Courses:**
- Includes foundational courses like Data Structures, Algorithms, Database Systems, etc.
- Serves as prerequisites for 400 level courses

### Course Properties
Each course includes:
- **Code:** Unique identifier (e.g., CSC481)
- **Title:** Full course name
- **Units:** Credit hours (typically 2-6 units)
- **Level:** Academic level (300, 400)
- **Semester:** 1 or 2
- **Department:** Computer Science
- **Type:** Compulsory or Elective
- **Prerequisites:** Array of required course codes (optional)

## 🚀 Deployment

### Production Build
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start production server
npm start
```

The build process:
- Compiles TypeScript to JavaScript
- Optimizes React components
- Generates static pages where possible
- Minifies CSS and JavaScript
- Optimizes images and assets

### Environment Setup for Production
1. **MongoDB:** Use MongoDB Atlas or a production MongoDB instance with authentication enabled
2. **JWT Secret:** Generate a strong, random secret key (32+ characters)
3. **HTTPS:** Enable HTTPS for secure cookie transmission (required for production)
4. **Environment Variables:** Set production values in your hosting platform's dashboard

### Deployment Platforms
This Next.js application can be deployed to:
- **Vercel** (Recommended - zero configuration, automatic deployments)
- **Netlify** (Good alternative with similar features)
- **AWS Amplify** (For AWS ecosystem integration)
- **DigitalOcean App Platform** (Simple and affordable)
- **Railway** (Easy deployment with database hosting)
- **Self-hosted** with Node.js (requires manual configuration)

### Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

Add environment variables in Vercel dashboard:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Your secret key for JWT signing

### Performance Optimizations
- **Server-side rendering (SSR):** Initial page loads are server-rendered for fast FCP
- **Static generation:** Landing page is statically generated at build time
- **API route optimization:** Efficient database queries with proper indexing
- **Code splitting:** Automatic code splitting per route
- **Image optimization:** Next.js Image component with automatic WebP conversion
- **MongoDB connection pooling:** Reuses database connections across requests
- **Lazy loading:** Components and routes loaded on demand
- **Caching headers:** Proper cache control for static assets

## 🎓 University Project Notes

This system is designed to impress during project defense:

### Technical Excellence
1. **Visual Impact:** Modern, professional interface with glassmorphism and animations
2. **Technical Depth:** Full-stack implementation with proper authentication and validation
3. **Real-world Relevance:** Solves actual university registration problems
4. **Code Quality:** Clean, well-structured, and documented TypeScript code
5. **User Experience:** Intuitive flow with helpful feedback and guided tours

### Key Selling Points for Defense
- **Interactive Onboarding:** First-time users get a guided tour
- **Smart Validation:** Real-time feedback prevents registration errors
- **Responsive Design:** Works seamlessly on all devices
- **Admin Controls:** Comprehensive management system
- **Semester Management:** Independent registration for each semester
- **Configurable Rules:** Admin can toggle prerequisite checking
- **Modern Tech Stack:** Uses latest Next.js, React, and TypeScript

### Demo Flow Suggestion
1. **Start with Student Login:** Show the interactive tour guide
2. **Navigate Dashboard:** Highlight progress tracking and statistics
3. **Register Courses:** Demonstrate smart suggestions and validation
4. **Show Mobile View:** Display responsive design
5. **Switch to Admin:** Show management capabilities
6. **Approve Registration:** Demonstrate admin workflow
7. **Show Settings:** Explain system configuration options

### Features That Stand Out
- ✅ Interactive tour guide for first-time users
- ✅ Real-time course suggestions based on student profile
- ✅ Beautiful glassmorphism UI with smooth animations
- ✅ Comprehensive validation with helpful error messages
- ✅ Fully responsive mobile-first design
- ✅ Semester-specific registration tracking
- ✅ Admin dashboard with analytics
- ✅ Configurable system settings
- ✅ Registration slip generation
- ✅ Complete CRUD operations for all entities

## � API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - Student/Admin login
- `POST /api/auth/register` - Student registration
- `POST /api/auth/logout` - Logout and clear session

### Student Endpoints
- `GET /api/students` - Get all students (Admin only)
- `GET /api/students/[id]` - Get student by ID
- `POST /api/students` - Create new student (Admin only)
- `PUT /api/students/[id]` - Update student (Admin only)
- `DELETE /api/students/[id]` - Delete student (Admin only)

### Course Endpoints
- `GET /api/courses` - Get all courses
- `GET /api/courses/[id]` - Get course by ID
- `POST /api/courses` - Create new course (Admin only)
- `PUT /api/courses/[id]` - Update course (Admin only)
- `DELETE /api/courses/[id]` - Delete course (Admin only)
- `GET /api/courses/suggest` - Get suggested courses for student

### Registration Endpoints
- `GET /api/registrations` - Get all registrations
- `POST /api/registrations` - Create/update registration
- `PUT /api/registrations/[id]` - Update registration status (Admin only)
- `DELETE /api/registrations?id=[id]` - Delete registration

### Dashboard Endpoints
- `GET /api/dashboard/stats` - Get student dashboard statistics

### Settings Endpoints
- `GET /api/settings` - Get system settings
- `PUT /api/settings` - Update system settings (Admin only)

### Admin Endpoints
- `GET /api/admins` - Get all admins
- `POST /api/admins` - Create new admin
- `PUT /api/admins/[id]` - Update admin
- `DELETE /api/admins/[id]` - Delete admin

## � Testing

### Manual Testing Checklist

**Student Flow:**
- [ ] Register new student account
- [ ] Login with student credentials
- [ ] View interactive tour guide on first login
- [ ] Navigate dashboard and view statistics
- [ ] Register for courses with smart suggestions
- [ ] Verify validation (compulsory courses, unit limits)
- [ ] Modify existing registration
- [ ] View registration history
- [ ] Download registration slip
- [ ] Test on mobile device

**Admin Flow:**
- [ ] Login with admin credentials
- [ ] View admin tour guide on first login
- [ ] View dashboard statistics
- [ ] Add new student
- [ ] Edit student information
- [ ] Add new course
- [ ] Edit course details
- [ ] Approve student registration
- [ ] Reject student registration
- [ ] Change semester in settings
- [ ] Toggle registration status
- [ ] Toggle prerequisite checking

**Responsive Design:**
- [ ] Test on mobile (320px - 767px)
- [ ] Test on tablet (768px - 1023px)
- [ ] Test on desktop (1024px+)
- [ ] Verify all tables scroll horizontally on mobile
- [ ] Check button sizes are touch-friendly
- [ ] Verify text is readable at all sizes

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** 
- Ensure MongoDB is running locally: `mongod` or start MongoDB service
- Check your `MONGODB_URI` in `.env.local`
- For MongoDB Atlas, verify your connection string and network access settings
- Ensure your IP address is whitelisted in MongoDB Atlas

**JWT Authentication Error:**
```
Error: Invalid token
```
**Solution:** 
- Clear browser cookies and login again
- Ensure `JWT_SECRET` is set in `.env.local`
- Check that the secret matches between token creation and verification
- Try logging out and logging back in

**Tour Guide Not Showing:**
**Solution:** 
- Clear localStorage for the site: Open DevTools → Application → Local Storage → Clear
- Open in incognito/private mode to reset tour state
- Check browser console for JavaScript errors

**Courses Not Loading:**
**Solution:** 
- Run `npm run setup` to seed the database with sample data
- Check MongoDB connection in browser console
- Verify API routes are responding: visit `/api/courses` directly
- Check for errors in terminal where dev server is running

**Build Errors:**
```
Error: Module not found
```
**Solution:** 
- Delete `node_modules` and `.next` folders
- Run `npm install` to reinstall dependencies
- Clear npm cache: `npm cache clean --force`
- Ensure you're using Node.js 18 or higher: `node --version`

**TypeScript Errors:**
```
Type error: Cannot find module...
```
**Solution:**
- Run `npm install` to ensure all type definitions are installed
- Delete `tsconfig.tsbuildinfo` and restart the dev server
- Check that all imports use correct paths

**Styling Not Applied:**
**Solution:**
- Ensure Tailwind CSS is properly configured
- Check that `globals.css` is imported in `app/layout.tsx`
- Clear `.next` folder and restart dev server
- Verify PostCSS configuration in `postcss.config.mjs`

**API Routes Returning 404:**
**Solution:**
- Ensure file is named `route.ts` (not `route.tsx`)
- Check that the file exports named functions: `GET`, `POST`, `PUT`, `DELETE`
- Verify the file is in the correct `app/api/` directory structure
- Restart the development server

**Database Seeding Fails:**
**Solution:**
- Ensure MongoDB is running and accessible
- Check that `MONGODB_URI` is correct in `.env.local`
- Verify you have write permissions to the database
- Try manually connecting to MongoDB using MongoDB Compass or mongosh

## 🔒 Security Considerations

### Current Security Features
- **JWT Tokens:** Stored in httpOnly cookies to prevent XSS attacks
- **Password Hashing:** Uses bcryptjs with salt rounds for secure password storage
- **Input Validation:** All user inputs validated on both client and server using Zod schemas
- **MongoDB Injection:** Uses Mongoose parameterized queries to prevent injection attacks
- **CORS:** Configured for same-origin requests only
- **Environment Variables:** Sensitive data stored in `.env.local` (excluded from version control via `.gitignore`)
- **Secure Cookies:** httpOnly flag prevents JavaScript access to authentication tokens

### Production Security Recommendations
- **HTTPS:** Use HTTPS for all connections (required for secure cookies)
- **Rate Limiting:** Implement rate limiting on API routes to prevent brute force attacks
- **CSRF Protection:** Add CSRF tokens for state-changing operations
- **MongoDB Authentication:** Enable authentication and use strong credentials
- **Strong JWT Secrets:** Use cryptographically secure random strings (32+ characters)
- **Session Timeout:** Implement automatic session expiration
- **Audit Logging:** Add logging for admin actions and sensitive operations
- **Content Security Policy:** Add CSP headers to prevent XSS
- **Helmet.js:** Add security headers for production deployment
- **Input Sanitization:** Sanitize user inputs to prevent stored XSS
- **File Upload Validation:** If adding file uploads, validate file types and sizes
- **Database Backups:** Regular automated backups of MongoDB data

### Security Best Practices for Development
- Never commit `.env.local` or sensitive credentials
- Rotate JWT secrets regularly in production
- Use different credentials for development and production
- Keep dependencies updated (`npm audit` and `npm update`)
- Review and test authentication flows regularly
- Implement proper error handling without exposing sensitive information

---

## 📝 License

This project is developed for academic purposes at the University of Port Harcourt.

---

**University of Port Harcourt**  
*Department of Computer Science*  
*Smart Course Registration Portal*  
*Developed for Academic Excellence*

**Built with:** Next.js 16 • React 19 • TypeScript • MongoDB • Tailwind CSS • Framer Motion
