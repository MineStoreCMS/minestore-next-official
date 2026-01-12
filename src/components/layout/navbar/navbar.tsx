'use client';

import { FC } from 'react';
import { TSettings } from '@/types/settings';

import { CurrencySection } from './sections/currency-section';
import { LanguageSection } from './sections/language-section';
import { ShoppingCartSection } from './sections/shopping-cart-section';
import { UserSection } from './sections/user-section';

import { Divider } from './components/divider';

type NavbarProps = {
    settings: TSettings;
};

export const Navbar: FC<NavbarProps> = ({ settings }) => {
    return (
        <nav className="z-20 h-[63px] w-full flex-row items-center justify-center bg-[url(/navbar.png)] px-9 md:mx-auto md:w-fit md:rounded-[10px]">
            <div className="hidden items-center md:flex">
                <CurrencySection settings={settings} />
                <Divider />
            </div>
            <div className="hidden items-center lg:flex">
                <LanguageSection settings={settings} />
                <Divider />
            </div>
            <ShoppingCartSection />
            <Divider />
            <UserSection />
        </nav>
    );
};
