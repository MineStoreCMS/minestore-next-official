import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem
} from '@/components/ui/command';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import { getFormCountries } from '@/constants/countries';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import { UserAvatar } from './user-avatar';
import { useSettingsStore } from '@/stores/settings';
import { useTranslations } from 'next-intl';

export const UserDetailsForm = () => {
    const { settings } = useSettingsStore();
    const formCountries = getFormCountries();

    const { setValue } = useFormContext();

    const t = useTranslations('checkout.details');

    if (!settings?.details) {
        return null;
    }

    return (
        <div className="grid gap-8 xl:grid-cols-[300px,1fr]">
            <div className="m-auto hidden xl:block">
                <UserAvatar />
            </div>
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-accent-foreground">{t('your-details')}</h2>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        name="details.fullname"
                        defaultValue=""
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>*{t('full-name')}</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        defaultValue=""
                        name="details.email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>*{t('email')}</FormLabel>
                                <FormControl>
                                    <Input placeholder="test@gmail.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        defaultValue=""
                        name="details.address1"
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>*{t('address-line-1')}</FormLabel>
                                <FormControl>
                                    <Input placeholder="1234 Main St" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        defaultValue=""
                        name="details.address2"
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>{t('address-line-2')}</FormLabel>
                                <FormControl>
                                    <Input placeholder="Apartment, studio, or floor" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        defaultValue=""
                        name="details.city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('city')}</FormLabel>
                                <FormControl>
                                    <Input placeholder="New York" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        defaultValue=""
                        name="details.region"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>*{t('state-region')}</FormLabel>
                                <FormControl>
                                    <Input placeholder="NY" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        defaultValue=""
                        name="details.zipcode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>*{t('zip-code')}</FormLabel>
                                <FormControl>
                                    <Input placeholder="12345" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        defaultValue=""
                        name="details.country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>*{t('country')}</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    'w-full justify-between',
                                                    !field.value && 'text-muted-foreground'
                                                )}
                                            >
                                                {field.value
                                                    ? formCountries.find(
                                                          (language) =>
                                                              language.value === field.value
                                                      )?.label
                                                    : t('country-placeholder')}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder={t('country-placeholder')} />
                                            <CommandEmpty>{t('no-country-found')}</CommandEmpty>
                                            <CommandGroup className="max-h-[200px] overflow-auto">
                                                {formCountries.map((country) => (
                                                    <CommandItem
                                                        value={country.label}
                                                        key={country.value}
                                                        onSelect={() => {
                                                            setValue(
                                                                'details.country',
                                                                country.value
                                                            );
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                country.value === field.value
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0'
                                                            )}
                                                        />
                                                        {country.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};
