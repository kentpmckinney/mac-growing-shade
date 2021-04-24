import { cleanup } from '@testing-library/react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
configure({ adapter: new Adapter() })
import ProjectOverview from './ProjectOverview';

afterEach(cleanup)

describe('Test the ProjectOverview component', () => {

  it('Renders without crashing', () => {
    shallow(<ProjectOverview/>);
  });

});
