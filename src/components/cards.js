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
        <Card className='h-100' style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>{props.infos.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{props.infos.subtitle}</Card.Subtitle>
            <Card.Text>
              
            </Card.Text>
            <Button variant="primary" onClick={handleShow}>
              En savoir plus
            </Button>
          </Card.Body>
        </Card>
        <DetailsModal infos={{show: show, handleClose: handleClose, text: props.infos.text, btnText: "S'inscrire", type: props.infos.type}}/>
        </>
        
    );
  }

export function CardsSpace(props) {
  return (
    <>
      <Card className='h-100' style={{ width: '18rem' }} id={props.data.id}>
        <Card.Body>
          <Card.Title>{props.data.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
          <Card.Text>
          </Card.Text>
          <Button variant="primary" onClick={()=>props.data.handleReservation(true, props.data.title, props.data.id)}>
            Réserver
          </Button>
        </Card.Body>
      </Card>
      </>
  );
}