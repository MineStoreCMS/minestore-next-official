import { setCookie, deleteCookie } from 'cookies-next';
import { getEndpoints } from '@/api';
import { fetcher } from '@/api/client/fetcher';

import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/user';
import { useState } from 'react';

const { auth, attemptAuthInGame, inGameAuth } = getEndpoints(fetcher);

export const useUser = () => {
    const [loading, setLoading] = useState(false);

    const { setUser } = useUserStore();
    const router = useRouter();

    const login = async (username: string) => {
        try {
            setLoading(true);
            const response = await auth(username);
            const token = response;

            setCookie('token', token);

            router.push('/');
            router.refresh();
        } catch (error) {
            console.error('Error while logging in:', error);
        } finally {
            setLoading(false);
        }
    };

    const loginAttemptInGame = async (username: string) => {
        try {
            const response = await attemptAuthInGame(username);
            return response;
        } catch (error) {
            console.error('Error while logging in game:', error);
        }
    };

    const loginInGame = async (username: string) => {
        try {
            const response = await inGameAuth(username);
            const { status, token } = response;

            if (status) {
                setCookie('token', token);
                router.push('/');
                router.refresh();
            }

            return response;
        } catch (error) {
            console.error('Error while logging in game:', error);
        }
    };

    const logout = () => {
        deleteCookie('token');
        setUser(undefined);
        router.push('/');
    };

    return {
        login,
        logout,
        loginAttemptInGame,
        loginInGame,
        loading
    };
};
