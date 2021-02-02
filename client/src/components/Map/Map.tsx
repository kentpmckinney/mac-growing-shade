import { memo, useMemo, Fragment } from "react";
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { Source, Layer, NavigationControl, InteractiveMap, FlyToInterpolator, Popup } from 'react-map-gl';
import { easeCubic } from 'd3-ease';
import SliderOverlay from './SliderOverlay/SliderOverlay';
import MapStyleOverlay from './MapStyleOverlay/MapStyleOverlay';
import InfoOverlay from './InfoOverlay/InfoOverlay';
import LoadingIndicator from './LoadingIndicator/LoadingIndicator';
import { useAppDispatch } from '../../state/store';
import { setViewport, ViewportState } from './mapViewportStateSlice';
import { updateLoadingMessage } from './LoadingIndicator/LoadingIndicatorStateSlice';
import * as Config from '../../config/application.json';
import { RootState } from '../../state/rootReducer';
import { baseUrl, blockLayer, blockOutlineLayer, parcelLayer, mapProperties } from './mapVariables';
import { generateBlockLayerGeoJsonSourceUrl, generateParcelLayerGeoJsonSourceUrl, updateUrlParams, generateBlockLayerFilter } from './mapFunctions';
import { onViewportChange, onMount, onMapClick, onLoad } from './mapEvents';
import './Map.scss';

/* The following lines work around a bug in recent versions of react-map-gl that prevents running on Heroku */
import mapboxgl from 'mapbox-gl';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

function Map () {

  const dispatch = useAppDispatch();
  const location = useLocation();

  /* Read settings from the Redux store */
  const viewport: ViewportState = useSelector((state: RootState) => state.viewport);
  const sliderValues = useSelector((state: RootState) => state.sliders).sliders;
  let { latitude, longitude, zoom, selectedFeature, transition, style:mapStyleName } = viewport;
  const mapStyleUrl = (mapStyleName === 'street') ? Config.mapStyle.street : Config.mapStyle.satellite;

  useMount(() => onMount(viewport, dispatch, location));
  useMemo(() => updateUrlParams(sliderValues, viewport.latitude, viewport.longitude, viewport.zoom, mapStyleName),
   [sliderValues, viewport.latitude, viewport.longitude, viewport.zoom, mapStyleName]);

  const handleViewportChange = (e: any) => onViewportChange(e, mapStyleName, selectedFeature, dispatch);
  const handleMapClick = (e: any) => onMapClick(e, viewport, selectedFeature, dispatch);
  const handleLoad = (e: any) => onLoad(e, dispatch, updateLoadingMessage);

  const blockLayerGeoJsonSourceUrl = generateBlockLayerGeoJsonSourceUrl(baseUrl, Config.postgresTableNames.blockLayer);
  const parcelLayerGeoJsonSourceUrl = generateParcelLayerGeoJsonSourceUrl(baseUrl, selectedFeature.fips);
  const blockLayerFilter = useMemo(() => generateBlockLayerFilter(sliderValues), [sliderValues]);
  const mapProps = useMemo(() => ({...mapProperties}), [])

  return (
    <div className='map-container'>

      <InteractiveMap
        {...mapProps}
        zoom={zoom}
        latitude={latitude}
        longitude={longitude}
        mapStyle={mapStyleUrl}
        onClick={handleMapClick}
        onViewportChange={handleViewportChange}   
        scrollZoom={false}
        onLoad={handleLoad}
        interactiveLayerIds={ (selectedFeature.fips.length > 0 ) ? ['parcel-layer'] : ['block-layer'] }
        { ...
          (transition)
          ? {
              transitionDuration: 1000,
              transitionInterpolator: new FlyToInterpolator(),
              transitionEasing: easeCubic
            }
          : { transitionDuration: 0 }
        }
      >

        {/* The data and map loading indicator */}
        <div className='centered-container'>
          <div className='loading-indicator'>
            <LoadingIndicator/>
          </div>
        </div>

        {/* The overlay containing the sliders */}
        {/* @ts-ignore */}
        <SliderOverlay captureClick={true} captureScroll={true} captureDrag={true}/>
        
        {/* Overlay components in the upper-right that respond to viewport changes as a group */}
        <div className='overlay-group'>

          {/* The overlay containing an interface to choose the style of the map */}
          <div className='style-overlay'>
            <MapStyleOverlay/>
          </div>

          {/* The overlay containing the info guide */}
          <div className='info-overlay'>
            <InfoOverlay/>
          </div>

          {/* The navigation control with zoom in/out */}
          <div className='navigation-control'>
            <NavigationControl showCompass={false}/>
          </div>

        </div>

        {/* Data source and interactive layer */}
        <Source id="block-source" type="geojson" data={blockLayerGeoJsonSourceUrl}>
          <Layer {...blockOutlineLayer} filter={blockLayerFilter} />
          <Layer {...blockLayer} filter={blockLayerFilter} />
        </Source>

        {
          (selectedFeature.fips.length > 0)
            ?
          <Source id="parcel-source" type="geojson" data={parcelLayerGeoJsonSourceUrl}>
            <Layer {...parcelLayer} />
            {
              (selectedFeature.showPopup)
                ?
              <Popup closeOnClick={true} closeButton={false} anchor="top"
                latitude={selectedFeature.latitude || latitude} longitude={selectedFeature.longitude || longitude}
                onClose={() => dispatch(setViewport({...viewport, selectedFeature: {...selectedFeature, showPopup: false}}))}
              >
                <div>popup</div>
              </Popup>
                :
              <Fragment/>
            }
          </Source>
            :
          <Fragment/>
        }

      </InteractiveMap>

    </div>
  );

}

export default memo(Map);