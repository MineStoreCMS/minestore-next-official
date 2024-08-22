'use client';

import { useUserStore } from '@/stores/user';
import { TUser } from '@/types/user';
import { FC, PropsWithChildren, useEffect } from 'react';

type AuthProviderProps = PropsWithChildren<{
    initialUser?: TUser;
}>;

export const AuthProvider: FC<AuthProviderProps> = ({ children, initialUser }) => {
    const { setUser } = useUserStore();

    useEffect(() => {
        if (initialUser) {
            setUser(initialUser);
        }
    }, [initialUser, setUser]);

    return children;
};
