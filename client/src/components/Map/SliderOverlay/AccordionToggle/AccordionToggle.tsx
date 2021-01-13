import { memo, useState } from "react";
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import './AccordionToggle.scss';

type AccordionToggleProps = {
  children?: HTMLElement
  eventKey: string
}

function AccordionToggle (props: AccordionToggleProps) {

  const [ value, setValue ] = useState(true);
  const onSelect = useAccordionToggle(props.eventKey, (): void => setValue(!value));

  return (
    <div className='accordion-toggle-container' onClick={onSelect}>
      {value ? 'Collapse Panel' : 'Expand Panel'}
    </div>
  );

}

export default memo(AccordionToggle);