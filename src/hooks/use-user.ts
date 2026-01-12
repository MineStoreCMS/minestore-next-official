import { setCookie, deleteCookie, getCookie } from 'cookies-next';
import { getEndpoints } from '@/api';
import { fetcher } from '@/api/client/fetcher';

import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/user';
import { useCartStore } from '@/stores/cart';
import { useCallback, useState } from 'react';

const { auth, attemptAuthInGame, inGameAuth } = getEndpoints(fetcher);

export const useUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resetSuccess, setResetSuccess] = useState(false);
    const { setUser } = useUserStore();
    const { clearCart } = useCartStore();
    const router = useRouter();

    const login = async (username: string) => {
        try {
            setLoading(true);
            const response = await auth(username);
            const token = response;

            setCookie('token', token, { maxAge: 21600 });

            const params = new URLSearchParams(window.location.search);
            const returnUrl = params.get('returnUrl');
            const redirectTo = returnUrl || getCookie('lastCategoryClicked') || '/';

            // window.history.replaceState({}, '', redirectTo);
            // router.replace(redirectTo);
            // router.refresh();
            window.location.replace(redirectTo);
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

                const params = new URLSearchParams(window.location.search);
                const returnUrl = params.get('returnUrl');
                const redirectTo = returnUrl || '/';

                router.push(redirectTo);
                router.refresh();
            }

            return response;
        } catch (error) {
            console.error('Error while logging in game:', error);
        }
    };

    const logout = () => {
        deleteCookie('token');
        deleteCookie('lastCategoryClicked');
        // Deleting Discord cookies
        deleteCookie('discord_linked');
        deleteCookie('discord_username');
        deleteCookie('discord_id');
        setUser(undefined);
        clearCart();
        router.push('/');
        router.refresh();
    };

   const loginClassic = useCallback(async (username: string, password: string) => {
      setError(null);
      try {
         setLoading(true);
         const response = await fetcher.post('/auth/login', { username, password });
         if (typeof response.data === 'string') {
            setCookie('token', response.data, { maxAge: 21600 });

            const params = new URLSearchParams(window.location.search);
            const returnUrl = params.get('returnUrl');
            const redirectTo = returnUrl || getCookie('lastCategoryClicked') || '/';

            window.location.replace(redirectTo);
         } else if (response.data.status === 'error') {
            setError(response.data.message || 'Login failed');
         } else if (response.data === 'ban') {
            setError('User is banned');
         }
      } catch (e: unknown) {
         type ErrorWithResponse = { response?: { data?: { message?: string } } };
         if (
            e &&
            typeof e === 'object' &&
            'response' in e &&
            (e as ErrorWithResponse).response &&
            typeof (e as ErrorWithResponse).response === 'object' &&
            'data' in (e as ErrorWithResponse).response! &&
            (e as ErrorWithResponse).response!.data &&
            typeof (e as ErrorWithResponse).response!.data === 'object' &&
            'message' in (e as ErrorWithResponse).response!.data!
         ) {
            setError((e as ErrorWithResponse).response!.data!.message || 'Login failed');
         } else {
            setError(e instanceof Error ? e.message : 'Login failed');
         }
      } finally {
         setLoading(false);
      }
   }, [setLoading]);

   const registerClassic = useCallback(async (username: string, password: string, password_confirmation: string, email?: string) => {
      setError(null);
      try {
         setLoading(true);
         const response = await fetcher.post('/auth/register', { username, password, password_confirmation, email });
         if (response.data.status === 'success') {
            setCookie('token', response.data.data.token, { maxAge: 21600 });

            const params = new URLSearchParams(window.location.search);
            const returnUrl = params.get('returnUrl');
            const redirectTo = returnUrl || '/';

            window.location.replace(redirectTo);
         } else {
            setError(response.data.message || 'Registration failed');
         }
      } catch (e: unknown) {
         setError(e instanceof Error ? e.message : 'Registration failed');
      } finally {
         setLoading(false);
      }
   }, [setLoading]);

   const resetClassic = useCallback(async (email: string) => {
      setError(null);
      setResetSuccess(false);
      try {
         setLoading(true);
         const response = await fetcher.post('/auth/request/resetPassword', { email });
         if (response.data.status === 'success') {
            setResetSuccess(true);
         } else {
            setError(response.data.message || 'Reset failed');
         }
      } catch (e: unknown) {
         setError(e instanceof Error ? e.message : 'Reset failed');
      } finally {
         setLoading(false);
      }
   }, [setLoading]);

    return {
        login,
        logout,
        loginAttemptInGame,
        loginInGame,
        loading,
        error,
        resetSuccess,
        loginClassic,
        registerClassic,
        resetClassic
    };
};
