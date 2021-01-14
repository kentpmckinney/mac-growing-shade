import { cleanup } from '@testing-library/react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
configure({ adapter: new Adapter() })
import AccordionToggle from './AccordionToggle';

afterEach(cleanup)

describe('Test the AccordionToggle component', () => {

  it('Renders without crashing', () => {
    shallow(<AccordionToggle eventKey="0"/>);
  });

});
