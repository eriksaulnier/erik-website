import { VectorMap } from '@south-paw/react-vector-maps';
import { useState, useEffect } from 'react';
import styles from './map-block.module.scss'

export default function MapBlock({ data: { block_title, map_type, checked_layers, show_tooltips, tooltips_checked_layers_only } }) {
  const [map, setMap] = useState(null)
  const [checkedLayers, setCheckedLayers] = useState([])
  const [tooltip, setTooltip] = useState(null)
  const [[x, y], setPosition] = useState([])

  useEffect(async () => {
    // Load the map type
    const map = await import(`./maps/${map_type}.json`)
    setMap(map)

    // Get a list of all of the valid layer IDs and the name mappings
    const layerIds = map.layers.map(layer => layer.id)
    const nameMappings = map.layers.reduce((result, { id, name }) => {
      result[name] = id
      return result
    }, [])

    // Parse the provided checked layers list
    const checkedLayers = checked_layers.map(id => {
      if (layerIds.includes(id)) {
        return id
      } else if (nameMappings.hasOwnProperty(id)) {
        return nameMappings[id]
      } else {
        return null
      }
    }).filter(id => id !== null)
    setCheckedLayers(checkedLayers)
  }, [])

  const onMouseOver = (event) => {
    if (show_tooltips) {
      if (tooltips_checked_layers_only) {
        if (event.target.attributes['aria-checked'].value === 'true') {
          setTooltip(event.target.attributes.name.value)
        }
      } else {
        setTooltip(event.target.attributes.name.value)
      }
    }
  }

  const onMouseMove = (event) => {
    if (show_tooltips) {
      setPosition([event.clientX, event.clientY])
    }
  }

  const onMouseOut = () => {
    if (show_tooltips && tooltip) {
      setTooltip(null)
    }
  }

  return map ? (
    <section className={[styles.mapBlock, tooltips_checked_layers_only ? '' : styles.hoverAll].join(' ')}>
      {block_title && <h2>{block_title}</h2>}

      <VectorMap
        {...map}
        checkedLayers={checkedLayers}
        layerProps={{ onMouseOver, onMouseMove, onMouseOut }}
      />

      {show_tooltips && (
        <span className={styles.tooltip} style={{ top: y, left: x, opacity: tooltip ? 1 : 0 }}>{tooltip}</span>
      )}
    </section>
  ) : <></>
}
