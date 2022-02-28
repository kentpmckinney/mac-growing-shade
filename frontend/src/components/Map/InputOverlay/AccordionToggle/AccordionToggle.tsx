import { memo, useState } from 'react'
import { useAccordionButton } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import './AccordionToggle.scss'

type AccordionToggleProps = {
  children?: HTMLElement
  eventKey: string
}

function AccordionToggle(props: AccordionToggleProps) {
  const [value, setValue] = useState(true)
  const onSelect = useAccordionButton(props.eventKey, (): void => setValue(!value))

  return (
    <div className='accordion-toggle-container' onClick={onSelect}>
      <div>Measurements</div>
      <div className='accordion-toggle-button'>
        {value ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
      </div>
    </div>
  )
}

export default memo(AccordionToggle)
