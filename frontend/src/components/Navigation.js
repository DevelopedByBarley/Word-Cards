import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from 'react-bootstrap';
import { fetchAuthentication } from '../services/AuthService';
import { UserContext } from '../App';

export default function Navigation() {

  const { user } = useContext(UserContext);

  const logout = () => {
    fetchAuthentication.post('/user/logout')
      .then(res => {
        if (res.data.status === true) {
          localStorage.clear();
          window.location.href = "/user"; // Ideális lenne a react-router `navigate` funkcióját használni
        } else {
          console.error("Logout failed:", res.data.error);
        }
      })
      .catch(error => {
        console.error("Logout error:", error);
      });
  }

  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/user/dashboard">Dashboard</Nav.Link>
              {!user && <Nav.Link href="/user">Login</Nav.Link>}
              {user ? <Button onClick={logout} variant='danger'>Logout</Button> : null}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
