// import { MapLoadEvent } from 'react-map-gl';
import { setViewport, ViewportState } from './mapViewportStateSlice';
import { getUrlFloat, getUrlString, isNullOrWhitespace } from './mapFunctions';
import { AppDispatch } from '../../state/store';

/* Update viewport state in Redux as changes occur */
export const onViewportChange: Function = (v: ViewportState, mapStyleName: any, activeLayer: string, feature: any, dispatch: Function) => dispatch(setViewport(
  {latitude: v.latitude, longitude: v.longitude, zoom: v.zoom, style: mapStyleName, activeLayer, feature: {...feature, isTransitionInProgress: false}}
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
export const onMapClick: Function = (e: any, viewport: any, dispatch: AppDispatch) => {
  const { feature, activeLayer } = viewport;
  const blockLayerIsActive = !activeLayer || (activeLayer && activeLayer === 'block');
  const parcelLayerIsActive = !isNullOrWhitespace(activeLayer) && activeLayer === 'parcel';
  const clickIsOnFeature = e?.features[0]?.properties ?? false;
  const clickIsOffFeature = !clickIsOnFeature;
  const lat = e.lngLat[1];
  const lon = e.lngLat[0];
  if (blockLayerIsActive) {
    if (clickIsOnFeature) {
      console.info('here 1')
      /* Change active layer to parcel and enable a viewport transition */
      dispatch(setViewport(
        {...viewport, latitude: lat, longitude: lon, zoom: 15, activeLayer: 'parcel',
          feature: {
            isTransitionInProgress: true,
            block: {
              latitude: lat,
              longitude: lon,
              properties: Object.assign({}, e?.features[0]?.properties),
              selected: e?.features[0]?.properties?.FIPS
            },
            parcel: {}
          }
        }
      ));
    }
    if (clickIsOffFeature) {
      console.info('here 2')
      /* Re-center map to clicked locaction */
      dispatch(setViewport(
        {...viewport, latitude: lat, longitude: lon, feature: {...feature, block: {}}}
      ));
    }
  }
  if (parcelLayerIsActive) {
    if (clickIsOnFeature) {
      console.info('here 3')
      const clickIsOnBlockFeature = !isNullOrWhitespace(feature?.block?.selected) ?? false;
      const clickIsOnParcelFeature = isNullOrWhitespace(e?.features[0].properties?.FIPS);
      if (clickIsOnParcelFeature) {
        console.info('here 4')
        dispatch(setViewport(
          {...viewport, activeLayer: 'parcel',
            feature: {
              isTransitionInProgress: false,
              block: {...feature.block},
              parcel: {
                latitude: lat,
                longitude: lon,
                properties: Object.assign({}, e?.features[0]?.properties),
                isPopupVisible: true
              }
            }
          }
        ));
      }
      else if (clickIsOnBlockFeature) {
        console.info('here 5')
        const clickedFeatureChanged = feature?.block?.selected !== e?.features[0].properties?.FIPS;
        const clickedFeatureDidNotChange = !clickedFeatureChanged;
        if (clickedFeatureChanged) {
          console.info('here 6')
          dispatch(setViewport(
            {...viewport, latitude: lat, longitude: lon, activeLayer: 'block',
              feature: {
                isTransitionInProgress: false,
                block: {...feature.block},
                parcel: {}
              }
            }
          ));
        }
        if (clickedFeatureDidNotChange) { console.info('here 7')}
      }
    }
    if (clickIsOffFeature) {
      console.info('here 8')
      dispatch(setViewport(
        {...viewport, latitude: lat, longitude: lon, activeLayer: 'block',
          feature: {
            block: {...feature.block, selected: null},
            parcel: {}
          }
        }
      ));
    }
  }
}