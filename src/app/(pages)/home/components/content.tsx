'use client';

import Image from 'next/image';
import { PaymentMethods } from './payment-methods';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/stores/settings';
import { getCacheBuster } from '@helpers/cache-buster';

export function Content() {
    const t = useTranslations('home');
    return (
        <div className="mt-8 space-y-6">
            <BannerSection />

            <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <div>
                            <h2 className="text-balance text-xl font-bold text-primary md:text-2xl">
                                {t('support-or-questions')}
                            </h2>
                            <hr className="mt-2 h-1 w-12 rounded border-0 bg-primary" />
                        </div>
                        <p className="text-pretty">{t('support-or-questions-description')}</p>
                    </div>

                    <div className="space-y-2">
                        <div>
                            <h2 className="text-balance text-xl font-bold text-primary md:text-2xl">
                                {t('refund-policy')}
                            </h2>
                            <hr className="mt-2 h-1 w-12 rounded border-0 bg-primary" />
                        </div>
                        <p className="text-pretty">{t('refund-policy-description')}</p>
                    </div>
                </div>
                <p>{t('payment-processing')}</p>
                <div className="flex flex-wrap gap-4">
                    <Button asChild>
                        <Link href="https://google.com" target="_blank">
                            Discord
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="https://google.com" target="_blank">
                            Terms & Conditions
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="https://google.com" target="_blank">
                            Contact Us
                        </Link>
                    </Button>
                </div>
            </div>

            <PaymentMethods />
        </div>
    );
}

function BannerSection() {
    const t = useTranslations('home');
    const { settings } = useSettingsStore();
    const cacheBuster = getCacheBuster();

    return (
        <div className="grid items-start gap-6 md:grid-cols-2">
            <div className="order-2 space-y-2 text-pretty rounded-md border border-accent-foreground/10 bg-accent p-4 text-center md:order-1">
                <h1 className="text-2xl font-bold text-primary md:text-3xl">
                    {t('welcome').replace('MinestoreCMS', settings?.website_name || 'MinestoreCMS')}
                </h1>
                <p>{t('welcome-description')}</p>
            </div>
            <div className="order-1 md:order-2">
                <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/img/index-banner.png?${cacheBuster}`}
                    alt="Banner"
                    width={500}
                    height={300}
                    className="object-contain"
                    onError={(e) => {
                        e.currentTarget.remove();
                    }}
                />
            </div>
        </div>
    );
}
