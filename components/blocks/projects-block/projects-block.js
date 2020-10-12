import ProjectsList from '../../project-list'

export default function ProjectsBlock({ data }) {
  return (
    <section>
      {data.block_title ? <h2>{data.block_title}</h2> : null}

      {data.projects ? <ProjectsList projects={data.projects} /> : null}
    </section>
  )
}
