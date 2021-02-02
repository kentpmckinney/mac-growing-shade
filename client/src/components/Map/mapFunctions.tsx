export const getUrlString: Function = ((p: string, location: any) => new URLSearchParams(location.search).get(p));
export const getUrlFloat: Function = ((p: string, location: any) => parseFloat(getUrlString(p, location) || ''));

export const generateBlockLayerGeoJsonSourceUrl: Function = (baseUrl: string, layerName: string): string => 
  `${baseUrl}/api/geojson?layer=${layerName}`;

export const generateParcelLayerGeoJsonSourceUrl: Function = (baseUrl: string, fips: string): string =>
  `${baseUrl}/api/geojson?fips=${fips}`;

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