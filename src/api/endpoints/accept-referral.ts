import { AxiosInstance } from 'axios';

type ReturnType = {
    success?: boolean;
};

export const acceptReferral = (fetcher: AxiosInstance) => async (ref_code: string) => {
    const url = '/cart/setReferral';
    const body = { ref_code };

    return (await fetcher.post<ReturnType>(url, body)).data;
};
