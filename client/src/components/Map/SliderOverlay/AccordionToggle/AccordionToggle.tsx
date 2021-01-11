import { memo, useState } from "react";
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import './AccordionToggle.scss';

function AccordionToggle (props: {children: any, eventKey: string}) {

  const [ value, setValue ] = useState(true);
  const onSelect = useAccordionToggle(props.eventKey, () => setValue(!value));

  return (
    <div className='accordion-toggle-container' onClick={onSelect}>
      {value ? 'Collapse Panel' : 'Expand Panel'}
    </div>
  );

}

export default memo(AccordionToggle);