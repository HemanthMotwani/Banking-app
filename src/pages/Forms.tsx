import { useState } from 'react';
import type { ChangeEvent, FormEvent, MouseEvent } from 'react';
// import Popup from "../components/InitialDetailsPopup.tsx"

import './Forms.css';

interface FormData {
  // Applicant Details
  fatherNameWithInitial: string;
  spouseName: string;
  motherName: string;
  maritalStatus: string;
  callerName: string;
  permanentName: string;
  permanentContactNumber: string;

  // Contact Information Address Details

  officialMailId: string;
  presentAddress: string;
  rentOrOwnHouse: string;
  presentAddressLandmark: string;
  presentAddressStayDuration: string;
  permanentAddress: string;

  // Employment Information & Financial Information
  designation: string;
  totalWorkExperience: string;
  presentCompanyWorkExperience: string;
  netTakeHomeSalary: string;
  salaryAccount: string;
  existingLoanDetails: string;
  loanAmount: string;
  bankName: string;

  // Document & Reference Details
  referenceRelative1: string;
  referenceRelative2: string;
  documentsMail: string;
  documentsWhatsapp: string;
}

interface FormErrors {
  [key: string]: string;
}

const Forms: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fatherNameWithInitial: '',
    spouseName: '',
    motherName: '',
    maritalStatus: '',
    callerName: '',
    permanentName: '',
    permanentContactNumber: '',
    officialMailId: '',
    presentAddress: '',
    rentOrOwnHouse: '',
    presentAddressLandmark: '',
    presentAddressStayDuration: '',
    permanentAddress: '',
    designation: '',
    totalWorkExperience: '',
    presentCompanyWorkExperience: '',
    netTakeHomeSalary: '',
    salaryAccount: '',
    existingLoanDetails: '',
    loanAmount: '',
    bankName: '',
    referenceRelative1: '',
    referenceRelative2: '',
    documentsMail: '',
    documentsWhatsapp: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sections = [
    'Applicant Details',
    'Contact Information Address Details',
    'Employment Information',
    'Document & References',
  ];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
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
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'fatherNameWithInitial':
        if (!value.trim()) return 'Father name with initial is required';
        break;
      case 'motherName':
        if (!value.trim()) return 'Mother name is required';
        break;
      case 'officialMailId':
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return 'Invalid email format';
        break;
      case 'maritalStatus':
        if (!value) return 'Marital status is required';
        break;
      case 'presentAddress':
        if (!value.trim()) return 'Present address is required';
        break;
      case 'rentOrOwnHouse':
        if (!value) return 'Please select rent or own house';
        break;
      case 'permanentAddress':
        if (!value.trim()) return 'Permanent address is required';
        break;
      case 'permanentContactNumber':
        if (!value.trim()) return 'Contact number is required';
        if (!/^\d{10}$/.test(value)) return 'Contact number must be 10 digits';
        break;
      case 'designation':
        if (!value.trim()) return 'Designation is required';
        break;
      case 'salaryAccount':
        if (!value.trim()) return 'Salary account is required';
        break;
      case 'netTakeHomeSalary':
        if (!value.trim()) return 'Net take home salary is required';
        if (isNaN(Number(value)) || Number(value) <= 0) return 'Please enter a valid salary';
        break;
      case 'loanAmount':
        if (!value.trim()) return 'Loan amount is required';
        if (isNaN(Number(value)) || Number(value) <= 0) return 'Please enter a valid loan amount';
        break;
      case 'bankName':
        if (!value.trim()) return 'Bank name is required';
        break;
      default:
        return '';
    }
    return '';
  };

  const validateSection = (sectionIndex: number): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    switch (sectionIndex) {
      case 0: // Personal Information
        ['fatherNameWithInitial', 'motherName', 'permanentContactNumber', 'maritalStatus'].forEach(
          (field) => {
            const error = validateField(field, formData[field as keyof FormData]);
            if (error) {
              newErrors[field] = error;
              isValid = false;
            }
          },
        );
        if (formData.maritalStatus === 'Married' && !formData.spouseName.trim()) {
          newErrors.spouseName = 'Spouse name is required for married applicants';
          isValid = false;
        }
        break;
      case 1: // Contact Information
        ['rentOrOwnHouse', 'presentAddress'].forEach((field) => {
          const error = validateField(field, formData[field as keyof FormData]);
          if (error) {
            newErrors[field] = error;
            isValid = false;
          }
        });
        if (formData.officialMailId && validateField('officialMailId', formData.officialMailId)) {
          newErrors.officialMailId = validateField('officialMailId', formData.officialMailId);
          isValid = false;
        }
        break;
      case 2: // Address Information
        ['designation', 'salaryAccount', 'bankName'].forEach((field) => {
          const error = validateField(field, formData[field as keyof FormData]);
          if (error) {
            newErrors[field] = error;
            isValid = false;
          }
        });
        break;
      case 3: // Financial & References
        if (!formData.referenceRelative1.trim()) {
          newErrors.referenceRelative1 = 'At least one reference is required';
          isValid = false;
        }
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (validateSection(currentSection)) {
      setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setCurrentSection((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate all sections
    let allValid = true;
    for (let i = 0; i < sections.length; i++) {
      if (!validateSection(i)) {
        allValid = false;
        setCurrentSection(i);
        break;
      }
    }

    if (!allValid) {
      alert('Please fix all errors before submitting');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Application submitted successfully!');
      console.log('Form Data:', formData);
    }, 2000);
  };

  return (
    <div className="forms-page">
      <div className="forms-header">
        <h1>Loan Application Form</h1>
        <p>Please fill in all the required information to proceed with your loan application</p>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
          ></div>
        </div>
        <div className="progress-text">
          Section {currentSection + 1} of {sections.length}
        </div>
      </div>

      {/* Section Navigation */}
      <div className="section-nav">
        {sections.map((section, index) => (
          <button
            key={index}
            className={`section-nav-item ${index === currentSection ? 'active' : ''} ${index < currentSection ? 'completed' : ''}`}
            onClick={() => {
              if (index <= currentSection || index === 0) {
                setCurrentSection(index);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            disabled={index > currentSection && index !== 0}
          >
            <span className="section-number">{index + 1}</span>
            <span className="section-name">{section}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="loan-form">
        {/* Section 1: Personal Information */}
        {currentSection === 0 && (
          <div className="form-section">
            <h2 className="section-title">Applicant Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fatherNameWithInitial">
                  Father Name with Initial <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="fatherNameWithInitial"
                  name="fatherNameWithInitial"
                  value={formData.fatherNameWithInitial}
                  onChange={handleChange}
                  className={errors.fatherNameWithInitial ? 'error' : ''}
                  placeholder="e.g., Mr. John D."
                />
                {errors.fatherNameWithInitial && (
                  <span className="error-message">{errors.fatherNameWithInitial}</span>
                )}
              </div>


              <div className="form-group">
                <label htmlFor="motherName">
                  Mother Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="motherName"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  className={errors.motherName ? 'error' : ''}
                  placeholder="Enter mother's full name"
                />
                {errors.motherName && <span className="error-message">{errors.motherName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="maritalStatus">
                  Marital Status <span className="required">*</span>
                </label>
                <select
                  id="maritalStatus"
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  className={errors.maritalStatus ? 'error' : ''}
                >
                  <option value="">Select marital status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
                {errors.maritalStatus && (
                  <span className="error-message">{errors.maritalStatus}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="spouseName">Spouse's Name</label>
                <input
                  type="text"
                  id="spouseName"
                  name="spouseName"
                  value={formData.spouseName}
                  onChange={handleChange}
                  className={errors.spouseName ? 'error' : ''}
                  placeholder="Enter spouse name (if married)"
                  disabled={formData.maritalStatus !== 'Married'}
                />
                {errors.spouseName && <span className="error-message">{errors.spouseName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="permanentName">Permanent Name</label>
                <input
                  type="text"
                  id="permanentName"
                  name="permanentName"
                  value={formData.permanentName}
                  onChange={handleChange}
                  placeholder="Name at permanent address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="permanentContactNumber">
                  Permanent Contact Number <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="permanentContactNumber"
                  name="permanentContactNumber"
                  value={formData.permanentContactNumber}
                  onChange={handleChange}
                  className={errors.permanentContactNumber ? 'error' : ''}
                  placeholder="10 digit contact number"
                  maxLength={10}
                />
                {errors.permanentContactNumber && (
                  <span className="error-message">{errors.permanentContactNumber}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Contact Information */}
        {currentSection === 1 && (
          <div className="form-section">
            <h2 className="section-title">Contact Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="officialMailId">Official Mail ID</label>
                <input
                  type="email"
                  id="officialMailId"
                  name="officialMailId" 
                  value={formData.officialMailId}
                  onChange={handleChange}
                  className={errors.officialMailId ? 'error' : ''}
                  placeholder="official.email@company.com"
                />
                {errors.officialMailId && (
                  <span className="error-message">{errors.officialMailId}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="rentOrOwnHouse">
                  Rent House / Own House <span className="required">*</span>
                </label>
                <select
                  id="rentOrOwnHouse"
                  name="rentOrOwnHouse"
                  value={formData.rentOrOwnHouse}
                  onChange={handleChange}
                  className={errors.rentOrOwnHouse ? 'error' : ''}
                >
                  <option value="">Select option</option>
                  <option value="Own">Own House</option>
                  <option value="Rent">Rent House</option>
                </select>
                {errors.rentOrOwnHouse && (
                  <span className="error-message">{errors.rentOrOwnHouse}</span>
                )}
              </div>

              <div className="form-group full-width">
                <label htmlFor="presentAddress">
                  Present Address <span className="required">*</span>
                </label>
                <textarea
                  id="presentAddress"
                  name="presentAddress"
                  value={formData.presentAddress}
                  onChange={handleChange}
                  className={errors.presentAddress ? 'error' : ''}
                  placeholder="Enter complete present address"
                  rows={3}
                />
                {errors.presentAddress && (
                  <span className="error-message">{errors.presentAddress}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="presentAddressLandmark">Present Address Landmark</label>
                <input
                  type="text"
                  id="presentAddressLandmark"
                  name="presentAddressLandmark"
                  value={formData.presentAddressLandmark}
                  onChange={handleChange}
                  placeholder="Nearby landmark"
                />
              </div>

              <div className="form-group">
                <label htmlFor="presentAddressStayDuration">Present Address Stay Duration</label>
                <input
                  type="text"
                  id="presentAddressStayDuration"
                  name="presentAddressStayDuration"
                  value={formData.presentAddressStayDuration}
                  onChange={handleChange}
                  placeholder="e.g., 2 years"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Address Information */}
        {currentSection === 2 && (
          <div className="form-section">
            <h2 className="section-title">Employment & Financial Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="designation">
                  Designation <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className={errors.designation ? 'error' : ''}
                  placeholder="Your job title"
                />
                {errors.designation && <span className="error-message">{errors.designation}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="totalWorkExperience">Total Work Experience</label>
                <input
                  type="text"
                  id="totalWorkExperience"
                  name="totalWorkExperience"
                  value={formData.totalWorkExperience}
                  onChange={handleChange}
                  placeholder="e.g., 5 years"
                />
              </div>

              <div className="form-group">
                <label htmlFor="presentCompanyWorkExperience">
                  Present Company Work Experience
                </label>
                <input
                  type="text"
                  id="presentCompanyWorkExperience"
                  name="presentCompanyWorkExperience"
                  value={formData.presentCompanyWorkExperience}
                  onChange={handleChange}
                  placeholder="e.g., 2 years"
                />
              </div>

              <div className="form-group">
                <label htmlFor="salaryAccount">
                  Salary Account <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="salaryAccount"
                  name="salaryAccount"
                  value={formData.salaryAccount}
                  onChange={handleChange}
                  className={errors.salaryAccount ? 'error' : ''}
                  placeholder="Bank account number"
                />
                {errors.salaryAccount && (
                  <span className="error-message">{errors.salaryAccount}</span>
                )}
              </div>

              <div className="form-group full-width">
                <label htmlFor="existingLoanDetails">Existing Loan Details</label>
                <textarea
                  id="existingLoanDetails"
                  name="existingLoanDetails"
                  value={formData.existingLoanDetails}
                  onChange={handleChange}
                  placeholder="Provide details of any existing loans (if applicable)"
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="bankName">
                  Bank Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className={errors.bankName ? 'error' : ''}
                  placeholder="Your bank name"
                />
                {errors.bankName && <span className="error-message">{errors.bankName}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Employment Information */}
        {currentSection === 3 && (
          <div className="form-section">
            <h2 className="section-title">Document & Reference Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="referenceRelative1">
                  Reference Relative 1 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="referenceRelative1"
                  name="referenceRelative1"
                  value={formData.referenceRelative1}
                  onChange={handleChange}
                  className={errors.referenceRelative1 ? 'error' : ''}
                  placeholder="Name and contact details"
                />
                {errors.referenceRelative1 && (
                  <span className="error-message">{errors.referenceRelative1}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="referenceRelative2">Reference Relative 2</label>
                <input
                  type="text"
                  id="referenceRelative2"
                  name="referenceRelative2"
                  value={formData.referenceRelative2}
                  onChange={handleChange}
                  placeholder="Name and contact details"
                />
              </div>

              <div className="form-group">
                <label htmlFor="documentsMail">Documents Mail</label>
                <input
                  type="email"
                  id="documentsMail"
                  name="documentsMail"
                  value={formData.documentsMail}
                  onChange={handleChange}
                  placeholder="Email for document submission"
                />
              </div>

              <div className="form-group">
                <label htmlFor="documentsWhatsapp">Documents WhatsApp</label>
                <input
                  type="text"
                  id="documentsWhatsapp"
                  name="documentsWhatsapp"
                  value={formData.documentsWhatsapp}
                  onChange={handleChange}
                  placeholder="WhatsApp number for documents"
                  maxLength={10}
                />
              </div>

              <div className="form-group">
                <label htmlFor="callerName">Caller Name</label>
                <input
                  type="text"
                  id="callerName"
                  name="callerName"
                  value={formData.callerName}
                  onChange={handleChange}
                  placeholder="Name of person who referred"
                />
              </div>

              <div className="document-note">
                <p>
                  <strong>Note:</strong> Please ensure all required documents are ready for
                  submission. You will receive further instructions via email or WhatsApp.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Navigation Buttons */}
        <div className="form-navigation">
          {currentSection > 0 && (
            <button type="button" onClick={handlePrevious} className="btn btn-secondary">
              Previous
            </button>
          )}
          {currentSection < sections.length - 1 && (
            <button
              key="next"
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
            >
              Next
            </button>
          )}
          {currentSection === sections.length - 1 && (
            <button
              key="submit"
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Forms;
