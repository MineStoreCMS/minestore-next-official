import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/core/auth/client/use-auth';
import { useUser } from '@/hooks/use-user';
import { ReactSVG } from 'react-svg';
import { useTranslations } from 'next-intl';

export const UserSection: FC = () => {
    const { user } = useAuth();

    const { logout } = useUser();
    const t = useTranslations('navbar');

    if (user) {
        return (
            <button
                type="submit"
                onClick={logout}
                className="flex-row text-accent-foreground disabled:pointer-events-none disabled:select-none"
            >
                <ReactSVG className="text-white" src="/icons/logout.svg" />
                <span className="ml-4 cursor-pointer font-bold uppercase text-white dark:text-accent-foreground">
                    {t('logout')}
                </span>
            </button>
        );
    }

    return (
        <Link href="/auth" className="flex-row items-center">
            <Image src="https://minotar.net/helm/steve/30.png" alt="" width={32} height={32} />
            <span className="ml-4 cursor-pointer font-bold uppercase text-white dark:text-accent-foreground">
                {t('guest')}
            </span>
        </Link>
    );
};
