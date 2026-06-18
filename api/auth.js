export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { username, password } = req.body

  const validUser = process.env.AUTH_USER
  const validPass = process.env.AUTH_PASS

  if (username === validUser && password === validPass) {
    return res.status(200).json({ ok: true })
  }

  return res.status(401).json({ ok: false, message: 'Incorrect username or password.' })
}
