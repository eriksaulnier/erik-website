import React, { useState, useEffect } from 'react'
import Link from 'next/link'
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
      {(track && track.name) ? (
        <Link href={track.link}>
          <a className={styles.track} key={'0-'+track.id}>
            <img className={styles.trackArtwork} src={track.artwork} alt={track.name} />
            <div className={styles.trackDetails}>
              <h3 className={styles.trackTitle}>{track.name}</h3>
              <p className={styles.trackArtist}>{track.artist}</p>
            </div>
          </a>
        </Link>
      ) : (
        <div className={styles.track}>
          <p className={styles.placeholder}>Nothing is currently playing</p>
        </div>
      )}
    </div>
  )
}