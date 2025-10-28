# Database Setup Guide

This guide explains how to set up the database for the Auto Direct API, including the `vehicle_comparison` table.

## 🎯 Quick Setup

Run the automated setup script:

```bash
cd auto-direct-api
npm run setup-db
```

This script:
- Creates the `vehicle_comparison` table
- Creates the `finance_dashboard` table
- Sets up all necessary indexes and foreign keys

## 📋 Manual Setup

If you prefer to set up the database manually:

1. **Connect to MySQL:**
   ```bash
   mysql -u root -p
   ```

2. **Create the database (if it doesn't exist):**
   ```sql
   CREATE DATABASE IF NOT EXISTS `autos-direct`;
   USE `autos-direct`;
   ```

3. **Run the SQL files:**
   ```bash
   # From the auto-direct-api directory
   mysql -u root -p autos-direct < data/finance_and_comparison_tables.sql
   ```

## 📁 SQL Files Reference

All SQL files are located in `auto-direct-api/data/`:

- **`finance_and_comparison_tables.sql`** - Creates `vehicle_comparison` and `finance_dashboard` tables
- **`add_email_phone_fields.sql`** - Adds email and phone fields to existing tables
- **`add_complaints_table.sql`** - Creates the complaints table
- **`chatbot_inquiries_table.sql`** - Creates the chatbot inquiries table

## ✅ Verifying Setup

To verify the `vehicle_comparison` table was created:

```bash
mysql -u root -p
USE `autos-direct`;
DESCRIBE vehicle_comparison;
```

You should see the table structure with columns like:
- `requestID`
- `userID`
- `primaryVehicleID`
- `secondaryVehicleID`
- `tertiaryVehicleID`
- `requestType`
- `status`
- etc.

## 🐛 Troubleshooting

### "Table doesn't exist" Error

If you see this error when using vehicle comparison:

```
Error: Table 'autos-direct.vehicle_comparison' doesn't exist
```

**Solution:**
```bash
cd auto-direct-api
npm run setup-db
```

### "Cannot connect to MySQL" Error

1. Check if MySQL is running:
   ```bash
   # macOS
   brew services list
   # or
   ps aux | grep mysql
   ```

2. Start MySQL if needed:
   ```bash
   brew services start mysql
   ```

3. Verify connection:
   ```bash
   mysql -u root -p
   ```

### "Access denied" Error

1. Check your database credentials in `config/connectionsConfig.js`
2. Make sure the database user has proper permissions:
   ```sql
   GRANT ALL PRIVILEGES ON `autos-direct`.* TO 'your_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

## 🔄 Updating Existing Database

If you need to update an existing database:

1. **Back up your database first:**
   ```bash
   mysqldump -u root -p autos-direct > backup.sql
   ```

2. **Run the update SQL files:**
   ```bash
   mysql -u root -p autos-direct < data/finance_and_comparison_tables.sql
   ```

## 📊 Table Structure

### vehicle_comparison

Stores vehicle comparison requests from customers.

**Key columns:**
- `requestID` (VARCHAR(36), PRIMARY KEY)
- `userID` (VARCHAR(36), FOREIGN KEY to users)
- `primaryVehicleID` (VARCHAR(36), FOREIGN KEY to vehicles)
- `secondaryVehicleID` (VARCHAR(36), FOREIGN KEY to vehicles)
- `tertiaryVehicleID` (VARCHAR(36), FOREIGN KEY to vehicles)
- `requestType` (ENUM)
- `status` (ENUM: Pending, In Progress, Completed, Cancelled)
- `submittedAt` (DATETIME)
- `updatedAt` (DATETIME)
- `completedAt` (DATETIME)

### finance_dashboard

Stores finance applications and loan inquiries.

**Key columns:**
- `requestID` (VARCHAR(36), PRIMARY KEY)
- `userID` (VARCHAR(36), FOREIGN KEY to users)
- `vehicleID` (VARCHAR(36), FOREIGN KEY to vehicles)
- `requestType` (ENUM)
- `status` (ENUM: Pending, In Progress, Approved, Rejected, Completed, Cancelled)
- `annualIncome` (DECIMAL(12,2))
- `loanAmount` (DECIMAL(12,2))
- `submittedAt` (DATETIME)

## 🔗 Related Documentation

- Main README: `/README.md`
- Deployment Guide: `/DEPLOYMENT_GUIDE.md`
- Quick Deployment: `/QUICK_DEPLOYMENT_STEPS.md`

## 💡 Tips

1. **Always backup before running schema changes**
2. **Test in development first before production**
3. **Keep your database credentials secure** (use `.env` in production)
4. **Regular backups are essential** for production databases

