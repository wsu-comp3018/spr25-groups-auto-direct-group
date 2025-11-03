-- Migration: Add customer and license information fields to purchases table
-- Date: 2025-10-31
-- Description: Adds purchase-time customer details and license information to support Order Management
-- Run this SQL on your database after pulling the latest code

-- Add customer detail fields (to store purchase-time data instead of relying on users table)
ALTER TABLE purchases 
ADD COLUMN IF NOT EXISTS customerFirstName VARCHAR(100),
ADD COLUMN IF NOT EXISTS customerLastName VARCHAR(100),
ADD COLUMN IF NOT EXISTS customerEmail VARCHAR(255),
ADD COLUMN IF NOT EXISTS customerPhone VARCHAR(20),
ADD COLUMN IF NOT EXISTS customerAddress TEXT;

-- Add license information fields
ALTER TABLE purchases 
ADD COLUMN IF NOT EXISTS licenseFirstName VARCHAR(100),
ADD COLUMN IF NOT EXISTS licenseLastName VARCHAR(100),
ADD COLUMN IF NOT EXISTS licenseNumber VARCHAR(50),
ADD COLUMN IF NOT EXISTS licenseState VARCHAR(10),
ADD COLUMN IF NOT EXISTS licenseExpiryDate DATE;

-- Verify the columns were added
DESCRIBE purchases;

-- Note: This migration is required for the Order Management feature to display
-- customer and license information correctly. Without these columns, the API
-- will fall back to using data from the users table.
