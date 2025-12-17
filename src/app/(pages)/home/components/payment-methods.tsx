import { getServerTranslations } from '@/core/i18n/server';
import Image from 'next/image';
import { TSettings } from '@/types/settings';

type PaymentMethodsProps = {
   settings: TSettings;
};

export async function PaymentMethods({ settings }: PaymentMethodsProps) {
   const t = await getServerTranslations('home');

   const payNow = settings?.footer?.find(item => item.url === "https://paynow.gg/terms-of-use")?.url;

   return (
      <div className="mt-10">
         {payNow && (
            <div className="flex-row py-4">
               <div className="w-32">
                  <Image
                     className="h-[29px] w-28 object-contain"
                     src={`/media/home/paynow.svg`}
                     alt="PayNow Logo"
                     width={112}
                     height={29}
                  />
               </div>
               <span className="ml-12">PayPal, Cards, Bank Transfers & 75+ More Ways to Pay.</span>
            </div>
         )}

         {!payNow && (
            <>
               <div className="flex-row py-4">
                  <div className="w-32">
                     <Image
                        className="h-[29px] w-28 object-contain"
                        src={`/media/home/paypal.svg`}
                        alt="PayPal Logo"
                        width={112}
                        height={29}
                     />
                  </div>
                  <span className="ml-12">{t('paypal-balance-banks-all-credit-debit-cards')}.</span>
               </div>

               <hr className="w-64" />

               <div className="flex-row py-4">
                  <div className="w-32">
                     <Image
                        className="mr-auto h-[40px] w-28 object-contain"
                        src={`/media/home/skrill.svg`}
                        alt="Skrill Logo"
                        width={112}
                        height={40}
                     />
                  </div>
                  <span className="ml-12">
                      {t('paysafecard-amazon-pay-mobile-payments-600-more')}
                   </span>
               </div>

               <hr className="w-64" />

               <div className="flex-row py-4">
                  <div className="w-32">
                     <Image
                        className="h-[29px] w-28 object-contain"
                        src={`/media/home/stripe.svg`}
                        alt="Stripe Logo"
                        width={112}
                        height={29}
                     />
                  </div>
                  <span className="ml-12">{t('all-credit-debit-cards')}.</span>
               </div>
            </>
         )}
      </div>
   );
}
