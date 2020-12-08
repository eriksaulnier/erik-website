import { getSiteProps } from '../../lib/api'

export default function handler(req, res) {
  const siteProps = getSiteProps()

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(siteProps))
}