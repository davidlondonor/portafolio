const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstileToken(token, ip) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  if (!secretKey) {
    console.warn('Turnstile secret key not configured')
    return { success: true, skipped: true }
  }

  if (!token) {
    return { success: false, error: 'Missing turnstile token' }
  }

  try {
    const formData = new URLSearchParams()
    formData.append('secret', secretKey)
    formData.append('response', token)
    if (ip) {
      formData.append('remoteip', ip)
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    const result = await response.json()

    return {
      success: result.success,
      error: result.success ? null : 'Turnstile verification failed',
      challengeTs: result.challenge_ts,
      hostname: result.hostname,
    }
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return { success: false, error: 'Verification request failed' }
  }
}
