-- Customer inquiries table for chatbot
CREATE TABLE IF NOT EXISTS customer_inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_message TEXT NOT NULL,
    inquiry_type VARCHAR(50) DEFAULT 'chatbot',
    status ENUM('pending', 'ai_handled', 'responded', 'closed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_business_hours BOOLEAN DEFAULT FALSE,
    ai_response TEXT NULL,
    customer_service_response TEXT NULL,
    customer_email VARCHAR(100) NULL,
    customer_phone VARCHAR(20) NULL,
    assigned_to VARCHAR(100) NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium'
);

-- Add indexes for better performance
CREATE INDEX idx_inquiries_status ON customer_inquiries(status);
CREATE INDEX idx_inquiries_created_at ON customer_inquiries(created_at);
CREATE INDEX idx_inquiries_business_hours ON customer_inquiries(is_business_hours);
ALTER TABLE customer_inquiries ADD COLUMN IF NOT EXISTS session_id VARCHAR(64) NULL;
CREATE INDEX IF NOT EXISTS idx_inquiries_session ON customer_inquiries(session_id);
ALTER TABLE customer_inquiries ADD COLUMN IF NOT EXISTS customer_key VARCHAR(128) NULL;
CREATE INDEX IF NOT EXISTS idx_inquiries_customer_key ON customer_inquiries(customer_key);

-- Messages table to store conversation history per inquiry
CREATE TABLE IF NOT EXISTS chatbot_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  inquiry_id INT NOT NULL,
  sender ENUM('user','agent','ai') NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_messages_inquiry (inquiry_id),
  CONSTRAINT fk_messages_inquiry FOREIGN KEY (inquiry_id)
    REFERENCES customer_inquiries(id) ON DELETE CASCADE
);
