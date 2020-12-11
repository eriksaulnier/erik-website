import styles from './project-list.module.scss'
import Project from './project';

export default function ProjectList({ projects }) {
  return (
    <>
      <ul className={styles.ProjectList}>
        {projects?.map((project, index) => (
          <li key={index}>
            <Project data={project} />
          </li>
        ))}
      </ul>
    </>
  )
}