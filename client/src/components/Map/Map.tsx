import { memo } from "react";
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
import './Map.scss';
// @ts-ignore
import * as styleVars from './MapColors.scss';

//import { Feature, Geometry, GeoJsonProperties } from "geojson";

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

  const sliderValue = 50;
  const _stops1 = [
    [1, styleVars.parcelStop1],
    [2, styleVars.parcelStop2],
    [3, styleVars.parcelStop3],
    [4, styleVars.parcelStop4],
    [5, styleVars.parcelStop5],
    [6, styleVars.parcelStop6],
    [7, styleVars.parcelStop7],
  ];
  console.info(_stops1[2][1])
  const _stops = [
    [1, '#f6d2a9'],
    [2, '#f5b78e'],
    [3, '#f19c7c'],
    [4, '#ea8171'],
    [5, '#dd686c'],
    [6, '#ca5268'],
    [7, '#b13f64'],
  ];

 const geoJsonDataSourceUrl = `${window.location.protocol}//${window.location.host.replace('3000', '5000')}` +
   `/api/geojson?layer=block_groups_2010_test`;

  // const handleMapHover = (info: any) => {
  //   info.features[0].layer.paint["fill-outline-color"] = "#000"
  // }

  const handleMapClick = (info: any) => {
    dispatch(setViewport(
      {latitude: info.lngLat[1], longitude: info.lngLat[0], zoom: 14, style: mapStyleName}
    ));
  }

  return (
    <div className='map-container'>
      <ReactMapGL
        ref={ref => console.log(ref)}
        latitude={latitude}
        longitude={longitude}
        zoom={zoom}
        width='100%'
        height='100%'
        onViewportChange={onViewportChange}
        mapboxApiAccessToken={Config.mapboxPublicToken}
        mapStyle={mapStyleUrl}
        transitionDuration={2000}
        transitionInterpolator={new FlyToInterpolator()}
        transitionEasing={easeCubic}
        interactiveLayerIds={['censusBlockGroups']}
        // onHover={handleMapHover}
        onClick={handleMapClick}
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
          <Source id="my-data" type="geojson" data={geoJsonDataSourceUrl}>
          <Layer
              key="parcel-layer"
              id="censusBlockGroups"
              type="fill"
              minzoom={10}
              paint={{
                "fill-color": {
                  property: "own_group",
                  stops: _stops,
                },
                "fill-opacity": sliderValue / 100,
                "fill-outline-color": "rgba(255,255,255,1)",
              }}
              filter={['all',
                ['>=', 'UHI', sliderValues[1]?.value],
                ['>=', 'API', sliderValues[2]?.value],
                ['>=', 'HH_INCOME', sliderValues[3]?.value],
                ['>=', 'BIPOC', sliderValues[4]?.value]
              ]}
            />
          </Source>

      </ReactMapGL>
    </div>
  );

}

export default memo(Map);