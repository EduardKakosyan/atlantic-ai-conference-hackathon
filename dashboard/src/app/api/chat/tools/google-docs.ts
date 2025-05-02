// import { google } from 'googleapis';

// /**
//  * Creates a new Google Doc with the specified title and returns its URL.
//  *
//  * @param title - The title of the document to create.
//  * @returns The edit URL of the newly created document.
//  */
// export async function createGoogleDoc(title: string): Promise<string> {
//   // Initialize authentication with the required scope
//   const auth = new google.auth.GoogleAuth({
//     scopes: ['https://www.googleapis.com/auth/documents'],
//     clientOptions: {
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }
//   });

//   console.log(auth);

//   // Acquire an auth client, and bind it to future calls
//   const authClient = await auth.getClient();
  
//   // Instantiate the Docs API
//   const docs = google.docs({
//     version: 'v1',
//     auth: authClient as any
//   });

//   // Create the document
//   const res = await docs.documents.create({
//     requestBody: {
//       title: title
//     }
//   });

//   console.log(res);
  
//   // Extract the document ID from the response
//   const documentId = res.data.documentId;
//   if (!documentId) {
//     throw new Error('Failed to create document: no documentId returned');
//   }

//   // Return the URL where the document can be edited
//   return `https://docs.google.com/document/d/${documentId}/edit`;
// }