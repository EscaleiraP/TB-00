import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';

// Default IPFS configuration
const defaultConfig = {
  // Default to using the public Infura IPFS gateway
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  // Add your Infura project ID and secret for production use
  headers: {
    authorization: process.env.REACT_APP_IPFS_AUTH || '',
  }
};

/**
 * Creates an IPFS client with the given configuration
 * @param {Object} config - IPFS client configuration
 * @returns {Object} - IPFS client instance
 */
export const createIPFSClient = (config = defaultConfig) => {
  try {
    return create(config);
  } catch (error) {
    console.error('Failed to create IPFS client:', error);
    throw new Error('Failed to initialize IPFS client');
  }
};

/**
 * Uploads data to IPFS
 * @param {Object|string|Buffer} data - Data to upload
 * @param {Object} options - Upload options
 * @param {boolean} options.pin - Whether to pin the data (default: true)
 * @param {Object} config - IPFS client configuration
 * @returns {Promise<string>} - IPFS CID (Content Identifier)
 */
export const uploadToIPFS = async (data, options = { pin: true }, config = defaultConfig) => {
  try {
    const ipfs = createIPFSClient(config);
    
    // Convert data to Buffer if it's not already
    let content;
    if (Buffer.isBuffer(data)) {
      content = data;
    } else if (typeof data === 'string') {
      content = Buffer.from(data);
    } else {
      content = Buffer.from(JSON.stringify(data));
    }
    
    // Upload to IPFS
    const result = await ipfs.add(content, options);
    return result.cid.toString();
  } catch (error) {
    console.error('Failed to upload to IPFS:', error);
    throw new Error('Failed to upload to IPFS');
  }
};

/**
 * Retrieves data from IPFS by CID
 * @param {string} cid - Content Identifier
 * @param {Object} config - IPFS client configuration
 * @returns {Promise<Buffer>} - Data from IPFS
 */
export const getFromIPFS = async (cid, config = defaultConfig) => {
  try {
    const ipfs = createIPFSClient(config);
    
    // Get the data from IPFS
    const chunks = [];
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(chunk);
    }
    
    // Combine chunks into a single Buffer
    return Buffer.concat(chunks);
  } catch (error) {
    console.error(`Failed to retrieve from IPFS (CID: ${cid}):`, error);
    throw new Error('Failed to retrieve data from IPFS');
  }
};

/**
 * Pins data on IPFS to ensure it's not garbage collected
 * @param {string} cid - Content Identifier to pin
 * @param {Object} config - IPFS client configuration
 * @returns {Promise<void>}
 */
export const pinIPFSData = async (cid, config = defaultConfig) => {
  try {
    const ipfs = createIPFSClient(config);
    await ipfs.pin.add(cid);
  } catch (error) {
    console.error(`Failed to pin data on IPFS (CID: ${cid}):`, error);
    throw new Error('Failed to pin data on IPFS');
  }
};

/**
 * Creates a link to view the data on an IPFS gateway
 * @param {string} cid - Content Identifier
 * @param {string} gateway - IPFS gateway URL (default: ipfs.io)
 * @returns {string} - Gateway URL for the CID
 */
export const getIPFSGatewayURL = (cid, gateway = 'ipfs.io') => {
  return `https://${gateway}/ipfs/${cid}`;
};

/**
 * Utility function to store certificate data on IPFS
 * @param {Object} certificateData - Certificate data to store
 * @returns {Promise<string>} - IPFS CID of the stored certificate
 */
export const storeCertificateOnIPFS = async (certificateData) => {
  try {
    // Add timestamp to the certificate data
    const dataToStore = {
      ...certificateData,
      timestamp: new Date().toISOString(),
      type: 'certificate'
    };
    
    // Upload to IPFS
    return await uploadToIPFS(dataToStore);
  } catch (error) {
    console.error('Failed to store certificate on IPFS:', error);
    throw new Error('Failed to store certificate on IPFS');
  }
}; 