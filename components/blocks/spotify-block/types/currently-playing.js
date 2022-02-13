import React, { useState, useEffect } from 'react'
import { fetchFromApi } from '@/lib/util'
import styles from '../spotify-block.module.scss'

export default function CurrentlyPlaying() {
  const [track, setTrack] = useState([])

  useEffect(async () => {
    const { track } = await fetchFromApi('/api/spotify/currently-playing')
    setTrack(track)
  }, [])

  return (
    <div className={styles.currentlyPlaying}>
      {track && (
        <h3>{track.name}</h3>
      )}
    </div>
  )
}