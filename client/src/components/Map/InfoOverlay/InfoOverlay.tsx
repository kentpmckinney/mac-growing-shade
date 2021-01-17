import { BaseControl } from 'react-map-gl';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ReactPlayer from 'react-player';
import './InfoOverlay.scss';

interface InfoOverlayState {
  showModal: boolean
}

class InfoOverlay extends BaseControl<any, any> {

  state = { showModal: true } as InfoOverlayState

  _render() {
  
    const closeModal = (): void => this.setState<never>({ showModal: false });
    const openModal = (): void => this.setState<never>({ showModal: true });

    return (
      /* ref={this._containerRef} stops mouse/touch events over the control propagating to the map */
      <div ref={this._containerRef}>

        {/* The clickable UI 'Guide' element on the map */}
        <div className='info-overlay-container'>
          <span>ⓘ&nbsp;</span><span className='info-overlay-text' onClick={openModal}>Guide</span>
        </div>

        {/* The modal box that appears with a video guide for usage of the map */}
        <Modal show={this.state.showModal} onHide={closeModal} size='lg' centered>
            <Modal.Body>
              <div>Video Guide For Using The Mapping Tool</div>
              <div>&nbsp;</div>
              <div className='player-container'>
                <ReactPlayer width='auto' height='auto' className='react-player' url="http://www.youtube.com/watch?v=HPJKxAhLw5I" controls/>
              </div>
              <div>&nbsp;</div>
              <div className='close-button-container'>
                <Button variant='secondary' onClick={closeModal}>Close</Button>
              </div>
            </Modal.Body>
        </Modal>
      </div>
    );
  }
  
}

export default InfoOverlay;