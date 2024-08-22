import { TCart } from '@/types/cart';
import { AxiosInstance } from 'axios';

type ReturnType = TCart;

export const getCart = (fetcher: AxiosInstance) => async () => {
    const url = '/cart/get';
    return (await fetcher.post<ReturnType>(url)).data;
};
