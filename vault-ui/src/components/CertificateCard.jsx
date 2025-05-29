import React from 'react';
import { formatDate, truncateString } from '../utils';

/**
 * Certificate Card Component
 * Displays a certificate in a card format with actions
 */
const CertificateCard = ({ 
  certificate, 
  onView, 
  onDownload, 
  onVerify, 
  isVerified = false,
  isVerifying = false 
}) => {
  const { 
    id, 
    name, 
    course, 
    date, 
    ipfsHash, 
    recipient = 'Not specified'
  } = certificate;

  return (
    <div className="bg-[#16213e] rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl border border-[#0f3460] hover:border-[#e94560]">
      {/* Certificate Header */}
      <div className="bg-[#1a1a2e] p-4 border-b border-[#0f3460]">
        <h3 className="text-xl font-bold text-white mb-1 truncate">{course}</h3>
        <p className="text-gray-300 text-sm">ID: {truncateString(id, 12)}</p>
      </div>
      
      {/* Certificate Body */}
      <div className="p-5">
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-1">Recipient</p>
          <p className="text-white font-medium">{name || recipient}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-1">Issue Date</p>
          <p className="text-white">{formatDate(date)}</p>
        </div>
        
        {ipfsHash && (
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-1">IPFS Hash</p>
            <p className="text-white font-mono text-xs break-all">{truncateString(ipfsHash, 20)}</p>
          </div>
        )}
        
        {/* Verification Status */}
        <div className="mt-5 mb-2">
          {isVerifying ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#e94560] mr-2"></div>
              <span className="text-gray-300 text-sm">Verifying...</span>
            </div>
          ) : isVerified ? (
            <div className="flex items-center text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Verified on blockchain</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Not verified</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Actions Footer */}
      <div className="bg-[#1a1a2e] p-3 flex justify-between items-center border-t border-[#0f3460]">
        <button 
          onClick={() => onView(certificate)}
          className="btn btn-primary text-xs px-3 py-1"
        >
          View
        </button>
        
        <div className="flex space-x-2">
          {onVerify && (
            <button 
              onClick={() => onVerify(certificate)}
              className="btn bg-[#0f3460] text-white hover:bg-[#16213e] text-xs px-3 py-1"
              disabled={isVerifying}
            >
              Verify
            </button>
          )}
          
          {onDownload && (
            <button 
              onClick={() => onDownload(certificate)}
              className="btn bg-[#16213e] text-white hover:bg-[#0f3460] text-xs px-3 py-1"
            >
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateCard; 