'use client';

import { getEndpoints } from '@/api';
import { fetcher } from '@/api/client/fetcher';
import { TAnnouncement } from '@/types/announcement';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
const { getAnnouncement } = getEndpoints(fetcher);

export const Alert: FC = () => {
    const [details, setDetails] = useState<TAnnouncement>();

    useEffect(() => {
        getAnnouncement().then(setDetails);
    }, []);

    if (!details?.is_index) return null;

    const { content, title, button_name, button_url } = details;

    return (
        <div className="rounded-md bg-accent shadow-md" role="alert">
            <div className="flex items-center justify-between">
                <div className="flex">
                    <div className="flex items-center justify-center rounded-bl-md rounded-tl-md bg-accent-foreground/5 p-4">
                        <svg
                            className="h-8 w-8 fill-current text-primary"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                        </svg>
                    </div>
                    <div className="p-4">
                        <p className="text-xl font-bold text-accent-foreground">{title}</p>
                        <p
                            className="text-sm"
                            dangerouslySetInnerHTML={{ __html: content || '' }}
                        ></p>
                    </div>
                </div>
                {button_url && (
                    <Link
                        href={button_url}
                        className="stone-pattern mr-4 flex-row rounded-md p-9 px-6 py-4 text-center text-base font-bold uppercase text-white dark:bg-accent-foreground/20"
                    >
                        {button_name}
                    </Link>
                )}
            </div>
        </div>
    );
};
