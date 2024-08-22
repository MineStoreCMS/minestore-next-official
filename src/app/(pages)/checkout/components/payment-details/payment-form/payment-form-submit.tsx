import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const PaymentFormSubmit = ({ loading }: { loading: boolean }) => {
    const t = useTranslations('checkout');

    return (
        <div className="flex flex-wrap items-center justify-between">
            <FormField
                name="privacyPolicy"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>{t('agree')}</FormLabel>
                            <FormMessage />
                        </div>
                    </FormItem>
                )}
            />
            <Button
                type="submit"
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-2 md:w-auto"
            >
                {loading && <Loader2 className="animate-spin" size={24} />}
                {t('purchase')}
            </Button>
        </div>
    );
};
