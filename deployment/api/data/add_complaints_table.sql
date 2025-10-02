l-- Add complaints table to autos-direct database
-- This table stores customer complaints that are sent directly to the CEO

USE `autos-direct`;

-- -----------------------------------------------------
-- Table `autos-direct`.`complaints`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `autos-direct`.`complaints` ;

CREATE TABLE IF NOT EXISTS `autos-direct`.`complaints` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `customer_name` VARCHAR(100) NOT NULL,
  `has_account` ENUM('yes', 'no') NOT NULL,
  `account_number` VARCHAR(50) NULL DEFAULT NULL,
  `is_staff_related` ENUM('yes', 'no') NOT NULL,
  `staff_member` VARCHAR(100) NULL DEFAULT NULL,
  `complaint_details` TEXT NOT NULL,
  `resolution_request` TEXT NOT NULL,
  `contact_details` TEXT NOT NULL,
  `status` ENUM('pending', 'in_review', 'resolved', 'closed') NOT NULL DEFAULT 'pending',
  `admin_notes` TEXT NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `status-idx` (`status` ASC) VISIBLE,
  INDEX `created_at-idx` (`created_at` ASC) VISIBLE,
  INDEX `customer_name-idx` (`customer_name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- Insert sample data (optional - for testing)
-- INSERT INTO `autos-direct`.`complaints` 
-- (`customer_name`, `has_account`, `account_number`, `is_staff_related`, `staff_member`, `complaint_details`, `resolution_request`, `contact_details`, `status`) 
-- VALUES 
-- ('John Doe', 'yes', 'ACC123456', 'no', NULL, 'Vehicle delivery was delayed by 2 weeks without proper communication.', 'I would like a discount on the final price and better communication about delivery status.', 'john.doe@email.com, 0412345678', 'pending');
