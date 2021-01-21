import { memo, useMemo, ChangeEvent } from "react";
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { useAppDispatch } from '../../../../state/store';
import { RootState } from '../../../../state/rootReducer';
import { updateSliderValue, SliderItem, SliderCollection } from './SliderStateSlice';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import RangeSlider, { RangeSliderProps } from 'react-bootstrap-range-slider';
import './Slider.scss';

export type SliderProps = {
  min: number
  max: number
  label: string
  name: string
  unit: string
  width: string
  defaultValue: number
  step: number
  description: string
  table: string
  column: string
}

function Slider (props: SliderProps) {

  const unit = props.unit || '';
  const name = props.name || '';
  const table = props.table || '';
  const column = props.column || '';
  const dispatch = useAppDispatch();

  /* Distinguish between monetary and other types of units */
  const monetaryUnit = (unit === '$') ? '$' : '';
  const otherUnit = (unit !== '$') ? unit : '';

  /* Use a URL query parameter as the default value if available */
  const location = useLocation();
  let value = parseInt(new URLSearchParams(location.search).get(name) || '') || props.defaultValue;  

  /* Write the slider's default value to the Redux store on component mount */
  useMount((): void => {
      dispatch(updateSliderValue({ name, value, table, column }))
    }
  );

  /* Read the slider's value from the Redux store */
  const { sliders } = useSelector( (state: RootState): SliderCollection => state.sliders );
  const slider = sliders.filter( (x: SliderItem): boolean => x.name === props.name )[0];
  if (slider !== undefined) { value = slider.value; }

  /* Write the slider's value to the Redux store as the value changes */
  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.currentTarget.value);
    dispatch( updateSliderValue( { name, value, table, column } ) );
  }

  /* Define a popover that lets the user click to see a description for the slider's value */
  const popover: JSX.Element = useMemo(() => 
    <Popover id="popover-basic">
      <Popover.Title as="h3">{props.label}</Popover.Title>
      <Popover.Content>{props.description}</Popover.Content>
    </Popover>
  , [props.label, props.description]);

  /* Props for the RangeSlider component */
  const sliderProps: Partial<RangeSliderProps> = useMemo(() => {
    return {
      size: "sm",
      variant: "secondary",
      min: props.min,
      max: props.max,
      value: value,
      step: props.step,
      tooltip: "on",
      tooltipLabel: (v: number) => `${monetaryUnit}${v}${otherUnit}`
    }
  }, [props.min, props.max, props.step, value, monetaryUnit, otherUnit])

  return (
    <div className='slider-container' key={`slider-${name}`}>

      {/* Show a label that can be clicked on to view a popover */}
      <OverlayTrigger trigger="click" placement="right" overlay={popover} rootClose>
        <div className='slider-label'>{props.label} <span>ⓘ</span></div>
      </OverlayTrigger>

      {/* Show the slider with min and max values on each side */}
      <div className='slider-with-min-max'>
        <span className='slider-min-value'>{monetaryUnit}{props.min}{otherUnit}</span>
        <RangeSlider {...sliderProps} onChange={onChange}/> 
        <span className='slider-max-value'>{monetaryUnit}{props.max}{otherUnit}</span>
      </div>

    </div>
  );

}

export default memo(Slider);