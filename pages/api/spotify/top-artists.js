import { getTopArtists } from '@/lib/spotify'

export default async (req, res) => {
  const { limit, timeRange } = req.query
  const artists = await getTopArtists(limit, timeRange)
  res.status(200).json({ artists })
}