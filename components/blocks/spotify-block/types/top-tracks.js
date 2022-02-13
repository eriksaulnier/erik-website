import React, { useState, useEffect } from 'react'
import querystring from 'querystring'
import { fetchFromApi } from '@/lib/util'
import styles from '../spotify-block.module.scss'

export default function TopTracks({ limit, timeRange }) {
  const [tracks, setTracks] = useState([])

  useEffect(async () => {
    const queryParams = querystring.stringify({
      limit: limit,
      timeRange: timeRange
    })
    
    const { tracks } = await fetchFromApi('/api/spotify/top-tracks?' + queryParams)
    setTracks(tracks)
  }, [])

  return (
    <div className={styles.trackList}>
      {tracks && tracks.map(track => (
        <div className={styles.track} key={track.id}>
          <h3>{track.name}</h3>
          <p>{track.artists.map(artist => artist.name).join(', ')}</p>
        </div>
      ))}
    </div>
  )
}