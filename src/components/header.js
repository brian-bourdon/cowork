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

export function Header(handleShowI, handleShowC, handleUser, handleProfile) {
    return (
      <>
        <Navbar bg="primary" variant="dark" expand="lg" className='py-md-3'>
          <Navbar.Brand href="#home">Co'Work</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
            </Nav>
            <Nav>
              {!getCookie("id") && <Button variant="outline-light" className="mr-sm-2" onClick={handleShowC}>Connection</Button>}
              {!getCookie("id") && <Button variant="outline-light" className="mr-sm-2" onClick={handleShowI}>Inscription</Button>}
              {getCookie("id") && <DropdownButton id="dropdown-item-button" title={upperCaseFirst(getCookie("firstname").toLowerCase())} className="person-circle" alignRight>
              <Dropdown.Item as="button" onClick={()=>handleProfile(true)}>Profil</Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => { deleteUser(); handleUser("deconnected")}}>Déconection</Dropdown.Item>
            </DropdownButton>}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </>
    );
  }