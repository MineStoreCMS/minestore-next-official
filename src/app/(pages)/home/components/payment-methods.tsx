'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export function PaymentMethods() {
    const t = useTranslations('home');

    return (
        <div className="mt-10">
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
                <span className="ml-12">{t('paypal-balance-banks-all-credit-debit-cards')}</span>
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
                <span className="ml-12">{t('all-credit-debit-cards')}</span>
            </div>
        </div>
    );
}
