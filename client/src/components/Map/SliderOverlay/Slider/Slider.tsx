import { memo, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { useAppDispatch } from '../../../../state/store';
import { RootState } from '../../../../state/rootReducer';
import { updateSliderValue, SliderItem, SliderCollection, SliderValue } from './SliderStateSlice';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import './Slider.scss';

export type SliderProps = {
  min: number
  max: number
  label: string
  name: string
  unit: string
  width: string
  defaultValue: SliderValue
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
  const getUrlParam = ((p: string) => new URLSearchParams(location.search).get(p));
  let param = getUrlParam(name);
  const getMin = (() => parseInt(param?.split(',')[0] || ''));
  const getMax = (() => parseInt(param?.split(',')[1] || ''));
  let min = getMin() || props.defaultValue.min;
  let max = getMax() || props.defaultValue.max;
  let value = { min, max };  

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
  const onChange = (e: any): void => {
    const value = {min: e.min || props.min, max: e.max || props.max};
    dispatch( updateSliderValue( { name, value, table, column } ) );
  }

  /* Define a popover that lets the user click to see a description for the slider's value */
  const popover: JSX.Element = useMemo(() => 
    <Popover id="popover-basic">
      <Popover.Title as="h3">{props.label}</Popover.Title>
      <Popover.Content>{props.description}</Popover.Content>
    </Popover>
  , [props.label, props.description]);

  return (
    <div className='slider-container' key={`slider-${name}`}>

      {/* Show a label that can be clicked on to view a popover */}
      <OverlayTrigger trigger="click" placement="right" overlay={popover} rootClose>
        <div className='slider-label'>{props.label} <span>ⓘ</span></div>
      </OverlayTrigger>

      <br/>

      {/* Show the slider with min and max values on each side */}
      <div className='slider-with-min-max'>

        <InputRange
          minValue={props.min}
          maxValue={props.max}
          step={props.step}
          formatLabel={v => `${monetaryUnit}${v}${otherUnit}`}
          value={value}
          onChange={onChange}
        />

      </div>

    </div>
  );

}

export default memo(Slider);