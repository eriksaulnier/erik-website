import matter from 'gray-matter'
import fs from 'fs'
import { join } from 'path'
import { getAllMarkdownFiles } from './util'

const devMode = process.env.NODE_ENV === 'development'

const contentDirectory = join(process.cwd(), 'content')
const pagesDirectory = join(contentDirectory, 'pages')
const projectsDirectory = join(contentDirectory, 'projects')
const articlesDirectory = join(contentDirectory, 'articles')

export function getSiteSettings() {
  const path = join(contentDirectory, 'site-settings.md')
  const fileContents = fs.readFileSync(path)
  const { data } = matter(fileContents)

  // Preload navigation data
  if (data.header?.navigation) {
    data.header.navigation = data.header.navigation.map(item => {
      const slug = item.slug ? item.slug : item.page.replace('content/pages/', '').replace('.md', '')
      const page = getPageBySlug(slug)
      return { slug: page.slug, label: item.label }
    })
  }
  
  return { ...data }
}

export function getAllPages() {
  const paths = getAllMarkdownFiles(pagesDirectory)
  const pages = paths
    .map(path => getPageBySlug(path))
    .filter(page => devMode || page.published)

  return pages
}

export function getAllPagePaths() {
  const paths = getAllPages().map(page => page.slug.split('/'))

  return paths
}

export function getPageBySlug(slug) {
  const path = join(pagesDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(path)
  const { data, content } = matter(fileContents)

  // Preload block data
  if (data.blocks) {
    data.blocks = data.blocks.map(block => {
      switch (block.template) {
        case 'projects-block':
          block.projects = (block.limit == -1) ? getAllProjects() : getAllProjects().slice(0, block.limit)
          break;
        case 'article-blocks':
          block.articles = (block.limit == -1) ? getAllArticles() : getAllArticles().slice(0, block.limit)
          break;
      }
      return block
    })
  }

  return { slug, content, ...data }
}

export function getAllProjects() {
  const paths = getAllMarkdownFiles(projectsDirectory)
  const projects = paths
    .map(path => {
      const project = getProjectBySlug(path)
      project.created_date = Date.parse(project.created_date)
      return project
    })
    .filter(project => devMode || project.published)
    .sort((a, b) => b.created_date - a.created_date)

  return projects
}

export function getProjectBySlug(slug) {
  const path = join(projectsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(path)
  const { data } = matter(fileContents)

  return { ...data }
}

export function getAllArticles() {
  const paths = getAllMarkdownFiles(articlesDirectory)
  const articles = paths
    .map(path => {
      const article = getArticleBySlug(path)
      article.created_date = Date.parse(article.created_date)
      return article
    })
    .filter(article => devMode || article.published)
    .sort((a, b) => b.created_date - a.created_date)
  
  return articles
}

export function getAllArticlePaths() {
  const paths = getAllArticles().map(article => article.slug.split('/'))

  return paths
}

export function getArticleBySlug(slug) {
  const path = join(articlesDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(path)
  const { data, content } = matter(fileContents)
  
  return { slug, content, ...data }
}