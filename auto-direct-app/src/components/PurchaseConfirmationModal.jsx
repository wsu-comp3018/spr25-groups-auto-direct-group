
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PurchaseConfirmationModal = ({ 
  isOpen, 
  onClose, 
  orderID, 
  customerName, 
  vehicleDetails, 
  manufacturerDetails, 
  purchaseFormData, 
  onProcessPayment 
}) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  const handleClose = () => {
    // Close modal first, then navigate to payment instructions page
    onClose();
    navigate('/payment-instructions', {
      state: {
        orderID,
        customerName,
        purchaseFormData,
        vehicleDetails,
        manufacturerDetails
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Purchase Vehicle Form</h2>
          
          {/* Green Checkmark and Order Confirmed */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-green-600">Order Confirmed - ID: {orderID}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="space-y-4 text-gray-700">
            <p>
              Thank you for your order, <span className="font-semibold">{customerName}</span>. 
              A unique 10-digit Order ID, <span className="font-bold text-blue-600">{orderID}</span>, 
              has been generated, and detailed instructions have been sent to your registered email address.
            </p>
            <p>
              To complete your purchase, please make a direct bank transfer to the manufacturer using the 
              account details provided. Please be sure to include your Order ID as the payment reference.
            </p>
            <p>
              Once your payment is confirmed, you will receive a notification with updates regarding 
              delivery and logistics.
            </p>
            <p>
              If you also requested a test drive, our Test Drive Team will contact you directly to schedule 
              a suitable appointment.
            </p>
            <p>
              For any inquiries, please contact our Customer Service Team at{' '}
              <a href="mailto:autodirectsupport@gmail.com" className="text-blue-600 hover:underline">
                autodirectsupport@gmail.com
              </a>{' '}
              or <span className="font-semibold">0444 444 444</span>.
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
          >
            Close
          </button>
        </div>

        {/* Discover vehicles section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Discover vehicles</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-4 mb-2">
                <img src="/api/placeholder/100/80" alt="Everyday and Convenience" className="w-full h-16 object-cover rounded" />
              </div>
              <p className="text-sm font-medium">Everyday and Convenience</p>
              <p className="text-xs text-gray-500">Cars that give you the freedom for everyday living</p>
              <button className="text-xs text-blue-600 hover:underline mt-1">See them all →</button>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-4 mb-2">
                <img src="/api/placeholder/100/80" alt="Families and Road Trippers" className="w-full h-16 object-cover rounded" />
              </div>
              <p className="text-sm font-medium">Families and Road Trippers</p>
              <p className="text-xs text-gray-500">Cars that give you the space to move people or pack heavy</p>
              <button className="text-xs text-blue-600 hover:underline mt-1">See them all →</button>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-4 mb-2">
                <img src="/api/placeholder/100/80" alt="Work and Play" className="w-full h-16 object-cover rounded" />
              </div>
              <p className="text-sm font-medium">Work and Play</p>
              <p className="text-xs text-gray-500">Tough and rugged for both work and fun play on the weekend</p>
              <button className="text-xs text-blue-600 hover:underline mt-1">See them all →</button>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-4 mb-2">
                <img src="/api/placeholder/100/80" alt="Environmentally Conscious" className="w-full h-16 object-cover rounded" />
              </div>
              <p className="text-sm font-medium">Environmentally Conscious</p>
              <p className="text-xs text-gray-500">Electric and hybrid cars with the environment in mind</p>
              <button className="text-xs text-blue-600 hover:underline mt-1">See them all →</button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          © 2025 Autos Direct. All rights reserved. | Contact | Privacy Policy | Glossary
        </div>
      </div>
    </div>
  );
};

export default PurchaseConfirmationModal;
