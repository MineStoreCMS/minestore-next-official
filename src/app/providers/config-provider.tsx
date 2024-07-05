'use client';

import { extractConfigValue } from '@helpers/extract-config-value';
import { hexToHsl } from '@helpers/hex-to-hsl';
import * as React from 'react';

type ConfigProviderProps = {
    children: React.ReactNode;
    config: unknown;
};

export type Config = {
    author: string;
    config: {
        header: string;
        options: {
            id: string;
            name: string;
            default: string;
            description: string;
            type: string;
            values?: string[];
            value?: string;
        }[];
    }[];
};

export function ConfigProvider({ children, config }: ConfigProviderProps) {
    const configData = config as Config;

    const mainColor = extractConfigValue('main-color', configData);
    const { h, l, s } = hexToHsl(mainColor as string);

    return (
        <>
            <style jsx global>{`
                .dark {
                    --primary: ${h} ${s}% ${l}%;
                    --hue: ${h};
                }
                :root {
                    --primary: ${h} ${s}% ${l}%;
                    --hue: ${h};
                }
            `}</style>
            {children}
        </>
    );
}
