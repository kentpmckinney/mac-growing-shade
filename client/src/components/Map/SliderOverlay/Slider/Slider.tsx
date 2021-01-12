import { memo, useEffect, ChangeEvent } from "react";
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../state/store';
import { RootState } from '../../../../state/rootReducer';
import { updateSliderValue } from './SliderStateSlice';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import './Slider.scss';

type SliderProps = {
  min: number
  max: number
  label: string
  name: string
  unit: string
  width: string
  defaultValue: number
  step: number
  description: string
}

function Slider (props: SliderProps) {

  const unit = props.unit || '';
  const name = props.name || '';
  const dispatch = useAppDispatch();

  /* Use a URL query parameter as the default value if available */
  const location = useLocation();
  let value = parseInt(new URLSearchParams(location.search).get(name) || '') || props.defaultValue;  

  /* Write the slider's default value to the Redux store once after the component loads */
  useEffect(() => {
    dispatch(updateSliderValue({ name, value }))},
  []);

  /* Read the slider's value from the Redux store */
  const { sliders } = useSelector(
    (state: RootState) => state.sliders
  );
  const slider = sliders.filter(x => x.name === props.name)[0];
  if (slider !== undefined) {
    value = slider.value;
  }

  /* Write the slider's value to the Redux store as the value changes */
  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.currentTarget.value);
    dispatch(updateSliderValue({ name, value }));
  }

  /* Define a popover that lets the user click to see a description for the slider's value */
  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">{props.label}</Popover.Title>
      <Popover.Content>{props.description}</Popover.Content>
    </Popover>
  );

  return (
    <div className='slider-container'>

      {/* Show a label that can be clicked on to view a popover */}
      <OverlayTrigger trigger="click" placement="right" overlay={popover} rootClose>
        <div className='slider-label'>{props.label} <span>ⓘ</span></div>
      </OverlayTrigger>

      {/* Show the slider with min and max values on each side */}
      <div className='slider-with-min-max'>
        <span className='slider-min-value'>{props.min}</span>
        <RangeSlider
          min={props.min}
          max={props.max}
          value={value}
          step={props.step}
          size="sm"
          onChange={onChange}
          tooltip="on"
          tooltipLabel={(v: number) => `${v}${unit}`}
          variant='secondary'/> 
        <span className='slider-max-value'>{props.max}</span>
      </div>

    </div>
  );

}

export default memo(Slider);