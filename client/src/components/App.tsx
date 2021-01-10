import { memo } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from './NavBar/NavBar';
import Map from './Map/Map';
import Home from './Home/Home';
import ProjectOverview from './Project/ProjectOverview';
import LogRocket from 'logrocket';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Map/mapbox-gl.css';
import './App.scss';

function App() {

  LogRocket.init('hbumel/mac-growing-shade'); /* For early development use */

  return (
    <div className='app-container'>
      <Router>
        <div className='app-header'>
          <NavBar />
        </div>
        <div className='app-content'>
          <Switch>
            <Route exact path={["/"]} component={Home}></Route>
            <Route exact path={"/project-overview"} component={ProjectOverview}></Route>
            <Route exact path={"/project-timeline"} component={ProjectOverview}></Route>
            <Route exact path={"/project-team"} component={ProjectOverview}></Route>
            <Route exact path={"/map"} component={Map}></Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default memo(App);