/*
import { NextRequest } from 'next/server'
import { i18nRouter } from 'next-i18n-router'
import i18nConfig from '@/i18nConfig.js'

function middleware(request: NextRequest) {
  return i18nRouter(request, i18nConfig)
}

const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
}

export { middleware, config }
*/

import { NextRequest, NextResponse } from 'next/server'
import i18nConfig from '@/i18nConfig.js'

//let locales = ['en-US', 'nl-NL', 'nl']

// Get the preferred locale, similar to the above or using a library
//function getLocale(request) { ... }

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = i18nConfig.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  const locale = 'en'
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en/products
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
}
