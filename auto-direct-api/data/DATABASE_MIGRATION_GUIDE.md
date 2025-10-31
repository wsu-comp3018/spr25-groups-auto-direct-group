# Database Migration Guide

## For AWS Deployment and Team Setup

### Required Migrations

After pulling the latest code, run these SQL migrations in order:

#### 1. Add License and Customer Fields (2025-10-31)
```bash
mysql -u your_username -p your_database < add_license_fields.sql
```

Or manually in MySQL Workbench:
- Open `add_license_fields.sql`
- Execute all statements

### What These Migrations Do

**Customer Fields:**
- `customerFirstName`, `customerLastName`, `customerEmail`, `customerPhone`, `customerAddress`
- These store the customer information entered during purchase (not profile data)

**License Fields:**
- `licenseFirstName`, `licenseLastName`, `licenseNumber`, `licenseState`, `licenseExpiryDate`
- Stores driver's license information collected during purchase

### For AWS RDS Deployment

1. **Connect to your AWS RDS instance:**
   ```bash
   mysql -h your-rds-endpoint.amazonaws.com -u admin -p your_database
   ```

2. **Run the migration:**
   ```sql
   source /path/to/add_license_fields.sql;
   ```

3. **Verify:**
   ```sql
   DESCRIBE purchases;
   ```

### Troubleshooting

**Error: Column already exists**
- The migration uses `IF NOT EXISTS`, so it's safe to run multiple times

**Error: Table 'purchases' doesn't exist**
- Run the main database setup first: `autosdirect_db29.05.sql`

**Missing data after migration**
- Old purchases won't have license data (columns will be NULL)
- New purchases will automatically populate these fields

### Team Coordination

**When deploying to AWS:**
1. One person deploys the code changes
2. Same person (or DBA) runs the SQL migration on AWS RDS
3. Everyone else pulls the code - no database changes needed on their local machines unless testing

**For local development:**
- Each team member should run the migration on their local MySQL database
- This ensures everyone can test the Order Management features locally
