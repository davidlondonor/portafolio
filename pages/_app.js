import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import Head from 'next/head'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { GeistPixelSquare } from 'geist/font/pixel'
import { LanguageProvider } from '../contexts/LanguageContext'

function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <style jsx global>{`
        :root {
          --font-geist-sans: ${GeistSans.style.fontFamily};
          --font-geist-mono: ${GeistMono.style.fontFamily};
          --font-geist-pixel: ${GeistPixelSquare.style.fontFamily};
        }
      `}</style>
      <div className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}>
        <Component {...pageProps} />
      </div>
      <Analytics />
      {process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN && (
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={`{"token": "${process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN}"}`}
          strategy="afterInteractive"
        />
      )}
    </LanguageProvider>
  )
}

export default MyApp
