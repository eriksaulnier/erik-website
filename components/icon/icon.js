import React from 'react'
import dynamic from 'next/dynamic'

export default function Icon({ name }) {
  const family = name.substr(0, 2).toLowerCase()

  const iconFamilies = {
    'si': dynamic(() => import('./families/si')),
    'fa': dynamic(() => import('./families/fa')),
    'di': dynamic(() => import('./families/di')),
    'bs': dynamic(() => import('./families/bs')),
    'gr': dynamic(() => import('./families/gr')),
    'si': dynamic(() => import('./families/si')),
    'gi': dynamic(() => import('./families/gi')),
  }

  const IconComponent = iconFamilies[family]

  if (!iconFamilies[family]) console.log('Font family not loaded:', family)

  return IconComponent ? <IconComponent name={name} /> : null
}