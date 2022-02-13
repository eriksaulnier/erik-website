import { getCurrentlyPlaying } from '@/lib/spotify'

export default async (_, res) => {
  const track = await getCurrentlyPlaying()
  res.status(200).json({ track })
}