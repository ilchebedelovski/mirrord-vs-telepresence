import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const auditorUrl = `${process.env.AUDITOR_ADDRESS ?? 'http://localhost:3200'}/audit`;

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith('/_next')) {
    fetch(auditorUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pathname })
    }).catch(err => { console.error('Error sending audit log', err) });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*'
}