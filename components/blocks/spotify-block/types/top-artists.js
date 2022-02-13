import React, { useState, useEffect } from 'react'
import querystring from 'querystring'
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
        <div className={styles.artist} key={artist.id}>
          <h3>{artist.name}</h3>
        </div>
      ))}
    </div>
  )
}