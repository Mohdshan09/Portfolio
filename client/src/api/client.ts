import axios from 'axios';

export const apiClient = axios.create({
  // Same-origin by default: Vite's dev proxy and Vercel's rewrite (vercel.json) both forward
  // /api to the Express server, which keeps the SameSite=Strict refresh cookie working.
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
});
