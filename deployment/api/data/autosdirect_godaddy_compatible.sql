-- GoDaddy Compatible MySQL Script
-- Fixed for older MySQL versions (5.7 and earlier)
-- Use this file if the main one still has issues

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema autos-direct
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `autos-direct` ;

-- -----------------------------------------------------
-- Schema autos-direct
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `autos-direct` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `autos-direct` ;

-- -----------------------------------------------------
-- Table `autos-direct`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `autos-direct`.`users` (
  `userID` INT NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(45) NOT NULL,
  `lastName` VARCHAR(45) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phoneNumber` VARCHAR(20) NULL,
  `address` TEXT NULL,
  `role` ENUM('customer', 'admin', 'dealer', 'manufacturer') NOT NULL DEFAULT 'customer',
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userID`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;

-- -----------------------------------------------------
-- Table `autos-direct`.`manufacturers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `autos-direct`.`manufacturers` (
  `manufacturerID` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `country` VARCHAR(50) NULL,
  `website` VARCHAR(255) NULL,
  `logo` VARCHAR(255) NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`manufacturerID`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;

-- -----------------------------------------------------
-- Table `autos-direct`.`vehicles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `autos-direct`.`vehicles` (
  `vehicleID` INT NOT NULL AUTO_INCREMENT,
  `manufacturerID` INT NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  `year` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `mileage` INT NULL,
  `fuelType` ENUM('Petrol', 'Diesel', 'Electric', 'Hybrid') NULL,
  `transmission` ENUM('Manual', 'Automatic', 'CVT') NULL,
  `bodyType` ENUM('Sedan', 'SUV', 'Hatchback', 'Ute', 'Supercar', 'EV') NULL,
  `engineSize` VARCHAR(20) NULL,
  `doors` INT NULL,
  `seats` INT NULL,
  `driveTrain` ENUM('FWD', 'RWD', 'AWD', '4WD') NULL,
  `color` VARCHAR(50) NULL,
  `description` TEXT NULL,
  `imagePath` VARCHAR(255) NULL,
  `approvalStatus` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `deletedStatus` BOOLEAN DEFAULT FALSE,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`vehicleID`),
  INDEX `fk_vehicles_manufacturers1_idx` (`manufacturerID` ASC) VISIBLE,
  CONSTRAINT `fk_vehicles_manufacturers1`
    FOREIGN KEY (`manufacturerID`)
    REFERENCES `autos-direct`.`manufacturers` (`manufacturerID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;

-- Insert sample data
INSERT INTO `manufacturers` (`name`, `country`, `website`) VALUES
('Toyota', 'Japan', 'https://toyota.com'),
('Honda', 'Japan', 'https://honda.com'),
('Ford', 'USA', 'https://ford.com'),
('BMW', 'Germany', 'https://bmw.com'),
('Mercedes-Benz', 'Germany', 'https://mercedes-benz.com'),
('Tesla', 'USA', 'https://tesla.com');

INSERT INTO `vehicles` (`manufacturerID`, `model`, `year`, `price`, `mileage`, `fuelType`, `transmission`, `bodyType`, `engineSize`, `doors`, `seats`, `driveTrain`, `color`, `description`, `imagePath`, `approvalStatus`) VALUES
(1, 'Camry', 2023, 35000.00, 15000, 'Petrol', 'Automatic', 'Sedan', '2.5L', 4, 5, 'FWD', 'Silver', 'Reliable family sedan with great fuel economy', 'camry_silver.jpg', 'approved'),
(2, 'Civic', 2023, 28000.00, 12000, 'Petrol', 'Manual', 'Hatchback', '1.5L', 5, 5, 'FWD', 'Blue', 'Sporty hatchback perfect for city driving', 'civic_blue.jpg', 'approved'),
(3, 'F-150', 2023, 45000.00, 8000, 'Petrol', 'Automatic', 'Ute', '3.5L V6', 4, 5, '4WD', 'White', 'Powerful pickup truck for work and play', 'f150_white.jpg', 'approved'),
(4, 'X5', 2023, 65000.00, 5000, 'Petrol', 'Automatic', 'SUV', '3.0L', 5, 7, 'AWD', 'Black', 'Luxury SUV with advanced technology', 'x5_black.jpg', 'approved'),
(5, 'C-Class', 2023, 55000.00, 3000, 'Petrol', 'Automatic', 'Sedan', '2.0L', 4, 5, 'RWD', 'Silver', 'Elegant luxury sedan with premium features', 'cclass_silver.jpg', 'approved'),
(6, 'Model 3', 2023, 50000.00, 2000, 'Electric', 'Automatic', 'EV', 'Electric', 4, 5, 'RWD', 'Blue', 'Electric sedan with cutting-edge technology', 'model3_blue.jpg', 'approved');

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
