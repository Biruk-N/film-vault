/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import appCss from '~/styles/app.css?url'
import { seo, seoPresets } from '~/utils/seo'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo(seoPresets.home),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'icon', href: '/favicon.ico' },
      // Additional SEO-friendly links
      { rel: 'canonical', href: 'https://film-vault-popular.netlify.app' },
      { rel: 'dns-prefetch', href: 'https://api.themoviedb.org' },
      { rel: 'dns-prefetch', href: 'https://image.tmdb.org' },
    ],
    scripts: [
      {
        src: '/customScript.js',
        type: 'text/javascript',
      },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
})

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="bg-gray-900 text-white min-h-screen">
        <QueryClientProvider client={queryClient}>
          <nav className="bg-gray-800 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <Link
                    to="/"
                    className="flex items-center space-x-2 text-xl font-bold text-white hover:text-blue-400 transition-colors"
                  >
                    <span className="text-2xl">🎬</span>
                    <span>FilmVault</span>
                  </Link>
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/"
                    activeProps={{
                      className: 'text-blue-400 font-semibold',
                    }}
                    activeOptions={{ exact: true }}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    to="/movies"
                    activeProps={{
                      className: 'text-blue-400 font-semibold',
                    }}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Movies
                  </Link>
                  <Link
                    to="/search"
                    activeProps={{
                      className: 'text-blue-400 font-semibold',
                    }}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Search
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="flex-1">
            {children}
          </main>
          <TanStackRouterDevtools position="bottom-right" />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
