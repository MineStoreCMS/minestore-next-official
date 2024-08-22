'use client';

import { useTranslations } from 'next-intl';

export default function Success() {
    const t = useTranslations('success');

    return (
        <div className="flex-col rounded-[10px] bg-card p-6">
            <span className="text-center text-[28px] text-primary">{t('title')}</span>

            <span className="text-center">{t('thanks')}</span>
        </div>
    );
}
