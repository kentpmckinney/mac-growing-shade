import { memo, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import ReactMapGL, { NavigationControl, Source, Layer } from 'react-map-gl';
import SliderOverlay from './SliderOverlay/SliderOverlay';
import { RootState } from '../../state/rootReducer';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import './Map.scss';

function Map (props: any) {

    const mapRef = useRef();
    const onViewportChange = (newViewport: any) => setViewport(newViewport);

    const data: any = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature', geometry: { type: 'Point', coordinates: [-122.4, 37.8]}
            }
        ]
      };

    const [viewport, setViewport] = useState({
        latitude: 45.5099,
        longitude: -122.4348,
        zoom: 11,
        bearing: 0,
        pitch: 0
    });

    /* Read the sliders' values from the Redux store */
    const { sliders } = useSelector(
        (state: RootState) => state.sliders
    );
    console.log(sliders);

    return (
        <div className='map-container'>
            <ReactMapGL
                {...viewport}
                width='100%'
                height='100%'
                onViewportChange={onViewportChange}
                mapboxApiAccessToken={'pk.eyJ1Ijoia2VudHBtY2tpbm5leSIsImEiOiJjamV1ZzFyMmIxbjdkMnhwOTh5MjdnaHUyIn0.F_H5tFsVF3NyPDpy0nKKNg'}
                mapStyle="mapbox://styles/kentpmckinney/ckjqgjo3452ue19o1elkq69kb"
                reuseMaps={true}>
                    <SliderOverlay captureScroll={true} captureClick={true}/>
                    <div className='navigation-control'>
                        <NavigationControl showCompass={false}/>
                    </div>
                    <Source id='route' type='geojson' data={data}>
                        <Layer
                            id='route'
                            type='line'
                            source='route'
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