# GrindX - Social Fitness Community

GrindX is a modern social fitness tracking web application built with Next.js, MongoDB, and Shadcn UI that helps users track their fitness routines, share their progress, and get inspired by the community.

## Features

### 🔐 User Authentication
- User registration and login
- Secure password hashing with bcrypt
- JWT-based authentication
- Profile management with fitness goals

### 💪 Workout Management
- Create custom workout routines
- Categorize workouts (Legs, Arms, Cardio, Core, Back, Chest, Shoulders, Full Body, Other)
- Set sets and reps for each exercise
- Add notes and reference links
- Share workouts with the community
- Edit and delete your own workouts

### 🌟 Social Features
- **Community Feed**: View shared workout logs from other users
- **Share Progress**: Choose to share your workout logs with the community
- **Like & Interact**: Like and engage with other users' posts
- **Privacy Controls**: Keep personal logs private or share with the community
- **Search & Discover**: Find workouts and progress from other users

### 📊 Progress Tracking
- Log completed workouts with duration and notes
- Track workout history and progress
- View personal workout statistics
- Keep detailed notes about each session
- Share achievements with the community

### 🎨 Modern UI/UX
- Beautiful, responsive design with Shadcn UI
- Black color scheme for a modern look
- Mobile-first approach
- Intuitive navigation and user experience

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens with HTTP-only cookies
- **UI Components**: Shadcn UI with Radix UI primitives
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom design system

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd grindx
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory based on the `env.example`:
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/grindx
   
   # Authentication
   JWT_SECRET=your-jwt-secret-here
   
   # API
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # For local MongoDB
   mongod
   
   # Or if using MongoDB as a service
   sudo systemctl start mongod
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
grindx/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── workouts/      # Workout CRUD operations
│   │   └── logs/          # Workout log operations
│   ├── feed/              # Community feed page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── workouts/          # Workout pages
│   ├── logs/              # Log pages
│   ├── profile/           # User profile page
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Home page
├── components/            # React components
│   ├── ui/                # Shadcn UI components
│   ├── auth/              # Authentication components
│   └── layout/            # Layout components
├── lib/                   # Utility libraries
│   ├── mongodb.js         # Database connection
│   ├── auth.js            # Authentication utilities
│   └── utils.js           # General utilities
├── models/                # MongoDB models
│   ├── User.js            # User model
│   ├── Workout.js         # Workout model
│   └── Log.js             # Log model with social features
├── public/                # Static assets
└── env.example            # Environment variables template
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user profile

### Workouts
- `GET /api/workouts` - Get all workouts (with pagination and filtering)
- `POST /api/workouts` - Create a new workout
- `GET /api/workouts/[id]` - Get a specific workout
- `PUT /api/workouts/[id]` - Update a workout (owner only)
- `DELETE /api/workouts/[id]` - Delete a workout (owner only)

### Logs
- `GET /api/logs` - Get user's workout logs
- `POST /api/logs` - Create a new log entry
- `GET /api/logs/[id]` - Get a specific log entry
- `PUT /api/logs/[id]` - Update a log entry
- `DELETE /api/logs/[id]` - Delete a log entry
- `GET /api/logs/shared` - Get shared logs for community feed
- `POST /api/logs/[id]/like` - Like/unlike a shared log

## Social Features

### Community Feed
- View shared workout logs from other users
- Like and interact with posts
- Search through shared content
- Get inspired by others' progress

### Privacy Controls
- Choose to share or keep logs private
- Personal logs remain private by default
- Shared logs appear in community feed
- Full control over what you share

## Usage

### Getting Started
1. **Register**: Create a new account with your name, email, and password
2. **Login**: Sign in to access your dashboard
3. **Create Workouts**: Build custom workout routines with sets, reps, and categories
4. **Log Workouts**: Track your completed workouts with duration and notes
5. **Share Progress**: Choose to share your achievements with the community
6. **Explore Feed**: Discover and get inspired by other users' progress

### Key Features
- **Community Workouts**: Browse and use workouts created by other users
- **Social Sharing**: Share your workout progress with the GrindX community
- **Personal Logs**: Keep detailed records of your workout sessions
- **Progress Tracking**: Monitor your fitness progress over time
- **Community Interaction**: Like and engage with other users' posts
- **Responsive Design**: Access your fitness data on any device

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:
1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Contact the development team

## Future Enhancements

- [ ] Comments on shared posts
- [ ] User following system
- [ ] Workout challenges and competitions
- [ ] Progress charts and analytics
- [ ] Mobile app development
- [ ] Integration with fitness trackers
- [ ] Workout reminders and notifications
- [ ] Nutrition tracking integration
- [ ] Advanced workout scheduling
- [ ] Achievement badges and rewards

---

**Join the GrindX Community! 💪🌟**