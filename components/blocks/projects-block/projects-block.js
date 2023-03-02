import { useState } from 'react'
import ProjectList from './project-list'

export default function ProjectsBlock({ data: { title, projects } }) {
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <section>
      {title && <h2>{title}</h2>}

      {projects && <ProjectList projects={projects} onClick={setSelectedProject} />}
    </section>
  )
}
