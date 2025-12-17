import { FC } from 'react';
import { Navbar } from '@layout/navbar/navbar';
import Image from 'next/image';
import { TSettings } from '@/types/settings';
import { HeroSection } from './sections/hero-section';
import { Container } from '@/components/base/container/container';
import { getModifiedCacheBuster } from '@helpers/cache-buster';
import { UserBar } from './user-bar';
import { ParticlesWrapper } from './particles-wrapper';

import './Header.css';

type HeaderProps = {
    settings: TSettings;
    particles: string;
    initialLang: string;
};

export const Header: FC<HeaderProps> = ({ settings, particles, initialLang }) => {
    const cacheBuster = getModifiedCacheBuster(5);

    return (
        <header className="relative">
            <ParticlesWrapper enabled={particles === 'Enabled'} />

            <div className="absolute inset-0 -z-20 h-[525px] w-full">
                <div className="hero-image before:bg-primary/20 dark:before:bg-transparent">
                    <Image
                        src={`/background.jpg?${cacheBuster}`}
                        className="absolute -z-10 h-full w-full object-cover opacity-60"
                        width={1590}
                        height={352}
                        alt=""
                        fetchPriority="high"
                        priority
                        loading="eager"
                    />
                    <svg
                        className="absolute inset-0 top-[280px] z-[-1] h-full w-full"
                        viewBox="0 0 1440 224"
                        fill="none"
                        preserveAspectRatio="xMidYMid slice"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M720 90.7C960 85 1200 43 1320 21.3L1440 0V224H1320C1200 224 960 224 720 224V90.7Z"
                            fill="hsl(var(--background))"
                            fillOpacity="1"
                        />
                        <path
                            d="M720 90.7C480 85 240 43 120 21.3L0 0V224H120C240 224 480 224 720 224V90.7Z"
                            fill="hsl(var(--background))"
                            fillOpacity="1"
                        />
                    </svg>
                </div>
            </div>

            <div className="relative">
                <Navbar settings={settings} initialLang={initialLang} />

                <HeroSection settings={settings} />
            </div>

            <Container>
                <div className="relative flex h-[90px] sm:h-[110px] items-center bg-primary/20 px-3 sm:px-5">
                    <div className="absolute inset-0 -z-10 size-full rounded-md bg-primary"></div>
                    <div className="absolute inset-0 -z-10 size-full rounded-md bg-[url(/bg.jpg)] bg-cover opacity-20"></div>

                    <UserBar settings={settings} />
                </div>
            </Container>
        </header>
    );
};
