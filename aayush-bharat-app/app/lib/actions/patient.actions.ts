import { ID, Query } from "node-appwrite";
import { users } from "../appwrite.config";

export interface CreateUserParams {
  email: string;
  phone: string;
  name: string;
}

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(ID.unique(), user.email, undefined, undefined, user.name);
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


