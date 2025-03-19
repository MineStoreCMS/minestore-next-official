"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import PatronsCategory from './patrons-category';

export default function PatronsGroupTabs({
   patronGroups,
   topPatrons,
   currencyCode,
}: {
   patronGroups: [string, string[]][];
   topPatrons?: { username: string; amount: number }[];
   currencyCode?: string;
}) {
   const sortedGroups = useMemo(() => {
      return [...patronGroups].sort((a, b) => {
         const amountA = parseFloat(a[0]);
         const amountB = parseFloat(b[0]);
         return amountA - amountB;
      });
   }, [patronGroups]);

   const t = useTranslations('patrons');

   const tabOptions = useMemo(
      () => [
         ...(topPatrons && topPatrons.length > 0
            ? [
               {
                  value: 'top',
                  label: {
                     top: t('top'),
                     bottom: t('patrons'),
                  },
               },
            ]
            : []),
         ...sortedGroups.map(([group]) => ({
            value: group,
            label: {
               top: t('patrons'),
               bottom: `${currencyCode || '$'}${group}+`,
            },
         })),
      ],
      [topPatrons, sortedGroups, currencyCode, t]
   );

   const [activeTab, setActiveTab] = useState<string>(() => {
      return topPatrons && topPatrons.length > 0 ? 'top' : sortedGroups[0]?.[0] || 'top';
   });

   const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
   const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number }>({
      left: 0,
      width: 0,
   });

   const updateUnderline = useCallback(() => {
      const activeIndex = tabOptions.findIndex((tab) => tab.value === activeTab);
      const activeTabElement = tabRefs.current[activeIndex];

      if (activeTabElement) {
         const { offsetLeft, offsetWidth } = activeTabElement;
         setUnderlineStyle({
            left: offsetLeft,
            width: offsetWidth,
         });
      }
   }, [activeTab, tabOptions]);

   useEffect(() => {
      updateUnderline();

      window.addEventListener('resize', updateUnderline);
      return () => {
         window.removeEventListener('resize', updateUnderline);
      };
   }, [updateUnderline]);

   const handleTabClick = (value: string) => {
      setActiveTab(value);
   };

   return (
      <div className="w-full">
         <div className="overflow-x-auto">
            <div className="flex justify-center py-4 bg-accent rounded-lg mb-4 relative">
               {tabOptions.map((tab, index) => (
                  <div
                     key={tab.value}
                     className="mx-4 pb-2"
                     ref={(el) => {
                        tabRefs.current[index] = el;
                     }}
                  >
                     <button
                        onClick={() => handleTabClick(tab.value)}
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

         {activeTab === 'top' && topPatrons && topPatrons.length > 0 && (
            <PatronsCategory
               title={t('top-patrons')}
               patrons={topPatrons}
               isTopPatrons={true}
               currencyCode={currencyCode}
            />
         )}

         {sortedGroups.map(([group, patrons]) =>
            activeTab === group ? (
               <PatronsCategory
                  key={group}
                  title={`${t('patrons')} ${currencyCode || '$'}${group}+`}
                  patrons={patrons}
                  currencyCode={currencyCode}
               />
            ) : null
         )}
      </div>
   );
}
