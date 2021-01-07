import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Slider from './Slider';
import {BaseControl} from 'react-map-gl';

class ControlOverlay extends BaseControl<any, any> {
    state = { value: 50 }
    // Instead of implementing render(), implement _render()
    _render() {
      
      const {viewport} = this._context;
      // _containerRef registers event listeners for map interactions
      return (
        <div className="control-panel-container" ref={this._containerRef}>
          <Card>
            <Card.Body>
              <div>Environmental</div>
              <Slider label='Canopy Cover (%)' unit='%' width='150px'/>
              <div>Urban Heat Index</div>
              <div>0 <input type="range"/> 10</div>
              <div>Air Pollution Index</div>
              <div>0 <input type="range"/> 10</div>
              <div>Social</div>
              <div>Median Household Income</div>
              <div>0 <input type="range"/> 260000</div>
              <div>People of Color (%)</div>
              <div>0 <input type="range"/> 100</div>
            </Card.Body>
          </Card>
        </div>
      );
    }
  }

  export default ControlOverlay;