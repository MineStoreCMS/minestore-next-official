import { FC } from 'react';
import { ReactSVG } from 'react-svg';
import Link from 'next/link';
import { useAuth } from '@/core/auth/client/use-auth';
import { useCartStore } from '@/stores/cart';
import { Price } from '@/components/base/price/price';
import { useTranslations } from 'next-intl';

export const ShoppingCartSection: FC = () => {
    const { user } = useAuth();
    const { cart } = useCartStore();

    const t = useTranslations('navbar');

    const isCartEmpty = cart?.items === 0;

    if (!user) {
        return (
            <div className="flex items-center">
                <ReactSVG src="/icons/shopping-cart.svg" className='text-white dark:text-accent-foreground w-5 h-5 sm:w-6 sm:h-6' />
                <div className="ml-2 sm:ml-4 flex-col hidden sm:flex">
                    <span className="text-xs uppercase text-muted-foreground">
                        {t('not-logged')}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <Link
            href="/checkout"
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200"
        >
            <ReactSVG
                src="/icons/shopping-cart.svg"
                className="text-white dark:text-accent-foreground w-5 h-5 sm:w-6 sm:h-6"
            />
            <div className="ml-2 sm:ml-4 flex-col">
                <span className="font-bold uppercase text-white dark:text-accent-foreground text-sm sm:text-base">
                    {t('cart')}
                </span>
                {user ? (
                    <div className="flex flex-col sm:flex-row text-xs uppercase text-muted-foreground">
                        {isCartEmpty ? (
                            <span className="hidden sm:inline">{t('empty-cart')}</span>
                        ) : (
                            <>
                                <span className="hidden sm:inline">
                                    {cart?.items} {t('cart-hint')}&nbsp;
                                </span>
                                <Price value={cart?.price || 0} className="text-xs sm:text-xs" />
                            </>
                        )}
                    </div>
                ) : (
                    <span className="text-xs uppercase text-muted-foreground hidden sm:inline">
                        {t('not-logged')}
                    </span>
                )}
            </div>
        </Link>
    );
};
