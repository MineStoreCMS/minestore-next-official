export const getDictionary = (lang: string) => {
    return import(`../../locales/${lang}.json`).then((module) => module.default);
};
