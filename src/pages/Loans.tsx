import React, { useState, useCallback } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateForm, loanFormValidationRules } from '../utils/validation';
import './Loans.css';

interface FormData extends Record<string, string> {
  firstName: string;
  secondName: string;
  lastName: string;
  panNumber: string;
  aadharNumber: string;
  netTakeHomeSalary: string;
  dob: string;
  contactNumber: string;
  email: string;
  loanAmount: string;
  loanType: '';
}

interface FormErrors {
  [key: string]: string;
}

const Loans: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    secondName: '',
    lastName: '',
    panNumber: '',
    aadharNumber: '',
    netTakeHomeSalary: '',
    dob: '',
    contactNumber: '',
    email: '',
    loanAmount: '10000',
    loanType: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    [errors],
  );

  const validate = useCallback((): boolean => {
    const newErrors = validateForm(formData, loanFormValidationRules);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!validate()) {
        alert('Please fix all errors before submitting');
        return;
      }

      setIsSubmitting(true);

      // Simulate API call
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        alert('Application submitted successfully!');
        console.log('Form Data:', formData);
        // Navigate to Forms page after successful submission
        navigate('/forms');
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validate, navigate],
  );

  const formatCurrency = (value: string): string => {
    const numValue = Number(value);
    if (isNaN(numValue)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  const sliderPercentage = ((Number(formData.loanAmount) - 10000) / (5000000 - 10000)) * 100;

  return (
    <div className="loans-page">
      {/* Header */}
      <div className="loans-header">
        <h1>Quick Loan Application</h1>
        <p>Fill in your details to get started with your loan application process</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="loan-form">
        {/* Personal & Contact Information Section */}
        <div className="form-section">
          <h2 className="section-title">Personal & Contact Information</h2>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="loanAmount">
                Loan Amount Required <span className="required">*</span>
              </label>
              <div className="loan-slider-container">
                <div className="slider-wrapper">
                  <input
                    type="range"
                    id="loanAmount"
                    name="loanAmount"
                    min={10000}
                    max={5000000}
                    step={10000}
                    value={formData.loanAmount}
                    onChange={handleChange}
                    className={`slider ${errors.loanAmount ? 'error' : ''}`}
                  />
                  <div className="slider-track">
                    <div className="slider-fill" style={{ width: `${sliderPercentage}%` }}></div>
                  </div>
                </div>

                <div className="slider-values">
                  <span>{formatCurrency('10000')}</span>
                  <span className="slider-current-value">
                    {formatCurrency(formData.loanAmount)}
                  </span>
                  <span>{formatCurrency('5000000')}</span>
                </div>

                <input
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  className={`loan-amount-input ${errors.loanAmount ? 'error' : ''}`}
                  placeholder="Enter loan amount"
                  min={10000}
                  max={5000000}
                />
                {errors.loanAmount && <span className="error-message">{errors.loanAmount}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="firstName">
                First Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
                placeholder="Enter first name"
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="secondName">Middle Name</label>
              <input
                type="text"
                id="secondName"
                name="secondName"
                value={formData.secondName}
                onChange={handleChange}
                placeholder="Enter middle name (optional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">
                Last Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
                placeholder="Enter last name"
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="dob">
                Date of Birth <span className="required">*</span>
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={errors.dob ? 'error' : ''}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.dob && <span className="error-message">{errors.dob}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="panNumber">
                PAN Number <span className="required">*</span>
              </label>
              <input
                type="text"
                id="panNumber"
                name="panNumber"
                maxLength={10}
                value={formData.panNumber}
                onChange={handleChange}
                className={errors.panNumber ? 'error' : ''}
                placeholder="ABCDE1234F"
                style={{ textTransform: 'uppercase' }}
              />
              {errors.panNumber && <span className="error-message">{errors.panNumber}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="aadharNumber">
                Aadhar Number <span className="required">*</span>
              </label>
              <input
                type="text"
                id="aadharNumber"
                name="aadharNumber"
                maxLength={12}
                value={formData.aadharNumber}
                onChange={handleChange}
                className={errors.aadharNumber ? 'error' : ''}
                placeholder="12 digit Aadhar number"
              />
              {errors.aadharNumber && <span className="error-message">{errors.aadharNumber}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="contactNumber">
                Contact Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                maxLength={10}
                value={formData.contactNumber}
                onChange={handleChange}
                className={errors.contactNumber ? 'error' : ''}
                placeholder="10 digit contact number"
              />
              {errors.contactNumber && (
                <span className="error-message">{errors.contactNumber}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="your.email@example.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="netTakeHomeSalary">
                Net Take Home Salary <span className="required">*</span>
              </label>
              <input
                type="number"
                id="netTakeHomeSalary"
                name="netTakeHomeSalary"
                value={formData.netTakeHomeSalary}
                onChange={handleChange}
                className={errors.netTakeHomeSalary ? 'error' : ''}
                placeholder="Enter Net Take Home salary"
                min="0"
              />
              {errors.netTakeHomeSalary && (
                <span className="error-message">{errors.netTakeHomeSalary}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="loanType">
                Loan Type <span className="required">*</span>
              </label>
              <select
                id="loanType"
                name="loanType"
                value={formData.loanType}
                onChange={handleChange}
                className={errors.loanType ? 'error' : ''}
              >
                <option value="">Select Loan Type</option>
                <option value="fresh_home">Fresh Home Loan</option>
                <option value="balance_transfer">Balance Transfer</option>
              </select>
              {errors.loanType && <span className="error-message">{errors.loanType}</span>}
            </div>
          </div>
        </div>


        {/* Form Navigation */}
        <div className="form-navigation">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Loans;
