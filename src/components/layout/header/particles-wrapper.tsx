'use client';

import dynamic from 'next/dynamic';

// Dynamically import particles to avoid SSR issues
const HeroParticles = dynamic(() => import('./particles'), {
    ssr: false,
});

type ParticlesWrapperProps = {
    enabled: boolean;
};

export function ParticlesWrapper({ enabled }: ParticlesWrapperProps) {
    if (!enabled) return null;
    return <HeroParticles />;
}

