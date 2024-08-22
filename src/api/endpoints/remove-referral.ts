import { AxiosInstance } from 'axios';

type ReturnType = {
    success?: boolean;
};

export const removeReferral = (fetcher: AxiosInstance) => async () => {
    const url = '/cart/removeReferral';

    return (await fetcher.post<ReturnType>(url)).data;
};
