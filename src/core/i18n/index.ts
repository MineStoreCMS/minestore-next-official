export const getDictionary = async (lang: string) => {
   try {
      const localeModule = await import(`../../locales/${lang}.json`);
      return localeModule.default;
   } catch (error) {
      console.error(`Error loading language file for ${lang}:`, error);
      const defaultLocaleModule = await import(`../../locales/en.json`);
      return defaultLocaleModule.default;
   }
};
