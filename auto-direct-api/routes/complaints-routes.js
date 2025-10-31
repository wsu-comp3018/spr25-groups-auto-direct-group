const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const { connectionConfig } = require('../config/connectionsConfig');
const { emailService } = require('../service/email-service.js');

const pool = mysql.createPool(connectionConfig);

// Function to send complaint email using new professional template
const sendComplaintEmail = async (complaintData) => {
  try {
    const content = `
      <div class="message-text">
        A new customer complaint has been submitted and requires your attention.
      </div>
      
      <div class="highlight-box">
        <h3>New Customer Complaint</h3>
        <p>Please review the details below and take appropriate action.</p>
      </div>
      
      <div class="details-container">
        <div class="details-title">Complaint Details</div>
        <div class="detail-row">
          <span class="detail-label">Customer Name:</span>
          <span class="detail-value"><strong>${complaintData.customer_name}</strong></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Customer Email:</span>
          <span class="detail-value">${complaintData.customer_email}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Customer Phone:</span>
          <span class="detail-value">${complaintData.customer_phone}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Has Account:</span>
          <span class="detail-value">${complaintData.has_account}</span>
        </div>
        ${complaintData.account_number ? `
        <div class="detail-row">
          <span class="detail-label">Account Number:</span>
          <span class="detail-value">${complaintData.account_number}</span>
        </div>
        ` : ''}
        <div class="detail-row">
          <span class="detail-label">Staff Related:</span>
          <span class="detail-value">${complaintData.is_staff_related}</span>
        </div>
        ${complaintData.staff_member ? `
        <div class="detail-row">
          <span class="detail-label">Staff Member:</span>
          <span class="detail-value">${complaintData.staff_member}</span>
        </div>
        ` : ''}
      </div>
      
      <div class="details-container">
        <div class="details-title">Complaint Details</div>
        <div class="detail-text" style="background: #f8f9fa; padding: 15px; border-left: 4px solid #6c757d; margin: 10px 0;">${complaintData.complaint_details}</div>
      </div>
      
      <div class="details-container">
        <div class="details-title">Resolution Request</div>
        <div class="detail-text" style="background: #f8f9fa; padding: 15px; border-left: 4px solid #6c757d; margin: 10px 0;">${complaintData.resolution_request}</div>
      </div>
      
      <div class="details-container">
        <div class="details-title">Contact Details</div>
        <div class="detail-text" style="background: #f8f9fa; padding: 15px; border-left: 4px solid #6c757d; margin: 10px 0;">${complaintData.contact_details}</div>
      </div>
      
      <div class="info-box" style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
        <p><em>This complaint was submitted on ${new Date().toLocaleString()}</em></p>
      </div>
    `;

    const subject = `New Complaint from ${complaintData.customer_name}`;
    const htmlContent = emailService.createProfessionalEmailTemplate(subject, content, 'Customer Service Team');
    
    const transporter = emailService.createTransporter();
    const mailOptions = {
      from: `AutoDirect <${emailService.auth.user}>`,
      to: '22070210@student.westernsydney.edu.au',
      subject: subject,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log('Complaint email sent successfully with new professional template');
    return true;
  } catch (error) {
    console.error('Error sending complaint email:', error);
    return false;
  }
};

// POST /api/complaints - Submit a new complaint
router.post('/', (req, res) => {
  try {
    console.log('Complaint submission received:', req.body);
    
    const {
      customerName,
      customerEmail,
      customerPhone,
      hasAccount,
      accountNumber,
      isStaffRelated,
      staffMember,
      complaintDetails,
      resolutionRequest,
      contactDetails
    } = req.body;

  // Validate required fields
  if (!customerName || !customerEmail || !customerPhone || !hasAccount || !isStaffRelated || !complaintDetails || !resolutionRequest || !contactDetails) {
    console.log('Validation failed - missing fields');
    return res.status(400).json({ 
      error: 'Missing required fields. Please fill in all required information.' 
    });
  }

  const complaintData = {
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    has_account: hasAccount,
    account_number: accountNumber || null,
    is_staff_related: isStaffRelated,
    staff_member: staffMember || null,
    complaint_details: complaintDetails,
    resolution_request: resolutionRequest,
    contact_details: `Email: ${customerEmail}\nPhone: ${customerPhone}\nAdditional: ${contactDetails}`,
    status: 'pending',
    created_at: new Date(),
    updated_at: new Date()
  };

  const query = `
    INSERT INTO complaints (
      customer_name, 
      customer_email, 
      customer_phone,
      has_account, 
      account_number, 
      is_staff_related, 
      staff_member, 
      complaint_details, 
      resolution_request, 
      contact_details, 
      status, 
      created_at, 
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    complaintData.customer_name,
    complaintData.customer_email,
    complaintData.customer_phone,
    complaintData.has_account,
    complaintData.account_number,
    complaintData.is_staff_related,
    complaintData.staff_member,
    complaintData.complaint_details,
    complaintData.resolution_request,
    complaintData.contact_details,
    complaintData.status,
    complaintData.created_at,
    complaintData.updated_at
  ];

  pool.query(query, values, async (err, result) => {
    if (err) {
      console.error('Database error inserting complaint:', err);
      console.error('Query:', query);
      console.error('Values:', values);
      return res.status(500).json({ 
        error: 'Failed to submit complaint. Please try again later.' 
      });
    }

    console.log('Complaint submitted successfully:', {
      id: result.insertId,
      customer: customerName,
      timestamp: new Date().toISOString()
    });

    // Send email notification
    const emailSent = await sendComplaintEmail(complaintData);
    if (!emailSent) {
      console.log('Warning: Email notification failed, but complaint was saved to database');
    }

    res.status(201).json({
      message: 'Complaint submitted successfully. You will receive a response directly.',
      complaintId: result.insertId
    });
  });
  } catch (error) {
    console.error('Unexpected error in complaints route:', error);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

// GET /api/complaints - Get all complaints (for admin/CEO use)
router.get('/', (req, res) => {
  const query = `
    SELECT 
      id,
      customer_name,
      has_account,
      account_number,
      is_staff_related,
      staff_member,
      complaint_details,
      resolution_request,
      contact_details,
      status,
      created_at,
      updated_at
    FROM complaints 
    ORDER BY created_at DESC
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching complaints:', err);
      return res.status(500).json({ 
        error: 'Failed to fetch complaints' 
      });
    }

    res.json(results);
  });
});

