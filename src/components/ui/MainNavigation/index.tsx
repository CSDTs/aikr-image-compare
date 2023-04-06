import { faUser as RegUser, faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { faUser as SolidUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import "./MainNavigation.module.scss";

interface IProps {
	user: any;
}



const root = process.env.NODE_ENV === "production" ? "/static/website/www/img/nav" : ""
const MainNavigation: React.FC<IProps> = ({ user }) => {
	let dropdown;
	if (user) {
		const parsedUser = JSON.parse(user);
		const loginStatus = parsedUser.username || false;

		if (loginStatus) {
			let status = (
				<>
					<FontAwesomeIcon icon={SolidUser as IconProp} className="pe-2 ps-1" /> <span>{parsedUser.username}</span>
				</>
			);
			dropdown = (
				<NavDropdown title={status} id="collasible-nav-dropdown" className="w-auto mx-0 px-0">
					<NavDropdown.Item href={`/users/${parsedUser.id}`}>My Projects</NavDropdown.Item>
					<NavDropdown.Item href={`/users/${parsedUser.id}/classes`}>My Classrooms</NavDropdown.Item>
					<NavDropdown.Item href={`/users/${parsedUser.id}/workbooks`}>My Workbooks</NavDropdown.Item>
					<NavDropdown.Divider />
					<NavDropdown.Item href="/accounts/logout">Not You? (LOGOUT)</NavDropdown.Item>
				</NavDropdown>
			);
		} else {
			dropdown = (
				<React.Fragment>
					<Nav.Link href="/accounts/signup/">Sign Up</Nav.Link>
					<Nav.Link href="/accounts/login/">
						<FontAwesomeIcon icon={RegUser as IconProp} className="pe-2 ps-1" />
						Login
					</Nav.Link>
				</React.Fragment>
			);
		}
	}

	return (
		<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
			<Container>
				<Navbar.Brand href="/">
					<img
						src={ `${root}/nsf.gif`}
						width="40"
						height="40"
						alt="NSF Logo"
					/>

					<img
						src={ `${root}/logo.svg`}
						width="100"
						height="40"
						alt="CSDT Logo"
					/>
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
							<FontAwesomeIcon icon={faCircleQuestion as IconProp} className="pe-2 ps-1" />
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};
export default MainNavigation;
