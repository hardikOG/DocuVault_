import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const pathString = path.join('/');
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${BACKEND_URL}/${pathString}${searchParams ? `?${searchParams}` : ''}`;

    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const authHeader = request.headers.get('Authorization');
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers,
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to connect to backend' },
            { status: 502 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const pathString = path.join('/');
    const url = `${BACKEND_URL}/${pathString}`;

    try {
        const contentType = request.headers.get('Content-Type') || '';
        const headers: HeadersInit = {};

        const authHeader = request.headers.get('Authorization');
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        let body: BodyInit;

        if (contentType.includes('multipart/form-data')) {
            // For file uploads, pass through the form data
            body = await request.formData();
        } else {
            // For JSON requests
            headers['Content-Type'] = 'application/json';
            body = await request.text();
        }

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body,
        });

        if (response.status === 204) {
            return new NextResponse(null, { status: 204 });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to connect to backend' },
            { status: 502 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const pathString = path.join('/');
    const url = `${BACKEND_URL}/${pathString}`;

    try {
        const headers: HeadersInit = {};

        const authHeader = request.headers.get('Authorization');
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const response = await fetch(url, {
            method: 'DELETE',
            headers,
        });

        if (response.status === 204) {
            return new NextResponse(null, { status: 204 });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to connect to backend' },
            { status: 502 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const pathString = path.join('/');
    const url = `${BACKEND_URL}/${pathString}`;

    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const authHeader = request.headers.get('Authorization');
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const body = await request.text();

        const response = await fetch(url, {
            method: 'PUT',
            headers,
            body,
        });

        if (response.status === 204) {
            return new NextResponse(null, { status: 204 });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to connect to backend' },
            { status: 502 }
        );
    }
}
