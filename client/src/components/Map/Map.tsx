import { memo } from "react";
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMount } from 'react-use';
import ReactMapGL, { ContextViewportChangeHandler, NavigationControl, ViewportProps, Source, Layer } from 'react-map-gl';
import SliderOverlay from './SliderOverlay/SliderOverlay';
import MapStyleOverlay from './MapStyleOverlay/MapStyleOverlay';
import InfoOverlay from './InfoOverlay/InfoOverlay';
import sanitizeHtml from 'sanitize-html';
import { useAppDispatch } from '../../state/store';
import { setViewport, ViewportState } from './mapViewportStateSlice';
import * as Config from '../../config/application.json';
import { RootState } from '../../state/rootReducer';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import './Map.scss';
//import { Feature, Geometry, GeoJsonProperties } from "geojson";
import * as sampleJson from './geo.json';

function Map () {

  /* Read settings from the Redux store */
  const viewport: ViewportState = useSelector((state: RootState) => state.viewport);
  const sliderValues = useSelector((state: RootState) => state.sliders).sliders;
  let latitude = viewport.latitude;
  let longitude = viewport.longitude;
  let zoom = viewport.zoom;
  let mapStyleName = viewport.style;

  /* Synchronize viewport settings with URL parameters on component mount */
  const location = useLocation();
  useMount(() => {
    latitude = parseFloat(new URLSearchParams(location.search).get('lat') || '') || viewport.latitude;
    longitude = parseFloat(new URLSearchParams(location.search).get('lon') || '') || viewport.longitude;
    zoom = parseFloat(new URLSearchParams(location.search).get('zoom') || '') || viewport.zoom;
    mapStyleName = new URLSearchParams(location.search).get('style') || viewport.style;
  })
  const mapStyleUrl = (mapStyleName === 'street') ? Config.mapStyle.street : Config.mapStyle.satellite;
 
  /* Update the URL bar with viewport settings without triggering a render */
  try {
    window.history.replaceState(null, "Branch Out Gresham",
    "/map?" + new URLSearchParams(sliderValues.map(x => [x.name, x.value.toString()])).toString()
    + `&lat=${viewport.latitude}&lon=${viewport.longitude}&zoom=${viewport.zoom}&style=${mapStyleName}`
  );
  }
  catch (e) {
    console.error(`Error updating URL params. Details: ${e}`);
  }

  /* Update viewport state in Redux as changes occur */
  const dispatch = useAppDispatch();
  const onViewportChange: ContextViewportChangeHandler = (v: ViewportProps) => dispatch(setViewport(
    {latitude: v.latitude, longitude: v.longitude, zoom: v.zoom, style: mapStyleName}
  ));

  /* Display state values to the console for development purposes */
  console.log(sliderValues);
  console.log(viewport);

  // const geojson: Feature<Geometry, GeoJsonProperties> = {
  //     "type": "Feature" as const,
  //     "geometry": {
  //       "type": "Point" as const,
  //       "coordinates": [-122.4348, 45.5099]
  //     },
  //     "properties": {
  //       "name": "Coors Field",
  //       "amenity": "Baseball Stadium",
  //       "popupContent": "This is where the Rockies play!"
  //   },
  // };

  return (
    <div className='map-container'>
      <ReactMapGL
        latitude={latitude}
        longitude={longitude}
        zoom={zoom}
        width='100%'
        height='100%'
        onViewportChange={onViewportChange}
        mapboxApiAccessToken={Config.mapboxPublicToken}
        mapStyle={mapStyleUrl}
        mapOptions={{
          logoPosition: 'bottom-right',
          customAttribution: sanitizeHtml(Config.attribution, {
            allowedTags: [ 'b', 'i', 'em', 'strong', 'a' ],
            allowedAttributes: { 'a': ['href'] } 
          })
        }}
        reuseMaps={true}>
        
          {/* The overlay containing the sliders */}
          <SliderOverlay captureScroll={true} captureClick={true}/>

          {/* The overlay containing the info guide */}
          <div className='info-overlay'>
            <InfoOverlay captureScroll={true} captureClick={true}/>
          </div>

          {/* The overlay containing an interface to choose the style of the map */}
          <div className='imagery-overlay'>
            <MapStyleOverlay captureScroll={true} captureClick={true}/>
          </div>

          {/* The navigation control with zoom in/out */}
          <div className='navigation-control'>
            <NavigationControl showCompass={false}/>
          </div>
          
          {/* Data source and interactive layer */}
          <Source id="my-data" type="geojson" data={sampleJson.layers[0].geometryType}>
            <Layer
              id="point"
              type="circle"
              paint={{
                'circle-radius': 10,
                'circle-color': '#007cbf'
              }} />
          </Source>

      </ReactMapGL>
    </div>
  );

}

export default memo(Map);