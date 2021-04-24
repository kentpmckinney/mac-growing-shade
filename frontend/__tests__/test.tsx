import { cleanup } from '@testing-library/react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, render } from 'enzyme';
configure({ adapter: new Adapter() })
import App from '../src/components/App';

afterEach(cleanup)

describe('Test the App component', () => {

  it('Renders without crashing', () => {
    render(<App/>);
  });

});