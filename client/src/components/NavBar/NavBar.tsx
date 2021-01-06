import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import './NavBar.scss';

class Navbar extends Component {
  render() {
    //const { isOpen } = this.props.navbar;
    return (
      <nav className="nav-outer-container">
        <div
          className="nav-inner-container"
        //   style={isOpen ? { height: "auto" } : null}
        >
          <div>
            <NavLink exact to="/the-issue">
              <img
                src="https://nca-toolkit.s3-us-west-2.amazonaws.com/NCA_logo_black.png"
                alt="logo"
              ></img>
            </NavLink>
          </div>
          <div></div>
          <NavLink
            activeClassName="nav-link-active"
            exact
            to="/the-issue"
            onClick={() => {
              //this.props.dispatch(togglenavDrawerAction(false));
            }}
          >
            The Issue
          </NavLink>
          <NavLink
            activeClassName="nav-link-active"
            exact
            to="/mapping-tool"
            onClick={() => {
              //this.props.dispatch(togglenavDrawerAction(false));
            }}
          >
            Mapping Tool
          </NavLink>
          <NavLink
            activeClassName="nav-link-active"
            exact
            to="/join-us"
            onClick={() => {
              //this.props.dispatch(togglenavDrawerAction(false));
            }}
          >
            Join Us
          </NavLink>
        </div>
        <div
          className="hamburger-button"
          onClick={() => {
            //this.props.dispatch(togglenavDrawerAction(!isOpen));
          }}
        >
          &#x2630;
        </div>
      </nav>
    );
  }
}
// function mapStateToProps({ navbar }) {
//   return { navbar };
// }
//export default connect(mapStateToProps)(Navbar);
export default Navbar;