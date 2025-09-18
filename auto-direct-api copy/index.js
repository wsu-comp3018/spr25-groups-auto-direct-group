const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user-routes');
const vehicleRoutes = require('./routes/vehicle-routes');
const manufacturerRoutes = require('./routes/manufacturer-routes');
const adminRoutes = require('./routes/admin-routes');
const dealerRoutes = require('./routes/dealer-routes');
const testDriveBookingRoutes = require('./routes/test-drive-booking-routes');
const purchasesRoute = require('./routes/purchase-routes');

const app = express();
const connectDB = require("./service/databaseConnection");
const PORT = process.env.PORT || 3000;

const mysql = require('mysql2')
const { connectionConfig } = require('./config/connectionsConfig');
const pool = mysql.createPool(connectionConfig);

app.use(cors());
app.use(express.json()); // Needed to parse JSON bodies
app.use('/user', userRoutes);
app.use('/vehicle', vehicleRoutes);
app.use('/manufacturer', manufacturerRoutes);
app.use('/vehicle-images', express.static('vehicle-images'));
app.use('/admin', adminRoutes);
app.use("/manage-dealerships", dealerRoutes);
app.use("/test-drive", testDriveBookingRoutes);
app.use("/purchases", purchasesRoute);

connectDB();

/*
 * Below code block is a test for the database connection. It will be used to
 * simply retrieve all users from the database.
 * THIS MUST BE REMOVED BEFORE HANDOVER
*/

  app.get('/api/db-connection-test', (req, res) => {
    pool.query('SELECT * from users', (err, results) => {
      if (err) {
        console.error('Query failed: ${err}');
        res.status(500).send('Server error');
      }
      else {
        res.json(results);
      }

      pool.destroy();
    });
  });

// End of database connection test

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})