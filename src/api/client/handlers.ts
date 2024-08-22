import { AxiosError } from 'axios';

export const handleUnauthorized = (error: unknown) => {
    if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
            history.replaceState({}, '', '/auth');
        } else {
            throw error;
        }
    }
    throw error;
};
