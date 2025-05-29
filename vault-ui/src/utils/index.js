// Export all utilities from this central file
import apiService from './apiService';
import logger, { LOG_LEVELS, configureLogger } from './logger';
import * as helpers from './helpers';

// Certificate utilities
import { generateCertificate, verifyCertificate } from './certificateGenerator';

// IPFS utilities
import {
  createIPFSClient,
  uploadToIPFS,
  getFromIPFS,
  pinIPFSData,
  getIPFSGatewayURL,
  storeCertificateOnIPFS
} from './ipfsService';

// Export all utilities
export {
  // API service
  apiService,
  
  // Logger
  logger,
  LOG_LEVELS,
  configureLogger,
  
  // Certificate utilities
  generateCertificate,
  verifyCertificate,
  
  // IPFS utilities
  createIPFSClient,
  uploadToIPFS,
  getFromIPFS,
  pinIPFSData,
  getIPFSGatewayURL,
  storeCertificateOnIPFS,
  
  // Helper functions
  helpers
};

// Also export all helper functions directly
export const {
  generateUUID,
  formatDate,
  truncateString,
  isValidEmail,
  capitalizeFirstLetter,
  debounce,
  throttle,
  deepClone,
  groupBy,
  fileToDataURL,
  formatCurrency,
  getQueryParams,
  randomColor,
  timeAgo
} = helpers; 