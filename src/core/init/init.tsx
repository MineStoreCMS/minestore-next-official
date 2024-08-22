'use client';

import { FC, useEffect } from 'react';
import { useCurrencyStore } from '@/stores/currency';
import { useSettingsStore } from '@/stores/settings';
import { useCartStore } from '@/stores/cart';
import { getEndpoints } from '@/api';
import { fetcher } from '@/api/client/fetcher';
import { TSettings } from '@/types/settings';
import { useUserStore } from '@/stores/user';

const { getCart } = getEndpoints(fetcher);

export const Init: FC<{ settings: TSettings }> = ({ settings }) => {
    const { user } = useUserStore();
    const { setCurrency } = useCurrencyStore();
    const { setSettings } = useSettingsStore();
    const { setCart } = useCartStore();

    useEffect(() => {
        setSettings(settings);
    }, [settings, setSettings]);

    useEffect(() => {
        const initializeCurrency = async () => {
            const currencyName = localStorage.currency;
            if (currencyName) {
                const currency = settings.currencies.find((x) => x.name === currencyName);
                if (currency) {
                    setCurrency(currency);
                }
            } else {
                localStorage.currency = settings.system_currency.name;
                setCurrency(settings.system_currency);
            }
        };

        initializeCurrency();

        if (user) {
            getCart().then(setCart);
        }
    }, [settings.currencies, settings.system_currency, setCurrency, setCart, user]);

    return <></>;
};
