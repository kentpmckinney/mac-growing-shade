import { BaseControl } from 'react-map-gl';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ReactPlayer from 'react-player';
import './HelpOverlay.scss';

class HelpOverlay extends BaseControl<any, any> {
  state = { showModal: true }

  _render() {
  
    const closeModal = () => this.setState({ showModal: false });
    const openModal = () => this.setState({ showModal: true });

    return (
      /* ref={this._containerRef} stops mouse/touch events over the control propagating to the map */
      <div ref={this._containerRef}>
        <div className='help-overlay-container'>
          <span>ⓘ&nbsp;</span><span className='help-overlay-text' onClick={openModal}>Guide</span>
        </div>
        <Modal show={this.state.showModal} onHide={closeModal} size="xl" centered>
            <Modal.Body>
              <div>Video Guide For Using The Mapping Tool</div>
              <div>&nbsp;</div>
              <div className='player-container'>
                <ReactPlayer width='auto' height='auto' className='react-player' url="https://www.youtube.com/watch?v=HPJKxAhLw5I" controls/>
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

export default HelpOverlay;