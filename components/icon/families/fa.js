import React from 'react'
import * as IconFamily from 'react-icons/fa'

export default function SimpleIcon({ name }) {
  return React.createElement(IconFamily[name])
}