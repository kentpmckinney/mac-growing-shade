import { cleanup } from '@testing-library/react'
import Adapter from 'enzyme-adapter-react-16'
import { configure, shallow } from 'enzyme'
configure({ adapter: new Adapter() })
import InfoOverlay from './InfoOverlay'

afterEach(cleanup)

describe('Test the InfoOverlay component', () => {
  it('Renders without crashing', () => {
    shallow(<InfoOverlay />)
  })
})
