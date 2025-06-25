"use client";
import { useState } from 'react';
import { ClassicAuthForm } from './classic-auth-form';
import { ClassicRegisterForm } from './classic-register-form';
import { ClassicResetForm } from './classic-reset-form';

export function ClassicAuthSwitcher({ initialForm = 'login' }: { initialForm?: 'login' | 'register' | 'reset' }) {
    const [form, setForm] = useState<'login' | 'register' | 'reset'>(initialForm);
    if (form === 'login') return <ClassicAuthForm onSwitch={setForm} />;
    if (form === 'register') return <ClassicRegisterForm onSwitch={setForm} />;
    if (form === 'reset') return <ClassicResetForm onSwitch={setForm} />;
    return null;
} 