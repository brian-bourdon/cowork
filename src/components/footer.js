import {Card, Navbar, NavbarBrand, Container, Button} from 'react-bootstrap'
import React from 'react';

export function Footer2() {
    return (
      
      <Card bg="primary" text="light">
        
        <Card.Body>
          
          <blockquote className="blockquote mb-0">
            <p>
              {' '}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere
              erat a ante.{' '}
            </p>
          </blockquote>
        </Card.Body>
      </Card>
    );
  }

  var style = {
    backgroundColor: "#F8F8F8",
    borderTop: "1px solid #E7E7E7",
    textAlign: "center",
    padding: "20px",
    position: "fixed",
    left: "0",
    bottom: "0",
    height: "60px",
    width: "100%",
}

var phantom = {
  display: 'block',
  padding: '20px',
  height: '60px',
  width: '100%',
  paddingTop: "50vh"
}

export function Footer(props) {
    return (
        <div>
            <div style={phantom} />
            <div style={style}>
                <Button onClick={() => props.data.handleShowD(true)}>Aide</Button>
            </div>
        </div>
    )
}
