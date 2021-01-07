import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function NavBar (props: any) {
    return (
        <div className="NavBar">
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/home">Branch Out Gresham</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={NavLink} exact to="/home">Home</Nav.Link>
                        <NavDropdown title="Project" id="basic-nav-dropdown">
                            <NavDropdown.Item as={NavLink} exact to="/project-overview">Overview</NavDropdown.Item>
                            <NavDropdown.Item as={NavLink} exact to="/project-timeline">Timeline</NavDropdown.Item>
                            <NavDropdown.Item as={NavLink} exact to="/project-team">Team</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link as={NavLink} exact to="/map">Mapping Tool</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default memo(NavBar);