import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function AppNavbar() {
  const linkClass = ({ isActive }) =>
    `nav-link d-flex align-items-center gap-2 ${
      isActive ? "active fw-semibold" : ""
    }`;

  return (
    <Navbar bg="light" expand="md" sticky="top" className="border-bottom">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold">
          <i className="bi bi-activity me-2" aria-hidden="true" />
          FitLog
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end className={linkClass}>
              <i className="bi bi-speedometer2" aria-hidden="true" />
              Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/meals" className={linkClass}>
              <i className="bi bi-egg-fried" aria-hidden="true" />
              Meals
            </Nav.Link>
            <Nav.Link as={NavLink} to="/workouts" className={linkClass}>
              <i className="bi bi-lightning-charge" aria-hidden="true" />
              Workouts
            </Nav.Link>
            <Nav.Link as={NavLink} to="/habits" className={linkClass}>
              <i className="bi bi-check2-square" aria-hidden="true" />
              Habits
            </Nav.Link>
            <Nav.Link as={NavLink} to="/progress" className={linkClass}>
              <i className="bi bi-graph-up" aria-hidden="true" />
              Progress
            </Nav.Link>
            <Nav.Link as={NavLink} to="/settings" className={linkClass}>
              <i className="bi bi-gear" aria-hidden="true" />
              Settings
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
