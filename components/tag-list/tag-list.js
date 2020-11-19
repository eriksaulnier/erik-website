// import React from 'react'
// import * as Devicon from 'react-icons/di' 
import styles from './tag-list.module.scss'

export default function TagList({ tags, color }) {
  return (
    <ul className={styles.tagList}>
      {tags?.map((tag, index) => (
        <li key={index} className={[styles.tag, color ? styles[color] : null].join(' ')}>
          {/* {tag.icon ? React.createElement(Devicon[tag.icon]) : null} */}
          {tag.label}
        </li>
      ))}
    </ul>
  )
}
