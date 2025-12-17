/** @type {import("next").NextConfig} */

const removeProtocol = (url) => {
    return url.replace(/(^\w+:|^)\/\//, '');
};

const nextConfig = {
    // Enable React strict mode for better development experience
    reactStrictMode: true,
    
    // Optimize production builds
    productionBrowserSourceMaps: false,
    
    // Enable PPR (Partial Prerendering) for better SSR
    experimental: {
        // Optimize package imports for faster builds
        optimizePackageImports: [
            'lucide-react',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-label',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
        ],
    },
    
    images: {
        remotePatterns: [
            {
                hostname: 'mc-heads.net'
            },
            {
                hostname: 'minotar.net'
            },
            {
                hostname: removeProtocol(process.env.NEXT_PUBLIC_API_URL)
            },
            {
                hostname: 'i.imgur.com'
            },
            {
                hostname: 'qr.sepay.vn'
            }
        ],
        minimumCacheTTL: 30,
        // Enable modern image formats
        formats: ['image/avif', 'image/webp'],
    },

    headers: async () => {
        return [
            {
                // Matching all image formats under /img/categories
                source: '/img/categories/:all*(png|gif|jpeg|jpg)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=30, must-revalidate'
                    }
                ]
            },
            {
                // Matching all image formats under /img/items
                source: '/img/items/:all*(png|gif|jpeg|jpg)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=30, must-revalidate'
                    }
                ]
            },
            {
                // Matching all image formats under /img
                source: '/img/:all*(png|gif|jpeg|jpg)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=120, must-revalidate'
                    }
                ]
            },
            {
                // Cache static assets longer
                source: '/icons/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            },
            {
                // Cache flags longer
                source: '/flags/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            }
        ];
    },
    rewrites: async () => {
        return [
            {
                source: '/',
                destination: '/home'
            }
        ];
    },
    
    // Compiler optimizations
    compiler: {
        // Remove console.log in production
        removeConsole: process.env.NODE_ENV === 'production' ? {
            exclude: ['error', 'warn'],
        } : false,
    },
};

module.exports = nextConfig;
