export type TPaymentStatus = 'checking' | 'paid' | 'error' | 'cancelled' | 'pending' | 'success' | 'forbidden' | 'failed' | 'not_found';

export interface PaymentStatusResponse {
   status: TPaymentStatus;
   message: string;
   order_data?: OrderData;
}

export interface OrderData {
   id?: number;
   internal_id?: string;
   price?: number;
   currency?: string;
   status?: number;
   gateway?: string;
   created_at?: string;
}
