import { AxiosInstance } from 'axios';

type ReturnType = void;

type RequestParams = {
    id: number;
    payment_type: 'regular' | 'subscription';
    promoted?: number | boolean;
};

export const addToCart =
    (fetcher: AxiosInstance) =>
    async ({ id, payment_type, promoted }: RequestParams) => {
        const url = `/cart/add/${id}`;
        return (
            await fetcher.post<ReturnType>(url, {
                promoted: promoted ? 1 : 0,
                payment_type: payment_type === 'regular' ? 0 : 1
            })
        ).data;
    };
