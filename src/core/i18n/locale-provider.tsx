'use client';

import { FC, useEffect, useState, useRef } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useLangStore } from '@/stores/lang';
import { getDictionary } from '.';

const dictionaryCache: Record<string, Record<string, string>> = {};

interface LocaleProviderProps {
   children: React.ReactNode;
   initialMessages: Record<string, string>;
   initialLang: string;
}

export const LocaleProvider: FC<LocaleProviderProps> = ({
                                                           children,
                                                           initialMessages,
                                                           initialLang,
                                                        }) => {
   const { lang, setLang } = useLangStore();
   const [messages, setMessages] = useState(initialMessages);
   const isInitialized = useRef(false);

   // Use initialLang for first render to match server, then use store lang
   const currentLocale = isInitialized.current ? (lang || initialLang) : initialLang;

   // Sync zustand store with server-determined language on mount
   useEffect(() => {
      if (!isInitialized.current) {
         isInitialized.current = true;
         // Only set if store lang differs from initialLang (or is empty)
         if (!lang || lang !== initialLang) {
            setLang(initialLang);
         }
      }
   }, [lang, setLang, initialLang]);

   // Load dictionary when language changes (after initial mount)
   useEffect(() => {
      if (!isInitialized.current) return;
      
      const targetLang = lang || initialLang;
      
      // Skip if we already have the right messages
      if (targetLang === initialLang && messages === initialMessages) {
         return;
      }

      // Check cache first
      if (dictionaryCache[targetLang]) {
         setMessages(dictionaryCache[targetLang]);
         return;
      }

      // Load new dictionary
      getDictionary(targetLang)
         .then((dictionary) => {
            dictionaryCache[targetLang] = dictionary;
            setMessages(dictionary);
         })
         .catch(() => {
            getDictionary('en').then((fallbackDictionary) => {
               dictionaryCache['en'] = fallbackDictionary;
               setMessages(fallbackDictionary);
            });
         });
   }, [lang, initialLang, initialMessages, messages]);

   // CRITICAL: Always render children with initial messages for SSR
   return (
      <NextIntlClientProvider 
         locale={currentLocale} 
         messages={messages}
         timeZone="UTC"
      >
         {children}
      </NextIntlClientProvider>
   );
};
