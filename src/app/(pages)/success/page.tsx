'use client';

import { useTranslations } from 'next-intl';

export default function Success() {
    const t = useTranslations('success');

    return (
       <div className="flex-col rounded-[10px] bg-card p-6">
          <span className="text-center text-[28px] text-primary">{t('title')}</span>

          <span className="text-center">{t('thanks')}</span>

          <hr className="mt-2 border-[2.5px] border-accent"/>

          <p className="mt-8 text-gray-400">
             <span className="font-bold text-white">{t('thanks-title-1')}</span>
             <p>{t('thanks-description')}</p>
          </p>

          <p className="mt-8 text-gray-400">
             <span className="font-bold text-white">{t('you-will-receive')}</span>
             <p>{t('thanks-description-2')}</p>
          </p>
       </div>
    );
}
