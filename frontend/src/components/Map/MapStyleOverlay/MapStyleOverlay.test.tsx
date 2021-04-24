import { cleanup } from '@testing-library/react'
import Adapter from 'enzyme-adapter-react-16'
import { configure, shallow } from 'enzyme'
configure({ adapter: new Adapter() })
import MapStyleOverlay from './MapStyleOverlay'

afterEach(cleanup)

describe('Test the MapStyleOverlay component', () => {
  it('Renders without crashing', () => {
    shallow(<MapStyleOverlay />)
  })
})
