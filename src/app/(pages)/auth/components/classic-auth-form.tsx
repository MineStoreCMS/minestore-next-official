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
  username: z.string().min(3).max(16),
  password: z.string().min(1).max(100)
});

type FormValues = z.infer<typeof schema>;

export function ClassicAuthForm({ onSwitch }: { onSwitch: (form: 'register' | 'reset') => void }) {
  const t = useTranslations('auth');
  const { loginClassic, loading, error } = useUser();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '' },
    mode: 'onSubmit'
  });
  async function onSubmit(data: FormValues) {
    await loginClassic(data.username, data.password);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto space-y-4">
        <h2 className="text-center text-2xl font-bold text-accent-foreground">{ t('title') }</h2>
        <FormField control={form.control} name="username" render={({ field }) => (
          <FormItem className="w-[300px] md:w-[400px]">
            <FormLabel>{ t('label') }</FormLabel>
            <FormControl><Input placeholder={ t('placeholder') } {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem className="w-[300px] md:w-[400px]">
            <FormLabel>{ t('password') }</FormLabel>
            <FormControl><Input type="password" placeholder={ t('password') } {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <Button type="submit" className="w-full p-6" disabled={!form.formState.isValid || form.formState.isSubmitting || loading}>
          {loading && <Loader2Icon className="mr-2 animate-spin" />} { t('submit') }
        </Button>
        <div className="flex justify-between text-xs mt-2">
          <button type="button" className="underline" onClick={() => onSwitch('register')}>{ t('register-title') }</button>
          <button type="button" className="underline" onClick={() => onSwitch('reset')}>{ t('forgot-password') }</button>
        </div>
      </form>
    </Form>
  );
}
