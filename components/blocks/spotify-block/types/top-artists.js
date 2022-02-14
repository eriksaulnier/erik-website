import React, { useState, useEffect } from 'react'
import querystring from 'querystring'
import Link from 'next/link'
import { fetchFromApi } from '@/lib/util'
import styles from '../spotify-block.module.scss'

export default function TopArtists({ limit, timeRange }) {
  const [artists, setArtists] = useState([])

  useEffect(async () => {
    const queryParams = querystring.stringify({
      limit: limit,
      timeRange: timeRange
    })
    
    const { artists } = await fetchFromApi('/api/spotify/top-artists?' + queryParams)
    setArtists(artists)
  }, [])

  return (
    <div className={styles.artistList}>
      {artists && artists.map(artist => (
        <Link href={artist.link}>
          <a className={styles.artist} key={artist.id}>
            <img className={styles.artistImage} src={artist.image} alt={artist.name} />
            <h3 className={styles.artistName}>{artist.name}</h3>
          </a>
        </Link>
      ))}
    </div>
  )
}