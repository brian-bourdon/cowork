import React, { useState, useEffect } from 'react';
import {Button, Card, Spinner, CardDeck, Row, Col, Form, Badge ,Alert} from 'react-bootstrap'
import axios from 'axios'

export function EvenemenentWrapper(props) {
    const [eventsData, setEventsData] = useState(null);
    const [space, setSpace] = useState("");

    const handleEventsData = (v) => {
        setEventsData(v)
      }
    
      const handleSpace = (v) => {
        handleEventsData(null)
        setSpace(v.nativeEvent.target.value)
      }

    useEffect(() => {
        if(props.data.evenement && props.data.user) axios.get('https://cowork-paris.000webhostapp.com/index.php/events/space/' + space).then(res => handleEventsData(res.data)).catch(err => console.log(err))
    }, [space]);

    return (
        <>
            <Form>
                <Form.Group controlId="selectSpace">
                    <Form.Label className="float-left">Espace</Form.Label>
                    <Form.Control as="select" defaultValue="0" onChange={handleSpace}>
                    <option value="">Tous</option>
                    <option value="1">CO'WORK BASTILLE</option>
                    <option value="2">CO'WORK REPUBLIQUE</option>
                    <option value="3">CO'WORK Odéon</option>
                    <option value="4">CO'WORK PLACE D'ITALIE</option>
                    <option value="5">CO'WORK TERNES</option>
                    <option value="6">CO'WORK CO'WORK BEAUBOURG</option>
                    </Form.Control>
                </Form.Group>
            </Form>
            {props.data.evenement && props.data.user && !eventsData && <Spinner
            as="span"
            animation="border"
            size="sm"
            variant="primary"
            role="status"
            aria-hidden="true"
            style={{width: "5em", height: "5em"}}
            />}
            {props.data.evenement && props.data.user && eventsData && 
            <Row>
                <Col lg="auto">
                <CardDeck>
                    {eventsData.map(v => <CardsEvenement infos={{...v, user_id: props.data.user.id}} />)}
                </CardDeck>
                </Col>
            </Row>}
        </>
    )
}
export function CardsEvenement(props) {
    const [placesRestantes, setPlacesRestantes] = useState(props.infos.nb_places);
    const [inscription, setInscription] = useState(null);
    const [isResByUser, setIsResByUser] = useState(null);
    const [isLoadingPr, setIsLoadingPr] = useState(true);
    const [isLoadingRes, setIsLoadingRes] = useState(true);

    const handleIsResByUser = (v) => {
        setIsResByUser(v)
        setIsLoadingRes(false)
    }

    const handleInscription = (v) => {
        setInscription(v)
    }

    const handlePlacesRestantes = (v) => {
        setPlacesRestantes(props.infos.nb_places - v)
        setIsLoadingPr(false)
    }
    // TODO: nombre places restances + regles
    useEffect(() => {
        axios.get('https://cowork-paris.000webhostapp.com/index.php/ReservationEvents/total/' + props.infos.id).then(res => handlePlacesRestantes(res.data)).catch(err => console.log(err))
        axios.get('https://cowork-paris.000webhostapp.com/index.php/ReservationEvents/isResByUser/' + props.infos.user_id + "/" + props.infos.id).then(res => handleIsResByUser(res.data)).catch(err => console.log(err))
     }, [inscription]);

     let img = ""
     let space = ""
     switch(props.infos.id_space) {
       case "1":
         img = "bastille.jpg"
         space = "CO'WORK BASTILLE"
         break;
       case "2":
         img = "republique.jpg"
         space = "CO'WORK REPUBLIQUE"
         break;
       case "3":
         img = "odeon.jpg"
         space = "CO'WORK ODEON"
         break;
       case "4":
         img = "place_italie.jpg"
         space = "CO'WORK PLACE D'ITALIE"
         break;
       case "5":
         img = "ternes.jpg"
         space = "CO'WORK TERNES"
         break;
       case "6":
         img = "beaubourg.jpg"
         space = "CO'WORK BEAUBOURG"
         break;
     }
    return (
      <>
        <Card>
          <Card.Img variant="top" src={process.env.PUBLIC_URL + '/' + img} />
          <Card.Body>
            <Card.Title>{props.infos.nom}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{space}</Card.Subtitle>
            <>
                <h5>
                    {"Places restantes: "}
                    {isLoadingPr && <Spinner as="span" animation="border" size="sm" variant="primary" role="status" aria-hidden="true"/>}
                    {!isLoadingPr && <Badge variant={placesRestantes > 0 ? (placesRestantes > props.infos.nb_places / 2 ? "success" : "warning") : "danger"}>{placesRestantes}</Badge>}
                </h5>
                <h5>{props.infos.description}</h5>
            </>
            {inscription !== null && <div className="text-center"><Alert className="mb-0" variant={inscription ? "success" : "danger"}>
                {inscription ? "Inscription réussie !" : "L'inscription a échoué !"}
            </Alert></div>}
          </Card.Body>
          <Card.Footer>
            {!isLoadingRes && <Button variant="primary" onClick={() => InscriptionEvent(props.infos.user_id, props.infos.id, handleInscription)} disabled={placesRestantes <= 0 || isResByUser > 0}>
                {placesRestantes <= 0 && "Plus de places disponibles"}
                {isResByUser > 0 && "Vous êtes déja inscris"}
                {!(placesRestantes <= 0 || isResByUser > 0) && "S'inscrire"}
            </Button>}
            {isLoadingRes && <Spinner as="span" animation="border" size="sm" variant="primary" role="status" aria-hidden="true"/>}
          </Card.Footer>
        </Card>
      </>
    );
  }

function InscriptionEvent(id_user, id_event, handleInscription) {
    let inscription = false
    let formData = new FormData();
    formData.append('id_user', id_user);
    formData.append('id_events', id_event);

    fetch("https://cowork-paris.000webhostapp.com/index.php/ReservationEvents/",
        {
            body: formData,
            method: "post"
        })
        .then(res=>res.json())
        .then(res => {
        if(res[0] === "Reservation created successfully.") {
            inscription = Date.now // Pas trouvé mieux
        }
        handleInscription(inscription)
        })
        .catch(e => {
            handleInscription(inscription)
        })

}