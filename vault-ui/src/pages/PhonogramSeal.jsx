import React, { useState } from 'react';
import { Layout, CertificateForm, CertificateViewer } from '../components';
import { generateCertificate, storeCertificateOnIPFS, logger } from '../utils';

const PhonogramSeal = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [ipfsHash, setIpfsHash] = useState(null);
  const [showViewer, setShowViewer] = useState(false);
  const [log, setLog] = useState([]);
  
  // Handle audio file selection
  const handleAudioFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'audio/mpeg' || file.type === 'audio/wav')) {
      setAudioFile(file);
      addToLog(`Audio file selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    } else {
      addToLog('Invalid file format. Please select a .mp3 or .wav file', 'error');
    }
  };
  
  // Add message to log
  const addToLog = (message, type = 'info') => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message,
      type
    };
    setLog(prev => [...prev, logEntry]);
    
    // Also log to the logger utility
    switch (type) {
      case 'error':
        logger.error(message);
        break;
      case 'warn':
        logger.warn(message);
        break;
      default:
        logger.info(message);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (certificateData) => {
    if (!audioFile) {
      addToLog('No audio file selected', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create enhanced certificate data with audio file info
      const enhancedData = {
        ...certificateData,
        mediaType: 'phonogram',
        mediaFormat: audioFile.type,
        fileSize: audioFile.size,
        fileName: audioFile.name,
        dateCreated: new Date().toISOString()
      };
      
      addToLog('Generating certificate PDF...');
      
      // Generate PDF certificate
      const pdf = await generateCertificate(enhancedData);
      setPdfBlob(pdf);
      
      addToLog('Certificate PDF generated successfully');
      
      // Store certificate data on IPFS
      addToLog('Uploading certificate data to IPFS...');
      
      const hash = await storeCertificateOnIPFS({
        ...enhancedData,
        certificateGeneratedAt: new Date().toISOString()
      });
      
      setIpfsHash(hash);
      addToLog(`Certificate uploaded to IPFS with CID: ${hash}`);
      
      // Store complete certificate object
      setCertificate({
        ...enhancedData,
        ipfsHash: hash
      });
      
      addToLog('Sealing process completed successfully', 'info');
      setShowViewer(true);
      
    } catch (error) {
      addToLog(`Error sealing phonogram: ${error.message}`, 'error');
      console.error('Error sealing phonogram:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle certificate download
  const handleDownload = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificate.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToLog('Certificate PDF downloaded');
    }
  };
  
  // Handle certificate verification
  const handleVerify = async () => {
    addToLog('Verifying certificate authenticity...');
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    addToLog('Certificate verified on simulated blockchain');
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Seal Phonogram</h1>
        
        {showViewer && certificate ? (
          <>
            <CertificateViewer 
              certificate={certificate}
              pdfBlob={pdfBlob}
              onVerify={handleVerify}
              onDownload={handleDownload}
              onClose={() => setShowViewer(false)}
            />
            
            <div className="mt-8">
              <button 
                onClick={() => setShowViewer(false)}
                className="btn bg-[#0f3460] text-white hover:bg-[#16213e] mr-4"
              >
                Back to Form
              </button>
              
              <button 
                onClick={() => {
                  setAudioFile(null);
                  setCertificate(null);
                  setPdfBlob(null);
                  setIpfsHash(null);
                  setShowViewer(false);
                  setLog([]);
                }}
                className="btn bg-[#16213e] text-white hover:bg-[#0f3460]"
              >
                Start New Seal
              </button>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="bg-[#16213e] rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Upload Phonogram</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Audio File (.mp3 or .wav) *
                  </label>
                  
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-[#0f3460] hover:border-[#e94560] bg-[#1a1a2e]">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {audioFile ? (
                          <>
                            <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                            <p className="mb-2 text-sm text-gray-300">
                              <span className="font-semibold">{audioFile.name}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </>
                        ) : (
                          <>
                            <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            <p className="mb-2 text-sm text-gray-300">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              MP3 or WAV (MAX. 10MB)
                            </p>
                          </>
                        )}
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".mp3,.wav" 
                        onChange={handleAudioFileChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Logs Section */}
              <div className="bg-[#16213e] rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Process Log
                </h3>
                
                <div className="bg-[#1a1a2e] border border-[#0f3460] rounded-md p-3 h-64 overflow-y-auto font-mono text-xs">
                  {log.length === 0 ? (
                    <p className="text-gray-500">No logs yet. Start the sealing process...</p>
                  ) : (
                    log.map((entry, index) => (
                      <div 
                        key={index} 
                        className={`mb-1 ${
                          entry.type === 'error' 
                            ? 'text-red-400' 
                            : entry.type === 'warn' 
                              ? 'text-yellow-400' 
                              : 'text-green-400'
                        }`}
                      >
                        <span className="text-gray-400">[{new Date(entry.timestamp).toLocaleTimeString()}]</span> {entry.message}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-[#16213e] rounded-lg p-6">
              <CertificateForm 
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                initialData={{
                  issuer: 'Symbiosis Vault',
                  course: audioFile ? audioFile.name.replace(/\.(mp3|wav)$/i, '') : ''
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PhonogramSeal; 