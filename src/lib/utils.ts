import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const loadScript = (src: string) => {
    return new Promise<void>((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            resolve();
        };
        document.body.appendChild(script);
    });
};
