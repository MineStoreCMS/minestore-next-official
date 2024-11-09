import './globals.css';
import { getEndpoints } from '@/api';
import { fetcher } from '@/api/server/fetcher';

import type { Metadata } from 'next';
import { App } from './app';
import { Montserrat } from 'next/font/google';
import 'react-quill/dist/quill.snow.css';

const { getSettings } = getEndpoints(fetcher);

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700'] });

export const generateMetadata = async (): Promise<Metadata> => {
    try {
        const { website_name, website_description } = await getSettings();

        return {
            title: `${website_name}`,
            description: `${website_description}`,
            icons: `${process.env.NEXT_PUBLIC_API_URL}/img/favicon.png`,
            openGraph: {
                images: [{ url: `${process.env.NEXT_PUBLIC_API_URL}/img/banner.png` }]
            },
            applicationName: `${website_name}`,
            metadataBase: new URL(`${process.env.NEXT_PUBLIC_API_URL}`)
        };
    } catch (e) {
        return {
            title: `${process.env.NEXT_PUBLIC_WEBSTORE_NAME}`,
            description: `${process.env.NEXT_PUBLIC_WEBSTORE_DESCRIPTION}`,
            icons: `${process.env.NEXT_PUBLIC_API_URL}/img/favicon.png`,
            applicationName: `${process.env.NEXT_PUBLIC_WEBSTORE_NAME}`,
            metadataBase: new URL(`${process.env.NEXT_PUBLIC_API_URL}`)
        };
    }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${montserrat.className} bg-background text-foreground/70`}>
                <App>{children}</App>
            </body>
        </html>
    );
}
