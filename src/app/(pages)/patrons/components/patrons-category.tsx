"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import PatronMember from './patron-member';

export default function PatronsCategory({
                                           title,
                                           patrons,
                                           isTopPatrons = false,
                                           currencyCode,
                                        }: {
   title: string;
   patrons: string[] | { username: string; amount: number }[];
   isTopPatrons?: boolean;
   currencyCode?: string;
}) {
   const ITEMS_PER_PAGE = 20;
   const INITIAL_ITEMS = 16;

   const [visibleCount, setVisibleCount] = useState(INITIAL_ITEMS);
   const [hasShownMore, setHasShownMore] = useState(false);
   const displayPatrons = patrons.slice(0, visibleCount);
   const isAllShown = visibleCount >= patrons.length;
   const t = useTranslations('patrons');

   const handleShowMore = () => {
      if (isAllShown) {
         setVisibleCount(INITIAL_ITEMS);
         setHasShownMore(false);
      } else {
         setVisibleCount((prevCount) => Math.min(prevCount + ITEMS_PER_PAGE, patrons.length));
         setHasShownMore(true);
      }
   };

   return (
      <div className="flex justify-center mt-6">
         <div className="w-full max-w-5xl">
            <h2 className="text-2xl font-bold text-accent-foreground text-center">{title}</h2>
            {isTopPatrons && patrons.length >= 3 ? (
               <div className="mt-4 flex justify-center items-end gap-4">
                  <div className="mb-4">
                     <PatronMember
                        key={(patrons[1] as { username: string }).username}
                        username={(patrons[1] as { username: string }).username}
                        rank={2}
                        amount={(patrons[1] as { amount: number }).amount}
                        currencyCode={currencyCode}
                     />
                  </div>
                  <div className="mb-8">
                     <PatronMember
                        key={(patrons[0] as { username: string }).username}
                        username={(patrons[0] as { username: string }).username}
                        rank={1}
                        amount={(patrons[0] as { amount: number }).amount}
                        currencyCode={currencyCode}
                     />
                  </div>
                  <div className="mb-4">
                     <PatronMember
                        key={(patrons[2] as { username: string }).username}
                        username={(patrons[2] as { username: string }).username}
                        rank={3}
                        amount={(patrons[2] as { amount: number }).amount}
                        currencyCode={currencyCode}
                     />
                  </div>
               </div>
            ) : (
               <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {displayPatrons.map((patron, index) =>
                     typeof patron === 'string' ? (
                        <PatronMember
                           key={patron}
                           username={patron}
                           rank={isTopPatrons ? index + 1 : undefined}
                           currencyCode={currencyCode}
                        />
                     ) : (
                        <PatronMember
                           key={patron.username}
                           username={patron.username}
                           rank={isTopPatrons ? index + 1 : undefined}
                           amount={patron.amount}
                           currencyCode={currencyCode}
                        />
                     )
                  )}
               </div>
            )}
            {!isTopPatrons && patrons.length > INITIAL_ITEMS && (
               <div className="mt-4 flex justify-center">
                  <button
                     onClick={handleShowMore}
                     className="bg-accent hover:bg-accent/80 text-white font-bold py-2 px-4 rounded"
                  >
                     {hasShownMore && isAllShown ? t('show-less') : t('show-more')}
                  </button>
               </div>
            )}
         </div>
      </div>
   );
}
