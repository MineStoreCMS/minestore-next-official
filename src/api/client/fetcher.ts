import axios from 'axios';
import { tokenHelper } from '@/core/auth/client/token';
import { config } from '../config';

export const fetcher = axios.create(config);

fetcher.interceptors.request.use((request) => {
    request.headers.Authorization = `Bearer ${tokenHelper.get()}`;
    return request;
});
