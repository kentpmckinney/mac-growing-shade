import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Slider from './Slider/Slider';
import AccordionToggle from './AccordionToggle/AccordionToggle';
import { BaseControl } from 'react-map-gl';
import './SliderOverlay.scss';
import './AccordionToggle/AccordionToggle.scss';

class SliderOverlay extends BaseControl<any, any> {

  _render() {
    return (
      /* ref={this._containerRef} stops mouse/touch events over the control propagating to the map */
      <div className='slider-overlay-container' ref={this._containerRef}>
        <Accordion defaultActiveKey='0'>
          <Card>
            <Card.Header>
              <div className="slider-overlay-header">
                <AccordionToggle children={{}} eventKey='0' />
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey='0'>
              <Card.Body>
                <div className="slider-overlay-body">
                  <div className='slider-overlay-section-label'>Environmental</div>
                  <br/>
                  <Slider
                    min={0} max={100} defaultValue={50} step={1} name='treeCover' label='Tree Cover (%)' unit='%' width='240px'
                    description=''
                  />
                  <Slider
                    min={0} max={10} defaultValue={5} step={1} name='urbanHeatIndex' label='Urban Heat Index' unit='' width='240px'
                    description=''
                  />
                  <Slider
                    min={0} max={10} defaultValue={5} step={1} name='airPollutionIndex' label='Air Pollution Index' unit='' width='240px'
                    description=''
                  />
                  <hr/>
                  <div className='slider-overlay-section-label'>Social</div>
                  <br/>
                  <Slider
                    min={0} max={260000} defaultValue={50000} step={2000} name='medianIncome' label='Median Household Income' unit='' width='230px'
                    description=''
                  />
                  <Slider
                    min={0} max={100} defaultValue={50} step={1} name='peopleOfColor' label='People of Color (%)' unit='%' width='240px'
                    description=''
                  />
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    );
  }
  
}

export default SliderOverlay;