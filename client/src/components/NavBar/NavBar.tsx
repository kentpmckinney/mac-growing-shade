import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import './NavBar.scss';

function NavBar (props: any) {
    //const { isOpen } = this.props.navbar;
    return (
        <nav className="nav-outer-container">
            <div className="nav-inner-container" /*style={isOpen ? { height: "auto" } : null}*/>
                <div>
                    <NavLink exact to="/home">
                    <div>Branch Out Gresham</div>
                    </NavLink>
                </div>
                <div></div>
                <NavLink exact to="/home"
                    activeClassName="nav-link-active"
                    onClick={() => { /*this.props.dispatch(togglenavDrawerAction(false));*/}}>HOME</NavLink>
                <NavLink exact to="/project"
                    activeClassName="nav-link-active"
                    onClick={() => { /*this.props.dispatch(togglenavDrawerAction(false));*/}}>PROJECT</NavLink>
                <NavLink exact to="/map"
                    activeClassName="nav-link-active"
                    onClick={() => { /*this.props.dispatch(togglenavDrawerAction(false));*/}}>MAPPING TOOL</NavLink>
            </div>
            <div
                className="hamburger-button"
                onClick={() => { /*this.props.dispatch(togglenavDrawerAction(!isOpen));*/}}>&#x2630;</div>
        </nav>
    );
}

// function mapStateToProps({ navbar }) {
//   return { navbar };
// }
//export default connect(mapStateToProps)(Navbar);
export default memo(NavBar);