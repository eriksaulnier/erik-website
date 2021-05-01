import { useState } from 'react'
import ProjectsList from './project-list'

export default function ProjectsBlock({ data: { block_title, projects } }) {
  
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <section>
      {block_title && <h2>{block_title}</h2>}

      {projects && <ProjectsList projects={projects} onClick={setSelectedProject} />}
    </section>
  )
}
