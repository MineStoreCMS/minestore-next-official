import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type TCheckAccessibilityResponse = {
    success: boolean;
    status: 'banned' | 'maintenance';
    message: string;
};

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token');

    const checkAccessibilityURL = `${process.env.NEXT_PUBLIC_API_URL}/api/checkAccessibility`;

    if (!request.url.startsWith('/maintenance') || !request.url.startsWith('/banned')) {
        const data = (await (
            await fetch(checkAccessibilityURL, {
                next: {
                    revalidate: 60
                }
            })
        ).json()) as TCheckAccessibilityResponse;
        if (!data.success) {
            if (data.status === 'maintenance') {
                request.cookies.set('maintenance', 'true');
                return NextResponse.redirect(new URL('/maintenance', request.url));
            }

            if (data.status === 'banned') {
                request.cookies.set('banned', 'true');
                return NextResponse.redirect(new URL('/banned', request.url));
            }
        }
    }

    // Base redirects:
    if (!token && !request.url.endsWith('/auth')) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Handle token on /auth:
    if (request.url.endsWith('/auth') && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Protected routes check (optional):
    if (request.url.match(/^\/(categories|checkout|profile)(\?.*)?$/) && !token) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/categories/:path*', '/checkout', '/profile', '/auth', '/!(maintenance|banned)']
};
