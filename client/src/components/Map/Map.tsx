import { memo, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMount } from 'react-use';
import ReactMapGL, { ContextViewportChangeHandler, NavigationControl, ViewportProps, Source, Layer, FlyToInterpolator } from 'react-map-gl';
import { easeCubic } from 'd3-ease';
import SliderOverlay from './SliderOverlay/SliderOverlay';
import MapStyleOverlay from './MapStyleOverlay/MapStyleOverlay';
import InfoOverlay from './InfoOverlay/InfoOverlay';
import sanitizeHtml from 'sanitize-html';
import { useAppDispatch } from '../../state/store';
import { setViewport, ViewportState } from './mapViewportStateSlice';
import * as Config from '../../config/application.json';
import { RootState } from '../../state/rootReducer';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import Colors from './Colors.module.scss';
import './Map.scss';

// Below is regarding the bug in mapbox-gl and how to use the latest version of react-map-gl in Heroku (currently using a downgraded version instead):
// https://github.com/mapbox/mapbox-gl-js/issues/10173
//Just making it super concrete for future create-react-users that come across this, a non-eject production build solution is to import mapboxgl like this:
//import 'mapbox-gl/dist/mapbox-gl.css';
//import mapboxgl from 'mapbox-gl';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
//mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
// @rsippl - wow! thanks for the tip! I had added it before my imports (specifically AFTER the mapbox-gl import). I really appreciate that!

const baseUrl = `${window.location.protocol}//${window.location.host.replace('3000', '5000')}`;
const blockLayerGeoJsonSourceUrl = `${baseUrl}/api/geojson?layer=${Config.postgresTableNames.blockLayer}`;

const _stops = [
  [1, Colors.parcelStop1],
  [2, Colors.parcelStop2],
  [3, Colors.parcelStop3],
  [4, Colors.parcelStop4],
  [5, Colors.parcelStop5],
  [6, Colors.parcelStop6],
  [7, Colors.parcelStop7],
];

const mapProps = {
  width:'100%',
  height:'100%',
  mapboxApiAccessToken: Config.mapboxPublicToken,
  reuseMaps: true,
  interactiveLayerIds: ['blockLayer'],
  transitionDuration: 2000,
  transitionInterpolator: new FlyToInterpolator(),
  transitionEasing: easeCubic,
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
 
  /* Update the URL bar with viewport settings without triggering a render */
  useMemo(() => {
    try {
      window.history.replaceState(null, "Branch Out Gresham",
      "/map?" + new URLSearchParams(sliderValues.map(x => [x.name, x.value.toString()])).toString()
      + `&lat=${viewport.latitude}&lon=${viewport.longitude}&zoom=${viewport.zoom}&style=${mapStyleName}`
    );
    }
    catch (e) {
      console.error(`Error updating URL params. Details: ${e}`);
    }
  }, [sliderValues, viewport.latitude, viewport.longitude, viewport.zoom, mapStyleName])

  /* Update viewport state in Redux as changes occur */
  const onViewportChange: ContextViewportChangeHandler = (v: ViewportProps) => dispatch(setViewport(
    {latitude: v.latitude, longitude: v.longitude, zoom: v.zoom, style: mapStyleName}
  ));

  /* Handle interactive clicks or presses on the map */
  const handleMapClick = (info: any) => {
    dispatch(setViewport(
      {latitude: info.lngLat[1], longitude: info.lngLat[0], zoom: 14, style: mapStyleName}
    ));
  }

  /* Create a 'filter' for the Layer component in the map below which determines if a feature is shown on the map */
  /* The overall purpose of this is to map slider values to the data 'columns' they represent */
  /* The format is ['expression affecting all arguments', ['expression', column, value], ['expression', column, value], ...] */
  /* The first expression affects all subsequent arguments, and the expression within an argument affects 'column' and 'value' */
  /* 'All' means the feature will show if all of the other expressions are true, and those are all 'column >= value' */
  /* The 'filter' breaks if s.column is an empty string hence the Array.filter function to remove invalid entries */
  const blockLayerFilter = useMemo(() => [ 'all',
    ...sliderValues
      .map(s => ['>=', s.column, s.value])
      .filter(s => (typeof s === 'string') || (Array.isArray(s) && s.length >= 2 && s[1] !== ''))
  ], [sliderValues]);

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
      >
        
        {/* The overlay containing the sliders */}
        <SliderOverlay captureScroll={true} captureClick={true}/>

        {/* Overlay components in the upper-right that respond to viewport changes as a group */}
        <div className='overlay-group'>

          {/* The overlay containing an interface to choose the style of the map */}
          <div className='style-overlay'>
            <MapStyleOverlay captureScroll={true} captureClick={true}/>
          </div>

          {/* The overlay containing the info guide */}
          <div className='info-overlay'>
            <InfoOverlay captureScroll={true} captureClick={true}/>
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
              "fill-color": {
                property: "own_group",
                stops: _stops,
              },
              "fill-opacity": 30 / 100,
              "fill-outline-color": "rgba(255,255,255,1)",
            }}
            filter={blockLayerFilter}
          />
        </Source>

      </ReactMapGL>
    </div>
  );

}

export default memo(Map);