import { useEffect, useRef, useCallback } from 'react'
import Script from 'next/script'

export default function Turnstile({ onVerify, onError, onExpire }) {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)
  const scriptLoadedRef = useRef(false)

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !window.turnstile || widgetIdRef.current) return

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    if (!siteKey) {
      console.warn('Turnstile site key not configured')
      return
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token) => {
        onVerify?.(token)
      },
      'error-callback': () => {
        onError?.()
      },
      'expired-callback': () => {
        onExpire?.()
      },
      theme: 'auto',
    })
  }, [onVerify, onError, onExpire])

  useEffect(() => {
    if (scriptLoadedRef.current && window.turnstile) {
      renderWidget()
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [renderWidget])

  const handleScriptLoad = () => {
    scriptLoadedRef.current = true
    renderWidget()
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />
      <div ref={containerRef} className="cf-turnstile" />
    </>
  )
}

export function resetTurnstile(widgetId) {
  if (window.turnstile && widgetId) {
    window.turnstile.reset(widgetId)
  }
}
