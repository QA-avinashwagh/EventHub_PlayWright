import dotnev from "dotenv"

dotnev.config();

export const UI_BASE_URL = process.env.UI_BASE_URL
export const API_BASE_URL = process.env.API_BASE_URL!;