import { BaseControl } from 'react-map-gl';
import ImageryToggle from './ImageryToggle/ImageryToggle';
import './ImageryOverlay.scss';

class ImageryOverlay extends BaseControl<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { enableSatelliteTerrain: true };
  }

  _render() {

    return (
      /* ref={this._containerRef} stops mouse/touch events over the control propagating to the map */
      <div ref={this._containerRef}>
        <ImageryToggle/>
      </div>
    );
  }
  
}

export default ImageryOverlay;