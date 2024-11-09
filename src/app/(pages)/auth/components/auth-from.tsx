'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';
import { Loader2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';

const authFormSchema = z.object({
    username: z
        .string({
            invalid_type_error: 'Invalid Username'
        })
       .regex(/^([*_BP\.]{0,1}[a-zA-Z0-9_]{3,24}(-[a-zA-Z0-9_]{1,24})?)$/, {
            message: 'Invalid Username'
        })
});

type AuthFormValues = z.infer<typeof authFormSchema>;

const defaultValues: Partial<AuthFormValues> = {
    username: ''
};

export function AuthForm() {
    const t = useTranslations('auth');
    const { login, loading } = useUser();

    const form = useForm<AuthFormValues>({
        resolver: zodResolver(authFormSchema),
        defaultValues,
        mode: 'onSubmit'
    });

    async function onSubmit(data: AuthFormValues) {
        const { username } = data;
        await login(username);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto">
                <div className="space-y-4">
                    <h2 className="text-center text-2xl font-bold text-accent-foreground">
                        {t('title')}
                    </h2>
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem className="w-[300px] md:w-[400px]">
                                <FormLabel>{t('label')}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t('placeholder')} {...field} />
                                </FormControl>
                                <FormDescription>{t('description')}</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button
                    type="submit"
                    className="mt-8 w-[300px] p-6 md:w-[400px]"
                    disabled={!form.formState.isValid || form.formState.isSubmitting || loading}
                >
                    {loading && <Loader2Icon className="mr-2 animate-spin" />}
                    {t('submit')}
                </Button>
            </form>
        </Form>
    );
}
