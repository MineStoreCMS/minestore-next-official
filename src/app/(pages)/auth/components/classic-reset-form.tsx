"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';
import { Loader2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';

const schema = z.object({
  email: z.string().email().max(255)
});

type FormValues = z.infer<typeof schema>;

export function ClassicResetForm({ onSwitch }: { onSwitch: (form: 'login' | 'register') => void }) {
  const t = useTranslations('reset-password');
  const { resetClassic, loading, error, resetSuccess } = useUser();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
    mode: 'onSubmit'
  });
  async function onSubmit(data: FormValues) {
    await resetClassic(data.email);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto space-y-4">
        <h2 className="text-center text-2xl font-bold text-accent-foreground">{ t('title') }</h2>
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem className="w-[300px] md:w-[400px]">
            <FormLabel>{ t('email') }</FormLabel>
            <FormControl><Input placeholder="Email" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        {resetSuccess && <div className="text-green-500 text-sm text-center">{ t('check-email') }</div>}
        <Button type="submit" className="w-full p-6" disabled={!form.formState.isValid || form.formState.isSubmitting || loading}>
          {loading && <Loader2Icon className="mr-2 animate-spin" />}{ t('send-reset-link') }
        </Button>
        <div className="flex justify-between text-xs mt-2">
          <button type="button" className="underline" onClick={() => onSwitch('login')}>{ t('login') }</button>
          <button type="button" className="underline" onClick={() => onSwitch('register')}>{ t('register') }</button>
        </div>
      </form>
    </Form>
  );
}
