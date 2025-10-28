// Appwrite database | Account queries and lookup

const sdk = require('node-appwrite');

const debug = false;

const client = new sdk.Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT) // Appwrite API Endpoint
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID) // Appwrite project ID


// Endpoint: Creates a new user
export const createUser = async (email: string, password: string, userId: string) => {

    const account = new sdk.Account(client);

    const result = await account.create({
        userId: userId,
        email: email,
        password: password,
    });

    // debug && console.log(result);
    return(result);
}

// Endpoint: Login existing user
export const loginUser = async (email: string, password:string) => {
    
    const account = new sdk.Account(client);

    const result = await account.createEmailPasswordSession({
        email: email,
        password: password
    });

    // debug && console.log(result);
    return result;
}

// Endpoint: Logs out user & deletes session
export const logOutUser = async (session: string) => {
    
    const account = new sdk.Account(client);

    const result = await account.deleteSession({
        sessionId: session
    });

    // debug && console.log(result);
    return result;
}