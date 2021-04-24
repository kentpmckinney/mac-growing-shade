import { memo } from "react";
import { useSelector } from 'react-redux';
import { useMount } from 'react-use';
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
  const style = viewport.style;

  /* Write the default value to the Redux store on component mount */
  useMount((): void => {
    dispatch(setViewport({...viewport, style}))
  });

  /* Write the value to the Redux store as the value changes */
  const onChange = ((e: string) => {
    dispatch(setViewport({...viewport, style: e}));
  });

  return (
    <div className='imagery-toggle-container'>
      <ToggleButtonGroup type='radio' name='imagery' value={style} onChange={onChange} size='sm'>
          <ToggleButton key='street' type='radio' variant='secondary' name='styleToggle' value='street' size='sm'>Street</ToggleButton>
          <ToggleButton key='satellite' type='radio' variant='secondary' name='styleToggle' value='satellite' size='sm'>Satellite</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );

}

export default memo(StyleToggle);