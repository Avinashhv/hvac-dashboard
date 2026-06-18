export const config = {
  matcher: '/(.*)',
}

export default function middleware(request) {
  const url = new URL(request.url)

  // Allow static assets through without auth (js, css, images, fonts)
  if (/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2|ttf|map)$/.test(url.pathname)) {
    return new Response(null, { status: 200, headers: { 'x-middleware-next': '1' } })
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
        return new Response(null, { status: 200, headers: { 'x-middleware-next': '1' } })
      }
    } catch {}
  }

  return new Response('Access denied', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="D&E Group Dashboard", charset="UTF-8"',
      'Content-Type': 'text/plain',
    },
  })
}
