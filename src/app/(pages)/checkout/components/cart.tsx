'use client';

import { FC } from 'react';
import { CartItem } from './cart-item';
import { Price } from '@/components/base/price/price';
import { useCartStore } from '@/stores/cart';
import { useTranslations } from 'next-intl';
import { Table, TableHeader, TableRow, TableHead, TableBody } from '@/components/ui/table';
import { TCart } from '@/types/cart';
import { useSettingsStore } from '@/stores/settings';

export const Cart: FC = () => {
    const t = useTranslations('checkout');
    const { cart, items } = useCartStore();
    const { settings} = useSettingsStore();

    return (
        <>
            <div className="stone-pattern flex-row rounded-md p-9 dark:bg-accent">
                <p className="text-2xl font-bold text-white dark:text-accent-foreground">
                    {t('title')}
                </p>
                <span className="ml-auto flex items-center gap-2 text-[25px] font-bold">
                    <Price value={cart?.price || 0} />
                   {cart?.virtual_price
                      ? ` / ${cart.virtual_price} ${settings?.virtual_currency}`
                      : ''}
                    {cart?.tax ? (
                       <span className="flex gap-2">
                            {' '}
                          + <Price value={cart.tax}/> (tax)
                        </span>
                    ) : (
                       ''
                    )}
                </span>
            </div>

            <CartItems items={items} />
        </>
    );
};

function CartItems({ items }: { items: TCart['items'] }) {
    const t = useTranslations('checkout');

    if (items.length === 0) {
        return (
            <div className="mt-12 flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-primary">{t('empty-cart-title')}</h1>
                <p className="text-balance">{t('empty-cart-description')}</p>
            </div>
        );
    }

    return (
        <Table className="my-4 border-4">
            <TableHeader className="[&_tr]:border-b-4">
                <TableRow className="">
                    <TableHead className="hidden md:table-cell md:w-[100px]">
                        <span className="sr-only">{t('image')}</span>
                    </TableHead>
                    <TableHead className="w-[300px] text-base font-bold text-primary md:text-lg">
                        {t('name')}
                    </TableHead>
                    <TableHead className="w-[200px] text-base font-bold text-primary md:text-lg">
                        {t('price')}
                    </TableHead>
                    <TableHead className="w-[130px] text-base font-bold text-primary md:text-lg">
                        {t('quantity')}
                    </TableHead>
                    <TableHead>
                        <span className="sr-only">{t('actions')}</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="[&_tr]:border-b-4">
                {items?.map((item) => <CartItem key={item.id} item={item} />)}
            </TableBody>
        </Table>
    );
}
