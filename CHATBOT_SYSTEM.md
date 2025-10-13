# Chatbot System - Grouped Messages Implementation

## Overview

The chatbot system has been updated to properly group messages per person/session instead of creating a new row for each message. This provides a much better user experience and more efficient data management.

## Key Features

### 1. User Registration Flow
- Users must register with their name and contact details before starting a chat
- System generates unique session ID and customer key for each user
- Existing customers are recognized and can continue previous conversations

### 2. Session Management
- Each conversation is tied to a unique session ID
- Customer key is generated from email/phone for user identification
- Messages are grouped under a single inquiry record per session

### 3. Message Grouping
- Individual messages are stored in `chatbot_messages` table
- All messages for a conversation are linked to a single `customer_inquiries` record
- This eliminates the problem of creating new rows for each message

## Database Structure

### customer_inquiries Table
- `id`: Primary key
- `customer_message`: Initial message or conversation summary
- `customer_email`: Customer's email address
- `customer_phone`: Customer's phone number
- `session_id`: Unique session identifier
- `customer_key`: Hashed identifier for customer recognition
- `status`: Conversation status (pending, ai_handled, responded, closed)
- `assigned_to`: Agent assigned to handle the conversation
- `created_at`, `updated_at`: Timestamps

### chatbot_messages Table
- `id`: Primary key
- `inquiry_id`: Foreign key to customer_inquiries
- `sender`: Message sender (user, agent, ai)
- `message`: The actual message content
- `created_at`: Timestamp

## API Endpoints

### POST /api/chatbot/register
Register a new user before starting chat
- **Body**: `{ customerName, customerEmail, customerPhone }`
- **Response**: `{ sessionId, customerKey, inquiryId }`

### POST /api/chatbot/message
Send a message in a conversation
- **Body**: `{ sessionId, customerKey, message, sender }`
- **Response**: `{ messageId, inquiryId }`

### GET /api/chatbot/inquiries
Get all inquiries for admin dashboard
- **Response**: `{ inquiries: [...] }`

### GET /api/chatbot/messages/:inquiryId
Get all messages for a specific inquiry
- **Response**: `{ messages: [...] }`

### POST /api/chatbot/reply
Send a reply from customer service agent
- **Body**: `{ id: inquiryId, sessionId, replyText }`
- **Response**: `{ messageId }`

### PUT /api/chatbot/assign
Assign inquiry to an agent
- **Body**: `{ id: inquiryId, agent }`

### PUT /api/chatbot/unassign
Unassign inquiry from agent
- **Body**: `{ id: inquiryId }`

### PUT /api/chatbot/status
Update inquiry status
- **Body**: `{ id: inquiryId, status }`

## Frontend Components

### Chatbot.jsx (Floating Widget)
- **Floating chat button** in lower left corner with bounce animation
- **User registration form** when first opened
- **Chat interface** with message history
- **Minimize/maximize** functionality
- **Notification badge** for unread messages
- **Real-time message display**
- **Session management**
- **Responsive design** that works on all screen sizes

### ChatbotInquiries.jsx (Admin Dashboard)
- View all customer conversations
- Filter by status and assignment
- View individual conversation details
- Send replies to customers
- Assign/unassign conversations

## Benefits

1. **Better Data Organization**: Messages are properly grouped by conversation
2. **Improved User Experience**: Users can see their conversation history
3. **Efficient Admin Management**: Agents can view complete conversation context
4. **Scalable Architecture**: System can handle multiple concurrent conversations
5. **Customer Recognition**: Returning customers can continue previous conversations

## Usage Flow

1. **Customer Registration**: User provides name and contact details
2. **Session Creation**: System creates unique session and customer identifiers
3. **Message Exchange**: Messages are stored and linked to the session
4. **Admin Management**: Agents can view, assign, and respond to conversations
5. **Conversation Tracking**: Complete conversation history is maintained

## Floating Widget Features

### Visual Design
- **Fixed position** in lower left corner (bottom-6 left-6)
- **High z-index** (z-50) to appear above all content
- **Bounce animation** to attract user attention
- **Hover effects** with shadow and color transitions
- **Notification badge** with red dot and exclamation mark

### User Experience
- **Click to open** - Single click opens the chat widget
- **Minimize/Expand** - Users can minimize to just the header
- **Close button** - X button to completely close the widget
- **Responsive sizing** - Adapts to different screen sizes
- **Smooth animations** - All transitions are smooth and polished

### Widget States
1. **Closed**: Only floating button visible
2. **Open**: Full chat interface displayed
3. **Minimized**: Only header bar visible
4. **Registration**: Form for new users
5. **Chat**: Active conversation interface

This implementation solves the original problem of creating new rows for each message and provides a much more organized and user-friendly chatbot system with a modern floating widget interface.
