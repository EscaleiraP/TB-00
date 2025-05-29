import React, { useState } from 'react';
import { generateUUID, isValidEmail } from '../utils';

/**
 * Certificate Form Component
 * Form for creating or editing certificates
 */
const CertificateForm = ({ 
  onSubmit, 
  initialData = {}, 
  isSubmitting = false 
}) => {
  const [certificate, setCertificate] = useState({
    id: initialData.id || generateUUID(),
    name: initialData.name || '',
    recipient: initialData.recipient || '',
    email: initialData.email || '',
    course: initialData.course || '',
    date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    issuer: initialData.issuer || 'Your Organization',
    ...initialData
  });
  
  const [errors, setErrors] = useState({});
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCertificate({
      ...certificate,
      [name]: value
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!certificate.name.trim()) {
      newErrors.name = 'Recipient name is required';
    }
    
    if (!certificate.course.trim()) {
      newErrors.course = 'Course name is required';
    }
    
    if (certificate.email && !isValidEmail(certificate.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(certificate);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          {initialData.id ? 'Edit Certificate' : 'Create New Certificate'}
        </h2>
        <p className="text-gray-400">
          Fill in the details below to {initialData.id ? 'update the' : 'create a new'} certificate.
        </p>
      </div>
      
      <div className="space-y-4">
        {/* Certificate ID (Hidden but shown as text) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Certificate ID
          </label>
          <input
            type="text"
            value={certificate.id}
            readOnly
            className="input-field bg-[#1a1a2e] text-gray-400 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Unique identifier for this certificate</p>
        </div>
        
        {/* Recipient Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Recipient Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={certificate.name}
            onChange={handleChange}
            className={`input-field ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Enter recipient's full name"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        
        {/* Recipient Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Recipient Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={certificate.email}
            onChange={handleChange}
            className={`input-field ${errors.email ? 'border-red-500' : ''}`}
            placeholder="Enter recipient's email address"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          <p className="text-xs text-gray-500 mt-1">Optional, for sending the certificate</p>
        </div>
        
        {/* Course Name */}
        <div>
          <label htmlFor="course" className="block text-sm font-medium text-gray-300 mb-1">
            Course/Achievement Name *
          </label>
          <input
            type="text"
            id="course"
            name="course"
            value={certificate.course}
            onChange={handleChange}
            className={`input-field ${errors.course ? 'border-red-500' : ''}`}
            placeholder="Enter course or achievement name"
          />
          {errors.course && <p className="text-red-500 text-xs mt-1">{errors.course}</p>}
        </div>
        
        {/* Issue Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
            Issue Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={certificate.date}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        
        {/* Issuer Name */}
        <div>
          <label htmlFor="issuer" className="block text-sm font-medium text-gray-300 mb-1">
            Issuer Name
          </label>
          <input
            type="text"
            id="issuer"
            name="issuer"
            value={certificate.issuer}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter issuing organization's name"
          />
        </div>
        
        {/* Additional Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={certificate.notes || ''}
            onChange={handleChange}
            rows="3"
            className="input-field"
            placeholder="Enter any additional information or notes"
          ></textarea>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full py-3 flex justify-center items-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              <span>Processing...</span>
            </>
          ) : initialData.id ? (
            'Update Certificate'
          ) : (
            'Generate Certificate'
          )}
        </button>
      </div>
    </form>
  );
};

export default CertificateForm; 