// const sdk = require('node-appwrite');

// const client = new sdk.Client()
//     .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT) // Your API Endpoint
//     .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID) // Your project ID
//     .setSession(''); // The user session to authenticate with

// const databases = new sdk.Databases(client);

// const result = await databases.createDocument({
//     databaseId: '<DATABASE_ID>',
//     collectionId: '<COLLECTION_ID>',
//     documentId: '<DOCUMENT_ID>',
//     data: {
//         "username": "walter.obrien",
//         "email": "walter.obrien@example.com",
//         "fullName": "Walter O'Brien",
//         "age": 30,
//         "isAdmin": false
//     },
//     permissions: [sdk.Permission.read(sdk.Role.any())], // optional
//     transactionId: '<TRANSACTION_ID>' // optional
// });
