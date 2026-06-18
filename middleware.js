export const config = {
  matcher: '/(.*)',
}

export default function middleware(request) {
  const url = new URL(request.url)

  // Allow static assets through without auth
  if (/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2|ttf|map)$/.test(url.pathname)) {
    return
  }

  const authHeader = request.headers.get('Authorization') || ''
  const [scheme, encoded] = authHeader.split(' ')

  if (scheme === 'Basic' && encoded) {
    try {
      const decoded = atob(encoded)
      const colonIdx = decoded.indexOf(':')
      const user = decoded.slice(0, colonIdx)
      const pass = decoded.slice(colonIdx + 1)

      const validUser = process.env.AUTH_USER
      const validPass = process.env.AUTH_PASS

      if (user === validUser && pass === validPass) {
        return // allow through
      }
    } catch (e) {}
  }

  return new Response('Access denied', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="D&E Group Dashboard"',
      'Content-Type': 'text/plain',
    },
  })
}
