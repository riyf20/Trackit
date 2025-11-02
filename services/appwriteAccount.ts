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
        name: userId,
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

// Endpoint: Update user email
export const updateUserEmail = async (email:string, password:string) => {
    const account = new sdk.Account(client);

    const result = await account.updateEmail({
        email: email,
        password: password,
    });

    debug && console.log(result);
    return result;
}

// Endpoint: Update username
export const updateUserUsername = async (newName:string) => {
    
    const account = new sdk.Account(client);

    const result = await account.updateName({
        name: newName,
    });

    debug && console.log(result);
    return result;
}

// Endpoint: Update password
export const updateUserPassword = async (previousPassword:string, newPassword:string) => {
    
    const account = new sdk.Account(client);

    const result = await account.updatePassword({
        password: newPassword,
        oldPassword: previousPassword   
    });

    debug && console.log(result);
    return result;
}

// Endpoint: Returns a user [has to be logged in]
export const getUser = async (currentSession: string) => {
    client.setSession(currentSession);

    const account = new sdk.Account(client);

    const user = await account.get();

    return user;
}
