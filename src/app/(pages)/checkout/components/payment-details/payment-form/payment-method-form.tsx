import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage
} from '@/components/ui/form';

import { useFormContext, useWatch } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEffect, useState } from 'react';
import { TPayments } from '@/types/payments';

import { getEndpoints } from '@/api';
import { fetcher } from '@/api/client/fetcher';
import { TCart } from '@/types/cart';
import { Label } from '@/components/ui/label';

import { Checkbox } from '@/components/ui/checkbox';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

const { getPaymentMethods } = getEndpoints(fetcher);

type PaymentMethodFormProps = {
   items: TCart['items'];
};

export const PaymentMethodForm = ({ items }: PaymentMethodFormProps) => {
   const t = useTranslations('checkout');
   const form = useFormContext();
   const { setValue } = form;

   const [paymentMethods, setPaymentMethods] = useState<TPayments>([]);
   const [isLoading, setIsLoading] = useState(true);

   // Watch for payment method changes
   const paymentMethod = useWatch({
      control: form.control,
      name: 'paymentMethod'
   });

   const isPayNowSelected = paymentMethod === 'PayNow';

   // Effect to handle terms and conditions based on selected payment method
   useEffect(() => {
      if (isPayNowSelected) {
         setValue('termsAndConditions', true);
      } else {
         setValue('termsAndConditions', false);
      }
   }, [isPayNowSelected, setValue]);

   useEffect(() => {
      getPaymentMethods()
         .then((response) => {
            setPaymentMethods(response);

            if (response.length === 1) {
               setValue('paymentMethod', response[0].name);
               setValue('termsAndConditions', true);
            }

            setIsLoading(false);
         })
         .catch((err) => {
            console.error(err);
            setIsLoading(false);
         });
   }, [items, setValue]);

   if (!isLoading && paymentMethods.length === 1) {
      return null;
   }

   return (
      <div className="space-y-4 rounded-md border border-border p-4">
         <FormField
            name="paymentMethod"
            render={({ field }) => (
               <FormItem>
                  <FormLabel className="text-[20px] font-bold text-accent-foreground">
                     {t('payment-method')}
                  </FormLabel>
                  <RadioGroup
                     className="grid grid-cols-2 gap-4 md:grid-cols-3"
                     onValueChange={field.onChange}
                     defaultValue={field.value}
                  >
                     {paymentMethods.map((method, index) => (
                        <div key={index}>
                           <RadioGroupItem
                              value={method.name}
                              id={method.name}
                              className="peer sr-only transition-all"
                           />
                           <Label
                              htmlFor={method.name}
                              className="flex flex-col items-center justify-between gap-2 rounded-md border-2 border-muted bg-popover p-4 transition-all hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary
                      peer-data-[state=checked]:bg-primary/10 [&:has([data-state=checked])]:border-primary"
                           >
                              <div className={`flex items-center justify-center ${method.name === 'PayNow' ? 'h-20' : 'h-20'}`}>
                                 <Image
                                    className={`rounded object-contain ${method.name === 'PayNow' ? 'h-full w-auto max-w-full' : 'h-20 w-28'}`}
                                    src={`/media/payments/${method.name.toLowerCase()}.svg`}
                                    alt=""
                                    width={method.name === 'PayNow' ? 130 : 112}
                                    height={80}
                                 />
                              </div>
                              {
                                 method.name === 'Cordarium' ? 'Crypto' :
                                    method.name === 'PayPalIPN' ? 'PayPal' :
                                       method.name === 'PayNow' ? 'PayNow Checkout' :
                                          method.name
                              }
                           </Label>
                        </div>
                     ))}
                  </RadioGroup>
                  <FormMessage />
               </FormItem>
            )}
         />

         {/* Only show terms and conditions when PayNow is not selected */}
         {!isPayNowSelected && (
            <FormField
               name="termsAndConditions"
               render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                     <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                     </FormControl>
                     <div className="space-y-1 leading-none">
                        <FormLabel>{t('privacy-statement')}</FormLabel>
                        <FormDescription>{t('privacy-statement-description')}</FormDescription>
                        <FormMessage />
                     </div>
                  </FormItem>
               )}
            />
         )}
      </div>
   );
};
