import React, { useState } from 'react';
import {Button, Card} from 'react-bootstrap'
import {DetailsModal} from '../components/modal'
import {getCookie} from '../util/util'
import axios from 'axios';
import {Col} from 'react-bootstrap'
import {SubscriptionModal} from '../components/reservation'

export function Cards(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <Card>
          <Card.Img variant="top" src={"holder.js/100px160"} />
          <Card.Body>
            <Card.Title>{props.infos.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{props.infos.subtitle}</Card.Subtitle>
            <Card.Text>
              This is a wider card with supporting text below as a natural lead-in to
              additional content. This content is a little bit longer.
            </Card.Text>
            <Button variant="primary" onClick={handleShow}>
              En savoir plus
            </Button>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">Last updated 3 mins ago</small>
          </Card.Footer>
        </Card>
        <DetailsModal infos={{show: show, handleClose: handleClose, text: props.infos.text, btnText: "S'inscrire", type: props.infos.type}}/>
      </>
    );
  }

export function CardsSpace(props) {
  let img = ""
  switch(props.data.id) {
    case "1":
      img = "bastille.jpg"
      break;
    case "2":
      img = "republique.jpg"
      break;
    case "3":
      img = "odeon.jpg"
      break;
    case "4":
      img = "place_italie.jpg"
      break;
    case "5":
      img = "ternes.jpg"
      break;
    case "6":
      img = "beaubourg.jpg"
      break;
  }

  return (
    <>
      <Card className='h-100' style={{ width: '18rem' }} id={props.data.id}>
        <Card.Img variant="top" src={process.env.PUBLIC_URL + '/' + img} />
        <Card.Body>
          <Card.Title>{props.data.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
          <Card.Text>
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <Button key={props.data.id} variant="primary" onClick={()=>props.data.handleReservation(true, props.data.title, props.data.id)}>
            Réserver
          </Button>
        </Card.Footer>
      </Card>
      </>
  );
}