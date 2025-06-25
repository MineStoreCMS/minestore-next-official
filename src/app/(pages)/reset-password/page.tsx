"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const schema = z.object({
  password: z.string().min(6).max(100),
  password_confirmation: z.string().min(6).max(100)
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"]
});

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token') || '';
  const email = params.get('email') || '';
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', password_confirmation: '' },
    mode: 'onSubmit'
  });
  async function onSubmit(data: FormValues) {
    setError(null);
    setSuccess(false);
    try {
      const res = await axios.post('/api/auth/resetPassword', {
        token,
        email,
        password: data.password,
        password_confirmation: data.password_confirmation
      });
      if (res.data.status === 'success') {
        setSuccess(true);
        setTimeout(() => router.push('/auth'), 2000);
      } else {
        setError(res.data.message || 'Reset failed');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Reset failed');
    }
  }
  if (!token || !email) {
    return <div className="flex-col rounded-[10px] bg-card p-4 w-full max-w-md mx-auto mt-10 text-center text-red-500 text-lg">Invalid reset link</div>;
  }
  return (
    <div className="flex-col rounded-[10px] bg-card p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto space-y-4">
          <h2 className="text-center text-2xl font-bold text-accent-foreground">Reset Password</h2>
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem className="w-[300px] md:w-[400px]">
              <FormLabel>New Password</FormLabel>
              <FormControl><Input type="password" placeholder="New Password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="password_confirmation" render={({ field }) => (
            <FormItem className="w-[300px] md:w-[400px]">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl><Input type="password" placeholder="Confirm Password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-500 text-sm text-center">Password reset! Redirecting...</div>}
          <Button type="submit" className="w-full p-6" disabled={!form.formState.isValid || form.formState.isSubmitting}>Reset Password</Button>
          <div className="flex justify-center text-xs mt-2">
            <Link href="/auth" className="underline">Login</Link>
          </div>
        </form>
      </Form>
    </div>
  );
} 