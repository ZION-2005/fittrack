import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User.js';
import Workout from '../models/Workout.js';
import Log from '../models/Log.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });

// Sample users data
const sampleUsers = [
    {
        name: 'Admin',
        email: 'admin@example.com',
        password: 'password123',
    },
  {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    password: 'password123'
  },
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    password: 'password123'
  },
  {
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@example.com',
    password: 'password123'
  },
  {
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    password: 'password123'
  },
  {
    name: 'David Kim',
    email: 'david.kim@example.com',
    password: 'password123'
  },
  {
    name: 'Lisa Thompson',
    email: 'lisa.thompson@example.com',
    password: 'password123'
  },
  {
    name: 'James Brown',
    email: 'james.brown@example.com',
    password: 'password123'
  },
  {
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    password: 'password123'
  }
];

// Sample workouts data
const sampleWorkouts = [
  {
    name: 'Morning Cardio Blast',
    category: 'Cardio',
    sets: 3,
    reps: 20,
    notes: 'High-intensity cardio workout to start your day with energy'
  },
  {
    name: 'Upper Body Strength',
    category: 'Arms',
    sets: 4,
    reps: 12,
    notes: 'Build upper body strength with compound movements'
  },
  {
    name: 'Leg Day Power',
    category: 'Legs',
    sets: 5,
    reps: 15,
    notes: 'Complete leg workout for power and strength'
  },
  {
    name: 'Yoga Flow',
    category: 'Other',
    sets: 1,
    reps: 45,
    notes: 'Relaxing yoga flow for flexibility and mindfulness'
  },
  {
    name: 'HIIT Training',
    category: 'Cardio',
    sets: 6,
    reps: 30,
    notes: 'High-intensity interval training for maximum results'
  },
  {
    name: 'Core Strengthening',
    category: 'Core',
    sets: 4,
    reps: 20,
    notes: 'Targeted core workout for stability and strength'
  },
  {
    name: 'Full Body Circuit',
    category: 'Full Body',
    sets: 3,
    reps: 15,
    notes: 'Complete full body workout in circuit format'
  },
  {
    name: 'Swimming Session',
    category: 'Cardio',
    sets: 8,
    reps: 25,
    notes: 'Low-impact cardio workout in the pool'
  },
  {
    name: 'Pilates Core',
    category: 'Core',
    sets: 3,
    reps: 10,
    notes: 'Pilates-based core strengthening routine'
  },
  {
    name: 'Boxing Workout',
    category: 'Cardio',
    sets: 5,
    reps: 3,
    notes: 'High-energy boxing workout for cardio and strength'
  },
  {
    name: 'Back & Shoulders',
    category: 'Back',
    sets: 4,
    reps: 12,
    notes: 'Focus on back and shoulder development'
  },
  {
    name: 'Chest & Triceps',
    category: 'Chest',
    sets: 4,
    reps: 10,
    notes: 'Upper body push day workout'
  },
  {
    name: 'Biceps & Forearms',
    category: 'Arms',
    sets: 3,
    reps: 15,
    notes: 'Arm-focused strength training'
  },
  {
    name: 'Running Session',
    category: 'Cardio',
    sets: 1,
    reps: 30,
    notes: 'Steady-state running for endurance'
  },
  {
    name: 'Shoulder Workout',
    category: 'Shoulders',
    sets: 4,
    reps: 12,
    notes: 'Focused shoulder strengthening routine'
  }
];

// Sample notes for workout logs
const sampleNotes = [
  'Great workout! Felt really strong today.',
  'Tough session but pushed through it.',
  'Love this workout routine.',
  'Could feel the burn in the last few sets.',
  'Perfect weather for an outdoor workout.',
  'Really enjoyed this session with friends.',
  'Challenging but rewarding workout.',
  'Feeling stronger each week!',
  'Had to modify a few exercises due to minor injury.',
  'Excellent workout, highly recommend this routine.',
  'The intensity was perfect for today.',
  'Great way to start the day!',
  'Feeling energized after this session.',
  'This workout never gets easier, but that\'s why I love it.',
  'Perfect way to unwind after work.',
  'Really focused on form today.',
  'Increased weights from last time.',
  'Great session with my workout partner.',
  'Felt the progress from consistent training.',
  'Challenging but I conquered it!'
];

async function seedDatabase() {
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is not set!');
      console.log('\n📝 Please set up your environment variables:');
      console.log('1. Create a .env file in the root directory');
      console.log('2. Add: MONGODB_URI=mongodb://localhost:27017/fittrack');
      console.log('3. For MongoDB Atlas: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fittrack');
      process.exit(1);
    }

    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Workout.deleteMany({});
    await Log.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create workouts for each user
    console.log('💪 Creating workouts...');
    const allWorkouts = [];
    
    for (const user of createdUsers) {
      // Each user gets 4-6 random workouts
      const userWorkoutCount = Math.floor(Math.random() * 3) + 4;
      const shuffledWorkouts = [...sampleWorkouts].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < userWorkoutCount; i++) {
        const workoutData = {
          ...shuffledWorkouts[i],
          createdBy: user._id
        };
        allWorkouts.push(workoutData);
      }
    }
    
    const createdWorkouts = await Workout.insertMany(allWorkouts);
    console.log(`✅ Created ${createdWorkouts.length} workouts`);

    // Create logs for each user
    console.log('📝 Creating workout logs...');
    const allLogs = [];
    
    for (const user of createdUsers) {
      const userWorkouts = createdWorkouts.filter(w => w.createdBy.toString() === user._id.toString());
      
      // Each user has 15-25 workout logs
      const logCount = Math.floor(Math.random() * 11) + 15;
      
      for (let i = 0; i < logCount; i++) {
        const randomWorkout = userWorkouts[Math.floor(Math.random() * userWorkouts.length)];
        const completedAt = new Date();
        completedAt.setDate(completedAt.getDate() - Math.floor(Math.random() * 60)); // Random date within last 60 days
        completedAt.setHours(Math.floor(Math.random() * 12) + 6); // Random hour between 6 AM and 6 PM
        completedAt.setMinutes(Math.floor(Math.random() * 60));
        
        const logData = {
          workoutId: randomWorkout._id,
          userId: user._id,
          completedAt,
          duration: Math.floor(Math.random() * 60) + 20, // 20-80 minutes
          notes: Math.random() > 0.7 ? getRandomNote() : '',
          isShared: Math.random() > 0.5, // 50% chance of being shared
          likes: [],
          comments: []
        };
        
        // Add some random likes to shared logs
        if (logData.isShared && Math.random() > 0.4) {
          const otherUsers = createdUsers.filter(u => u._id.toString() !== user._id.toString());
          const likeCount = Math.floor(Math.random() * Math.min(8, otherUsers.length));
          const randomLikers = otherUsers.sort(() => 0.5 - Math.random()).slice(0, likeCount);
          logData.likes = randomLikers.map(u => u._id);
        }
        
        allLogs.push(logData);
      }
    }
    
    const createdLogs = await Log.insertMany(allLogs);
    console.log(`✅ Created ${createdLogs.length} workout logs`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   💪 Workouts: ${createdWorkouts.length}`);
    console.log(`   📝 Logs: ${createdLogs.length}`);
    console.log(`   🌟 Shared Logs: ${createdLogs.filter(l => l.isShared).length}`);
    
    console.log('\n🔑 Test Login Credentials:');
    console.log('   Email: alex.johnson@example.com');
    console.log('   Password: password123');
    console.log('   (All users use the same password for testing)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

function getRandomNote() {
  return sampleNotes[Math.floor(Math.random() * sampleNotes.length)];
}

// Run the seed function
seedDatabase();
