'use client';

import { extractConfigValue } from '@helpers/extract-config-value';
import { hexToHsl } from '@helpers/hex-to-hsl';
import * as React from 'react';
import { createContext, useContext } from 'react';

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

const ConfigContext = createContext<Config | undefined>(undefined);

export function ConfigProvider({ children, config }: ConfigProviderProps) {
    const configData = config as Config;

    const mainColor = extractConfigValue('main-color', configData);
    const { h, l, s } = hexToHsl(mainColor as string);

    return (
        <ConfigContext.Provider value={configData}>
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
        </ConfigContext.Provider>
    );
}

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};
