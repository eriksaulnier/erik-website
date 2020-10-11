import fs from 'fs'
import { join } from 'path'

export async function getAllMarkdownFiles(directory, filelist = [], base = null) {
  const files = fs.readdirSync(directory)

  files.forEach(filename => {
    const path = join(directory, filename)
    
    if (fs.lstatSync(path).isDirectory()) {
      getAllMarkdownFiles(path, filelist, base ? base : `${directory}/`)
    } else if (/\.md$/.test(path)) {
      if (base) {
        filelist.push(join(directory.replace(base, ''), filename.replace(/\.md$/, '')))
      } else {
        filelist.push(filename.replace(/\.md$/, ''))
      }
    }
  })
  
  return filelist
}