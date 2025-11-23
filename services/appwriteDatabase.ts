import { ID, Query } from "react-native-appwrite";

const sdk = require('node-appwrite');

const client = new sdk.Client()
    // API Endpoint
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT) 
    // Appwrite Project ID
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID) 

const databases = new sdk.Databases(client);

// Endpoint: Adds new user 
export const addUserTable = async (username:string) => {

    const result = await databases.createDocument({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
        documentId: username,
        data: {
            "User": username,
        },
    })
}

// Endpoint: Updates user's username
export const updateUsernameTable = async (userId:string, newUsername:string) => {

    const result = await databases.updateDocument({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
        documentId: userId,
        data: {
            "User": newUsername,
        },
    })
}

// Endpoint: Updates user's profile picture 
export const updatePictureTable = async (userId:string, newUrl:string) => {

    const result = await databases.updateDocument({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
        documentId: userId,
        data: {
            "User_Profile_Picture": newUrl,
        },
    })
}

// Endpoint: Will send a friend request | [userId] --> [requestedUser]
export const updateRequestedTable = async (userId:string, requestedUser:string) => {

    // Gets user's data
    const currentList = await databases.getDocument({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
        documentId: userId,
    })

    // Add 'requestedUser' to user's requested array
    const updatedFriends = [...(currentList.Requested || []), requestedUser];

    // Updates user's data
    const result = await databases.updateDocument({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
        documentId: userId,
        data: {
            "Requested": updatedFriends,
        },
    })

    // Gets 'requestedUser' data
    const currentListFromRequested = await databases.getDocument({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
        documentId: requestedUser,
    })

    // Adds user to 'requestedUser's invites array
    const updatedInvite = [...(currentList.Invites || []), userId];

    // Updates 'requestedUser's data
    const resultFromRequested = await databases.updateDocument({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
        documentId: requestedUser,
        data: {
            "Invites": updatedInvite,
        },
    })
}

// Endpoint: Queries' based on given username 
export const searchUserTable = async (search:string) => {

    // Gets results of queried search
    const result = await databases.listDocuments({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
        queries: [
            Query.search('User', search)
        ]
    })

    // If no result was found just returns false
    if(result.total === 0) {
        return false
    }

    // Will return only the necessary attributes 
    const filtered = result.documents.map(
        (doc: { User: any; User_Profile_Picture: any; $id:any}) => 
        ({
            User: doc.User,
            User_Profile_Picture: doc.User_Profile_Picture,
            UsersID: doc.$id,
        })
    );

    return(filtered);
}

// Endpoint: Returns specific user based on given id 
export const getUserById = async (userId:string) => {

    const currentList = await databases.getDocument({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
        documentId: userId,
    })

    return(currentList)
}

// Endpoint: Will accept a friend request | [userId] --> accept --> [inviteFromUser]
export const acceptInviteTable = async (userId:string, inviteFromUser:string) => {

    // Gets user's data
    const currentList = await databases.getDocument({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
        documentId: userId,
    })

    // Removes 'inviteFromUser' from user's invites array
    const updatedInvite = currentList.Invites.filter((userID:string) => userID !== inviteFromUser);
    // Adds 'inviteFromUser' to user's friends array
    const updateFriends = [...(currentList.Friends || []), inviteFromUser];


    // Updates user's data
    const result = await databases.updateDocument({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
        documentId: userId,
        data: {
            "Invites": updatedInvite,
            "Friends": updateFriends,
        },
    })

    // Gets inviteFromUser's data
    const currentListFromUser = await databases.getDocument({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
        documentId: inviteFromUser,
    })

    // Removes user from 'inviteFromUser's requested array
    const updatedRequestedFromUser = currentListFromUser.Requested.filter((userID:string) => userID !== userId);
    // Add user to 'inviteFromUser's friends array
    const updateFriendsFromUser = [...(currentListFromUser.Friends || []), userId];
    
    // Updates 'inviteFromUser's data
    const resultFromUser = await databases.updateDocument({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
        documentId: inviteFromUser,
        data: {
            "Requested": updatedRequestedFromUser,
            "Friends": updateFriendsFromUser,
        },
    })

}

// Endpoint: Will unfriends two users friends | [userId] and [secondUser]
export const unfriendTable = async (userId:string, secondUser:string) => {

    // Gets user's data
    const currentList = await databases.getDocument({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
        documentId: userId,
    })

    // Removes 'secondUser' from user's friends array
    const updateFriends = currentList.Friends.filter((userID:string) => userID !== secondUser);
    
    // Updates user's data
    const result = await databases.updateDocument({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
        documentId: userId,
        data: {
            "Friends": updateFriends,
        },
    })

    // Gets secondUser's data
    const currentListSecondUser = await databases.getDocument({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
        documentId: secondUser,
    })

    // Removes user from 'secondUser's friends array
    const updateFriendsSecondUser = currentListSecondUser.Friends.filter((userID:string) => userID !== userId);
    
    // Updates 'secondUser's data
    const resultSecondUser = await databases.updateDocument({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
        documentId: secondUser,
        data: {
            "Friends": updateFriendsSecondUser,
        },
    })

}


// Endpoint: Adds new contract 
export const addUserContract = async (username:string, userid:string, habitName:string, habitIcon:string,
    frequency:string, count:number, duration:string, expiration:string, difficulty:string, totalDays: number) => {

    const result = await databases.createDocument({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.EXPO_PUBLIC_APPWRITE_CONTRACTS_COLLECTION_ID,
        documentId: ID.unique(),
        data: {
            "Username": username,
            "User_ID": userid,
            "Habit_Name": habitName,
            "Habit_Icon": habitIcon,
            "Frequency": frequency,
            "Count": count,
            "Duration": duration,
            "Expiration": expiration,
            "Difficulty": difficulty, 
            "Total_Days": totalDays,
        },
    })

    // console.log(result);
}

// Endpoint: Queries' based on given username 
export const searchUserContract = async (username:string, userID:string) => {

    // Gets results of queried search
    const result = await databases.listDocuments({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.EXPO_PUBLIC_APPWRITE_CONTRACTS_COLLECTION_ID,
        queries: [
            Query.search('User_ID', userID)
        ]
    })

    // If no result was found just returns false
    if(result.total === 0) {
        return false
    } else {
        return(result);
    }
}