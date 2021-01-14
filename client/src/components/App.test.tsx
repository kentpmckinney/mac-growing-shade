import { cleanup } from '@testing-library/react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
configure({ adapter: new Adapter() })
import App from './App';

afterEach(cleanup)

describe('Test the App component', () => {

  it('Renders without crashing', () => {
    shallow(<App/>);
  });

});
