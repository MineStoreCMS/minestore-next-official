import { FC, useState } from 'react';
import { TSettings } from '@/types/settings';
import { useCurrencyStore } from '@/stores/currency';
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

type CurrencySectionProps = {
    settings: TSettings;
};

export const CurrencySection: FC<CurrencySectionProps> = ({ settings }) => {
    const { currencies } = settings;

    const [expanded, setExpanded] = useState(false);
    const { currency, setCurrency } = useCurrencyStore();

    const t = useTranslations('navbar');

    return (
        <div className="space-x-4">
            <span className="uppercase text-muted-foreground">{t('currency')}</span>

            <DropdownMenu
                onOpenChange={(open) => {
                    setExpanded(open);
                }}
            >
                <DropdownMenuTrigger>
                    <div className="flex-row items-center">
                        <div className="flex-row items-center gap-1 text-white dark:text-accent-foreground">
                            <span className="ml-1 font-bold uppercase">{currency?.name}</span>
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
                        <span className="text-muted-foreground">{t('currency')}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {currencies.map((currency, index) => (
                        <DropdownMenuItem
                            onClick={() => {
                                setCurrency(currency);
                            }}
                            key={index}
                        >
                            {currency.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
