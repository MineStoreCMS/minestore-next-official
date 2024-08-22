import { AxiosInstance } from 'axios';

type ReturnType = {
    success?: boolean;
    status?: boolean;
    message: string;
    sum?: number;
    type?: string;
};

export const removeCoupon = (fetcher: AxiosInstance) => async () => {
    const url = '/cart/removeCoupon';
    return (await fetcher.post<ReturnType>(url)).data;
};
