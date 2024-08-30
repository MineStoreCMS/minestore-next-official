import { AxiosInstance } from 'axios';

type ResponseType = {
   success: boolean;
   message?: string;
};

export const updateItemCount = (fetcher: AxiosInstance) => async (id: number, count: number) => {
    const url = `/cart/reload/${id}`;
    const body = { count };

   const response = await fetcher.post<ResponseType>(url, body);
   return response.data;
};
