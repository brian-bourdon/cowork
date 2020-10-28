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
    let text = ""
    if(props.infos.type === 0) {
      text = (<>
        <div className="font-weight-bold pb-1 pt-2">Tarifs par personne :</div>
        Première heure : 5€<br/>
        ½ heure suivante : 2,5€<br/>
        Journée (5 heures et plus) : 24€<br/>
        <div className="font-weight-bold pb-1 pt-2">Réduction étudiante :</div>
        Journée (5 heures et plus) :<br/>
        20€</>)
    }
    else if(props.infos.type === 1) {
      text = (<>
        <div className="font-weight-bold pb-1 pt-2">Tarifs membre par personne :</div>
        Première heure : 4€<br/>
        ½ heure suivante : 2€<br/>
        Journée (5 heures et plus) : 20€<br/>
        <div className="font-weight-bold pb-1 pt-2">Devenir membre sans engagement :</div>
        24€ TTC /Mois<br/>
        <div className="font-weight-bold pb-1 pt-2">Devenir membre 12 mois:</div>
        20€ TTC /Mois<br/>
        </>)
    }
    else if(props.infos.type === 2) {
      text = (<>
        <div className="font-weight-bold pb-5 pt-2">Bénéficiez d'un accès en illimité 7/7j</div>
        <div className="font-weight-bold pb-1">Devenir membre résident sans engagement :</div>
        300 TTC /Mois<br/>
        <div className="font-weight-bold pb-1 pt-2">Devenir membre 8 mois:</div>
        252€ TTC /Mois<br/>
        </>)
    }
    return (
      <>
        <Card>
          <Card.Body>
            <Card.Title>{props.infos.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{props.infos.subtitle}</Card.Subtitle>
            <Card.Text>
              {text}
            </Card.Text>   
          </Card.Body>
          <Card.Footer>
          <Button variant="primary" onClick={handleShow}>
              En savoir plus
            </Button>
          </Card.Footer>
        </Card>
        {show && <DetailsModal infos={{title: props.infos.title, show: show, handleClose: handleClose, text: props.infos.text, btnText: "S'inscrire", type: props.infos.type, connected: props.infos.connected, subtitle: props.infos.subtitle, user: props.infos.user, handleUser: props.infos.handleUser, setUpdatedUser: props.infos.setUpdatedUser, handleSpace: props.infos.handleSpace}}/>}
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