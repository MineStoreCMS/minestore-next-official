"use client";

import { useTranslations } from 'next-intl';

export default function PatronsHeading({ description }: { description?: string }) {
   const t = useTranslations('patrons');

   return (
      <div className="w-full flex flex-col p-6 bg-card text-white rounded-lg">
         <div className="flex justify-center items-center">
            <h1 className="mt-4 text-2xl lg:text-3xl text-primary font-bold uppercase">
               {t('patron')}
            </h1>
         </div>
         {description && (
            <p
               className="mt-2 text-center text-gray-300"
               dangerouslySetInnerHTML={{ __html: description }}
            />
         )}
         <hr className="mt-5 border-2 border-accent" />
      </div>
   );
}
