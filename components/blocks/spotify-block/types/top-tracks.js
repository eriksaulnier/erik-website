import React, { useState, useEffect } from 'react'
import querystring from 'querystring'
import Link from 'next/link'
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
        <Link href={track.link}>
          <a className={styles.track} key={'1-'+track.id}>
            <img className={styles.trackArtwork} src={track.artwork} alt={track.name} />
            <div className={styles.trackDetails}>
              <h3 className={styles.trackTitle}>{track.name}</h3>
              <p className={styles.trackArtist}>{track.artist}</p>
            </div>
          </a>
        </Link>
      ))}
    </div>
  )
}