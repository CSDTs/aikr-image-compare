import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser as SolidUser } from "@fortawesome/free-solid-svg-icons";
import {
  faUser as RegUser,
  faCircleQuestion,
} from "@fortawesome/free-regular-svg-icons";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navigation.module.css";
import NSF from "./nsf.gif";
import logo from "./logo.svg";

function Navigation(props) {
  let dropdown;
  if (props.user) {
    const user = JSON.parse(props.user);
    const loginStatus = user.username || false;

    if (loginStatus) {
      let status = (
        <React.Fragment>
          <FontAwesomeIcon icon={SolidUser} className="pe-2 ps-1" />{" "}
          <span>{user.username}</span>
        </React.Fragment>
      );
      dropdown = (
        <NavDropdown
          title={status}
          id="collasible-nav-dropdown"
          className="w-auto mx-0 px-0"
        >
          <NavDropdown.Item href={"/users/" + user.id}>
            My Projects
          </NavDropdown.Item>
          <NavDropdown.Item href={"/users/" + user.id + "/classes"}>
            My Classrooms
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/accounts/logout">
            Not You? (LOGOUT)
          </NavDropdown.Item>
        </NavDropdown>
      );
    } else {
      dropdown = (
        <React.Fragment>
          <Nav.Link href="/accounts/signup/">Sign Up</Nav.Link>
          <Nav.Link href="/accounts/login/">
            <FontAwesomeIcon icon={RegUser} className="pe-2 ps-1" />
            Login
          </Nav.Link>
        </React.Fragment>
      );
    }
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">
          <img src={NSF} width="40" height="40" alt="" />

          <img src={logo} width="100" height="40" alt="" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <Nav.Link href="/projects">Projects</Nav.Link>
            <Nav.Link href="/news">News</Nav.Link>
            <Nav.Link href="/publications">Publications</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
          </Nav>
          <Nav className="justify-content-end">
            {dropdown}{" "}
            <Nav.Link className="help-divide d-none d-lg-block" disabled>
              {" "}
              |
            </Nav.Link>
            <Nav.Link href="/culture/help/index.html">
              <FontAwesomeIcon icon={faCircleQuestion} className="pe-2 ps-1" />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default Navigation;
