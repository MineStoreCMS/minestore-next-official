import { AxiosInstance } from 'axios';
import { TCheckoutRequest } from '@/types/requests/checkout';

type Data =
    | {
          type: 'url';
          url: string;
      }
    | {
          type: 'html';
          html: string;
      };

type ReturnType = {
    success: boolean;
    message: string;
    data: Data;
};

type RequestBody = TCheckoutRequest;

export const checkout = (fetcher: AxiosInstance) => async (body: RequestBody) => {
    const url = '/payments/create';
    return (await fetcher.post<ReturnType>(url, body)).data;
};
