import { cleanup } from '@testing-library/react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
configure({ adapter: new Adapter() })
import Slider from './Slider';

afterEach(cleanup)

describe('Test the Slider component', () => {

  it('Renders without crashing', () => {
    shallow(
    <Slider
      min={0} max={100} label='Label' name='Name' width='100px' unit='' defaultValue={50} step={1} description=''
    />);
  });

});
