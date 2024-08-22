'use client';
import { GiftCard } from '@layout/gift-card/giftcard';
import { RecentPurchases } from '@layout/recent-purchases/recent-purchases';
import { useTranslations } from 'next-intl';

export function Modules() {
    const t = useTranslations('home');

    return (
        <div className="mt-4 border-t border-t-accent px-4 py-6 @container">
            <div className="grid gap-6 @4xl:grid-cols-2">
                <GiftCard />
                <div className="flex-col gap-4">
                    <h3 className="text-xl font-bold text-accent-foreground">
                        {t('recent-purchases')}
                        <hr className="mt-2 h-1 w-12 rounded border-0 bg-accent" />
                    </h3>
                    <RecentPurchases limit={7} />
                </div>
            </div>
        </div>
    );
}
