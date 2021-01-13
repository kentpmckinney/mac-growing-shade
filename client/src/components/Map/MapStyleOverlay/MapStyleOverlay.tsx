import { BaseControl } from 'react-map-gl';
import StyleToggle from './StyleToggle/StyleToggle';

class MapStyleOverlay extends BaseControl<any, any> {

  _render() {

    return (
      /* ref={this._containerRef} stops mouse/touch events over the control propagating to the map */
      <div ref={this._containerRef} className='style-overlay-container'>
        <StyleToggle/>
      </div>
    );
  }
  
}

export default MapStyleOverlay;