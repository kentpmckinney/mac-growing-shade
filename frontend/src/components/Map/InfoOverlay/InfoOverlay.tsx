import { memo, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import ReactPlayer from 'react-player'
import './InfoOverlay.scss'

const InfoOverlay = () => {
  const [showModal, setShowModal] = useState(false)
  const closeModal = (): void => setShowModal(false)
  const openModal = (): void => setShowModal(true)

  return (
    <div>
      {/* The clickable UI 'Guide' element on the map */}
      <OverlayTrigger
        defaultShow={true}
        placement='left'
        overlay={
          <Popover id='popover-basic'>
            <Popover.Body>Click here to watch a video guide for using this map</Popover.Body>
          </Popover>
        }
        rootClose
        transition={false}>
        <div className='info-overlay-container'>
          <span>ⓘ&nbsp;</span>
          <span className='info-overlay-text' onClick={openModal}>
            Guide
          </span>
        </div>
      </OverlayTrigger>

      {/* The modal box that appears with a video guide for usage of the map */}
      <Modal show={showModal} onHide={closeModal} size='lg' centered transition={false}>
        <Modal.Body>
          <div>Video Guide For Using The Mapping Tool</div>
          <div>&nbsp;</div>
          <div className='player-container'>
            <ReactPlayer
              width='auto'
              height='auto'
              className='react-player'
              url='http://www.youtube.com/watch?v=HPJKxAhLw5I'
              controls
            />
          </div>
          <div>&nbsp;</div>
          <div className='close-button-container'>
            <Button variant='secondary' onClick={closeModal}>
              Close
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default memo(InfoOverlay)
