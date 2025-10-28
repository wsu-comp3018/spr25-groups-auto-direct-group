#!/usr/bin/env node
// Database setup script to create all necessary tables
// Run this script when setting up a new environment: node setup-database.js

const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const { connectionConfig } = require('./config/connectionsConfig.js');

const pool = mysql.createPool(connectionConfig.promise());

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');
  
  const sqlFiles = [
    'data/finance_and_comparison_tables.sql'
  ];
  
  for (const sqlFile of sqlFiles) {
    const filePath = path.join(__dirname, sqlFile);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Warning: ${sqlFile} not found, skipping...`);
      continue;
    }
    
    const sql = fs.readFileSync(filePath, 'utf8');
    
    try {
      console.log(`📝 Executing ${sqlFile}...`);
      
      // Split SQL by semicolons and execute each statement
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));
      
      for (const statement of statements) {
        if (statement) {
          await pool.execute(statement);
        }
      }
      
      console.log(` Successfully executed ${sqlFile}\n`);
    } catch (error) {
      console.error(`Error executing ${sqlFile}:`, error.message);
      console.error('Continuing with next file...\n');
    }
  }
  
  console.log(' Database setup completed!');
  pool.end();
}

setupDatabase().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

