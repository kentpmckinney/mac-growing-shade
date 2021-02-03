import { memo, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { Source, Layer, NavigationControl, InteractiveMap, Popup } from 'react-map-gl';
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
import { generateBlockLayerGeoJsonSourceUrl, generateParcelLayerGeoJsonSourceUrl, generateInteractiveLayerIds,
  generateBlockLayerFilter, generateTransitionProperties, updateUrlParams} from './mapFunctions';
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
  let { latitude, longitude, zoom, feature, activeLayer, style:mapStyleName } = viewport;
  const mapStyleUrl = useMemo(() => (mapStyleName === 'street') ? Config.mapStyle.street : Config.mapStyle.satellite, [mapStyleName]);

  /* Url params */
  useMount(() => onMount(viewport, dispatch, location));
  useMemo(() => updateUrlParams(sliderValues, viewport.latitude, viewport.longitude, viewport.zoom, mapStyleName),
    [sliderValues, viewport.latitude, viewport.longitude, viewport.zoom, mapStyleName]);

  /* Event handlers */
  const handleViewportChange = (e: any) => onViewportChange(e, mapStyleName, activeLayer, feature, dispatch);
  const handleMapClick = (e: any) => onMapClick(e, viewport, dispatch);
  const handleLoad = (e: any) => onLoad(e, dispatch, updateLoadingMessage);

  /* Map data */
  const mapProps = useMemo(() => ({...mapProperties}), [])
  const transitionProps = useMemo(() => 
    generateTransitionProperties(feature.isTransitionInProgress), [feature.isTransitionInProgress]);
  const blockLayerFilter = useMemo(() => generateBlockLayerFilter(sliderValues), [sliderValues]);
  const interactiveLayerIds = useMemo(() => generateInteractiveLayerIds(activeLayer), [activeLayer]);
  const blockLayerGeoJsonSourceUrl = useMemo(() => 
    generateBlockLayerGeoJsonSourceUrl(baseUrl, Config.postgresTableNames.blockLayer), []);
  const parcelLayerGeoJsonSourceUrl = useMemo(() => 
    /* @ts-ignore */
    generateParcelLayerGeoJsonSourceUrl(baseUrl, feature.block.properties), [feature.block.properties]);

console.log(viewport)

  return (
    <div className='map-container'>

      <InteractiveMap
        {...mapProps}
        {...transitionProps}
        zoom={zoom}
        scrollZoom={false}
        latitude={latitude}
        longitude={longitude}
        mapStyle={mapStyleUrl}
        interactiveLayerIds={interactiveLayerIds}
        onLoad={handleLoad}
        onClick={handleMapClick}
        onViewportChange={handleViewportChange} >

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

        { activeLayer && activeLayer === 'parcel' &&
          <Source id="parcel-source" type="geojson" data={parcelLayerGeoJsonSourceUrl}>
            <Layer {...parcelLayer} />
            { feature.parcel && feature.parcel.isPopupVisible &&
              <Popup
                closeOnClick={true}
                closeButton={false}
                latitude={feature.parcel.latitude || latitude}
                longitude={feature.parcel.longitude || longitude}
                onClose={() => dispatch(setViewport(
                  {...viewport, feature: {...feature, parcel: {...feature.parcel, isPopupVisible: false}}}))
                }
                anchor="top" >
                  <div className='popup-text'>
                    {Object.entries(feature?.parcel?.properties ?? {}).map(([k, v]) => <div>{k}: {v}</div>)}
                  </div>
              </Popup> }
          </Source> }

      </InteractiveMap>

    </div>
  );

}

export default memo(Map);