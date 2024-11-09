import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type TCheckAccessibilityResponse = {
    success: boolean;
    status: 'banned' | 'maintenance';
    message: string;
};

export async function middleware(request: NextRequest) {
    const clientIp =
        request.headers.get('x-forwarded-for')?.split(',')[0] || // Most common
        request.headers.get('x-real-ip') || // Nginx, etc.
        request.headers.get('http_x_real_ip') || // Apache, etc.
        request.headers.get('x-client-ip') || // Less common
        request.headers.get('x-forwarded') || // General header
        request.headers.get('forwarded-for') || // Another variation
        request.ip || // Fallback to server IP
        'Unknown IP';

    const token = request.cookies.get('token')?.value;

    const checkAccessibilityURL = `${process.env.NEXT_PUBLIC_API_URL}/api/checkAccessibility`;

    if (!request.url.startsWith('/maintenance') && !request.url.startsWith('/banned')) {
        const data = (await (
            await fetch(checkAccessibilityURL, {
                headers: {
                    Cookie: `token=${token}; client-ip=${clientIp}`
                },
                next: {
                    revalidate: 60
                }
            })
        ).json()) as TCheckAccessibilityResponse;

        if (!data.success) {
            if (data.status === 'maintenance') {
                // Create a response with a maintenance cookie and redirect
                const response = NextResponse.redirect(new URL('/maintenance', request.url));
                response.cookies.set('maintenance', 'true');
                return response;
            }

            if (data.status === 'banned') {
                // Create a response with a banned cookie and redirect
                const response = NextResponse.redirect(new URL('/banned', request.url));
                response.cookies.set('banned', 'true');
                return response;
            }
        }
    }

    // Base redirects:
    if (!token && !request.url.endsWith('/auth')) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Handle token on /auth:
    if (request.url.endsWith('/auth') && token) {
        const lastCategoryClicked = request.cookies.get('lastCategoryClicked')?.value || '/';
        return NextResponse.redirect(new URL(lastCategoryClicked, request.nextUrl.origin));
    }

    //Protected routes check:
    if (request.url.match(/^\/(categories|checkout|profile)(\?.*)?$/) && !token) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/categories/:path*', '/checkout', '/profile', '/auth', '/!(maintenance|banned)']
};
