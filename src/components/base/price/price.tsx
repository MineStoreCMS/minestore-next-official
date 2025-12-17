'use client';

import { FC } from 'react';
import { useCurrencyStore } from '@/stores/currency';
import { useSettingsStore } from '@/stores/settings';
import { convertToLocalCurrency } from '@helpers/convert-to-local-currency';
import { cn } from '@/lib/utils';
import { TCurrency } from '@/types/currency';

type PriceProps = {
    value: number;
    isVirtual?: boolean;
    className?: string;
    discount?: number;
    originalPrice?: number;
    // SSR-friendly: optional currency prop
    currency?: TCurrency;
    virtualCurrencyName?: string;
};

type PriceTagProps = {
    price: number;
    currency: string;
    isVirtual: boolean;
    discount?: number;
    originalPrice?: number;
    className?: string;
    virtualCurrencyName?: string;
};

type VariablePriceProps = {
   value: number;
   currency?: TCurrency;
};

const PriceTag: FC<PriceTagProps> = ({
    price,
    currency,
    isVirtual,
    discount,
    originalPrice,
    className,
    virtualCurrencyName
}) => {
    let displayPrice = 'Free';
    let discountedPrice: string | null = null;

    const hasDiscountOrOriginalPrice = discount || originalPrice;
    const effectivePrice = originalPrice || price + (discount || 0);

    if (isVirtual) {
        displayPrice = `${price} ${virtualCurrencyName || ''}`;
    } else if (price > 0) {
        displayPrice = `${price.toFixed(2)} ${currency}`;
        discountedPrice = hasDiscountOrOriginalPrice
            ? `${effectivePrice.toFixed(2)} ${currency}`
            : null;
    }

    return (
         <p className={className}>
            {(discountedPrice && discountedPrice !== displayPrice) ? (
               <>
                  <s className="text-red-400 line-through">{discountedPrice}</s>
                  <span className="text-green-400">{displayPrice}</span>
               </>
            ) : (
               <>
                  <span className={cn('text-green-400', className)}>{displayPrice}</span>
               </>
            )}
         </p>
      );
};

export const Price: FC<PriceProps> = ({
    value,
    isVirtual = false,
    className,
    discount,
    originalPrice,
    currency: currencyProp,
    virtualCurrencyName: virtualCurrencyNameProp
}) => {
    const { currency: storeCurrency } = useCurrencyStore();
    const { settings } = useSettingsStore();
    
    // Use prop if provided (SSR), otherwise fall back to store (client)
    const currency = currencyProp || storeCurrency;
    const virtualCurrencyName = virtualCurrencyNameProp || settings?.virtual_currency;
    
    const localCurrencyName = currency?.name || '';
    const localPrice = convertToLocalCurrency(value, currency);
    const localDiscount = discount ? convertToLocalCurrency(discount, currency) : 0;
    const localOriginalPrice = originalPrice ? convertToLocalCurrency(originalPrice, currency) : 0;

    return (
        <PriceTag
            originalPrice={localOriginalPrice}
            price={localPrice}
            currency={localCurrencyName}
            isVirtual={isVirtual}
            discount={localDiscount}
            className={className}
            virtualCurrencyName={virtualCurrencyName}
        />
    );
};

export const VariablePrice: FC<VariablePriceProps> = ({ value, currency: currencyProp }) => {
   const { currency: storeCurrency } = useCurrencyStore();
   const currency = currencyProp || storeCurrency;
   const localCurrencyName = currency?.name || '';
   const localPrice = convertToLocalCurrency(value, currency).toFixed(2);

   return (
      <span>
         {localPrice} {localCurrencyName}
      </span>
   );
};
