import React, { useState, useEffect } from 'react';
import { formatDate, getIPFSGatewayURL } from '../utils';

/**
 * Certificate Viewer Component
 * Displays the certificate details and preview
 */
const CertificateViewer = ({ 
  certificate, 
  pdfBlob = null, 
  onVerify, 
  onDownload, 
  onClose,
  isVerified = false,
  isVerifying = false
}) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [activeTab, setActiveTab] = useState('certificate');
  
  // Generate a preview URL for the PDF if available
  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setPreviewUrl(url);
      
      // Clean up the URL when the component unmounts
      return () => URL.revokeObjectURL(url);
    }
  }, [pdfBlob]);

  // If there's an IPFS hash but no PDF blob, use the IPFS gateway
  useEffect(() => {
    if (!pdfBlob && certificate.ipfsHash) {
      setPreviewUrl(getIPFSGatewayURL(certificate.ipfsHash));
    }
  }, [certificate.ipfsHash, pdfBlob]);
  
  return (
    <div className="bg-[#16213e] rounded-lg shadow-xl border border-[#0f3460] max-w-4xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="bg-[#1a1a2e] p-4 flex justify-between items-center border-b border-[#0f3460]">
        <h2 className="text-xl font-bold text-white">Certificate Details</h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-[#0f3460] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Tabs */}
      <div className="bg-[#1a1a2e] px-4 border-b border-[#0f3460] flex">
        <button
          className={`py-3 px-4 text-sm font-medium ${
            activeTab === 'certificate' 
              ? 'text-[#e94560] border-b-2 border-[#e94560]' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('certificate')}
        >
          Certificate
        </button>
        <button
          className={`py-3 px-4 text-sm font-medium ${
            activeTab === 'details' 
              ? 'text-[#e94560] border-b-2 border-[#e94560]' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button
          className={`py-3 px-4 text-sm font-medium ${
            activeTab === 'verification' 
              ? 'text-[#e94560] border-b-2 border-[#e94560]' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('verification')}
        >
          Verification
        </button>
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Certificate Tab */}
        {activeTab === 'certificate' && (
          <div className="flex flex-col items-center">
            {previewUrl ? (
              <div className="w-full aspect-[1.414] bg-white rounded-lg overflow-hidden shadow-lg">
                <iframe 
                  src={previewUrl} 
                  title="Certificate Preview" 
                  className="w-full h-full"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
                ></iframe>
              </div>
            ) : (
              <div className="w-full aspect-[1.414] bg-[#1a1a2e] rounded-lg flex flex-col items-center justify-center p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-white font-bold text-lg mb-2">Certificate Preview Not Available</h3>
                <p className="text-gray-400 text-sm">
                  The certificate PDF is not generated yet or the IPFS data is not available.
                </p>
              </div>
            )}
            
            <div className="flex justify-center mt-6 space-x-4">
              {onDownload && (
                <button 
                  onClick={onDownload}
                  className="btn btn-primary flex items-center"
                  disabled={!pdfBlob && !certificate.ipfsHash}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download Certificate
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold mb-4 text-[#e94560]">Certificate Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Certificate ID</p>
                    <p className="font-mono text-sm break-all">{certificate.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Course/Achievement</p>
                    <p className="font-medium">{certificate.course}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Issue Date</p>
                    <p>{formatDate(certificate.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Issuer</p>
                    <p>{certificate.issuer || 'Not specified'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-4 text-[#e94560]">Recipient Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Name</p>
                    <p className="font-medium">{certificate.name}</p>
                  </div>
                  {certificate.email && (
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p>{certificate.email}</p>
                    </div>
                  )}
                </div>
                
                {certificate.ipfsHash && (
                  <div className="mt-6">
                    <h3 className="text-lg font-bold mb-4 text-[#e94560]">Storage Information</h3>
                    <div>
                      <p className="text-sm text-gray-400">IPFS Hash</p>
                      <p className="font-mono text-sm break-all">{certificate.ipfsHash}</p>
                      <a 
                        href={getIPFSGatewayURL(certificate.ipfsHash)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#e94560] text-sm hover:underline mt-2 inline-block"
                      >
                        View on IPFS
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {certificate.notes && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2 text-[#e94560]">Additional Notes</h3>
                <p className="text-gray-300 whitespace-pre-line">{certificate.notes}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Verification Tab */}
        {activeTab === 'verification' && (
          <div className="text-white">
            <div className="bg-[#1a1a2e] border border-[#0f3460] rounded-lg p-5">
              <div className="flex items-center mb-4">
                {isVerifying ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#e94560] mr-3"></div>
                    <span className="text-lg font-medium">Verifying certificate...</span>
                  </div>
                ) : isVerified ? (
                  <div className="flex items-center text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="text-lg font-medium">Certificate Verified</span>
                      <p className="text-sm text-gray-400">This certificate has been verified on the blockchain.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="text-lg font-medium">Certificate Not Verified</span>
                      <p className="text-sm text-gray-400">This certificate has not been verified yet.</p>
                    </div>
                  </div>
                )}
              </div>
              
              {!isVerifying && !isVerified && onVerify && (
                <button 
                  onClick={onVerify}
                  className="btn btn-primary w-full mt-2"
                >
                  Verify Certificate
                </button>
              )}
              
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-3 text-[#e94560]">What does verification mean?</h3>
                <p className="text-gray-300 text-sm mb-2">
                  Verification confirms that the certificate is authentic and has been recorded on the blockchain.
                  This means:
                </p>
                <ul className="list-disc pl-5 text-gray-300 text-sm space-y-1">
                  <li>The certificate has not been tampered with</li>
                  <li>It was issued by a recognized authority</li>
                  <li>The data matches what was recorded on the blockchain</li>
                  <li>The certificate is permanently stored on IPFS</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateViewer; 