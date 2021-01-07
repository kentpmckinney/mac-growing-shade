import { memo, useState } from "react";
import ReactMapGL from 'react-map-gl';
import ControlOverlay from './ControlOverlay/ControlOverlay';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import 'mapbox-gl-infobox/styles.css';
import './Map.scss';

const onMapLoad = (event: any) => console.log(event);

function Map (props: any) {
    const [viewport, setViewport] = useState({
        latitude: 45.5099,
        longitude: -122.4348,
        zoom: 11,
        bearing: 0,
        pitch: 0
    });
    return (
        <ReactMapGL
          {...viewport}
          width="100vw"
          height="100vh"
          onViewportChange={(viewport) => setViewport(viewport)}
          mapboxApiAccessToken={'pk.eyJ1Ijoia2VudHBtY2tpbm5leSIsImEiOiJjamV1ZzFyMmIxbjdkMnhwOTh5MjdnaHUyIn0.F_H5tFsVF3NyPDpy0nKKNg'}
          mapStyle="mapbox://styles/mapbox/light-v9"
          onLoad={onMapLoad}
          reuseMaps={true}>
            <ControlOverlay/>
        </ReactMapGL>
    );
}

export default memo(Map);