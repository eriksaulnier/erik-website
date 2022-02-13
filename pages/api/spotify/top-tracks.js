import { getTopTracks } from '@/lib/spotify'

export default async (req, res) => {
  const { limit, timeRange } = req.query
  const tracks = await getTopTracks(limit, timeRange)
  res.status(200).json({ tracks })
}