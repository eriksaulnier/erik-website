// import React from 'react'
// import * as Devicon from 'react-icons/di' 
import styles from './technology-block.module.scss'

export default function TechnologyBlock({ data }) {
  return (
    <section className={styles.TechnologyBlock}>
      {data.block_title ? <h2>{data.block_title}</h2> : null}

      {data.categories.map((category, index) => (
        <div key={index}>
          {category.category_title ? <h4>{category.category_title}</h4> : null}
          <ul>
            {category.technologies.map((tag, index) => (
              <li key={index} className={styles.skill}>
                {/* {tag.icon ? React.createElement(Devicon[tag.icon]) : null} */}
                {tag.label}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <ul>
        
      </ul>
    </section>
  )
}
