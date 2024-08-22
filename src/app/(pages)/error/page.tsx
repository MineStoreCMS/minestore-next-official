'use client';

import { useTranslations } from 'next-intl';

export default function Error() {
    const t = useTranslations('error');

    return (
        <div className="flex-col rounded-[10px] bg-card p-6">
            <span className="text-center text-[28px] text-primary">{t('oops')}</span>

            <span className="text-center">{t('somethingWrong')}</span>

            <span className="mt-8 text-xl">{t('youreTheBest')}</span>

            <hr className="mt-2 border-[2.5px] border-accent" />

            <p className="mt-8 text-gray-400">
                <span className="font-bold text-white">{t('contactUs')}</span>
                <p>{t('serverIssue')}</p>
            </p>

            <p className="mt-8 text-gray-400">
                <span className="font-bold text-white">{t('contactWithProof')}</span>
                <p>{t('paymentIssue')}</p>
            </p>
        </div>
    );
}
