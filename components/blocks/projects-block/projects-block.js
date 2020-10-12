import styles from './projects-block.module.scss'
import ProjectsList from '../../project-list'

export default function ProjectsBlock({ data }) {
  return (
    <section className={styles.TechnologyBlock}>
      {data.block_title ? <h2>{data.block_title}</h2> : null}

      {data.projects ? <ProjectsList projects={data.projects} /> : null}
    </section>
  )
}
