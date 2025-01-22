import * as sdk from "node-appwrite";

// Access environment variables
// export const {
//   NEXT_PUBLIC_PROJECT_ID: PROJECT_ID,
//   NEXT_PUBLIC_API_KEY: API_KEY,
//   NEXT_PUBLIC_DATABASE_ID: DATABASE_ID,
//   NEXT_PUBLIC_PATIENT_COLLECTION_ID: PATIENT_COLLECTION_ID,
//   NEXT_PUBLIC_DOCTOR_COLLECTION_ID: DOCTOR_COLLECTION_ID,
//   NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID: APPOINTMENT_COLLECTION_ID,
//   NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
//   NEXT_PUBLIC_ENDPOINT: ENDPOINT,
// } = process.env;

// Check if required variables are available
if (!process.env.NEXT_PUBLIC_ENDPOINT || !process.env.NEXT_PUBLIC_PROJECT_ID || !process.env.NEXT_PUBLIC_API_KEY) {
  throw new Error("Missing required Appwrite environment variables.");
}

// Create Appwrite client instance
const client = new sdk.Client();

console.log(process.env.NEXT_PUBLIC_PROJECT_ID, process.env.NEXT_PUBLIC_API_KEY);

client
  .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!)
  .setKey(process.env.NEXT_PUBLIC_API_KEY!);

// Export Appwrite services
export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
