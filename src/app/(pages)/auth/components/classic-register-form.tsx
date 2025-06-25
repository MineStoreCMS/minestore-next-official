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
  username: z.string().min(3).max(16).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(6).max(100),
  password_confirmation: z.string().min(6).max(100),
  email: z.string().email().max(255).optional().or(z.literal(''))
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"]
});

type FormValues = z.infer<typeof schema>;

export function ClassicRegisterForm({ onSwitch }: { onSwitch: (form: 'login' | 'reset') => void }) {
  const t = useTranslations('register');
  const { registerClassic, loading, error } = useUser();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '', password_confirmation: '', email: '' },
    mode: 'onSubmit'
  });
  async function onSubmit(data: FormValues) {
    await registerClassic(data.username, data.password, data.password_confirmation, data.email);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto space-y-4">
        <h2 className="text-center text-2xl font-bold text-accent-foreground">{ t('title') }</h2>
        <FormField control={form.control} name="username" render={({ field }) => (
          <FormItem className="w-[300px] md:w-[400px]">
            <FormLabel>{ t('username') }*</FormLabel>
            <FormControl><Input placeholder={ t('username') } {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem className="w-[300px] md:w-[400px]">
            <FormLabel>{ t('email') } ({ t('optional') })</FormLabel>
            <FormControl><Input placeholder="Email" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem className="w-[300px] md:w-[400px]">
            <FormLabel>{ t('password') }*</FormLabel>
            <FormControl><Input type="password" placeholder={ t('password') } {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="password_confirmation" render={({ field }) => (
          <FormItem className="w-[300px] md:w-[400px]">
            <FormLabel>{ t('confirm-password') }*</FormLabel>
            <FormControl><Input type="password" placeholder={ t('confirm-password') } {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <Button type="submit" className="w-full p-6" disabled={!form.formState.isValid || form.formState.isSubmitting || loading}>
          {loading && <Loader2Icon className="mr-2 animate-spin" />}{ t('title') }
        </Button>
        <div className="flex justify-between text-xs mt-2">
          <button type="button" className="underline" onClick={() => onSwitch('login')}>{ t('login') }</button>
          <button type="button" className="underline" onClick={() => onSwitch('reset')}>{ t('forgot-password') }</button>
        </div>
      </form>
    </Form>
  );
}
