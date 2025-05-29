import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

/**
 * Generates a certificate as a PDF with verification data
 * @param {Object} data - Certificate data
 * @param {string} data.name - Name of the certificate recipient
 * @param {string} data.course - Name of the course or achievement
 * @param {string} data.date - Date of issuance
 * @param {string} data.id - Unique certificate ID
 * @param {string} data.ipfsHash - IPFS hash for verification (optional)
 * @returns {Promise<Blob>} - PDF document as a Blob
 */
export const generateCertificate = async (data) => {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });
  
  // Set background color
  doc.setFillColor(26, 26, 46); // --primary color
  doc.rect(0, 0, 297, 210, 'F');
  
  // Add border
  doc.setDrawColor(233, 69, 96); // --highlight color
  doc.setLineWidth(2);
  doc.rect(10, 10, 277, 190);
  
  // Add header
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(233, 69, 96); // --highlight color
  doc.setFontSize(36);
  doc.text('CERTIFICATE OF ACHIEVEMENT', 148.5, 40, { align: 'center' });
  
  // Add certificate text
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(241, 241, 241); // --text-light color
  doc.setFontSize(16);
  doc.text('This is to certify that', 148.5, 70, { align: 'center' });
  
  // Add name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text(data.name, 148.5, 90, { align: 'center' });
  
  // Add course information
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.text('has successfully completed', 148.5, 110, { align: 'center' });
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text(data.course, 148.5, 125, { align: 'center' });
  
  // Add date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(`Date: ${data.date}`, 50, 170);
  
  // Add certificate ID
  doc.text(`Certificate ID: ${data.id}`, 50, 180);
  
  // Generate QR code for verification
  try {
    const verificationURL = data.ipfsHash 
      ? `https://ipfs.io/ipfs/${data.ipfsHash}`
      : `https://verify.example.com/cert/${data.id}`;
    
    const qrCodeDataURL = await QRCode.toDataURL(verificationURL, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 200,
      color: {
        dark: '#f1f1f1',
        light: '#1a1a2e'
      }
    });
    
    // Add QR code to the certificate
    doc.addImage(qrCodeDataURL, 'PNG', 220, 150, 30, 30);
    doc.setFontSize(10);
    doc.text('Scan to verify', 235, 185, { align: 'center' });
    
  } catch (error) {
    console.error('Failed to generate QR code:', error);
  }
  
  // Return the PDF as a blob
  return doc.output('blob');
};

/**
 * Verifies the certificate based on its ID
 * @param {string} certificateId - The ID of the certificate to verify
 * @returns {Promise<Object>} - Verification result
 */
export const verifyCertificate = async (certificateId) => {
  // In a real implementation, this would check against a blockchain or database
  // For now, we're just simulating a verification process
  
  try {
    // Simulate API call to a verification service
    // In a real implementation, you would verify against a blockchain or database
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate a successful verification
    return {
      verified: true,
      certificate: {
        id: certificateId,
        name: "Sample Certificate",
        recipientName: "John Doe",
        course: "Blockchain Fundamentals",
        issueDate: "2023-04-15",
        issuer: "Blockchain Academy"
      }
    };
  } catch (error) {
    console.error('Verification failed:', error);
    return {
      verified: false,
      error: 'Certificate verification failed'
    };
  }
}; 