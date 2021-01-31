import { cleanup } from '@testing-library/react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
configure({ adapter: new Adapter() })
import LoadingIndicator from './LoadingIndicator';

afterEach(cleanup)

describe('Test the InfoOverlay component', () => {

  it('Renders without crashing', () => {
    shallow(<LoadingIndicator/>);
  });

});
