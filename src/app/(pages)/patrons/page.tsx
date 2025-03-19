"use client";

import { useEffect, useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import { fetcher } from '@/api/client/fetcher';
import { getEndpoints } from '@/api';
import { TPatrons } from '@/types/patrons';
import { useTranslations } from 'next-intl';

function PatronsHeading({ description }: { description?: string }) {
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

function PatronMember({ username, rank, amount, currencyCode }: {
   username: string;
   rank?: number;
   amount?: number;
   currencyCode?: string
}) {
   const [imgSrc, setImgSrc] = useState(`https://minotar.net/avatar/${username}/100.png`);
   const t = useTranslations('patrons');

   // Background color for top-3
   let bgColorClass = 'bg-accent';
   if (rank === 1) bgColorClass = 'bg-yellow-500 px-9';
   if (rank === 2) bgColorClass = 'bg-gray-400 px-9';
   if (rank === 3) bgColorClass = 'bg-amber-800 px-9';

   return (
      <div className={`flex flex-col items-center p-4 rounded-lg ${bgColorClass} shadow-md rounded border-2 border-accent-foreground/10`}>
         <h3 className="font-bold text-accent-foreground text-center mb-2">{username}</h3>
         <Image
            src={imgSrc}
            alt={username}
            width={100}
            height={100}
            quality={100}
            className="rounded-md mb-4"
            onError={() => setImgSrc('https://minotar.net/avatar/test/100.png')} // Fallback image
         />
         {amount !== undefined && currencyCode && rank && rank <= 3 && (
            <p className="text-sm font-semibold text-gray-200">
               {t('spent')} {amount}{currencyCode}
            </p>
         )}
      </div>
   );
}

function PatronsCategory({
                            title,
                            patrons,
                            isTopPatrons = false,
                            currencyCode
                         }: {
   title: string;
   patrons: string[] | { username: string; amount: number }[];
   isTopPatrons?: boolean;
   currencyCode?: string;
}) {
   const ITEMS_PER_PAGE = 20; // Number of patrons to load per click
   const INITIAL_ITEMS = 16; // Initial number of patrons to show

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
         // Load the next 20 patrons
         setVisibleCount(prevCount => Math.min(prevCount + ITEMS_PER_PAGE, patrons.length));
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
                  {displayPatrons.map((patron, index) => (
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
                  ))}
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

function PatronsGroupTabs({ patronGroups, topPatrons, currencyCode }: {
   patronGroups: [string, string[]][];
   topPatrons?: { username: string; amount: number }[];
   currencyCode?: string;
}) {
   const sortedGroups = [...patronGroups].sort((a, b) => {
      const amountA = parseFloat(a[0]);
      const amountB = parseFloat(b[0]);
      return amountA - amountB;
   });

   const t = useTranslations('patrons');

   const tabOptions = useMemo(() => [
      ...(topPatrons && topPatrons.length > 0 ? [{
         value: "top",
         label: {
            top: t('top'),
            bottom: t('patrons')
         }
      }] : []),
      ...sortedGroups.map(([group]) => ({
         value: group,
         label: {
            top: t('patrons'),
            bottom: `${currencyCode || '$'}${group}+`
         }
      }))
   ], [topPatrons, sortedGroups, currencyCode, t]);

   const [activeTab, setActiveTab] = useState<string>(
      topPatrons && topPatrons.length > 0 ? "top" : sortedGroups[0]?.[0] || "top"
   );
   const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
   const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

   useEffect(() => {
      const activeIndex = tabOptions.findIndex(tab => tab.value === activeTab);
      const activeTabElement = tabRefs.current[activeIndex];
      if (activeTabElement) {
         const { offsetLeft, offsetWidth } = activeTabElement;
         setUnderlineStyle({
            left: offsetLeft,
            width: offsetWidth
         });
      }
   }, [activeTab, tabOptions]);

   return (
      <div className="w-full">
         <div className="overflow-x-auto">
            <div className="flex justify-center py-4 bg-accent rounded-lg mb-4 relative">
               {tabOptions.map((tab, index) => (
                  <div
                     key={tab.value}
                     className="mx-4 pb-2"
                     ref={(el) => { tabRefs.current[index] = el; }}
                  >
                     <button
                        onClick={() => setActiveTab(tab.value)}
                        className="px-4 py-1 font-bold transition-all duration-200 text-white hover:opacity-90"
                     >
                        <div className="flex flex-col items-center">
                           <span className="text-sm text-gray-300 uppercase">{tab.label.top}</span>
                           <span className="text-base font-bold uppercase">{tab.label.bottom}</span>
                        </div>
                     </button>
                  </div>
               ))}
               <div
                  className="absolute bottom-0 h-1 bg-primary rounded-t-full transition-all duration-300"
                  style={{
                     left: underlineStyle.left,
                     width: underlineStyle.width,
                  }}
               />
            </div>
         </div>

         {activeTab === "top" && topPatrons && topPatrons.length > 0 && (
            <PatronsCategory
               title={t('top-patrons')}
               patrons={topPatrons}
               isTopPatrons={true}
               currencyCode={currencyCode}
            />
         )}

         {sortedGroups.map(([group, patrons]) => (
            activeTab === group && (
               <PatronsCategory
                  key={group}
                  title={`${t('patrons')} ${currencyCode || '$'}${group}+`}
                  patrons={patrons}
                  currencyCode={currencyCode}
               />
            )
         ))}
      </div>
   );
}

export default function PatronsPage() {
   const [patronsData, setPatronsData] = useState<TPatrons | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const t = useTranslations('patrons');

   useEffect(() => {
      const fetchPatrons = async () => {
         try {
            const { getPatrons } = getEndpoints(fetcher);
            const data = await getPatrons();

            if (!data.success) {
               throw new Error(data.error || 'Failed to fetch patrons data');
            }

            setPatronsData(data as TPatrons);
         } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
         } finally {
            setLoading(false);
         }
      };

      fetchPatrons();
   }, []);

   if (loading) {
      return (
         <div className="flex-col rounded-[10px] bg-card p-6">
            <div className="flex justify-center items-center h-64">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
         </div>
      );
   }

   if (error || !patronsData) {
      return (
         <div className="flex-col rounded-[10px] bg-card p-6">
            <div className="flex justify-center items-center h-64">
               <div className="text-red-500 text-center">
                  <h2 className="text-xl font-bold">{t('error-loading')}</h2>
                  <p>{error || t('unable-to-load')}</p>
               </div>
            </div>
         </div>
      );
   }

   const patronGroups = Object.entries(patronsData.patrons || {});

   return (
      <div className="flex-col rounded-[10px] bg-card p-6">
         <PatronsHeading description={patronsData.description} />
         <div className="mt-6">
            <PatronsGroupTabs
               patronGroups={patronGroups}
               topPatrons={patronsData.top_patrons}
               currencyCode={patronsData.currency_code}
            />
         </div>
      </div>
   );
}
