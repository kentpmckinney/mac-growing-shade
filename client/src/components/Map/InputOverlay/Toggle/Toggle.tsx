import { memo, useMemo } from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import './Toggle.scss';

export type ToggleProps = {
  label: string
  description: string
  name: string
  left: string
  center: string
  right: string
}

function Toggle(props: ToggleProps) {

  /* Define a popover that lets the user click to see a description for the toggle's value */
  const popover: JSX.Element = useMemo(() => 
    <Popover id="popover-basic">
      <Popover.Title as="h3">{props.label}</Popover.Title>
      <Popover.Content>{props.description}</Popover.Content>
    </Popover>
  , [props.label, props.description]);

  return (
    <div className='toggle-container'>
      <fieldset className='toggle-fieldset'>
        <legend className='toggle-legend'>
          {/* Show a label that can be clicked on to view a popover */}
          <OverlayTrigger trigger="click" placement="right" overlay={popover} rootClose>
            <div className='toggle-label'>{props.label}<span>&nbsp;ⓘ</span></div>
          </OverlayTrigger>
        </legend>
        <div className="switch-toggle">
          <input id={`${props.name}-left`} name={props.name} type="radio" onClick={()=>{}}/>
          <label htmlFor={`${props.name}-left`}>{props.left}</label>
          <input id={`${props.name}-center`} name={props.name} type="radio" onClick={()=>{}} defaultChecked/>
          <label htmlFor={`${props.name}-center`}>{props.center}</label>
          <input id={`${props.name}-right`} name={props.name} type="radio" onClick={()=>{}}/>
          <label htmlFor={`${props.name}-right`}>{props.right}</label>
          <a className="toggle-button"/>
        </div>
      </fieldset>
    </div>
  );
}

export default memo(Toggle);