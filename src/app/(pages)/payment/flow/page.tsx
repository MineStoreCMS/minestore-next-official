'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getEndpoints } from '@/api';
import { fetcher } from '@/api/client/fetcher';
import { TPaymentStatus, OrderData } from '@/types/payment-status';
import { useTranslations } from 'next-intl';

export default function PaymentStatus() {
   const t = useTranslations('paymentFlow');
   const [status, setStatus] = useState<TPaymentStatus>('pending');
   const [message, setMessage] = useState<string>('');
   const [orderData, setOrderData] = useState<OrderData | null>(null);
   const [isPnTransaction, setIsPnTransaction] = useState<boolean>(false);
   const router = useRouter();
   const searchParams = useSearchParams();
   const orderId = searchParams.get('order_id');

   useEffect(() => {
      if (!orderId) {
         setStatus('error');
         router.replace('/error');
         return;
      }

      // Check if this is a pn_ (PayNow) transaction
      if (orderId.startsWith('pn_')) {
         setIsPnTransaction(true);
      }

      const { getPaymentStatus } = getEndpoints(fetcher);

      const checkPayment = async () => {
         try {
            const response = await getPaymentStatus({
               order_id: orderId,
            });

            const normalizedStatus: TPaymentStatus = response.status === 'success' ? 'paid' :
               (response.status as TPaymentStatus);

            setStatus(normalizedStatus);
            setMessage(response.message);

            if (response.order_data) {
               setOrderData(response.order_data);
            }

            if (response.status === 'success' || response.status === 'paid') {
               router.replace('/success');
            } else if (response.status === 'error' || response.status === 'cancelled' || response.status === 'failed') {
               router.replace('/error');
            } else if (response.status === 'not_found' && !isPnTransaction) {
               router.replace('/error');
            }
         } catch (error) {
            if (isPnTransaction) {
               setStatus('pending');
               setMessage(t('pleaseWaitChecking'));
            } else {
               setStatus('error');
               setMessage(t('paymentErrorOccurred'));
               router.replace('/error');
            }
         }
      };

      checkPayment();

      if (status === 'pending' || status === 'checking' || (isPnTransaction && status === 'not_found')) {
         const intervalId = setInterval(checkPayment, 4000);
         return () => clearInterval(intervalId);
      }

   }, [orderId, status, router, t, isPnTransaction]);

   const statusMessages: Record<TPaymentStatus, string> = {
      checking: t('checkingPaymentStatus'),
      paid: t('paymentSuccessful'),
      success: t('paymentSuccessful'),
      error: t('paymentError'),
      cancelled: t('paymentCancelled'),
      pending: t('pleaseWaitChecking'),
      failed: t('paymentFailed'),
      forbidden: t('accessDenied'),
      not_found: t('paymentNotFound'),
   };

   const LoadingSpinner = () => (
      <div className="mb-4">
         <div className="animate-spin h-20 w-20 border-8 border-primary border-t-transparent rounded-full mx-auto" />
      </div>
   );

   const StatusMessage = ({ status }: { status: TPaymentStatus }) => {
      if (isPnTransaction && status === 'not_found') {
         return <p>{t('pleaseWaitChecking')}</p>;
      }

      if (status === 'forbidden') {
         return <p>{t('loginAndTryAgain')}</p>;
      }
      if (status === 'not_found') {
         return <p>{t('paymentNotFoundError')}</p>;
      }
      if (status === 'error') {
         return (
            <>
               <span className="font-bold text-white">{t('paymentError')}</span>
               <p>{t('paymentErrorOccurred')}</p>
            </>
         );
      }
      if (status === 'cancelled') {
         return (
            <>
               <span className="font-bold text-white">{t('paymentCancelled')}</span>
               <p>{t('paymentCancelledMessage')}</p>
            </>
         );
      }
      return null;
   };

   const OrderDetails = ({ orderData }: { orderData: OrderData }) => (
      <div className="mt-3 mb-4 text-center border-t border-accent pt-4">
         <div className="mt-4 text-gray-400">
            <p><span className="font-bold text-white">{t('orderNumber')}</span> {orderData.id}</p>
            <p><span className="font-bold text-white">{t('orderId')}:</span> {orderData.internal_id}</p>
            <p><span className="font-bold text-white">{t('orderStatus')}:</span> {orderData.status === 1 ? t('orderStatusPaid') : t('orderStatusPending')}</p>
            <p><span className="font-bold text-white">{t('price')}:</span> {orderData.price} {orderData.currency}</p>
            <p><span className="font-bold text-white">{t('paymentGateway')}:</span> {orderData.gateway}</p>
            <p>
               <span className="font-bold text-white">{t('orderCreatedAt')}: </span>
               {orderData.created_at
                  ? new Date(orderData.created_at).toLocaleString()
                  : 'N/A'}
            </p>
         </div>
      </div>
   );

   const shouldShowSpinner = status === 'checking' || status === 'pending' ||
      (isPnTransaction && status === 'not_found');

   const displayMessage = isPnTransaction && status === 'not_found'
      ? t('checkingPaymentStatus')
      : (message || statusMessages[status]);

   return (
      <div className="flex-col rounded-[10px] bg-card p-6">
         <span className="text-center text-[28px] text-primary">
         {displayMessage}
         </span>
         <hr className="mt-2 border-[2.5px] border-accent" />
         <div className="mt-8 text-gray-400">
            {shouldShowSpinner && <LoadingSpinner />}
         </div>
         <span className="mt-3 text-center">
            {shouldShowSpinner && t('pleaseWaitMessage')}
         </span>
         <div className="text-center">
            <StatusMessage status={status} />
         </div>
         {(status === 'pending' || status === 'paid' || status === 'success' ||
            status === 'error' || status === 'cancelled' ||
            (isPnTransaction && status === 'not_found')) && orderData && (
            <OrderDetails orderData={orderData} />
         )}
      </div>
   );
}
