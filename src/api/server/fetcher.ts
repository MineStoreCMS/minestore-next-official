import axios from 'axios';
import { cookies, headers } from 'next/headers';
import { config } from '../config';

export const fetcher = axios.create(config);

fetcher.interceptors.request.use((request) => {
   const headersList = headers();

   const clientIP =
      headersList.get('x-forwarded-for')?.split(',')[0].trim() || // Most common
      headersList.get('x-real-ip') || // Nginx, etc.
      headersList.get('http_x_real_ip') || // Apache, etc.
      headersList.get('x-client-ip') || // Less common
      headersList.get('x-forwarded') || // General header
      headersList.get('forwarded-for') || // Another variation
      headersList.get('x-vercel-proxied-for') || // Vercel-specific
      '127.0.0.1'; // Fallback to localhost

   request.headers.Authorization = `Bearer ${cookies().get('token')?.value}`;
   request.headers['X-Forwarded-For'] = clientIP;
   return request;
});
