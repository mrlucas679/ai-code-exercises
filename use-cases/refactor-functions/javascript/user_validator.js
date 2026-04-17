// Refactored: split validateUserData into focused helper functions
// using Prompt (Break Down a Complex Function)

/**
 * Validates required fields for registration.
 * @param {Object} userData - The user data object
 * @returns {string[]} Array of error messages
 */
function validateRegistrationFields(userData) {
  const errors = [];
  const requiredFields = ['username', 'email', 'password', 'confirmPassword'];

  for (const field of requiredFields) {
    if (!userData[field] || userData[field].trim() === '') {
      errors.push(`${field} is required for registration`);
    }
  }

  return errors;
}

/**
 * Validates username format and uniqueness.
 * @param {string} username - The username to validate
 * @param {Object} options - Options including checkExisting for uniqueness check
 * @returns {string[]} Array of error messages
 */
function validateUsername(username, options) {
  const errors = [];

  if (!username) return errors;

  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  } else if (username.length > 20) {
    errors.push('Username must be at most 20 characters long');
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  } else if (options.checkExisting && options.checkExisting.usernameExists(username)) {
    errors.push('Username is already taken');
  }

  return errors;
}
/**
 * Validates password strength and confirmation match.
 * @param {string} password - The password to validate
 * @param {string} confirmPassword - The confirmation password
 * @returns {string[]} Array of error messages
 */
function validatePassword(password, confirmPassword) {
  const errors = [];

  if (!password) return errors;

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  } else if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  if (confirmPassword !== password) {
    errors.push('Password and confirmation do not match');
  }

  return errors;
}
/**
 * Validates email format and uniqueness.
 * @param {string} email - The email to validate
 * @param {boolean} isRegistration - Whether this is a registration request
 * @param {Object} options - Options including checkExisting for uniqueness check
 * @returns {string[]} Array of error messages
 */
function validateEmail(email, isRegistration, options) {
  const errors = [];

  if (email === undefined) return errors;

  if (email.trim() === '') {
    if (isRegistration) {
      errors.push('Email is required');
    }
    return errors;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Email format is invalid');
  } else if (options.checkExisting && options.checkExisting.emailExists(email)) {
    errors.push('Email is already registered');
  }

  return errors;
}
/**
 * Validates date of birth — checks it is a real date and meets age requirements.
 * @param {string} dateOfBirth - The date of birth string to validate
 * @returns {string[]} Array of error messages
 */
function validateDateOfBirth(dateOfBirth) {
  const errors = [];

  if (dateOfBirth === undefined || dateOfBirth === '') return errors;

  const dobDate = new Date(dateOfBirth);

  if (isNaN(dobDate.getTime())) {
    errors.push('Date of birth is not a valid date');
    return errors;
  }

  const now = new Date();
  const minAgeDate = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate());
  const maxAgeDate = new Date(now.getFullYear() - 120, now.getMonth(), now.getDate());

  if (dobDate > now) {
    errors.push('Date of birth cannot be in the future');
  } else if (dobDate > minAgeDate) {
    errors.push('You must be at least 13 years old');
  } else if (dobDate < maxAgeDate) {
    errors.push('Invalid date of birth (age > 120 years)');
  }

  return errors;
}
/**
 * Validates address object including country-specific zip code formats.
 * @param {Object|string} address - The address to validate
 * @returns {string[]} Array of error messages
 */
function validateAddress(address) {
  const errors = [];

  if (address === undefined || address === '') return errors;

  if (typeof address !== 'object') {
    errors.push('Address must be an object with required fields');
    return errors;
  }

  const requiredAddressFields = ['street', 'city', 'zip', 'country'];

  for (const field of requiredAddressFields) {
    if (!address[field] || address[field].trim() === '') {
      errors.push(`Address ${field} is required`);
    }
  }

  // Validate country-specific zip code formats
  if (address.zip && address.country) {
    if (address.country === 'US' && !/^\d{5}(-\d{4})?$/.test(address.zip)) {
      errors.push('Invalid US ZIP code format');
    } else if (address.country === 'CA' && !/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(address.zip)) {
      errors.push('Invalid Canadian postal code format');
    } else if (address.country === 'UK' && !/^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/.test(address.zip)) {
      errors.push('Invalid UK postal code format');
    }
  }

  return errors;
}
/**
 * Validates phone number format.
 * @param {string} phone - The phone number to validate
 * @returns {string[]} Array of error messages
 */
function validatePhone(phone) {
  const errors = [];

  if (phone === undefined || phone === '') return errors;

  if (!/^\+?[\d\s\-()]{10,15}$/.test(phone)) {
    errors.push('Phone number format is invalid');
  }

  return errors;
}
/**
 * Validates user input data for registration and profile updates.
 * Delegates to focused helper functions for each validation concern.
 * @param {Object} userData - The user data to validate
 * @param {Object} options - Validation options
 * @param {boolean} options.isRegistration - Whether this is a registration request
 * @param {Object} options.checkExisting - Object with usernameExists and emailExists methods
 * @param {Array} options.customValidations - Array of custom validation rules
 * @returns {string[]} Array of validation error messages, empty if valid
 */
function validateUserData(userData, options = {}) {
  const errors = [];
  const isRegistration = options.isRegistration || false;
  const requiredForProfile = ['firstName', 'lastName', 'dateOfBirth', 'address'];

  if (isRegistration) {
    // Validate required registration fields
    errors.push(...validateRegistrationFields(userData));

    // Validate username
    errors.push(...validateUsername(userData.username, options));

    // Validate password and confirmation
    errors.push(...validatePassword(userData.password, userData.confirmPassword));
  } else {
    // Profile update — check that provided fields are not empty
    for (const field of requiredForProfile) {
      if (userData[field] !== undefined && userData[field] === '') {
        errors.push(`${field} cannot be empty if provided`);
      }
    }
  }

  // Email validation applies to both registration and profile updates
  errors.push(...validateEmail(userData.email, isRegistration, options));

  // Date of birth validation
  errors.push(...validateDateOfBirth(userData.dateOfBirth));

  // Address validation
  errors.push(...validateAddress(userData.address));

  // Phone validation
  errors.push(...validatePhone(userData.phone));

  // Custom field validation if provided
  if (options.customValidations) {
    for (const validation of options.customValidations) {
      const field = validation.field;
      if (userData[field] !== undefined) {
        const valid = validation.validator(userData[field], userData);
        if (!valid) {
          errors.push(validation.message || `Invalid value for ${field}`);
        }
      }
    }
  }

  return errors;
}

// Export all functions for testing and reuse
module.exports = {
  validateUserData,
  validateRegistrationFields,
  validateUsername,
  validatePassword,
  validateEmail,
  validateDateOfBirth,
  validateAddress,
  validatePhone
};

