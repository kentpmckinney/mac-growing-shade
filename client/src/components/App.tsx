import { memo } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from './NavBar/NavBar';
import Map from './Map/Map';
import Home from './Home/Home';
import ProjectOverview from './Project/ProjectOverview';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Map/mapbox-gl.css';
import './App.scss';

function App() {
  return (
    <Router>
      <div className={'App-header'}>
        <NavBar />
      </div>
      <div className={'App-content'}>
        <Switch>
          <Route exact path={["/", "/home"]} component={Home}></Route>
          <Route exact path={"/project"} component={ProjectOverview}></Route>
          <Route exact path={"/map"} component={Map}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default memo(App);