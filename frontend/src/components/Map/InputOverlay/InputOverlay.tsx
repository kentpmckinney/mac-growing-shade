import { RefObject } from 'react'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import Slider from './Slider/Slider'
import AccordionToggle from './AccordionToggle/AccordionToggle'
import Toggle from './Toggle/Toggle'
import { BaseControl } from 'react-map-gl'
import * as Config from '../../../config/application.json'
import './InputOverlay.scss'
import './AccordionToggle/AccordionToggle.scss'

export type Input = {
  name: string
  label: string
  width: string
  description: string
  table: string
  column: string
  min?: number
  max?: number
  unit?: string
  defaultValue?: any
  step?: number
  display?: string[]
  left?: string
  center?: string
  right?: string
  type?: string
}

type InputSet = {
  name: string
  inputs: Input[]
}

const baseUrl = `${window.location.protocol}//${window.location.host.replace('3000', '5000')}`
const serverStatusUrl = `${baseUrl}/api/status`

class InputOverlay extends BaseControl {
  [x: string]: any
  state = { inputDefinitionSets: [] as InputSet[] }

  componentDidMount(): any {
    /* Query the server for its status and also to get the dynamic min/max values for each slider which is part of the server response */
    fetch(serverStatusUrl)
      .then(r => r.json())
      .then(j => {
        const dynamicMinMaxValues = j.inputMinMaxValues
        /* Create a copy of the slider definitions from the config file and then inject the min and max values so they are dynamic rather than hard-coded */
        const finalInputSets = Config.inputSets.map((set: any) => {
          /* This first map iterates through each slider set in the config file */
          return {
            name: set.name,
            inputs: [
              ...set.inputs.map((configInput: Input) => {
                /* This second map iterates through each individual slider in the config file and it replaces the min and max values as it maps */
                return {
                  ...configInput,
                  min: dynamicMinMaxValues.filter((d: Input) => d.name === configInput.name)[0].min,
                  max: dynamicMinMaxValues.filter((d: Input) => d.name === configInput.name)[0].max
                }
              })
            ]
          }
        })
        this.setState({ inputDefinitionSets: finalInputSets })
      })
      .catch(e => `Error fetching /api/status: ${console.error(e)}`)
  }

  _render(): any {
    return (
      <div
        className='input-overlay-container'
        ref={this._containerRef as RefObject<HTMLDivElement>}>
        <Accordion defaultActiveKey='0'>
          <Card>
            <Card.Header>
              <div className='input-overlay-header'>
                <AccordionToggle eventKey='0' />
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey='0'>
              <Card.Body className='card-body'>
                <div className='input-overlay-body'>
                  {/* Dynamically render sliders as they can change based on context */}
                  {this.state.inputDefinitionSets.map((inputDefinitionSet: any, i: number) => (
                    <div key={`sliderSet-${i}`}>
                      <div className='input-overlay-section-label'>{inputDefinitionSet.name}</div>
                      <br />
                      {inputDefinitionSet.inputs
                        .filter((e: any) => e.display.includes(this.props.activeLayer))
                        .map((s: any, j: number) =>
                          s.type === 'slider' ? (
                            <Slider
                              key={`slider-${j}`}
                              min={s.min}
                              max={s.max}
                              defaultValue={s.defaultValue}
                              step={s.step}
                              name={s.name}
                              label={s.label}
                              unit={s.unit}
                              width={s.width}
                              description={s.description}
                              table={s.table}
                              column={s.column}
                              display={s.display}
                            />
                          ) : (
                            <Toggle
                              key={`toggle-${j}`}
                              name={s.name}
                              label={s.label}
                              left={s.left}
                              center={s.center}
                              right={s.right}
                              table=''
                              column={s.column}
                              description={s.description}
                            />
                          )
                        )}
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    )
  }
}

export default InputOverlay
