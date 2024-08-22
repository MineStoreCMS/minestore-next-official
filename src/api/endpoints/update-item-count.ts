import { AxiosInstance } from 'axios';

type ReturnType = void;

export const updateItemCount = (fetcher: AxiosInstance) => async (id: number, count: number) => {
    const url = `/cart/reload/${id}`;
    const body = { count };

    return (await fetcher.post<ReturnType>(url, body)).data;
};
