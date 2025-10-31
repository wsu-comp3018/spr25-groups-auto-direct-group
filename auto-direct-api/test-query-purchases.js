const mysql = require('mysql2');
const { connectionConfig } = require('./config/connectionsConfig.js');

const pool = mysql.createPool(connectionConfig);

console.log('🔍 Testing database query for purchases with prices...\n');

const query = `SELECT 
    purchases.purchaseID as orderID, 
    purchases.vehicleID, 
    purchases.orderStatus as status, 
    purchases.orderDate,
    vehicles.modelName,
    vehicles.price,
    makes.makeName,
    users.firstName,
    users.lastName
FROM purchases 
JOIN vehicles ON purchases.vehicleID = vehicles.vehicleID
JOIN makes ON makes.makeID = vehicles.makeID
JOIN manufacturers ON makes.manufacturerID = manufacturers.manufacturerID
LEFT JOIN users ON purchases.purchaserID = users.userID
ORDER BY purchases.orderDate DESC
LIMIT 5;`;

pool.query(query, [], (err, result) => {
    if (err) {
        console.error('❌ Query error:', err);
        process.exit(1);
    }
    
    console.log(`✅ Found ${result.length} purchases\n`);
    
    result.forEach((row, index) => {
        console.log(`Order ${index + 1}:`);
        console.log(`  Order ID: ${row.orderID}`);
        console.log(`  Customer: ${row.firstName} ${row.lastName}`);
        console.log(`  Vehicle: ${row.makeName} ${row.modelName}`);
        console.log(`  Price: $${row.price}`);
        console.log(`  Status: ${row.status}`);
        console.log(`  Date: ${row.orderDate}`);
        console.log('');
    });
    
    process.exit(0);
});
