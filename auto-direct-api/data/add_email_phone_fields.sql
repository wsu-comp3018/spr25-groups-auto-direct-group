-- Add customer_email and customer_phone fields to existing complaints table
-- Run this script if the complaints table already exists

USE `autos-direct`;

-- Add the new fields to existing complaints table
ALTER TABLE `autos-direct`.`complaints` 
ADD COLUMN `customer_email` VARCHAR(100) NOT NULL AFTER `customer_name`,
ADD COLUMN `customer_phone` VARCHAR(20) NOT NULL AFTER `customer_email`;

-- Update any existing records to have default values (optional - only if needed)
-- UPDATE `autos-direct`.`complaints` 
-- SET `customer_email` = 'unknown@example.com', 
--     `customer_phone` = '0000000000' 
-- WHERE `customer_email` = '' OR `customer_phone` = '';

COMMIT;
