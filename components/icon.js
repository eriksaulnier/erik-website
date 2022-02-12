import React from 'react'
import loadable from '@loadable/component'

export default function DynamicIcon({ name, ...props }) {
  const family = name.slice(0, 2).toLowerCase()
  const Icon = loadable(() => import(`react-icons/${family}/index.js`), {
    resolveComponent: (el) => {
      if (Object.assign({}, el).hasOwnProperty(name)) {
        return el[name]
      } else {
        console.log('Failed to load icon:', name)
        return React.Fragment
      }
    }
  })
  
  return <Icon {...props} />
}
