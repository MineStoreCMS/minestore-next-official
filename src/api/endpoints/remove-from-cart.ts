import { AxiosInstance } from 'axios';

type ReturnType = void;

export const removeFromCart = (fetcher: AxiosInstance) => async (id: number) => {
    const url = `/cart/remove/${id}`;
    return (await fetcher.post<ReturnType>(url)).data;
};
