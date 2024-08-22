import { type ISourceOptions } from '@tsparticles/engine';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useState, useEffect, useMemo } from 'react';

const particleOptions: ISourceOptions = {
    detectRetina: true,
    autoPlay: true,

    fpsLimit: 120,
    fullScreen: {
        enable: false
    },
    interactivity: {
        detectsOn: 'canvas',
        events: {
            resize: {
                enable: true
            }
        },
        modes: {
            grab: {
                distance: 140,
                lineLinked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
            },
            repulse: {
                distance: 200,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    particles: {
        color: {
            value: '#fff'
        },
        move: {
            enable: true,
            direction: 'top',
            speed: 2,
            outModes: {
                default: 'out',
                bottom: 'out',
                left: 'out',
                right: 'out',
                top: 'out'
            }
        },
        number: {
            density: {
                enable: true,
                width: 1920,
                height: 1080
            },
            value: 40
        },
        opacity: {
            value: {
                min: 0.1,
                max: 1
            },
            animation: {
                enable: true,
                speed: 0.35,
                sync: false,
                mode: 'auto',
                startValue: 'random',
                destroy: 'none'
            }
        },
        shape: {
            close: true,
            fill: true,
            type: 'circle'
        },
        size: {
            value: 4
        }
    }
};

export default function HeroParticles() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const options: ISourceOptions = useMemo(
        () => ({
            ...particleOptions
        }),
        []
    );

    if (init) {
        return (
            <Particles id="mparticles" options={options} className="absolute -z-[100] size-full" />
        );
    }
}
