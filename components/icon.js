import React from 'react'
import dynamic from 'next/dynamic' 

export default function DynamicIcon({ name, ...props }) {
  const family = name.slice(0, 2).toLowerCase()
  const Icon = dynamic(
    () => import(`react-icons/${family}/index.js`).then((mod) => {
      if (!mod[name]) {
        console.error('Failed to load icon:', name)
        return React.Fragment
      }
      return mod[name]
    })
  )
  
  return <Icon {...props} />
}
