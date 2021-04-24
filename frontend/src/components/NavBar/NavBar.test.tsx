import { cleanup } from '@testing-library/react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
configure({ adapter: new Adapter() })
import NavBar from './NavBar';

afterEach(cleanup)

describe('Test the NavBar component', () => {

  it('Renders without crashing', () => {
    shallow(<NavBar/>);
  });

});
