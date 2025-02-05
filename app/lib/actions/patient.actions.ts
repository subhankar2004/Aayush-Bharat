'use server'

import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file";
import {
  NEXT_PUBLIC_BUCKET_ID as BUCKET_ID,
  NEXT_PUBLIC_DATABASE_ID as DATABASE_ID,
  NEXT_PUBLIC_ENDPOINT as ENDPOINT,
  NEXT_PUBLIC_PATIENT_COLLECTION_ID as PATIENT_COLLECTION_ID,
  NEXT_PUBLIC_PROJECT_ID as PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";

console.log(ENDPOINT);

export interface CreateUserParams {
  email: string;
  phone: string;
  name: string;
}

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      undefined,
      undefined,
      user.name
    );
    return newUser;
  } catch (err: any) {
    console.error("Error creating user:", err.message);

    if (err.code === 409) {
      const documents = await users.list([
        Query.equal("email", [user.email]),
      ]);
      return documents?.users?.[0];
    }

    throw err;
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (err: any) {
    console.error("Error getting user:", err.message);
    throw err;
  }
};

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", userId)]
    )
    return parseStringify(patients.documents[0]);
  } catch (err: any) {
    console.error("Error getting user:", err.message);
    throw err;
  }
};

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;

    if (!BUCKET_ID) {
      throw new Error("Bucket ID is not defined in environment variables.");
    }

    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get("blobFile") as Blob,
        identificationDocument?.get("fileName") as string
      );
      file = await storage.createFile(BUCKET_ID, ID.unique(), inputFile);
    }

    console.log(
      {
        identificationDocument:file?.$id || null,
        identificationDocumentUrl: file ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}` : null,
      }
    )

    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        // identificationDocument:file?.$id || null,
        identificationDocumentUrl: file ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}` : null,
        ...patient,
      }
    );

    return newPatient;
  } catch (err: any) {
    console.log("Error registering patient:", err.message);
    throw err;
  }
};




