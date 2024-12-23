import { AxiosInstance } from 'axios';
import { PaymentStatusResponse } from '@/types/payment-status';

type CheckPaymentParams = {
   order_id: string;
};

type TPaymentStatusResponse = PaymentStatusResponse;

export const getPaymentStatus = (fetcher: AxiosInstance) =>
   async (params: CheckPaymentParams) => {
      const url = '/payments/checkStatus';

      try {
         const response = await fetcher.post<TPaymentStatusResponse>(url, params);
         return response.data;
      } catch (error) {
         throw error;
      }
   };