// GET /api/complaints/:id - Get a specific complaint by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT 
      id,
      customer_name,
      has_account,
      account_number,
      is_staff_related,
      staff_member,
      complaint_details,
      resolution_request,
      contact_details,
      status,
      created_at,
      updated_at
    FROM complaints 
    WHERE id = ?
  `;

  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching complaint:', err);
      return res.status(500).json({ 
        error: 'Failed to fetch complaint' 
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ 
        error: 'Complaint not found' 
      });
    }

    res.json(results[0]);
  });
});

// PUT /api/complaints/:id - Update complaint status (for admin/CEO use)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { status, admin_notes } = req.body;

  if (!status) {
    return res.status(400).json({ 
      error: 'Status is required' 
    });
  }

  const validStatuses = ['pending', 'in_review', 'resolved', 'closed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: 'Invalid status. Must be one of: pending, in_review, resolved, closed' 
    });
  }

  const query = `
    UPDATE complaints 
    SET status = ?, admin_notes = ?, updated_at = ?
    WHERE id = ?
  `;

  const values = [status, admin_notes || null, new Date(), id];

  pool.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating complaint:', err);
      return res.status(500).json({ 
        error: 'Failed to update complaint' 
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        error: 'Complaint not found' 
      });
    }

    res.json({
      message: 'Complaint updated successfully',
      complaintId: id,
      status: status
    });
  });
});

module.exports = router;
