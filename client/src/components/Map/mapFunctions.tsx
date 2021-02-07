import { FlyToInterpolator } from 'react-map-gl';
import { easeCubic } from 'd3-ease';

/* Check if a string is null or contains whitespace */
export const isNullOrWhitespace = (s: string) => !s || !s.trim();

/* Get a url parameter by name */
export const getUrlString: Function = ((p: string, location: any) => new URLSearchParams(location.search).get(p));
export const getUrlFloat: Function = ((p: string, location: any) => parseFloat(getUrlString(p, location) || ''));

/* Get a url for an API route that provides GeoJSON for a block layer with the given layer (table) name */
export const generateBlockLayerGeoJsonSourceUrl: Function = (baseUrl: string, layerName?: string): string => 
  `${baseUrl}/api/geojson?layer=${layerName}`;

/* Get a url for an API route that provides GeoJSON for a parcel layer given a block feature's FIPS number */
export const generateParcelLayerGeoJsonSourceUrl: Function = (baseUrl: string, properties?: any): string =>
  `${baseUrl}/api/geojson?fips=${properties && properties['FIPS']}`;

/* Determine whether the block layer or parcel layer is active */
export const generateInteractiveLayerIds: Function = (activeLayer: string) => {
  return activeLayer === 'parcel' ? ['parcel-layer'] : ['block-layer']
}

/* Add extra properties to the map during a transition */
export const generateTransitionProperties: Function = (transition: boolean) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return { transitionDuration: 0 }
  }
  return { ...(transition)
    ? {
        transitionDuration: 500,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: easeCubic
      }
    : { transitionDuration: 0 }
  }
}

/* Update the URL bar with viewport settings without triggering a render */
export const updateUrlParams: Function = (sliderValues: any, latitude: number, longitude: number, zoom: number, mapStyleName: string) => {
  try {
    const sliderUrlValues = new URLSearchParams(
      sliderValues.map((x: any) => [x.name, (x.value && x.value.min) ? `${x.value.min}-${x.value.max}` : ""])
    ).toString();

    window.history.replaceState(null, 'Branch Out Gresham',
      `/map?${sliderUrlValues}&lat=${latitude}&lon=${longitude}&zoom=${zoom}&style=${mapStyleName}`
    );
  }
  catch (e) {
    console.error(`Error updating URL params. Details: ${e}`);
  }
}

/* Create a 'filter' for the Layer component in the map below which determines if a feature is shown on the map */
/* The overall purpose of this is to map slider values to the data 'columns' they represent */
/* The format is ['expression affecting all arguments', ['expression', column, value], ['expression', column, value], ...] */
/* The first expression affects all subsequent arguments, and the expression within an argument affects 'column' and 'value' */
/* 'All' means the feature will show if all of the other expressions are true, and those are all 'column >= value' */
/* The 'filter' breaks if s.column is an empty string hence the Array.filter function to remove invalid entries */
export const generateBlockLayerFilter = (sliderValues: any) => [ 'all',
  ...sliderValues
    .flatMap((s: any) => [['>=', s.column, s.value.min],['<=', s.column, s.value.max]])
    .filter((s: any) => (typeof s === 'string') || (Array.isArray(s) && s.length >= 2 && s[1] !== ''))
];

/* Get a reference to the underlying map */
// const mapRef = createRef<any>();
// useEffect(() => {
//   if (mapRef && mapRef.current) {
//     //const map = mapRef.current.getMap();
//   }
//   return undefined;
// }, [mapRef]);