import { FC, useState } from 'react';
import { CountryFlag } from '@/components/base/county-flag/country-flag';
import { TSettings } from '@/types/settings';
import { useLangStore } from '@/stores/lang';
import { useTranslations } from 'next-intl';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type LanguageSectionProps = {
    settings: TSettings;
};

export const LanguageSection: FC<LanguageSectionProps> = ({ settings }) => {
    const [expanded, setExpanded] = useState(false);
    const { languages } = settings;

    const { lang, setLang } = useLangStore();

    const t = useTranslations('navbar');

    return (
        <div className="space-x-4">
            <span className="uppercase text-muted-foreground">{t('language')}</span>

            <DropdownMenu
                onOpenChange={(open) => {
                    setExpanded(open);
                }}
            >
                <DropdownMenuTrigger>
                    <div className="flex-row items-center">
                        <CountryFlag lang={lang as string} />
                        <div className="flex-row items-center gap-1 text-white dark:text-accent-foreground">
                            <span className="ml-1 font-bold uppercase">
                                {languages?.find((x) => x.code === lang)?.name}
                            </span>
                            <ChevronDown
                                size={20}
                                className={cn(
                                    'transform transition-transform',
                                    expanded ? 'rotate-180' : 'rotate-0'
                                )}
                            />
                        </div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>
                        <span className="text-muted-foreground">{t('language')}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {languages.map((lang, index) => (
                        <DropdownMenuItem
                            onClick={() => {
                                setLang(lang.code);
                            }}
                            key={index}
                        >
                            <CountryFlag lang={lang.code} />
                            <span className="ml-1">{lang.name}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
