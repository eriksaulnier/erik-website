import React from 'react'
import { TopTracks, TopArtists, CurrentlyPlaying } from './types'
import styles from './spotify-block.module.scss'

export default function SpotifyBlock({ data: { block_title, block_type }}) {
  return (
    <section className={styles.contentBlock}>
      {block_title && <h2>{block_title}</h2>}

      {
        {
          'Top Tracks': <TopTracks limit={3} />,
          'Top Artists': <TopArtists limit={3} />,
          'Currently Playing': <CurrentlyPlaying />
        }[block_type]
      }
    </section>
  )
}