// import React from 'react'
// import * as Devicon from 'react-icons/di' 
import styles from './technology-block.module.scss'
import TagList from '../../tag-list'

export default function TechnologyBlock({ data }) {
  return (
    <section className={styles.TechnologyBlock}>
      {data.block_title ? <h2>{data.block_title}</h2> : null}

      {data.categories.map((category, index) => (
        <div key={index}>
          {category.category_title ? <h4>{category.category_title}</h4> : null}
          <TagList tags={category.technologies} />
        </div>
      ))}
    </section>
  )
}
