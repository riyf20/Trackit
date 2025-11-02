// Appwrite database | User queries and lookup

const sdk = require('node-appwrite');

const debug = false;

const client = new sdk.Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT) // Appwrite API Endpoint
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID) // Appwrite project ID
    .setKey(process.env.EXPO_PUBLIC_APPWRITE_API_KEY); // Appwrite secret API key

    
// Endpoint: Checks if user exists
export const checkUser = async (userIdRequested: string) => {
    
    const users = new sdk.Users(client);

    const allUsers = await users.list({
        queries: [
            sdk.Query.equal('name', userIdRequested),
        ]
    });

    console.log(allUsers)

    if(allUsers.total === 0) {
        return(false)
    } else {
        return(true)
    }

}
