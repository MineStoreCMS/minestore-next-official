'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { getEndpoints } from '@/api';
import { fetcher } from '@/api/client/fetcher';
import { notify } from '@/core/notifications';
import { useCartStore } from '@/stores/cart';
import { Price } from '@/components/base/price/price';
import { useTranslations } from 'next-intl';
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

const { acceptCoupon, getCart, removeCoupon, removeGiftCard } = getEndpoints(fetcher);

const formSchema = z.object({
    code: z.string().min(1, {
        message: 'Code is required'
    })
});

type FormValues = z.infer<typeof formSchema>;

export const RedeemCoupon = () => {
    const t = useTranslations('checkout');
    const { setCart, items, cart } = useCartStore();

    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: ''
        },
        mode: 'onSubmit'
    });

    async function onSubmit(data: FormValues) {
        const isCouponApplied = !!cart?.coupon_code;
        const isGiftCardApplied = !!cart?.gift_code;

        const bothTypesOfCouponsRedeemed = isCouponApplied && isGiftCardApplied;

        if (bothTypesOfCouponsRedeemed) {
            notify(t('only-one-coupon'), 'red');
            return;
        }

        const { code } = data;

        try {
            setLoading(true);
            const response = await acceptCoupon(code);

            setCart(await getCart());
            if (response.success) {
                notify(response.message, 'green');
            } else {
                notify(response.message, 'red');
            }

            if (!response.success) {
               notify(response.message, 'red')
            }

        } catch (error) {
            notify('Something wrong happened', 'red');
            console.error('Error accepting coupon', error);
        } finally {
            setLoading(false);
        }

        form.reset();
    }

    if (items.length === 0) return null;

    return (
        <>
            <div className="flex-col gap-4">
                <div>
                    <p className="text-[20px] font-bold text-accent-foreground">
                        {t('redeem-coupons-or-gift-cards')}
                    </p>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 flex gap-2">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('coupon-code')}</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder={t('coupon-placeholder')}
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

    const isCouponApplied = cart?.coupon_value || cart?.gift_code;

    const handleRemoveCoupon = async () => {
        try {
            await removeCoupon();
            setCart(await getCart());
        } catch (error) {
            notify('Something wrong happened', 'red');
            console.error('Error removing coupon', error);
        }
    };

    const handleRemoveGiftCard = async () => {
        try {
            await removeGiftCard();
            setCart(await getCart());
        } catch (error) {
            notify('Something wrong happened', 'red');
            console.error('Error removing gift card', error);
        }
    };

    if (!isCouponApplied) return null;

    return (
        <div className="flex-col">
            <p className="font-bold text-accent-foreground">{t('coupons-redeemed')}</p>
            <div className="mt-2 flex gap-2">
                {cart?.coupon_value && (
                    <RedeemedCoupon
                        code={cart.coupon_code}
                        removeCode={handleRemoveCoupon}
                        amount={cart.coupon_value}
                        coupon_type={cart.coupon_type}
                    />
                )}
                {cart?.gift_code && (
                    <RedeemedCoupon
                        code={cart.gift_code}
                        removeCode={handleRemoveGiftCard}
                        amount={cart.gift_sum}
                        coupon_type={1}
                    />
                )}
            </div>
        </div>
    );
}

type RedeemedCouponProps = {
    code: string;
    removeCode: () => void;
    amount: number;
    coupon_type?: 1 | 0;
};

function RedeemedCoupon({ code, removeCode, amount, coupon_type }: RedeemedCouponProps) {
    const t = useTranslations('checkout');

    return (
        <Badge
            variant="secondary"
            className="flex w-max items-center justify-between gap-4 rounded-md p-2"
        >
            <div className="flex items-center gap-2">
                <Tags size={30} className="scale-x-[-1] text-foreground/80" />
                <div>
                    <p className="text-base font-bold text-foreground">{code}</p>
                    {coupon_type === 1 ? (
                        <Price value={amount} className="text-foreground/80" />
                    ) : (
                        <p className="text-foreground/80">
                            {amount}% {t('coupon-savings')}
                        </p>
                    )}
                </div>
            </div>
            <Button
                variant="link"
                aria-label="Remove coupon"
                size="icon"
                onClick={removeCode}
                className="size-max"
                type="button"
            >
                <X size={24} />
            </Button>
        </Badge>
    );
}
