import { AxiosInstance } from 'axios';

type ReturnType = void;

type RequestParams = {
    id: number;
    payment_type: 'regular' | 'subscription' | 'gift';
    promoted?: number | boolean;
    gift_to?: string;
};

export const addToCart =
    (fetcher: AxiosInstance) =>
    async ({ id, payment_type, promoted, gift_to }: RequestParams) => {
        const url = `/cart/add/${id}`;
        let paymentTypeValue: number;
        if (payment_type === 'regular') paymentTypeValue = 0;
        else if (payment_type === 'subscription') paymentTypeValue = 1;
        else paymentTypeValue = 2;
        const data: Record<string, unknown> = {
            promoted: promoted ? 1 : 0,
            payment_type: paymentTypeValue
        };
        if (paymentTypeValue === 2 && gift_to) {
            data.gift_to = gift_to;
        }
        return (
            await fetcher.post<ReturnType>(url, data)
        ).data;
    };
