import { AxiosInstance } from 'axios';
import { TItem } from '@/types/item';

type ReturnType = TItem;

type Route = 'checkout';

export const getItem = (fetcher: AxiosInstance) => async (id: number, route?: Route) => {
    const url = `/items/get/${id}`;
    return (
        await fetcher.post<ReturnType>(url, {
            route
        })
    ).data;
};
