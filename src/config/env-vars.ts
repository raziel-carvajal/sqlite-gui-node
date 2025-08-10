import dotenv from 'dotenv';

dotenv.config();

export const DB_ADMIN_PASW= process.env.DB_ADMIN_PASW;
export const DB_ADMIN_USER = process.env.DB_ADMIN_USER;
export const EXPRESS_APP_PATH = process.env.EXPRESS_APP_PATH || "/";
export const EXPRESS_SESSION_SECRET = process.env.EXPRESS_SESSION_SECRET;
export const PRIVATE_KEY = process.env.PRIVATE_KEY;
