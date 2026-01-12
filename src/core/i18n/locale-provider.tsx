'use client';

import { FC, useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useLangStore } from '@/stores/lang';
import { getDictionary } from '.';

const dictionaryCache: Record<string, Record<string, string>> = {};

interface LocaleProviderProps {
   children: React.ReactNode;
   initialMessages: Record<string, string>;
   systemLanguage: string;
}

export const LocaleProvider: FC<LocaleProviderProps> = ({
                                                           children,
                                                           initialMessages,
                                                           systemLanguage,
                                                        }) => {
   const { lang, setLang } = useLangStore();
   const [messages, setMessages] = useState(initialMessages);
   const [isMounted, setIsMounted] = useState(false);

   useEffect(() => {
      setIsMounted(true);
      const defaultLang = lang || systemLanguage || navigator.language || 'en';

      if (!lang) {
         setLang(defaultLang);
      }

      const loadDictionary = async () => {
         const currentLang = lang || defaultLang;
         if (dictionaryCache[currentLang]) {
            setMessages(dictionaryCache[currentLang]);
            return;
         }

         try {
            const dictionary = await getDictionary(currentLang);
            dictionaryCache[currentLang] = dictionary;
            setMessages(dictionary);
         } catch (err) {
            const fallbackDictionary = await getDictionary('en');
            dictionaryCache['en'] = fallbackDictionary;
            setMessages(fallbackDictionary);
         }
      };

      loadDictionary();
   }, [lang, setLang, systemLanguage]);

   if (!isMounted) return null;

   return (
      <NextIntlClientProvider locale={lang || 'en'} messages={messages}>
         {children}
      </NextIntlClientProvider>
   );
};
