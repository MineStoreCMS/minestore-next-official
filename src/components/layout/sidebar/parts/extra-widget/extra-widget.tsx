'use client';

import { FC } from 'react';
import { RecentPurchases } from '@layout/recent-purchases/recent-purchases';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { TSettings } from '@/types/settings';
import { Crown, Rocket } from 'lucide-react';

type ExtraWidgetProps = {
    settings: TSettings;
};

export const ExtraWidget: FC<ExtraWidgetProps> = ({ settings }) => {
    const t = useTranslations();
    const { username, avatar } = settings?.top;

    return (
        <div className="mt-4 hidden w-full rounded-[10px] bg-card p-8 lg:block">
            <div className="flex items-center justify-center gap-2 rounded-[10px] bg-accent py-4 font-bold">
                <Crown className="text-accent-foreground" />
                <h3 className="text-accent-foreground">{t('sidebar.top-donator')}</h3>
            </div>
            <div className="my-4 flex items-start justify-center">
                <div className=" z-0 -mb-12 overflow-hidden">
                    <Image
                        src={avatar || '/media/modules/no-top-donor.webp'}
                        alt="Avatar"
                        width={120}
                        height={160}
                        className="h-[160px] w-[120px] object-contain"
                    />
                </div>
                <div className="mt-4">
                    <h3 className="text-xl font-bold text-primary">
                        {username || t('sidebar.no-top-donor')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {username
                            ? t('sidebar.top-donator-hint')
                            : t('sidebar.no-top-donor-description')}
                    </p>
                </div>
            </div>
            <div className="relative mb-4 flex items-center justify-center gap-2 rounded-[10px] bg-accent py-4 font-bold">
                <h3 className="text-accent-foreground">{t('recent-purchases')}</h3>
                <Rocket className="text-accent-foreground" />
            </div>
            <RecentPurchases limit={10} />
        </div>
    );
};
