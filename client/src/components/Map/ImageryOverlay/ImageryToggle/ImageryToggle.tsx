import { memo, useEffect, ChangeEvent } from "react";
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../state/store';
import { RootState } from '../../../../state/rootReducer';
import { updateImageryValue, ImageryOptions } from './ImageryToggleStateSlice';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import './ImageryToggle.scss';

type ImageryToggleProps = {}

function ImageryToggle (props: ImageryToggleProps) {

  const dispatch = useAppDispatch();

  /* Use a URL query parameter as the default value if available */
  const location = useLocation();
  let value = new URLSearchParams(location.search).get('imagery') || 'no';  

  /* Write the default value to the Redux store once after the component loads */
  useEffect( (): void => { dispatch(updateImageryValue({ enabled: false })) }, [] );

  /* Read state from the Redux store */
  const enabled = useSelector( (state: RootState): ImageryOptions => state.imagery ).enabled || false;

  /* Write the value to the Redux store as the value changes */
  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    dispatch(updateImageryValue( { enabled: e.currentTarget.value === 'true'}));
  }

  return (
    <div className='imagery-toggle-container'>
      <ToggleButtonGroup type='radio' name='imagery' defaultValue={1}>
          <ToggleButton key='map' type='radio' variant='secondary' name='imagery' value='false' size='sm'
            checked={!enabled} onChange={onChange} defaultChecked={true}>Map</ToggleButton>
          <ToggleButton key='imagery' type='radio' variant='secondary' name='imagery' value='true' size='sm'
            checked={enabled} onChange={onChange} defaultChecked={false}>Imagery</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );

}

export default memo(ImageryToggle);