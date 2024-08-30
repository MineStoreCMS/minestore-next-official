import { FC, useCallback, useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { getEndpoints } from '@/api';
import { TSettings } from '@/types/settings';
import { useTranslations } from 'next-intl';
import { notify } from '@/core/notifications';
import { getCacheBuster } from '@helpers/cache-buster';

const { discordWidget, getServerOnline } = getEndpoints(axios);

type HeroSectionProps = {
    settings: TSettings;
};

export const HeroSection: FC<HeroSectionProps> = ({ settings }) => {
    const t = useTranslations('header');

    const [serverOnline, setServerOnline] = useState(0);
    const [discordOnline, setDiscordOnline] = useState(0);

    const fetchOnline = useCallback(async () => {
        const promises = [
            discordWidget(settings.discord_id)
                .then((data) => ({
                    type: 'discord',
                    count: data.presence_count
                }))
                .catch(() => ({
                    type: 'discord',
                    count: 0
                })),
            getServerOnline(settings.server.ip, settings.server.port)
                .then((data) => ({
                    type: 'server',
                    count: data.onlinePlayers || 0
                }))
                .catch(() => ({
                    type: 'server',
                    count: 0
                }))
        ];

        const results = await Promise.allSettled(promises);
        results.forEach((result) => {
            if (result.status === 'fulfilled') {
                if (result.value.type === 'discord') {
                    setDiscordOnline(result.value.count);
                } else if (result.value.type === 'server') {
                    setServerOnline(result.value.count);
                }
            } else {
                console.error('Error fetching data:', result.reason);
            }
        });
    }, [settings.discord_id, settings.server.ip, settings.server.port]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchOnline();
        };

        fetchData();
        const interval = setInterval(fetchData, 20000);

        return () => clearInterval(interval);
    }, [fetchOnline]);

    const handleCopyServerIP = () => {
        navigator.clipboard.writeText(settings.server.ip);
        notify(`${t('copied-to-clipboard')}`, 'green');
    };

    const cacheBuster = getCacheBuster();

    return (
        <div className="relative w-full flex-row items-center justify-center">
            <div
                onClick={handleCopyServerIP}
                className="-mt-20 hidden cursor-pointer items-center gap-2 transition duration-300 hover:scale-110 lg:flex"
            >
                <ReactSVG className="h-12 w-12 text-primary" src="/icons/play.svg" />
                <div className="ml-0.5 flex-col">
                    <span className="text-lg font-bold text-white dark:text-accent-foreground">
                        {settings.server.ip}
                    </span>
                    <span className="text-sm text-white/80 dark:text-foreground">
                        {serverOnline} {t('players-online')}
                    </span>
                </div>
            </div>

            <div className="relative z-10 translate-y-12">
                <Link href="/">
                    <Image
                        className="levitate mx-4 h-[338px] w-[381px]"
                        src={`${process.env.NEXT_PUBLIC_API_URL}/img/logo.png?${cacheBuster}`}
                        width={381}
                        height={338}
                        alt="Logo"
                    />
                </Link>
            </div>

            <Link
                href={settings.discord_url}
                className="-mt-20 hidden items-center transition duration-300 hover:scale-110 lg:flex"
            >
                <div className="ml-0.5 flex-col">
                    <span className="text-lg font-bold text-white dark:text-accent-foreground">
                        {t('discord-server')}
                    </span>
                    <span className="text-sm text-white/80 dark:text-foreground">
                        {discordOnline} {t('members-online')}
                    </span>
                </div>
                <ReactSVG className="h-12 w-12 text-primary" src="/icons/discord.svg" />
            </Link>
        </div>
    );
};
