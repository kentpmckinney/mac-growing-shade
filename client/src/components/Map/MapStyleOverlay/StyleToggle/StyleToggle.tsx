import { memo, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../state/store';
import { RootState } from '../../../../state/rootReducer';
import { setViewport, ViewportState } from '../../mapViewportStateSlice';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import './StyleToggle.scss';

function StyleToggle () {

  const dispatch = useAppDispatch();

  /* Read settings from the Redux store */
  const viewport: ViewportState = useSelector((state: RootState) => state.viewport);
  let style = viewport.style;

  /* Write the default value to the Redux store once after the component loads */
  useEffect( (): void => { dispatch(setViewport({...viewport, style})) }, [] );

  /* Write the value to the Redux store as the value changes */
  const onChange = (() => {
    style = style === 'street' ? 'satellite' : 'street';
    dispatch(setViewport({...viewport, style}));
  });

  return (
    <div className='imagery-toggle-container'>
      <ToggleButtonGroup type='radio' name='imagery' defaultValue={1}>
          <ToggleButton key='map' type='radio' variant='secondary' name='style' value='street' size='sm'
            checked={style === 'street'} onChange={onChange}>Street</ToggleButton>
          <ToggleButton key='imagery' type='radio' variant='secondary' name='style' value='satellite' size='sm'
            checked={style !== 'street'} onChange={onChange}>Satellite</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );

}

export default memo(StyleToggle);