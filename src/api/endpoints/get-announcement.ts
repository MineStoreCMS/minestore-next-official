import { AxiosInstance } from 'axios';
import { TAnnouncement } from '@/types/announcement';

type ReturnType = TAnnouncement;

export const getAnnouncement = (fetcher: AxiosInstance) => async () => {
    const url = '/announcement/get';
    return (await fetcher.get<ReturnType>(url)).data;
};
