import styles from './project-list.module.scss'
import Project from './project';

export default function ProjectList({ projects }) {
  return (
    <>
      <ul className={styles.projectList}>
        {projects.map((project) => (
          <li>
            <Project project={project} key={project.title}></Project>
          </li>
        ))}
      </ul>
    </>
  )
}