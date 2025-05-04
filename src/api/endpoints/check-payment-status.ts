import { AxiosInstance } from 'axios';
import { PaymentStatusResponse } from '@/types/payment-status';

type CheckPaymentParams = {
   order_id: string;
   checkout_id?: string;
};

type TPaymentStatusResponse = PaymentStatusResponse;

export const getPaymentStatus = (fetcher: AxiosInstance) =>
   async (params: CheckPaymentParams) => {
      const url = '/payments/checkStatus';

      try {
         const requestParams: CheckPaymentParams = {
            order_id: params.order_id
         };

         if (params.checkout_id) {
            requestParams.checkout_id = params.checkout_id;
         }

         const response = await fetcher.post<TPaymentStatusResponse>(url, requestParams);
         return response.data;
      } catch (error) {
         throw error;
      }
   };
