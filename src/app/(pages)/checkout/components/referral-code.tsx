'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { getEndpoints } from '@/api';
import { fetcher } from '@/api/client/fetcher';
import { notify } from '@/core/notifications';
import { useCartStore } from '@/stores/cart';
import { Button } from '@/components/ui/button';
import { Loader2, Tags, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/stores/settings';

const { getCart, removeReferral, acceptReferral } = getEndpoints(fetcher);

const formSchema = z.object({
    code: z.string().min(1, {
        message: 'Code is required'
    })
});

type FormValues = z.infer<typeof formSchema>;

export const ReferralCode = () => {
    const t = useTranslations('checkout');

    const { setCart, items, cart } = useCartStore();
    const { settings } = useSettingsStore();

    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: ''
        },
        mode: 'onSubmit'
    });

    async function onSubmit(data: FormValues) {
        if (cart?.referral_code) {
            notify(t('referral-code-already-redeemed'), 'red');
            return;
        }

        const { code } = data;

        try {
            setLoading(true);
            const response = await acceptReferral(code);

            if (!response.success) {
                notify(t('referral-code-invalid'), 'red');
                return;
            }

            setCart(await getCart());
        } catch (error) {
            notify('Something wrong happened', 'red');
            console.error('Error accepting referral', error);
        } finally {
            setLoading(false);
        }

        form.reset();
    }

    if (!settings?.is_ref) return null;
    if (items.length === 0) return null;

    return (
        <>
            <div className="flex-col gap-4">
                <div>
                    <p className="text-[20px] font-bold text-accent-foreground">
                        {t('redeem-referral')}
                    </p>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 flex gap-2">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('referral-code')}</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder={t('referral-code-placeholder')}
                                                    {...field}
                                                />
                                                <Button
                                                    type="submit"
                                                    className="gap-2"
                                                    disabled={loading || !field.value}
                                                >
                                                    {loading && (
                                                        <Loader2
                                                            size={24}
                                                            className="animate-spin"
                                                        />
                                                    )}
                                                    {t('redeem')}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>

                <RedeemedCouponList />
            </div>
        </>
    );
};

function RedeemedCouponList() {
    const t = useTranslations('checkout');
    const { cart, setCart } = useCartStore();

    const isReferralApplied = !!cart?.referral_code;

    const handleRemoveReferral = async () => {
        try {
            await removeReferral();
            setCart(await getCart());
        } catch (error) {
            notify('Something wrong happened', 'red');
            console.error('Error removing coupon', error);
        }
    };

    if (!isReferralApplied) return null;

    return (
        <div className="flex-col">
            <p className="font-bold text-accent-foreground">{t('redeemed-referral')}</p>
            <div className="mt-2 flex gap-2">
                <Badge
                    variant="secondary"
                    className="flex w-max items-center justify-between gap-4 rounded-md p-2"
                >
                    <div className="flex items-center gap-2">
                        <Tags size={30} className="scale-x-[-1] text-foreground/80" />
                        <p className="text-foreground/80">{cart?.referral_code}</p>
                    </div>
                    <Button
                        variant="link"
                        aria-label="Remove referral"
                        size="icon"
                        onClick={handleRemoveReferral}
                        className="size-max"
                        type="button"
                    >
                        <X size={24} />
                    </Button>
                </Badge>
            </div>
        </div>
    );
}
