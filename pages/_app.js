import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { LanguageProvider } from '../contexts/LanguageContext'

function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <style jsx global>{`
        :root {
          --font-geist-sans: ${GeistSans.style.fontFamily};
          --font-geist-mono: ${GeistMono.style.fontFamily};
        }
      `}</style>
      <div className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <Component {...pageProps} />
      </div>
      <Analytics />
    </LanguageProvider>
  )
}

export default MyApp
