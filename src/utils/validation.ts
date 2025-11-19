export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
  min?: number;
  max?: number;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export const validateField = (
  name: string,
  value: string,
  rules: ValidationRule
): string => {
  const { required, minLength, maxLength, pattern, custom, min, max } = rules;

  if (required && !value.trim()) {
    return `${name} is required`;
  }

  if (!value.trim() && !required) {
    return '';
  }

  if (minLength && value.trim().length < minLength) {
    return `${name} must be at least ${minLength} characters`;
  }

  if (maxLength && value.trim().length > maxLength) {
    return `${name} must be at most ${maxLength} characters`;
  }

  if (pattern && !pattern.test(value)) {
    return `Invalid ${name} format`;
  }

  if (min !== undefined || max !== undefined) {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return `Please enter a valid number for ${name}`;
    }
    if (min !== undefined && numValue < min) {
      return `${name} must be at least ${min}`;
    }
    if (max !== undefined && numValue > max) {
      return `${name} must be at most ${max}`;
    }
  }

  if (custom) {
    const customError = custom(value);
    if (customError) {
      return customError;
    }
  }

  return '';
};

export const validateForm = (
  formData: Record<string, string>,
  validationRules: ValidationRules
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.keys(validationRules).forEach((key) => {
    const value = formData[key] || '';
    const rules = validationRules[key];
    const error = validateField(key, value, rules);
    if (error) {
      errors[key] = error;
    }
  });

  return errors;
};

// Common validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  aadhar: /^\d{12}$/,
  phone: /^\d{10}$/,
};

// Common validation rules for loan forms
export const loanFormValidationRules: ValidationRules = {
  firstName: {
    required: true,
    minLength: 2,
  },
  lastName: {
    required: true,
    minLength: 2,
  },
  panNumber: {
    required: true,
    pattern: validationPatterns.pan,
    custom: (value) => {
      if (!validationPatterns.pan.test(value.toUpperCase())) {
        return 'Invalid PAN format (e.g., ABCDE1234F)';
      }
      return null;
    },
  },
  aadharNumber: {
    required: true,
    pattern: validationPatterns.aadhar,
    custom: (value) => {
      if (!validationPatterns.aadhar.test(value)) {
        return 'Aadhar number must be 12 digits';
      }
      return null;
    },
  },
  contactNumber: {
    required: true,
    pattern: validationPatterns.phone,
    custom: (value) => {
      if (!validationPatterns.phone.test(value)) {
        return 'Contact number must be 10 digits';
      }
      return null;
    },
  },
  email: {
    required: true,
    pattern: validationPatterns.email,
    custom: (value) => {
      if (!validationPatterns.email.test(value)) {
        return 'Invalid email format';
      }
      return null;
    },
  },
  salary: {
    required: true,
    min: 0,
    custom: (value) => {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue <= 0) {
        return 'Please enter a valid salary amount';
      }
      return null;
    },
  },
  loanAmount: {
    required: true,
    min: 10000,
    max: 5000000,
    custom: (value) => {
      const amount = Number(value);
      if (isNaN(amount) || amount < 10000 || amount > 5000000) {
        return 'Loan amount must be between ₹10,000 and ₹50,00,000';
      }
      return null;
    },
  },
  dob: {
    required: true,
  },
};

