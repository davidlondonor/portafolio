import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

function MyApp({ Component, pageProps }) {
  return (
    <>
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
    </>
  )
}

export default MyApp
