import { AxiosInstance } from 'axios';
import { TCheckoutRequest } from '@/types/requests/checkout';
import { QrDetailsProps } from '@/app/(pages)/checkout/components/qr-payment-modal';

type Data =
    | {
          type: 'url';
          url: string;
      }
    | {
          type: 'html';
          html: string;
      }
    | ({
          type: 'qrcode';
      } & {
          details: QrDetailsProps['details'];
      });

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
