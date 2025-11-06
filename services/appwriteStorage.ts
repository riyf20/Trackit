const sdk = require('node-appwrite');

const client = new sdk.Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT) // Appwrite API Endpoint
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID) // Appwrite project ID

const storage = new sdk.Storage(client);

// Endpoint: Checks if user has profile picture 
export const checkUserProfilePicture = async (fileId:string) => {
  
  // File id is the userid of user | both are immutable making this secure

  const result = await storage.getFile({
    bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID,
    fileId: fileId,
  });
    
}

// Endpoint: Appends and returns the live link for picture
export const getUserProfilePicture = (fileId: string) => {
  return `${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID}`;
  
  // {TO DO: Try optimizing image fetch }
  // return storage.getFileView(process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!, fileId);
};

// Endpoint: Deletes current profile picture
export const deleteUserProfilePicture = async (fileId:string) => {

  const result = await storage.deleteFile({
    bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID,
    fileId: fileId,
  });
    
}
