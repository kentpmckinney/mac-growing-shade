import { cleanup } from '@testing-library/react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
configure({ adapter: new Adapter() })
import StyleToggle from './StyleToggle';

afterEach(cleanup)

describe('Test the StyleToggle component', () => {

  it('Renders without crashing', () => {
    shallow(<StyleToggle/>);
  });

});
