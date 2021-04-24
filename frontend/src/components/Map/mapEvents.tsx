// import { MapLoadEvent } from 'react-map-gl';
import { setViewport, ViewportState } from './mapViewportStateSlice'
import { getUrlFloat, getUrlString, isNullOrWhitespace } from './mapFunctions'
import { AppDispatch } from '../../state/store'

/* Update viewport state in Redux as changes occur */
export const onViewportChange: Function = (
  v: ViewportState,
  mapStyleName: any,
  activeLayer: string,
  feature: any,
  dispatch: Function
) => {
  /* 

      if ( viewport.longitude < MyOverlay.maxBounds.minLongitude ) {
        viewport.longitude = MyOverlay.maxBounds.minLongitude;
      }
      else if ( viewport.longitude > MyOverlay.maxBounds.maxLongitude ) {
        viewport.longitude = MyOverlay.maxBounds.maxLongitude;
      }
      else if ( viewport.latitude < MyOverlay.maxBounds.minLatitude ) {
        viewport.latitude = MyOverlay.maxBounds.minLatitude;
      }
      else if ( viewport.latitude > MyOverlay.maxBounds.maxLatitude ) {
        viewport.latitude = MyOverlay.maxBounds.maxLatitude;
      }

      export const isOutOfMaxBounds = (latitude, longitude, maxBounds) => {
        const [[swLng, swLat], [neLng, neLat]] = maxBounds;
        return longitude < swLng || longitude > neLng || latitude < swLat || latitude > neLat;
      };

  */

  dispatch(
    setViewport({
      latitude: v.latitude,
      longitude: v.longitude,
      zoom: v.zoom,
      style: mapStyleName,
      activeLayer,
      feature: { ...feature, isTransitionInProgress: false }
    })
  )
}

/* Synchronize viewport settings with URL parameters on component mount */
export const onMount: Function = (viewport: any, dispatch: AppDispatch, location: any) => {
  const latitude = getUrlFloat('lat', location) || viewport.latitude
  const longitude = getUrlFloat('lon', location) || viewport.longitude
  const zoom = getUrlFloat('zoom', location) || viewport.zoom
  const mapStyleName = getUrlString('style', location) || viewport.style
  dispatch(setViewport({ ...viewport, latitude, longitude, zoom, style: mapStyleName }))
}

/* Updates the loading message after the map finishes loading */
export const onLoad = (e: any, dispatch: AppDispatch, updateLoadingMessage: Function) => {
  const isStyleLoaded = () => {
    e.target.style && e.target.style._loaded
      ? dispatch(updateLoadingMessage({ message: '' }))
      : window.setTimeout(isStyleLoaded, 500)
  }
  isStyleLoaded()
}

/* Handle interactive clicks or presses on the map */
export const onMapClick: Function = (e: any, viewport: any, dispatch: AppDispatch) => {
  const { feature, activeLayer } = viewport
  const transitionInProgress = feature?.isTransitionInProgress
  const blockLayerIsActive = !activeLayer || (activeLayer && activeLayer === 'block')
  const parcelLayerIsActive = !isNullOrWhitespace(activeLayer) && activeLayer === 'parcel'
  const clickIsOnFeature = e?.features[0]?.properties ?? false
  const clickIsOffFeature = !clickIsOnFeature
  const lat = e?.lngLat[1]
  const lon = e?.lngLat[0]

  if (transitionInProgress) {
    dispatch(
      setViewport(
        /* A transition calls onClick many times */
        { ...viewport, latitude: lat, longitude: lon }
      ) /* Keep logic minimal */
    )
    return
  }

  if (blockLayerIsActive) {
    if (clickIsOnFeature) {
      dispatch(
        setViewport(
          /* A feature was clicked so do a FlyTo transition and show the parcels */
          {
            ...viewport,
            latitude: lat,
            longitude: lon,
            zoom: 15,
            activeLayer: 'parcel' /* Change active layer to parcel */,
            feature: {
              isTransitionInProgress: true /* enable a viewport transition */,
              block: {
                latitude: lat,
                longitude: lon,
                properties: Object.assign(
                  {},
                  e?.features[0]?.properties
                ) /* Retain the block's properties */,
                selected:
                  e?.features[0]?.properties?.FIPS /* Record the FIPS id of the clicked block */
              },
              parcel: {}
            }
          }
        )
      )
    }
    if (clickIsOffFeature) {
      dispatch(
        setViewport(
          /* Re-center map to clicked locaction */
          { ...viewport, latitude: lat, longitude: lon, feature: { ...feature, block: {} } }
        )
      )
    }
    return
  }

  if (parcelLayerIsActive) {
    if (clickIsOnFeature) {
      const clickIsOnBlockFeature = !isNullOrWhitespace(feature?.block?.selected)
      const clickIsOnParcelFeature = isNullOrWhitespace(e?.features[0].properties?.FIPS)
      if (clickIsOnParcelFeature) {
        dispatch(
          setViewport(
            /* A parcel was clicked so show a popup */
            {
              ...viewport,
              activeLayer: 'parcel',
              feature: {
                isTransitionInProgress: false,
                block: { ...feature.block } /* Retain the currently selected block */,
                parcel: {
                  latitude: lat,
                  longitude: lon,
                  properties: Object.assign(
                    {},
                    e?.features[0]?.properties
                  ) /* Retain the feature's properties */,
                  isPopupVisible: true /* Show a popup */
                }
              }
            }
          )
        )
      } else if (clickIsOnBlockFeature) {
        const clickedFeatureChanged = feature?.block?.selected !== e?.features[0].properties?.FIPS
        const clickedFeatureDidNotChange = !clickedFeatureChanged
        if (clickedFeatureChanged) {
          dispatch(
            setViewport(
              /* Clicked on a different feature so hide parcels and re-center to new location */
              {
                ...viewport,
                latitude: lat,
                longitude: lon,
                activeLayer: 'block',
                feature: {
                  isTransitionInProgress: false,
                  block: { ...feature.block } /* Retain the currently selected block */,
                  parcel: {}
                }
              }
            )
          )
        }
        if (clickedFeatureDidNotChange) {
          /* Ignore */
        }
      }
    }
    if (clickIsOffFeature) {
      dispatch(
        setViewport(
          /* Clicked on a non-feature so hide parcels and re-center to new location */
          {
            ...viewport,
            latitude: lat,
            longitude: lon,
            activeLayer: 'block',
            feature: {
              block: {
                ...feature.block,
                selected: null
              } /* Nullify the currently selected block */,
              parcel: {}
            }
          }
        )
      )
    }
    return
  }
}
