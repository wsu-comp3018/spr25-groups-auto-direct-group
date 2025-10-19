// Auto-fill utility functions for user profile data
import Cookies from "js-cookie";
import api from "../data/api-calls";

/**
 * Fetches user profile data and returns it for auto-filling forms
 * @returns {Promise<Object|null>} User profile data or null if not authenticated
 */
export const fetchUserProfileForAutoFill = async () => {
  const userID = Cookies.get("auto-direct-userID");
  const token = Cookies.get("auto-direct-token");

  // Only auto-fill if user is authenticated
  if (!userID || !token) {
    console.log('🔐 User not authenticated, skipping auto-fill');
    return null;
  }

  console.log('🔄 Fetching user profile for auto-fill...');
  try {
    const response = await fetch(api + '/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': token,
      },
    });

    const data = await response.json();
    
    if (data.message === 'jwt expired') {
      console.log('🔑 JWT expired, removing cookies');
      Cookies.remove("auto-direct-token", { path: '' });
      Cookies.remove('auto-direct-userID', { path: '' });
      return null;
    }

    if (data.user) {
      console.log('✅ User profile fetched for auto-fill:', data.user);
      return data.user;
    }
  } catch (error) {
    console.error('❌ Error fetching user profile for auto-fill:', error);
  }
  
  return null;
};

/**
 * Auto-fill form data with user profile information
 * @param {Function} setFormFunction - The setState function for the form
 * @param {Object} fieldMapping - Mapping of user profile fields to form fields
 */
export const autoFillForm = async (setFormFunction, fieldMapping) => {
  const userProfile = await fetchUserProfileForAutoFill();
  
  if (!userProfile) {
    return;
  }

  console.log('📝 Auto-filling form with user profile data');
  
  setFormFunction(prevForm => {
    const autoFilledData = {};
    
    // Map user profile fields to form fields based on provided mapping
    Object.entries(fieldMapping).forEach(([formField, profileField]) => {
      if (typeof profileField === 'function') {
        autoFilledData[formField] = profileField(userProfile);
      } else {
        autoFilledData[formField] = userProfile[profileField] || "";
      }
    });

    return {
      ...prevForm,
      ...autoFilledData
    };
  });
};

/**
 * Common field mappings for different form types
 */
export const fieldMappings = {
  // For purchase forms (comprehensive)
  purchase: {
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'emailAddress',
    confirmEmail: 'emailAddress',
    phone: 'phone',
    streetNumber: 'streetNo',
    streetName: 'streetName',
    suburb: 'suburb',
    postcode: 'postcode',
    licenseFirstName: 'firstName',
    licenseLastName: 'lastName'
  },
  
  // For test drive booking forms
  testDrive: {
    name: (profile) => `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
    email: 'emailAddress',
    phone: 'phone'
  },
  
  // For complaints forms
  complaints: {
    customerName: (profile) => `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
    contactDetails: (profile) => `Email: ${profile.emailAddress || ''}, Phone: ${profile.phone || ''}`
  },
  
  // For contact forms
  contact: {
    name: (profile) => `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
    email: 'emailAddress'
  }
};