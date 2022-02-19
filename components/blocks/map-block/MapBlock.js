import { VectorMap } from '@south-paw/react-vector-maps';
import { useState, useEffect } from 'react';
import styles from './map-block.module.scss'

export default function MapBlock({ data: { block_title, map_type, checked_layers, show_tooltips, tooltips_checked_layers_only } }) {
  const [map, setMap] = useState(null)
  const [label, setLabel] = useState(null)
  const [[x, y], setPosition] = useState([])

  useEffect(async () => {
    setMap(await import(`./maps/${map_type}.json`))
  }, [])

  const onMouseOver = (event) => {
    if (show_tooltips) {
      if (tooltips_checked_layers_only) {
        if (event.target.attributes['aria-checked'].value === 'true') {
          setLabel(event.target.attributes.name.value)
        }
      } else {
        setLabel(event.target.attributes.name.value)
      }
    }
  }

  const onMouseMove = (event) => {
    if (show_tooltips) {
      console.log(event)
      setPosition([event.clientX, event.clientY])
    }
  }

  const onMouseOut = (event) => {
    if (show_tooltips && label) {
      setLabel(null)
    }
  }

  return map ? (
    <section className={[styles.mapBlock, tooltips_checked_layers_only ? '' : styles.hoverAll].join(' ')}>
      {block_title && <h2>{block_title}</h2>}

      <VectorMap
        {...map}
        checkedLayers={checked_layers}
        layerProps={{ onMouseOver, onMouseMove, onMouseOut }}
      />
      {show_tooltips && <span className={styles.tooltip} style={{ top: y, left: x, opacity: label ? 1 : 0 }}>{label}</span>}
    </section>
  ) : <></>
}
