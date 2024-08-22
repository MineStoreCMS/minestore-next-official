import { AxiosInstance } from 'axios';

type ReturnType = {
    success?: boolean;
    status?: boolean;
    message: string;
    sum?: number;
    type?: string;
};

export const acceptCoupon = (fetcher: AxiosInstance) => async (coupon: string) => {
    const url = '/cart/acceptCoupon';
    const body = { coupon };

    return (await fetcher.post<ReturnType>(url, body)).data;
};
