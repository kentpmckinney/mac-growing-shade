import { memo } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from './NavBar/NavBar';
import Map from './Map/Map';
import './App.scss';

function App() {
  return (
    <Router>
        <NavBar />
        <Switch>
          <Route exact path={["/", "/the-issue"]} component={Map}></Route>
          {/* <Route exact path={"/mapping-tool"} component={Map}></Route>
          <Route exact path={"/join-us"} component={Map}></Route> */}
        </Switch>
      </Router>
  );
}

export default memo(App);