import React, { memo, useState } from "react";
import RangeSlider from 'react-bootstrap-range-slider';

type SliderProps = {
    label: string,
    unit: string,
    width: string
    //reducer: ,
}

function Slider (props: SliderProps) {
    const unit = props.unit || '';
    const [ value, setValue ] = useState(0);
    return (
        <div style={{width: props.width}}>
            <div>{props.label}</div>
              <RangeSlider
                value={value}
                size="sm"
                onChange={e => setValue(parseInt(e.target.value))}
                tooltip="on"
                tooltipLabel={(v:number) => `${v}${unit}`}
                variant='secondary'/> 
        </div>
    );
}

export default memo(Slider);