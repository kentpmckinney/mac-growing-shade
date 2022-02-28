import sanitizeHtml from 'sanitize-html'
import Config from '../../config/application.json'

/* Define static properties of the map */
export const mapProperties: any = {
  width: '100%',
  height: '100%',
  mapboxApiAccessToken: Config.mapboxPublicToken,
  reuseMaps: true,
  mapOptions: {
    logoPosition: 'bottom-right',
    customAttribution: sanitizeHtml(Config.attribution, {
      allowedTags: ['b', 'i', 'em', 'strong', 'a'],
      allowedAttributes: { a: ['href'] },
    }),
  },
}

/* Define static properties of the block layer */
export const blockLayer: any = {
  id: 'block-layer',
  type: 'fill',
  minzoom: 10,
  paint: {
    'fill-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#6dd0f7', '#1890d7'],
    'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.3, 0.3],
    'fill-outline-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      '#2ebaaf',
      '#0095ce',
    ],
  },
}

/* Define static properties of the block outline layer */
export const blockOutlineLayer: any = {
  id: 'block-outline-layer',
  type: 'line',
  minzoom: 10,
  paint: {
    'line-color': '#0076a3',
    'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 3, 2],
  },
}

/* Define static properties of the parcel layer */
export const parcelLayer: any = {
  id: 'parcel-layer',
  type: 'fill',
  minzoom: 10,
  paint: {
    'fill-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#6dd0f7', '#1890d7'],
    'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.7, 0.7],
    'fill-outline-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      '#0000ff',
      '#0000ff',
    ],
  },
}

export const baseUrl = `${window.location.protocol}//${window.location.host.replace(
  '3000',
  '5000'
)}`
