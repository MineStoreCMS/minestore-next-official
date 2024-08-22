import { AxiosInstance } from 'axios';

type ReturnType = void;

type RequestParams = {
    id: number;
    var_id: number;
    var_value: number | string;
};

export const setProductVariable =
    (fetcher: AxiosInstance) =>
    async ({ id, var_id, var_value }: RequestParams) => {
        const url = `/cart/setVariable/${id} `;
        return (
            await fetcher.post<ReturnType>(url, {
                var_id,
                var_value
            })
        ).data;
    };
