import { cleanup } from '@testing-library/react'
import Adapter from 'enzyme-adapter-react-16'
import { configure, shallow } from 'enzyme'
configure({ adapter: new Adapter() })
import Home from './Home'

afterEach(cleanup)

describe('Test the Home component', () => {
  it('Renders without crashing', () => {
    shallow(<Home />)
  })
})
