import fs from 'fs';
import path from 'path';

console.log('🚀 Setting up GrindX for development...\n');

// Check if .env exists
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📝 Creating .env file from env.example...');
    const envContent = fs.readFileSync(envExamplePath, 'utf8');
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log('\n⚠️  Please update the .env file with your actual values:');
    console.log('   - MONGODB_URI: Your MongoDB connection string');
    console.log('   - JWT_SECRET: A secure random string for JWT tokens');
    console.log('   - NEXTAUTH_SECRET: A secure random string for NextAuth');
  } else {
    console.log('❌ env.example file not found!');
    console.log('\n📝 Please create a .env file manually with:');
    console.log('   MONGODB_URI=mongodb://localhost:27017/fittrack');
    console.log('   JWT_SECRET=your-jwt-secret-here');
    console.log('   NEXTAUTH_SECRET=your-nextauth-secret-here');
  }
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Update .env with your MongoDB connection string');
console.log('2. Run: npm run seed (to populate database with sample data)');
console.log('3. Run: npm run dev (to start the development server)');
console.log('\n🎉 Setup complete!');
