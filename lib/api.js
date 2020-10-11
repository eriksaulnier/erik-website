import matter from 'gray-matter'
import fs from 'fs'
import { join } from 'path'
import { getAllMarkdownFiles } from './util'

const contentDirectory = join(process.cwd(), 'content')
const pagesDirectory = join(contentDirectory, 'pages')
const projectsDirectory = join(contentDirectory, 'projects')
const articlesDirectory = join(contentDirectory, 'articles')

export function getSiteSettings() {
  const path = join(contentDirectory, 'site-settings.md')
  const fileContents = fs.readFileSync(path)
  const { data } = matter(fileContents)

  data.header.navigation = data.header.navigation.map(item => {
    const slug = item.slug ? item.slug : item.page.replace('content/pages/', '').replace('.md', '')
    const page = getPageBySlug(slug)

    return { slug: page.slug, label: item.label }
  })
  
  return { frontmatter: { ...data } }
}

export async function getAllPagePaths() {
  const paths = await getAllMarkdownFiles(pagesDirectory)
  const splitPaths = paths.map(path => path.split('/'))
  
  return splitPaths
}

export function getPageBySlug(slug) {
  const path = join(pagesDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(path)
  const { data, content } = matter(fileContents)

  return { slug, frontmatter: { ...data }, content }
}

export async function getAllProjects() {
  const paths = await getAllMarkdownFiles(projectsDirectory)
  
  const projects = paths
    .map(path => getProjectBySlug(path))
    .filter(project => project.published)
    .map(project => {
      project.created_date = Date.parse(project.created_date)
      return project
    })
    .sort((a, b) => b.created_date - a.created_date)

    return projects
}

export function getProjectBySlug(slug) {
  const path = join(projectsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(path)
  const { data } = matter(fileContents)

  return { ...data }
}

export async function getAllArticlePaths() {
  const paths = await getAllMarkdownFiles(articlesDirectory)
  const splitPaths = paths
    .map(path => path.split('/'))
    .filter((path) => {
      const data = getArticleBySlug(path)
      return data.frontmatter.published
    })

  return splitPaths
}

export function getArticleBySlug(slug) {
  const path = join(articlesDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(path)
  const { data, content } = matter(fileContents)
  
  return { slug, frontmatter: { ...data }, content }
}