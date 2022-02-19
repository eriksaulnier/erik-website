import { VectorMap } from '@south-paw/react-vector-maps';

import world from './maps/world.json';

export default function MapBlock({ data: { block_title } }) {
  return (
    <section>
      {block_title && <h2>{block_title}</h2>}

      <VectorMap {...world} />
    </section>
  )
}
