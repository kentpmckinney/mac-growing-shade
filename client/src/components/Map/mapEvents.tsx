import { setViewport, ViewportState } from './mapViewportStateSlice';
import { getUrlFloat, getUrlString } from './mapFunctions';

/* Update viewport state in Redux as changes occur */
export const onViewportChange: Function = (v: ViewportState, mapStyleName: any, selectedFeature: any, dispatch: Function) => dispatch(setViewport(
  {latitude: v.latitude, longitude: v.longitude, zoom: v.zoom, style: mapStyleName, selectedFeature: selectedFeature, transition: false}
));

/* Synchronize viewport settings with URL parameters on component mount */
export const onMount: Function = (viewport: any, dispatch: Function, location: any) => {
  const latitude = getUrlFloat('lat', location) || viewport.latitude;
  const longitude = getUrlFloat('lon', location) || viewport.longitude;
  const zoom = getUrlFloat('zoom', location) || viewport.zoom;
  const mapStyleName = getUrlString('style', location) || viewport.style;
  dispatch(setViewport({ ...viewport, latitude, longitude, zoom, style: mapStyleName }));
}

/* Handle interactive clicks or presses on the map */
export const onMapClick: Function = (e: any, viewport: any, selectedFeature: any, dispatch: Function) => {
  const isFeatureSelected = e?.features[0]?.properties;

  if (selectedFeature.fips.length <= 0) {
    /* A block layer feature was selected */
    if (isFeatureSelected) {

      // TODO: ADD NEW SLIDERS

      const doTransition = selectedFeature.fips.length <= 0;
      const mapClickLatitude = e.lngLat[1]
      const mapClickLongitude = e.lngLat[0]
      const featureLatitude = e?.features[0]?.latitude;
      const featureLongitude = e?.features[0]?.longitude;
      const featureFipsValue = e?.features[0]?.properties?.FIPS;
      dispatch(setViewport(
        {...viewport, latitude: mapClickLatitude, zoom: 15, longitude: mapClickLongitude, transition: doTransition,
          selectedFeature: {
            type: 'parcel', fips: featureFipsValue, showPopup: false, latitude: featureLatitude, longitude: featureLongitude}
          }
      ));
    }
    else {
      // TODO: DETECT WHEN CLICKING OFF A BLOCK FEATURE AND CHANGE SLIDERS TO ORIGINAL SETUP
    }
  }
  else {
    /* A parcel layer feature was selected */
    if (isFeatureSelected) {
      dispatch(setViewport({...viewport, selectedFeature: {...selectedFeature, showPopup: true}}));
    }
    else {
      // a non-parcel was selected, ignore for now
    }
  }
}

export const onLoad = (e: any, dispatch: any, updateLoadingMessage: Function) => {
  const isStyleLoaded = () => {
    e.target.style && e.target.style._loaded
      ? dispatch(updateLoadingMessage({ message: '' }))
      : window.setTimeout(isStyleLoaded, 500);
  }
  isStyleLoaded();
}