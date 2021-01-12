import { Fragment } from 'react';
import { BaseControl } from 'react-map-gl';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ReactPlayer from 'react-player';
import './HelpOverlay.scss';

class HelpOverlay extends BaseControl<any, any> {
  state = { showModal: true }

  _render() {
  
    const closeModal = () => this.setState({ showModal: false });
    const openModal = () => this.setState({ showModal: true });

    return (
      /* ref={this._containerRef} stops mouse/touch events over the control propagating to the map */
      <Fragment>
        <div className='help-overlay-container' ref={this._containerRef}>
          <span>ⓘ&nbsp;</span><span className='help-overlay-text' onClick={openModal}>Guide</span>
        </div>
        <Modal show={this.state.showModal} onHide={closeModal} size="xl" centered>
            <Modal.Body>
              <div className='player-container'>
                <ReactPlayer width='auto' height='auto' className='react-player' url="https://www.youtube.com/watch?v=HPJKxAhLw5I" controls/>
              </div>
              <div>&nbsp;</div>
              <div className='close-button-container'>
                <Button variant='secondary' onClick={closeModal}>Close</Button>
              </div>
            </Modal.Body>
        </Modal>
      </Fragment>
    );
  }
  
}

export default HelpOverlay;