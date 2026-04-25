# Smart Course Registration Portal - University of Port Harcourt

A modern, intelligent course registration system built with Next.js, featuring smart course suggestions, real-time validation, and a beautiful UI designed to impress university supervisors.

## 🌟 Features

### Smart Course Suggestions
- AI-powered recommendations based on department, level, and semester
- Automatic detection of compulsory courses
- Prerequisite validation
- Real-time unit calculation

### Intelligent Validation
- Compulsory course checking
- Maximum credit unit enforcement (24 units)
- Duplicate course prevention
- Prerequisite requirement validation

### Modern UI/UX
- Glassmorphism design with beautiful animations
- Responsive design for all devices
- Real-time progress indicators
- Smooth micro-interactions
- Loading states and skeleton screens

### Admin Panel
- Student management
- Course management
- Registration oversight
- Analytics dashboard

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)

### Installation

1. **Clone and setup:**
```bash
git clone <repository-url>
cd uniport-course-registration
npm run setup
```

2. **Start development server:**
```bash
npm run dev
```

3. **Open your browser:**
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

## 🛠 Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS, Framer Motion
- **UI Components:** shadcn/ui, Lucide Icons
- **Backend:** Next.js API Routes
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT with httpOnly cookies
- **Validation:** Zod schemas

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Student dashboard
│   ├── register/          # Course registration
│   ├── admin/            # Admin panel
│   └── login/            # Authentication
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── CourseCard.tsx    # Course selection card
│   ├── GlassCard.tsx     # Glassmorphism container
│   └── SmartWarnings.tsx # Validation warnings
├── lib/                  # Utilities
│   ├── auth.ts          # JWT authentication
│   ├── db.ts            # Database connection
│   └── utils.ts         # Helper functions
├── models/              # MongoDB schemas
└── scripts/             # Setup scripts
```

## 🎯 Key Features Demonstration

### 1. Smart Course Suggestions
The system automatically suggests courses based on:
- Student's department (Computer Science)
- Current level (400 Level)
- Semester (First Semester)
- Previously completed courses

### 2. Real-time Validation
- **Compulsory Course Check:** Prevents submission without required courses
- **Unit Limit:** Visual warnings when exceeding 24 units
- **Prerequisites:** Validates course dependencies
- **Duplicates:** Prevents re-registration of completed courses

### 3. Beautiful UI Elements
- **Animated Progress Bars:** Show registration completion
- **Glassmorphism Cards:** Modern, translucent design
- **Micro-interactions:** Hover effects and smooth transitions
- **Smart Warnings:** Contextual validation messages

### 4. Registration Flow
1. **Course Selection:** Browse and select courses with filters
2. **Smart Validation:** Real-time feedback on selection
3. **Review Summary:** Confirm course selection
4. **Success Animation:** Celebration with confetti effect

## 🔧 Configuration

### Environment Variables
Create `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/uniport-registration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Database Seeding
The system includes sample data:
- Computer Science courses (300-400 level)
- Sample students and admin accounts
- Realistic course prerequisites

## 🎨 Design Philosophy

The UI follows modern design principles:
- **Glassmorphism:** Translucent cards with backdrop blur
- **Gradient Accents:** Subtle color transitions
- **Micro-animations:** Smooth, purposeful motion
- **Accessibility:** WCAG compliant color contrasts
- **Mobile-first:** Responsive design for all devices

## 📊 Sample Course Data

The system includes realistic Computer Science courses:

**400 Level Compulsory:**
- CSC480: Research Methodology (2 units)
- CSC481: Software Engineering (3 units)
- CSC482: Computer Graphics (3 units)
- CSC483: Artificial Intelligence (3 units)
- CSC486: Computer Networks (3 units)
- CSC496: Project I (3 units)
- CSC498: Industrial Training (6 units)
- GES400: Entrepreneurship (2 units)

**Electives:**
- CSC484: Machine Learning (3 units)
- CSC485: Mobile Development (3 units)
- CSC487: Cybersecurity (3 units)
- CSC488: Cloud Computing (3 units)

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
- Set production MongoDB URI
- Configure secure JWT secret
- Enable HTTPS in production

## 🎓 University Project Notes

This system is designed to impress during project defense:

1. **Visual Impact:** Modern, professional interface
2. **Technical Depth:** Full-stack implementation with proper validation
3. **Real-world Relevance:** Solves actual university registration problems
4. **Code Quality:** Clean, well-structured, and documented
5. **User Experience:** Intuitive flow with helpful feedback

## 📝 License

This project is created for educational purposes at the University of Port Harcourt.

## 🤝 Contributing

This is a university group project. For contributions:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**University of Port Harcourt**  
*Smart Course Registration Portal*  
*Developed for Academic Excellence*
