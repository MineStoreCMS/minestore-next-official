import { AxiosInstance } from 'axios';

type ReturnType = void;

type RequestParams = {
    id: number;
    price: number;
};

export const setCustomPrice =
    (fetcher: AxiosInstance) =>
    async ({ id, price }: RequestParams) => {
        const url = `/cart/changePrice/${id}`;
        return (
            await fetcher.post<ReturnType>(url, {
                price
            })
        ).data;
    };
