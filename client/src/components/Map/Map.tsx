import { memo } from "react";
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactMapGL, { ContextViewportChangeHandler, NavigationControl, ViewportProps } from 'react-map-gl';
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

function Map () {

  /* Read settings from the Redux store */
  const viewport: ViewportState = useSelector((state: RootState) => state.viewport);
  const sliderValues = useSelector((state: RootState) => state.sliders).sliders;

  /* Synchronize viewport settings with URL parameters */
  const location = useLocation();
  const latitude = parseFloat(new URLSearchParams(location.search).get('lat') || '') || viewport.latitude;
  const longitude = parseFloat(new URLSearchParams(location.search).get('lon') || '') || viewport.longitude;
  const zoom = parseFloat(new URLSearchParams(location.search).get('zoom') || '') || viewport.zoom;
  const mapStyleName = new URLSearchParams(location.search).get('style') || viewport.style;
  const mapStyleUrl = (mapStyleName === 'street') ? Config.mapStyle.street : Config.mapStyle.satellite;

  /* Update the URL bar with viewport settings without triggering a render */
  window.history.replaceState(null, "Branch Out Gresham",
    "/map?" + new URLSearchParams(sliderValues.map(x => [x.name, x.value.toString()])).toString()
    + `&lat=${viewport.latitude}&lon=${viewport.longitude}&zoom=${viewport.zoom}&style=${mapStyleName}`
  );

  /* Update viewport state in Redux as changes occur */
  const dispatch = useAppDispatch();
  const onViewportChange: ContextViewportChangeHandler = (v: ViewportProps) => dispatch(setViewport(
    {latitude: v.latitude, longitude: v.longitude, zoom: v.zoom, style: mapStyleName}
  ));

  /* Display state values to the console for development purposes */
  console.log(sliderValues);
  console.log(viewport);

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

      </ReactMapGL>
    </div>
  );

}

export default memo(Map);