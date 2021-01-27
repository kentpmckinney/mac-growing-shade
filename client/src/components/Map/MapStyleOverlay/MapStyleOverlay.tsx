import { memo } from 'react';
//import { RefObject } from 'react';
//import { BaseControl } from 'react-map-gl';
import StyleToggle from './StyleToggle/StyleToggle';

function MapStyleOverlay() {

  return (
      <StyleToggle/>
  );

}

export default memo(MapStyleOverlay);