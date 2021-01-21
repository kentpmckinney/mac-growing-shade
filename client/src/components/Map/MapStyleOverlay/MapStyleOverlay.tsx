import { BaseControl } from 'react-map-gl';
import StyleToggle from './StyleToggle/StyleToggle';

class MapStyleOverlay extends BaseControl<any, any> {

  _render() {

    return (
      <div className='style-overlay-container' ref={this._containerRef} /* ref stops propagation of mouse/touch events */>
        <StyleToggle/>
      </div>
    );

  }
  
}

export default MapStyleOverlay;