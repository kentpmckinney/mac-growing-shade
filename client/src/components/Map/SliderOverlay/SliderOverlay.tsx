import { Fragment } from 'react';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Slider, { SliderProps } from './Slider/Slider';
import AccordionToggle from './AccordionToggle/AccordionToggle';
import { BaseControl } from 'react-map-gl';
import * as Config from '../../../config/application.json';
import './SliderOverlay.scss';
import './AccordionToggle/AccordionToggle.scss';

type SliderDefinition = SliderProps;

type SliderDefinitionSet = {
  name: string
  sliders: SliderDefinition[]
}

class SliderOverlay extends BaseControl<any, any> {
  constructor(props: any) {
    super(props);
    this.sliderDefinitionSets = Config.sliderSets;
  }

  sliderDefinitionSets: SliderDefinitionSet[];

  _render() {
    return (
      /* ref={this._containerRef} stops mouse/touch events over the control propagating to the map */
      <div className='slider-overlay-container' ref={this._containerRef}>
        <Accordion defaultActiveKey='0'>
          <Card>
            <Card.Header>
              <div className="slider-overlay-header">
                <AccordionToggle eventKey='0' />
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey='0'>
              <Card.Body>
                <div className="slider-overlay-body">

                  {/* Dynamically render sliders as they can change based on context */}
                  {this.sliderDefinitionSets.map((sliderDefinitionSet) => 
                    <Fragment>
                      <div className='slider-overlay-section-label'>{sliderDefinitionSet.name}</div>
                      <br/>
                      {sliderDefinitionSet.sliders.map((s) => 
                        <Slider
                          min={s.min} max={s.max} defaultValue={s.defaultValue} step={s.step} name={s.name}
                          label={s.label} unit={s.unit} width={s.width} description={s.description}
                        />
                      )}
                    </Fragment>
                  ).reduce((a: any, c: any) => [...a, <hr/>, c], []).slice(1)} {/* Join slider sets with <hr/> */}
                  {/* The above reduce() always produces an extra leading <hr/> due to starting [] value hence the slice */}
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