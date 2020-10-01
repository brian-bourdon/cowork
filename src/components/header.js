import React, { useState } from 'react';
import {Navbar,Nav, NavDropdown, Button, DropdownButton, Dropdown } from 'react-bootstrap'
import {getCookie, deleteCookie, upperCaseFirst} from '../util/util';

function deleteUser() {
  deleteCookie("id", "/")
  deleteCookie("firstname", "/")
  deleteCookie("lastname", "/")
  deleteCookie("date_naissance", "/")
  deleteCookie("email", "/")
  deleteCookie("pwd", "/")
  deleteCookie("id_abonnement", "/")
}

export function Header(props) {
    return (
      <>
        <Navbar bg="primary" variant="dark" expand="lg" className='py-md-3'>
          <Navbar.Brand onClick={()=>{props.data.handleProfile(false); props.data.handleHome(Math.floor(Math.random() * 100) + 1)}} href="#">Co'Work</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
            </Nav>
            <Nav>
              {!getCookie("id") && <Button variant="outline-light" className="mr-sm-2" onClick={props.data.handleShowC}>Connection</Button>}
              {!getCookie("id") && <Button variant="outline-light" className="mr-sm-2" onClick={props.data.handleShowI}>Inscription</Button>}
              {getCookie("id") && <DropdownButton id="dropdown-item-button" title={upperCaseFirst(getCookie("firstname").toLowerCase())} className="person-circle" alignRight>
              <Dropdown.Item as="button" onClick={() => props.data.handleProfile(true)}>Profil</Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => props.data.handleCustomerReservations(true)}>Réservations</Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => { deleteUser(); props.data.handleUser(null); props.data.handleHome(true); props.data.handleProfile(false)}}>Déconection</Dropdown.Item>
            </DropdownButton>}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </>
    );
  }