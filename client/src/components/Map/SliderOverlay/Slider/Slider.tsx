import React, { memo, useEffect } from "react";
import { useSelector } from 'react-redux';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import { useAppDispatch } from '../../../../state/store';
import { RootState } from '../../../../state/rootReducer';
import { updateSliderValue } from './SliderStateSlice';
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
}

function Slider (props: SliderProps) {

    const unit = props.unit || '';
    const name = props.name;
    let value = props.defaultValue;
    const dispatch = useAppDispatch();

    /* Write the slider's default value to the Redux store */
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
    const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = parseInt(e.currentTarget.value);
        dispatch(updateSliderValue({ name, value }));
    }

    const popover = (
        <Popover id="popover-basic">
          <Popover.Title as="h3">{props.label}</Popover.Title>
          <Popover.Content>
            And here's some <strong>amazing</strong> content. It's very engaging.
            right?
          </Popover.Content>
        </Popover>
    );

    return (
        <div className='slider-container'>
            <OverlayTrigger trigger="click" placement="right" overlay={popover} rootClose>
                <div className='slider-label'>{props.label}</div>
            </OverlayTrigger>
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