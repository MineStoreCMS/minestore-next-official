import { cookies } from 'next/headers';

// Server-side translation helper
export async function getServerTranslations(namespace?: string) {
   // Get language from cookies on server
   const cookieStore = await cookies();
   const lang = cookieStore.get('lang')?.value || 'en';
   
   let messages: Record<string, unknown>;
   try {
      const localeModule = await import(`../../locales/${lang}.json`);
      messages = localeModule.default;
   } catch {
      const defaultLocaleModule = await import(`../../locales/en.json`);
      messages = defaultLocaleModule.default;
   }
   
   // Return a translator function
   const t = (key: string): string => {
      const keys = namespace ? `${namespace}.${key}`.split('.') : key.split('.');
      let value: unknown = messages;
      
      for (const k of keys) {
         if (value && typeof value === 'object' && k in value) {
            value = (value as Record<string, unknown>)[k];
         } else {
            return key; // Return key if not found
         }
      }
      
      return typeof value === 'string' ? value : key;
   };
   
   return t;
}

// Get raw messages for a namespace (for passing to client components)
export async function getServerMessages(namespace: string): Promise<Record<string, string>> {
   const cookieStore = await cookies();
   const lang = cookieStore.get('lang')?.value || 'en';
   
   let messages: Record<string, unknown>;
   try {
      const localeModule = await import(`../../locales/${lang}.json`);
      messages = localeModule.default;
   } catch {
      const defaultLocaleModule = await import(`../../locales/en.json`);
      messages = defaultLocaleModule.default;
   }
   
   const namespaceMessages = messages[namespace];
   if (typeof namespaceMessages === 'object' && namespaceMessages !== null) {
      return namespaceMessages as Record<string, string>;
   }
   
   return {};
}

