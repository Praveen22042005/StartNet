const { BlobServiceClient } = require('@azure/storage-blob');
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error("Azure Storage Connection string not found in environment variables.");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
// Use the container named "startup-logos"
const containerClient = blobServiceClient.getContainerClient('startup-logos');

const uploadStartupLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const blobName = `startup-logo-${Date.now()}-${req.file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: { 
        blobContentType: req.file.mimetype,
        blobCacheControl: 'public, max-age=31536000'
      }
    });
    const logoUrl = blockBlobClient.url;
    res.json({ logoUrl });
  } catch (error) {
    console.error('Error uploading startup logo: ', error);
    res.status(500).json({ message: 'Failed to upload startup logo' });
  }
};

module.exports = { uploadStartupLogo };