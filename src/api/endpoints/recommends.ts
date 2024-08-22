import { TItem } from '@/types/item';
import { AxiosInstance } from 'axios';

type ReturnType = Array<TItem>;

export const getRecommends = (fetcher: AxiosInstance) => async () => {
    const url = '/cart/getPromoted';
    return (await fetcher.post<ReturnType>(url)).data;
};
