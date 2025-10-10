// Check database structure
const mysql = require('mysql2');
const { connectionConfig } = require('./config/connectionsConfig.js');

const pool = mysql.createPool(connectionConfig);

console.log('Checking vehicles table structure...');

pool.query('DESCRIBE vehicles', (err, result) => {
  if (err) {
    console.error('Error describing vehicles table:', err);
  } else {
    console.log('\nVehicles table columns:');
    result.forEach(col => {
      console.log(`- ${col.Field} (${col.Type})`);
    });
  }
  
  console.log('\nChecking users table structure...');
  pool.query('DESCRIBE users', (err2, result2) => {
    if (err2) {
      console.error('Error describing users table:', err2);
    } else {
      console.log('\nUsers table columns:');
      result2.forEach(col => {
        console.log(`- ${col.Field} (${col.Type})`);
      });
    }
    
    pool.end();
  });
});