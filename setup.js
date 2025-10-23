#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🌅 Setting up Sunrise Chat...\n');

// Check if .env file exists
const envPath = path.join(__dirname, 'backend', '.env');
const envExamplePath = path.join(__dirname, 'backend', 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from template');
    console.log('⚠️  Please edit backend/.env and add your OpenAI API key\n');
  } else {
    console.log('❌ env.example file not found');
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists');
}

// Check if OpenAI API key is set
try {
  require('dotenv').config({ path: envPath });
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    console.log('⚠️  Please set your OpenAI API key in backend/.env\n');
  } else {
    console.log('✅ OpenAI API key is configured');
  }
} catch (error) {
  console.log('⚠️  Could not check API key configuration');
}

console.log('\n🚀 Setup complete! To start the application:');
console.log('   npm run dev');
console.log('\n📖 For more information, see README.md');

