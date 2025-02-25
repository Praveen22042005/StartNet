const { BlobServiceClient } = require('@azure/storage-blob');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

// Get container clients for different profile pictures
const entrepreneurContainerClient = blobServiceClient.getContainerClient('entrepreneur-profile-pictures');
const investorContainerClient = blobServiceClient.getContainerClient('investor-profile-pictures');

module.exports = { 
  entrepreneurContainerClient,
  investorContainerClient 
};