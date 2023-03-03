import React from 'react'
import dynamic from 'next/dynamic' 

export default function DynamicIcon({ name, ...props }) {
  const family = name.slice(0, 2).toLowerCase()
  const Icon = dynamic(
    () => import(`react-icons/${family}/index.js`).then((mod) => {
      if (mod[name]) return mod[name]
      throw new Error(`Icon ${name} not found`)
    })
  )
  
  return <Icon {...props} />
}
