import { memo, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMount } from 'react-use';
import ReactMapGL, { Source, Layer, NavigationControl } from 'react-map-gl';
import SliderOverlay from './SliderOverlay/SliderOverlay';
import MapStyleOverlay from './MapStyleOverlay/MapStyleOverlay';
import InfoOverlay from './InfoOverlay/InfoOverlay';
import sanitizeHtml from 'sanitize-html';
import { useAppDispatch } from '../../state/store';
import { setViewport, ViewportState } from './mapViewportStateSlice';
import * as Config from '../../config/application.json';
import { RootState } from '../../state/rootReducer';
import './Map.scss';

// Below is regarding the bug in mapbox-gl and how to use the latest version of react-map-gl in Heroku:
import mapboxgl from 'mapbox-gl';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const baseUrl = `${window.location.protocol}//${window.location.host.replace('3000', '5000')}`;
const blockLayerGeoJsonSourceUrl = `${baseUrl}/api/geojson?layer=${Config.postgresTableNames.blockLayer}`;

// const _stops = [
//   [1, Colors.parcelStop1],
//   [2, Colors.parcelStop2],
//   [3, Colors.parcelStop3],
//   [4, Colors.parcelStop4],
//   [5, Colors.parcelStop5],
//   [6, Colors.parcelStop6],
//   [7, Colors.parcelStop7],
// ];

const mapProps = {
  width:'100%',
  height:'100%',
  mapboxApiAccessToken: Config.mapboxPublicToken,
  reuseMaps: true,
  interactiveLayerIds: ['blockLayer'],
  // transitionDuration: 2000,
  // transitionInterpolator: new FlyToInterpolator(),
  mapOptions: {
    logoPosition: 'bottom-right',
    customAttribution: sanitizeHtml(Config.attribution, {
      allowedTags: [ 'b', 'i', 'em', 'strong', 'a' ],
      allowedAttributes: { 'a': ['href'] } 
    })
  }
}

function Map () {

  /* Read settings from the Redux store */
  const viewport: ViewportState = useSelector((state: RootState) => state.viewport);
  const sliderValues = useSelector((state: RootState) => state.sliders).sliders;
  let latitude = viewport.latitude;
  let longitude = viewport.longitude;
  let zoom = viewport.zoom;
  let mapStyleName = viewport.style;

  /* Synchronize viewport settings with URL parameters on component mount */
  const dispatch = useAppDispatch();
  const location = useLocation();
  useMount(() => {
    latitude = parseFloat(new URLSearchParams(location.search).get('lat') || '') || viewport.latitude;
    longitude = parseFloat(new URLSearchParams(location.search).get('lon') || '') || viewport.longitude;
    zoom = parseFloat(new URLSearchParams(location.search).get('zoom') || '') || viewport.zoom;
    mapStyleName = new URLSearchParams(location.search).get('style') || viewport.style;
    dispatch(setViewport({ latitude, longitude, zoom, style: mapStyleName }));
  })
  const mapStyleUrl = (mapStyleName === 'street') ? Config.mapStyle.street : Config.mapStyle.satellite;
 
  //// TODO: SLIDER VALUES AREN'T BEING READ IN FROM THE URL BAR

  /* Update the URL bar with viewport settings without triggering a render */
  useMemo(() => {
    try {
      const sliderUrlValues = new URLSearchParams(
        sliderValues.map(x => [x.name, (x.value && x.value.min) ? `${x.value.min}-${x.value.max}` : ""])
      ).toString()
      window.history.replaceState(null, "Branch Out Gresham",
      "/map?" + sliderUrlValues + `&lat=${viewport.latitude}&lon=${viewport.longitude}&zoom=${viewport.zoom}&style=${mapStyleName}`
    );
    }
    catch (e) {
      console.error(`Error updating URL params. Details: ${e}`);
    }
  }, [sliderValues, viewport.latitude, viewport.longitude, viewport.zoom, mapStyleName])

  /* Update viewport state in Redux as changes occur */
  const onViewportChange: Function = (v: ViewportState) => dispatch(setViewport(
    {latitude: v.latitude, longitude: v.longitude, zoom: v.zoom, style: mapStyleName}
  ));

  /* Handle interactive clicks or presses on the map */
  const handleMapClick = (info: any) => {
    dispatch(setViewport(
      {latitude: info.lngLat[1], longitude: info.lngLat[0], zoom: 14, style: mapStyleName}
    ));
  }

  /*
    export const countiesLayer = {
      id: 'counties',
      type: 'fill',
      'source-layer': 'original',
      paint: {
        'fill-outline-color': 'rgba(0,0,0,0.1)',
        'fill-color': 'rgba(0,0,0,0.1)'
      }
    };
    // Highlighted county polygons
    export const highlightLayer = {
      id: 'counties-highlighted',
      type: 'fill',
      source: 'counties',
      'source-layer': 'original',
      paint: {
        'fill-outline-color': '#484896',
        'fill-color': '#6e599f',
        'fill-opacity': 0.75
      }
    };
  */

  /* Create a 'filter' for the Layer component in the map below which determines if a feature is shown on the map */
  /* The overall purpose of this is to map slider values to the data 'columns' they represent */
  /* The format is ['expression affecting all arguments', ['expression', column, value], ['expression', column, value], ...] */
  /* The first expression affects all subsequent arguments, and the expression within an argument affects 'column' and 'value' */
  /* 'All' means the feature will show if all of the other expressions are true, and those are all 'column >= value' */
  /* The 'filter' breaks if s.column is an empty string hence the Array.filter function to remove invalid entries */
  const blockLayerFilter = useMemo(() => [ 'all',
    ...sliderValues
      .flatMap(s => [['>=', s.column, s.value.min],['<=', s.column, s.value.max]])
      .filter(s => (typeof s === 'string') || (Array.isArray(s) && s.length >= 2 && s[1] !== ''))
  ], [sliderValues]);

  const onMapLoaded = (event: any) => {
    const map = event.target;
    map.setFeatureState({source: 'my-data', id: 'blockLayer'}, { hover: true});
  };

  console.info(viewport);
  console.info(sliderValues);
  console.info(blockLayerFilter);

  return (
    <div className='map-container'>

      <ReactMapGL
        {...mapProps}
        zoom={zoom}
        latitude={latitude}
        longitude={longitude}
        mapStyle={mapStyleUrl}
        onClick={handleMapClick}
        onViewportChange={onViewportChange}   
        onLoad={onMapLoaded} 
      >
        
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
        <Source id="my-data" type="geojson" data={blockLayerGeoJsonSourceUrl}>
          <Layer
            id="blockLayer"
            type="fill"
            minzoom={10}
            paint={{
              "fill-color": [
                'case',
                ["boolean", ["feature-state", "hover"], false], "#6dd0f7",
                "#1890d7"
              ],
              "fill-opacity": [
                'case',
                ["boolean", ["feature-state", "hover"], false], 0.3,
                0.6
              ],
              "fill-outline-color": [
                'case',
                ["boolean", ["feature-state", "hover"], false], "#2ebaaf",
                "#0095ce"
              ]
            }}
            filter={blockLayerFilter}
          />
          <Layer
            id="blockLayer-line"
            type="line"
            minzoom={10}
            paint={{
              "line-color": '#0076a3',
              "line-width": [
                'case',
                ["boolean", ["feature-state", "hover"], false], 5,
                3
              ]
            }}
            filter={blockLayerFilter}
          />
        </Source>

      </ReactMapGL>
    </div>
  );

}

export default memo(Map);