import { cleanup } from '@testing-library/react'
import Adapter from 'enzyme-adapter-react-16'
import { configure, shallow } from 'enzyme'
configure({ adapter: new Adapter() })
import Contact from './Contact'

afterEach(cleanup)

describe('Test the Contact component', () => {
  it('Renders without crashing', () => {
    shallow(<Contact />)
  })
})
