import { RefObject } from 'react';
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

const baseUrl = `${window.location.protocol}//${window.location.host.replace('3000', '5000')}`;
const serverStatusUrl = `${baseUrl}/api/status`;

class SliderOverlay extends BaseControl {
  [x: string]: any;
  state = { sliderDefinitionSets: [] as SliderDefinitionSet[]}

  componentDidMount() {
    /* Query the server for its status and also to get the dynamic min/max values for each slider which is part of the server response */
    fetch(serverStatusUrl).then(r => r.json()).then(j => {
      const dynamicMinMaxValues = j.sliderMinMaxValues;
      /* Create a copy of the slider definitions from the config file and then inject the min and max values so they are dynamic rather than hard-coded */
      const finalSliderSets =
        Config.sliderSets
          .map((set: any) => {
            /* This first map iterates through each slider set in the config file */
            return {
              name: set.name,
              sliders: [...set.sliders.map((configSlider: SliderDefinition) => {
                /* This second map iterates through each individual slider in the config file and it replaces the min and max values as it maps */
                return {
                  ...configSlider,
                  min: dynamicMinMaxValues.filter((dynamicSlider: SliderDefinition) => dynamicSlider.name === configSlider.name)[0].min,
                  max: dynamicMinMaxValues.filter((dynamicSlider: SliderDefinition) => dynamicSlider.name === configSlider.name)[0].max
                }
              })]
            }
          });
      this.setState({ sliderDefinitionSets: finalSliderSets });
    }).catch(e => `Error fetching /api/status: ${console.error(e)}`);
  }

  _render() {
    return (
      <div className='slider-overlay-container' ref={this._containerRef as RefObject<HTMLDivElement>} /* ref stops propagation of mouse/touch events */>
        <Accordion defaultActiveKey='0'>
          <Card>
            <Card.Header>
              <div className="slider-overlay-header">
                <AccordionToggle eventKey='0'></AccordionToggle>
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey='0'>
              <Card.Body>
                <div className="slider-overlay-body">

                  {/* Dynamically render sliders as they can change based on context */}
                  {this.state.sliderDefinitionSets.map((sliderDefinitionSet, i) => 
                    <div key={`sliderSet-${i}`}>
                      <div className='slider-overlay-section-label'>{sliderDefinitionSet.name}</div>
                      <br/>
                      {sliderDefinitionSet.sliders.map((s, j) => 
                        <Slider key={`slider-${j}`}
                          min={s.min} max={s.max} defaultValue={s.defaultValue} step={s.step} name={s.name}
                          label={s.label} unit={s.unit} width={s.width} description={s.description}
                          table={s.table} column={s.column}
                        />
                      )}
                    </div>
                  ).reduce((a: any, c: any, i: number) => [...a, <hr key={`hr-${i}`}/>, c], []).slice(1)} {/* Join slider sets with <hr/> */}
                  {/* The above reduce() always produces an extra leading <hr/> due to the starting [] value hence the slice */}

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