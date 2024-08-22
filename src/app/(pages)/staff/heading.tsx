'use client';

import { useTranslations } from 'next-intl';

export function StaffHeading() {
    const t = useTranslations('staff');

    return (
        <h1 className="scroll-m-20 text-center text-4xl font-bold tracking-tight text-primary lg:text-5xl">
            {t('title')}
        </h1>
    );
}
