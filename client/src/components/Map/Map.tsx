import { memo, useState, useRef } from "react";
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactMapGL, { NavigationControl, Source, Layer } from 'react-map-gl';
import SliderOverlay from './SliderOverlay/SliderOverlay';
import ImageryOverlay from './ImageryOverlay/ImageryOverlay';
import InfoOverlay from './InfoOverlay/InfoOverlay';
import { RootState } from '../../state/rootReducer';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import './Map.scss';

type MapProps = {}

interface MapState {
  latitude: number
  longitude: number
  zoom: number
}

function Map (props: MapProps) {

  const mapRef = useRef();
  const onViewportChange = (v: any) => setViewport(v);
  const location = useLocation();

  /* The map's viewport state */
  const [viewport, setViewport] = useState({
    latitude: parseFloat(new URLSearchParams(location.search).get('lat') || '45.5099'),
    longitude: parseFloat(new URLSearchParams(location.search).get('lon') || '-122.4348'),
    zoom: parseFloat(new URLSearchParams(location.search).get('zoom') || '11')
  } as MapState);

  /* Read settings from the Redux store */
  const sliders = useSelector((state: RootState) => state.sliders).sliders;
  const imageryEnabled = useSelector((state: RootState) => state.imagery).enabled;

  /* Update the URL bar with slider values, lat, lon, and zoom level without triggering a render */
  window.history.replaceState(null, "Branch Out Gresham",
    "/map?" + new URLSearchParams(sliders.map(x => [x.name, x.value.toString()])).toString()
    + `&lat=${viewport.latitude}&lon=${viewport.longitude}&zoom=${viewport.zoom}`
  )
  
  /* Display state values to the console for development purposes */
  console.log(sliders);
  console.log(imageryEnabled);

  /* API key for MapBox */
  const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2VudHBtY2tpbm5leSIsImEiOiJjamV1ZzFyMmIxbjdkMnhwOTh5MjdnaHUyIn0.F_H5tFsVF3NyPDpy0nKKNg';

  /* Sample data for testing purposes */
  const data: any = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature', geometry: { type: 'Point', coordinates: [-122.4, 37.8]}
      }
    ]
  };
  
  /* Determine the style of the map to display */
  const imageryStyleUrl = 'mapbox://styles/mapbox/satellite-v9';
  const mapStyleUrl = 'mapbox://styles/kentpmckinney/ckjqgjo3452ue19o1elkq69kb';
  const mapStyle = imageryEnabled ? imageryStyleUrl : mapStyleUrl

  return (
    <div className='map-container'>
      <ReactMapGL
        {...viewport}
        width='100%'
        height='100%'
        onViewportChange={onViewportChange}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle={mapStyle}
        reuseMaps={true}>

          {/* The overlay containing the sliders */}
          <SliderOverlay captureScroll={true} captureClick={true}/>

          {/* The overlay containing help options */}
          <div className='info-overlay'>
            <InfoOverlay captureScroll={true} captureClick={true}/>
          </div>

          {/* The overlay containing an interface to choose between map and imagery */}
          <div className='imagery-overlay'>
            <ImageryOverlay captureScroll={true} captureClick={true}/>
          </div>

          {/* The navigation control with zoom in/out */}
          <div className='navigation-control'>
            <NavigationControl showCompass={false}/>
          </div>

          {/* A GeoJSON layer */}
          <Source id='route' type='geojson' data={data}>
            <Layer source='route' id='route' type='line'
              layout={{
              'line-join': 'round',
              'line-cap': 'round'
              }}
              paint={{
              'line-color': '#888',
              'line-width': 8
              }}
            />
          </Source>
      </ReactMapGL>
    </div>
  );

}

export default memo(Map);