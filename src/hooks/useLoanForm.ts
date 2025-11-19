import { useState, useCallback } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { validateForm, loanFormValidationRules, ValidationRules } from '../utils/validation';

export interface FormData {
  [key: string]: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface UseLoanFormOptions {
  initialData?: FormData;
  validationRules?: ValidationRules;
  onSubmit?: (data: FormData) => Promise<void> | void;
}

export const useLoanForm = (options: UseLoanFormOptions = {}) => {
  const {
    initialData = {},
    validationRules = loanFormValidationRules,
    onSubmit,
  } = options;

  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const validate = useCallback((): boolean => {
    const newErrors = validateForm(formData, validationRules);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validationRules]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!validate()) {
        return false;
      }

      setIsSubmitting(true);
      try {
        if (onSubmit) {
          await onSubmit(formData);
        }
        return true;
      } catch (error) {
        console.error('Form submission error:', error);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validate, onSubmit]
  );

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setIsSubmitting(false);
  }, [initialData]);

  const setFieldValue = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    validate,
    resetForm,
    setFieldValue,
    setFieldError,
    setFormData,
  };
};


