import { Client, Account, Databases } from "appwrite";

export const MESSAGES_ID = "687837080018ad7ca0a6";
export const DATABASES_ID = "687836ef003541693df5"

const client = new Client().setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT).setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
