import { AxiosInstance } from 'axios';
import { TPayments } from '@/types/payments';

type ReturnType = TPayments;

export const getPaymentMethods = (fetcher: AxiosInstance) => async () => {
    const url = `/payments/get`;
    return (await fetcher.post<ReturnType>(url)).data;
};
