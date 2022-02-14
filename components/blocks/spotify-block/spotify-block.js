import React from 'react'
import { TopTracks, TopArtists, CurrentlyPlaying } from './types'
import styles from './spotify-block.module.scss'

export default function SpotifyBlock({ data: { block_title, block_type, limit, time_range } }) {
  const timeRangeConversion = {
    'Short Term (4 weeks)': 'short_term',
    'Short Term (6 months)': 'medium_term',
    'Long Term (several years)': 'long_term',
  }
  const timeRange = timeRangeConversion[time_range]

  return (
    <section className={styles.contentBlock}>
      {block_title && <h2>{block_title}</h2>}

      {
        {
          'Top Tracks': <TopTracks limit={limit} timeRange={timeRange} />,
          'Top Artists': <TopArtists limit={limit} timeRange={timeRange} />,
          'Currently Playing': <CurrentlyPlaying />
        }[block_type]
      }
    </section>
  )
}