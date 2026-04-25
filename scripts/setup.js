const { execSync } = require('child_process');

console.log('🚀 Setting up Smart Course Registration Portal...\n');

try {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('\n🌱 Seeding database...');
  execSync('curl -X POST http://localhost:3000/api/seed', { stdio: 'inherit' });

  console.log('\n✅ Setup complete!');
  console.log('\n🎯 Next steps:');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Open http://localhost:3000');
  console.log('3. Login with:');
  console.log('   Student: john.doe@uniport.edu.ng / student123');
  console.log('   Admin: admin@uniport.edu.ng / admin123');
  
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}