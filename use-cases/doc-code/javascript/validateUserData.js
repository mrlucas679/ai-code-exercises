function validateUserData(userData) {
  const errors = {};

  // Check required fields
  const requiredFields = ['username', 'email', 'password'];
  for (const field of requiredFields) {
    if (!userData[field]) {
      errors[field] = `${field} is required`;
    }
  }

  // Validate username
  if (userData.username && (userData.username.length < 3 || userData.username.length > 20)) {
    errors.username = 'Username must be between 3 and 20 characters';
  }

  if (userData.username && !/^[a-zA-Z0-9_]+$/.test(userData.username)) {
    errors.username = 'Username can only contain letters, numbers, and underscores';
  }

  // Validate email
  if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.email = 'Please provide a valid email address';
  }

  // Validate password
  if (userData.password) {
    if (userData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    if (!/[A-Z]/.test(userData.password)) {
      errors.password = errors.password || 'Password must contain at least one uppercase letter';
    }

    if (!/[a-z]/.test(userData.password)) {
      errors.password = errors.password || 'Password must contain at least one lowercase letter';
    }

    if (!/[0-9]/.test(userData.password)) {
      errors.password = errors.password || 'Password must contain at least one number';
    }
  }

  // Validate age if provided
  if (userData.age !== undefined) {
    const age = parseInt(userData.age);
    if (isNaN(age)) {
      errors.age = 'Age must be a number';
    } else if (age < 13) {
      errors.age = 'You must be at least 13 years old';
    } else if (age > 120) {
      errors.age = 'Please provide a valid age';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}