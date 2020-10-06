// import * as Devicon from 'react-icons/di' 
import styles from './skills-block.module.scss'
import React from 'react'

export default function SkillsBlock({ title, skills }) {
  return (
    <div className={styles.skillsBlock}>
      {title ? <h4>{title}</h4> : null}
      <ul>
        {skills.map(skill => (
          <li key={skill.label} className={styles.skill}>
            {skill}
            {/* {skill.icon ? React.createElement(Devicon[skill.icon]) : null} */}
          </li>
        ))}
      </ul>
    </div>
  )
}