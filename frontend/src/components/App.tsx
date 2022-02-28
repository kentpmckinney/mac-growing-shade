import { memo } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NavBar from './NavBar/NavBar'
import Map from './Map/Map'
import Home from './Home/Home'
import Contact from './Contact/Contact'
import ProjectOverview from './Project/ProjectOverview'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.scss'

function App() {
  return (
    <div className='app-container'>
      <Router>
        <div className='app-header'>
          <NavBar />
        </div>
        <div className='app-content'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/project-overview' element={<ProjectOverview />} />
            <Route path='/project-timeline' element={<ProjectOverview />} />
            <Route path='/project-team' element={<ProjectOverview />} />
            <Route path='/map*' element={<Map />} />
            <Route path='/contact' element={<Contact />} />
          </Routes>
        </div>
      </Router>
    </div>
  )
}

export default memo(App)
