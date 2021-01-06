import { memo, useState } from "react";
import ReactMapGL from 'react-map-gl';

// eslint-disable-next-line
const onMapLoad = (event: any) => console.log(event);

function Map (props: any) {
  console.log(process.env);
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
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onLoad={onMapLoad}
          reuseMaps={true}
        />
    );
}

export default Map;//memo(Map);