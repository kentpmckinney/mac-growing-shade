import { memo, useMemo, Fragment } from "react";
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { Source, Layer, NavigationControl, InteractiveMap } from 'react-map-gl';
import SliderOverlay from './SliderOverlay/SliderOverlay';
import MapStyleOverlay from './MapStyleOverlay/MapStyleOverlay';
import InfoOverlay from './InfoOverlay/InfoOverlay';
import LoadingIndicator from './LoadingIndicator/LoadingIndicator';
import { useAppDispatch } from '../../state/store';
import { setViewport, ViewportState } from './mapViewportStateSlice';
import { updateLoadingMessage } from './LoadingIndicator/LoadingIndicatorStateSlice';
import * as Config from '../../config/application.json';
import { RootState } from '../../state/rootReducer';
import { blockLayer, blockOutlineLayer, parcelLayer, mapProperties } from './mapStyle';
import './Map.scss';

/* The following lines work around a bug in recent versions of react-map-gl that prevents running on Heroku */
import mapboxgl from 'mapbox-gl';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const baseUrl = `${window.location.protocol}//${window.location.host.replace('3000', '5000')}`;
const blockLayerGeoJsonSourceUrl = `${baseUrl}/api/geojson?layer=${Config.postgresTableNames.blockLayer}`;

function Map () {

  /* Read settings from the Redux store */
  const viewport: ViewportState = useSelector((state: RootState) => state.viewport);
  const sliderValues = useSelector((state: RootState) => state.sliders).sliders;
  let latitude = viewport.latitude;
  let longitude = viewport.longitude;
  let zoom = viewport.zoom;
  let mapStyleName = viewport.style;
  let selectedFeature = viewport.selectedFeature;

  const parcelLayerGeoJsonSourceUrl = `${baseUrl}/api/geojson?fips=${selectedFeature}`;

  /* Synchronize viewport settings with URL parameters on component mount */
  const dispatch = useAppDispatch();
  const location = useLocation();
  const getUrlParam = ((p: string) => new URLSearchParams(location.search).get(p));
  const getUrlFloat = ((p: string) => parseFloat(getUrlParam(p) || ''));
  useMount(() => {
    latitude = getUrlFloat('lat') || viewport.latitude;
    longitude = getUrlFloat('lon') || viewport.longitude;
    zoom = getUrlFloat('zoom') || viewport.zoom;
    mapStyleName = getUrlParam('style') || viewport.style;
    dispatch(setViewport({ latitude, longitude, zoom, style: mapStyleName, selectedFeature: '' }));
  })
  const mapStyleUrl = (mapStyleName === 'street') ? Config.mapStyle.street : Config.mapStyle.satellite;
 
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
    {latitude: v.latitude, longitude: v.longitude, zoom: v.zoom, style: mapStyleName, selectedFeature: ''}
  ));

  /* Handle interactive clicks or presses on the map */
  const handleMapClick = (info: any) => {
    const fips = info?.features[0]?.properties?.FIPS || '';
    dispatch(setViewport(
      {latitude: info.lngLat[1], longitude: info.lngLat[0], zoom: 14, style: mapStyleName, selectedFeature: fips}
    ));
  }

  // const onHover = (info: any) => {
  //   console.log(info)
  // }

  const onLoad = (e: any) => {
    const isStyleLoaded = () => {
      e.target.style && e.target.style._loaded
        ? dispatch(updateLoadingMessage({ message: '' }))
        : window.setTimeout(isStyleLoaded, 500);
    }
    isStyleLoaded();
  }

  /* Get a reference to the underlying map */
  // const mapRef = createRef<any>();
  // useEffect(() => {
  //   if (mapRef && mapRef.current) {
  //     //const map = mapRef.current.getMap();
  //   }
  //   return undefined;
  // }, [mapRef]);

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

  /* Define map properties */
  const mapProps = useMemo(() => { return {
    ...mapProperties
  }}, [])

  // console.info(viewport);
  // console.info(sliderValues);
  // console.info(blockLayerFilter);
//        ref={mapRef}
  return (
    <div className='map-container'>

      <InteractiveMap
        {...mapProps}

        zoom={zoom}
        latitude={latitude}
        longitude={longitude}
        mapStyle={mapStyleUrl}
        onClick={handleMapClick}
        onViewportChange={onViewportChange}   
        scrollZoom={false}
        onLoad={onLoad}
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
        <Layer
            {...blockOutlineLayer}
            filter={blockLayerFilter}
          />
          <Layer
            {...blockLayer}
            filter={blockLayerFilter}
          />
        </Source>

        {
          (selectedFeature.length > 0)
            ?
          <Source id="parcel-source" type="geojson" data={parcelLayerGeoJsonSourceUrl}>
            <Layer
              {...parcelLayer}
            />
          </Source>
            :
          <Fragment/>
        }

      </InteractiveMap>

    </div>
  );

}

export default memo(Map);