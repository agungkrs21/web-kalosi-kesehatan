import { Client, Account, Databases, Storage } from "appwrite";

export const PROJECT_ID = "6877342c0034395d4249";
export const MESSAGES_ID = "687837080018ad7ca0a6";
export const DATABASES_ID = "687836ef003541693df5";
export const AVATAR_ID = "68786dfd0010507fa2df";
export const USER_ID = "68786e92000d78a4f58f";
export const MEDIA_ID = "687a548d002ef292874b";
export const ARTIKEL_ID = "687a6ca900232322e586";

const client = new Client().setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT).setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

const testImagePreview = async () => {
  storage.getFilePreview(AVATAR_ID);
};
export { client, account, databases, storage };
