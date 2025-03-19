import { AxiosInstance } from 'axios';
import { TPatrons } from '@/types/patrons';

type ReturnType = TPatrons;

export const getPatrons = (fetcher: AxiosInstance) => async () => {
   const url = '/patrons/get';
   return (await fetcher.get<ReturnType>(url)).data;
};
