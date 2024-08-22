import { AxiosInstance } from 'axios';

type ReturnType = void;

type RequestParams = {
    id: number;
    server_id: number;
};

export const setSelectedServer =
    (fetcher: AxiosInstance) =>
    async ({ id, server_id }: RequestParams) => {
        const url = `/cart/setSelectedServer/${id} `;
        return (
            await fetcher.post<ReturnType>(url, {
                server_id
            })
        ).data;
    };
