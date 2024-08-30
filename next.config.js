/** @type {import("next").NextConfig} */

const removeProtocol = (url) => {
    return url.replace(/(^\w+:|^)\/\//, '');
};

const nextConfig = {
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
        minimumCacheTTL: 30
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
    }
};

module.exports = nextConfig;
