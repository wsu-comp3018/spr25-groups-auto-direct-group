-- SQL Scripts for Finance Dashboard and Vehicle Comparison Tables
-- Run these scripts in MySQL Workbench to create the tables

USE `autos-direct`;

-- -----------------------------------------------------
-- Table `autos-direct`.`finance_dashboard`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `autos-direct`.`finance_dashboard`;

CREATE TABLE IF NOT EXISTS `autos-direct`.`finance_dashboard` (
  `requestID` VARCHAR(36) NOT NULL,
  `userID` VARCHAR(36) NOT NULL,
  `vehicleID` VARCHAR(36) NOT NULL,
  `dealerID` VARCHAR(36) NULL DEFAULT NULL,
  `requestType` ENUM('Finance Application', 'Loan Inquiry', 'Trade-in Valuation', 'Insurance Quote') NOT NULL,
  `status` ENUM('Pending', 'In Progress', 'Approved', 'Rejected', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
  `annualIncome` DECIMAL(12,2) NULL DEFAULT NULL,
  `employmentStatus` VARCHAR(100) NULL DEFAULT NULL,
  `loanAmount` DECIMAL(12,2) NULL DEFAULT NULL,
  `loanTerm` INT NULL DEFAULT NULL,
  `tradeInVehicle` VARCHAR(255) NULL DEFAULT NULL,
  `tradeInCondition` ENUM('Excellent', 'Good', 'Fair', 'Poor') NULL DEFAULT NULL,
  `customerNotes` LONGTEXT NULL DEFAULT NULL,
  `adminNotes` LONGTEXT NULL DEFAULT NULL,
  `submittedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `completedAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`requestID`),
  INDEX `userID-idx` (`userID` ASC) VISIBLE,
  INDEX `vehicleID-idx` (`vehicleID` ASC) VISIBLE,
  INDEX `dealerID-idx` (`dealerID` ASC) VISIBLE,
  INDEX `status-idx` (`status` ASC) VISIBLE,
  INDEX `requestType-idx` (`requestType` ASC) VISIBLE,
  CONSTRAINT `financedashboard-userID`
    FOREIGN KEY (`userID`)
    REFERENCES `autos-direct`.`users` (`userID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `financedashboard-vehicleID`
    FOREIGN KEY (`vehicleID`)
    REFERENCES `autos-direct`.`vehicles` (`vehicleID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `financedashboard-dealerID`
    FOREIGN KEY (`dealerID`)
    REFERENCES `autos-direct`.`dealers` (`dealerID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `autos-direct`.`vehicle_comparison`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `autos-direct`.`vehicle_comparison`;

CREATE TABLE IF NOT EXISTS `autos-direct`.`vehicle_comparison` (
  `requestID` VARCHAR(36) NOT NULL,
  `userID` VARCHAR(36) NOT NULL,
  `primaryVehicleID` VARCHAR(36) NOT NULL,
  `secondaryVehicleID` VARCHAR(36) NULL DEFAULT NULL,
  `tertiaryVehicleID` VARCHAR(36) NULL DEFAULT NULL,
  `dealerID` VARCHAR(36) NULL DEFAULT NULL,
  `requestType` ENUM('Vehicle Comparison', 'Feature Analysis', 'Price Comparison', 'Specification Review') NOT NULL DEFAULT 'Vehicle Comparison',
  `status` ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
  `budget` DECIMAL(12,2) NULL DEFAULT NULL,
  `customerNotes` LONGTEXT NULL DEFAULT NULL,
  `adminNotes` LONGTEXT NULL DEFAULT NULL,
  `submittedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `completedAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`requestID`),
  INDEX `userID-idx` (`userID` ASC) VISIBLE,
  INDEX `primaryVehicleID-idx` (`primaryVehicleID` ASC) VISIBLE,
  INDEX `secondaryVehicleID-idx` (`secondaryVehicleID` ASC) VISIBLE,
  INDEX `tertiaryVehicleID-idx` (`tertiaryVehicleID` ASC) VISIBLE,
  INDEX `dealerID-idx` (`dealerID` ASC) VISIBLE,
  INDEX `status-idx` (`status` ASC) VISIBLE,
  INDEX `requestType-idx` (`requestType` ASC) VISIBLE,
  CONSTRAINT `vehiclecomparison-userID`
    FOREIGN KEY (`userID`)
    REFERENCES `autos-direct`.`users` (`userID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `vehiclecomparison-primaryVehicleID`
    FOREIGN KEY (`primaryVehicleID`)
    REFERENCES `autos-direct`.`vehicles` (`vehicleID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `vehiclecomparison-secondaryVehicleID`
    FOREIGN KEY (`secondaryVehicleID`)
    REFERENCES `autos-direct`.`vehicles` (`vehicleID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `vehiclecomparison-tertiaryVehicleID`
    FOREIGN KEY (`tertiaryVehicleID`)
    REFERENCES `autos-direct`.`vehicles` (`vehicleID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `vehiclecomparison-dealerID`
    FOREIGN KEY (`dealerID`)
    REFERENCES `autos-direct`.`dealers` (`dealerID`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- Optional: Insert sample data for testing
-- Uncomment these lines if you want sample data

-- INSERT INTO `autos-direct`.`finance_dashboard` 
-- (`requestID`, `userID`, `vehicleID`, `requestType`, `status`, `annualIncome`, `employmentStatus`, `loanAmount`, `loanTerm`, `customerNotes`)
-- VALUES 
-- (UUID(), 'sample-user-id', 'sample-vehicle-id', 'Finance Application', 'Pending', 65000.00, 'Full-time', 45000.00, 60, 'Looking for competitive interest rates');

-- INSERT INTO `autos-direct`.`vehicle_comparison`
-- (`requestID`, `userID`, `primaryVehicleID`, `requestType`, `status`, `budget`, `customerNotes`)
-- VALUES
-- (UUID(), 'sample-user-id', 'sample-vehicle-id', 'Vehicle Comparison', 'Pending', 50000.00, 'Need help comparing fuel efficiency and safety features');