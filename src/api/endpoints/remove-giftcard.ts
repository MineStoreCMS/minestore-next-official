import { AxiosInstance } from 'axios';

type ReturnType = {
    success?: boolean;
    status?: boolean;
    message: string;
    sum?: number;
    type?: string;
};

export const removeGiftcard = (fetcher: AxiosInstance) => async () => {
    const url = '/cart/removeGiftcard';
    return (await fetcher.post<ReturnType>(url)).data;
};
