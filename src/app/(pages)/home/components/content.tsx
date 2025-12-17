import Image from 'next/image';
import { PaymentMethods } from './payment-methods';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getServerTranslations } from '@/core/i18n/server';
import { getCacheBuster } from '@helpers/cache-buster';
import { TSettings } from '@/types/settings';

type ContentProps = {
    settings: TSettings;
};

export async function Content({ settings }: ContentProps) {
    const t = await getServerTranslations('home');

    return (
        <div className="mt-8 space-y-6">
            <BannerSection settings={settings} t={t} />

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
                        <Link href={settings?.discord_url || "https://google.com"} target="_blank">
                           Discord
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={settings?.footer?.find(item => item.url === "https://paynow.gg/terms-of-use")?.url || "/pages/tos"} target="_blank">
                           Terms & Conditions
                        </Link>
                    </Button>
                    {settings?.footer?.some(item => item.url === "https://paynow.gg/terms-of-use") && (
                      <Button asChild>
                         <Link href={'https://checkout.paynow.gg/subscriptions'} target="_blank">
                            Manage Subscriptions
                         </Link>
                      </Button>
                    )}
                    <Button asChild>
                        <Link href={settings?.discord_url || "https://google.com"} target="_blank">
                            Contact Us
                        </Link>
                    </Button>
                </div>
            </div>

            <PaymentMethods settings={settings} />
        </div>
    );
}

type BannerSectionProps = {
    settings: TSettings;
    t: (key: string) => string;
};

function BannerSection({ settings, t }: BannerSectionProps) {
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
                />
            </div>
        </div>
    );
}
