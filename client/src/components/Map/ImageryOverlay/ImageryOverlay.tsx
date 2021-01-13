import { BaseControl } from 'react-map-gl';
import ImageryToggle from './ImageryToggle/ImageryToggle';

type ImageryOverlayProps = {}

class ImageryOverlay extends BaseControl<any, any> {
  constructor(props: ImageryOverlayProps) {
    super(props);
  }

  _render() {

    return (
      /* ref={this._containerRef} stops mouse/touch events over the control propagating to the map */
      <div ref={this._containerRef} className='imagery-overlay-container'>
        <ImageryToggle/>
      </div>
    );
  }
  
}

export default ImageryOverlay;