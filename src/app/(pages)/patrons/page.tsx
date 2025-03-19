"use client";

import { useEffect, useState } from 'react';
import { fetcher } from '@/api/client/fetcher';
import { getEndpoints } from '@/api';
import { TPatrons } from '@/types/patrons';
import { useTranslations } from 'next-intl';
import PatronsHeading from './components/patrons-heading';
import PatronsGroupTabs from './components/patrons-group-tabs';

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
