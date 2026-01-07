import { Client, Storage, ID } from 'react-native-appwrite';
import * as ImagePicker from "expo-image-picker";

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!) // Appwrite API Endpoint
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!) // Appwrite project ID

const storage = new Storage(client);

// Endpoint: Uploads user's new profile picture 
export const updateUserProfilePicture = async (fileId: string, newFilePath: string, newFileName: string, newFileType:string, newFileSize:number) => {

    // Create new file with metadata
    const file = {
        name: newFileName,
        type: newFileType,
        size: newFileSize,
        uri: newFilePath,
    }
     
    // Attempts to store 
    try {
        const respose = await storage.createFile(
            process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
            fileId,
            file
        );

    } catch (error:any) {
        console.log(error)
        console.log(error.code)
        console.log(error.message)
        throw new error;
    }
    
}

// Endpoint: Uploads user's new profile picture 
export const addUsersLogMedia = async (logId:string, item:ImagePicker.ImagePickerAsset) => {

    // Create new file with metadata
    const file = {
        name: item.fileName ?? `log-${logId}-${Date.now()}`,
        type: item.mimeType!,
        size: item.fileSize!,
        uri: item.uri,
    }
     
    // Attempts to store 
    try {
        const response = await storage.createFile(
            process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
            ID.unique(),
            file
        );

        // console.log(response);
        return(response.$id)

    } catch (error:any) {
        console.log(error)
        console.log(error.code)
        console.log(error.message)
        throw error;
    }
    
}
