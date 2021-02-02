// import { MapLoadEvent } from 'react-map-gl';
import { setViewport, ViewportState } from './mapViewportStateSlice';
import { getUrlFloat, getUrlString } from './mapFunctions';
import { AppDispatch } from '../../state/store';

/* Update viewport state in Redux as changes occur */
export const onViewportChange: Function = (v: ViewportState, mapStyleName: any, selectedFeature: any, dispatch: Function) => dispatch(setViewport(
  {latitude: v.latitude, longitude: v.longitude, zoom: v.zoom, style: mapStyleName, selectedFeature: selectedFeature, transition: false}
));

/* Synchronize viewport settings with URL parameters on component mount */
export const onMount: Function = (viewport: any, dispatch: AppDispatch, location: any) => {
  const latitude = getUrlFloat('lat', location) || viewport.latitude;
  const longitude = getUrlFloat('lon', location) || viewport.longitude;
  const zoom = getUrlFloat('zoom', location) || viewport.zoom;
  const mapStyleName = getUrlString('style', location) || viewport.style;
  dispatch(setViewport({ ...viewport, latitude, longitude, zoom, style: mapStyleName }));
}

/* Updates the loading message after the map finishes loading */
export const onLoad = (e: any, dispatch: AppDispatch, updateLoadingMessage: Function) => {
  const isStyleLoaded = () => {
    e.target.style && e.target.style._loaded
      ? dispatch(updateLoadingMessage({ message: '' }))
      : window.setTimeout(isStyleLoaded, 500);
  }
  isStyleLoaded();
}

/* Handle interactive clicks or presses on the map */
export const onMapClick: Function = (e: any, viewport: any, selectedFeature: any, dispatch: AppDispatch) => {
  // click on a block feature
    // if we're in parcel mode and the click is in the same block then stay in parcel mode
    // see if sliders need to change to block mode
  // click on a parcel feature
    // see if sliders need to change to parcel mode
  // click somewhere that's not a block or parcel feature
    // center on that location and change to block mode (and change sliders)
  // variables: selectedBlock (fips, lat/lng for flyto), selectedParcel (lat/lng for popup),
  //   interactionMode (block|parcel)
console.log(e)
  const isFeatureSelected = e?.features[0]?.properties ?? false;
  const isBlockFeatureSelected = selectedFeature.fips.length <= 0;

  if (isBlockFeatureSelected) {
    /* A block layer feature was selected */
    if (isFeatureSelected) {

      // TODO: ADD NEW SLIDERS

      const doTransition = selectedFeature.fips.length <= 0;
      const mapClickLatitude = e.lngLat[1];
      const mapClickLongitude = e.lngLat[0];
      const featureFipsValue = e?.features[0]?.properties?.FIPS;
      dispatch(setViewport(
        {...viewport, latitude: mapClickLatitude, longitude: mapClickLongitude, zoom: 15, transition: doTransition,
          selectedFeature: {
            type: 'parcel', fips: featureFipsValue, showPopup: false, latitude: mapClickLatitude, longitude: mapClickLongitude,
            properties: Object.assign({}, e?.features[0]?.properties)}
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
      const mapClickLatitude = e.lngLat[1];
      const mapClickLongitude = e.lngLat[0];
      dispatch(setViewport({...viewport, selectedFeature: {...selectedFeature, latitude: mapClickLatitude, longitude: mapClickLongitude, 
        showPopup: true, properties: Object.assign({}, e?.features[0]?.properties)}}));
    }
    else {
      // a non-parcel was selected, ignore for now
    }
  }
}