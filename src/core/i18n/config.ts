export const i18n = {
    defaultLocale: 'en',
    locales: [
        'en',
        'ro',
        'ru',
        'de',
        'fr',
        'sv-SE',
        'pt-PT',
        'pt-BR',
        'no',
        'nl',
        'it',
        'he',
        'es-ES',
        'da',
        'cs'
    ]
} as const;

export type Locale = (typeof i18n)['locales'][number];
