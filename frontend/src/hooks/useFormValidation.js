import { useState, useCallback } from 'react';

export function useFormValidation(validationRules) {
  const [errors, setErrors] = useState({});

  const validate = useCallback((values) => {
    const newErrors = {};
    let isValid = true;

    Object.entries(validationRules).forEach(([field, rules]) => {
      const value = values[field];

      rules.forEach((rule) => {
        if (rule.required && !value?.toString().trim()) {
          newErrors[field] = rule.message || `${field} is required`;
          isValid = false;
        } else if (rule.minLength && value?.length < rule.minLength) {
          newErrors[field] = rule.message || `${field} must be at least ${rule.minLength} characters`;
          isValid = false;
        } else if (rule.maxLength && value?.length > rule.maxLength) {
          newErrors[field] = rule.message || `${field} must be at most ${rule.maxLength} characters`;
          isValid = false;
        } else if (rule.pattern && !rule.pattern.test(value)) {
          newErrors[field] = rule.message || `${field} is invalid`;
          isValid = false;
        } else if (rule.custom && !rule.custom(value)) {
          newErrors[field] = rule.message || `${field} is invalid`;
          isValid = false;
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  }, [validationRules]);

  const clearError = useCallback((field) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validate,
    clearError,
    clearAllErrors,
  };
}

export default useFormValidation; 