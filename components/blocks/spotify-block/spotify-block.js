import React from 'react'
import { TopTracks, TopArtists, CurrentlyPlaying } from './types'
import styles from './spotify-block.module.scss'

export default function SpotifyBlock({ data: { block_title, block_type }}) {
  return (
    <section className={styles.contentBlock}>
      {block_title && <h2>{block_title}</h2>}

      {
        {
          'top-tracks': <TopTracks limit={3} />,
          'top-artists': <TopArtists limit={3} />,
          'currently-playing': <CurrentlyPlaying />
        }[block_type]
      }
    </section>
  )
}