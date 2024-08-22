'use client';

import { getEndpoints } from '@/api';
import { fetcher } from '@/api/client/fetcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { notify } from '@/core/notifications';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';

const { getGift } = getEndpoints(fetcher);

export const GiftCard: FC = () => {
    const t = useTranslations('home');

    const [giftCode, setGiftCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setLoading(true);

            if (!giftCode) {
                throw new Error('Please enter a gift code');
            }

            const response = await getGift(giftCode);

            if (response.status) {
                notify(`${t('gift-card-with-balance')}: ${response.end_balance}`, 'green');
            } else {
                notify(t('gift-card-not-found'), 'red');
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unexpected error occurred';
            notify(message, 'red');
        } finally {
            setLoading(false);
        }
    };

    const handleGiftCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGiftCode(event.target.value);
    };

    return (
        <div className="flex-col gap-4">
            <h3 className="text-xl font-bold text-accent-foreground">
                {t('gift-card')}
                <hr className="mt-2 h-1 w-12 rounded border-0 bg-accent" />
            </h3>
            <form className="flex h-full gap-2" onSubmit={handleFormSubmit}>
                <Input
                    placeholder={t('gift-card-placeholder')}
                    className="h-full w-full"
                    name="giftCode"
                    onChange={handleGiftCodeChange}
                />
                <Button
                    type="submit"
                    disabled={loading || !giftCode}
                    className="h-full min-w-[120px] gap-2"
                >
                    {loading && <Loader2 size={24} className="animate-spin" />}
                    {t('gift-card-check')}
                </Button>
            </form>
        </div>
    );
};
