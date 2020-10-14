import React, { useState } from 'react';
import {Form, Button,Modal, Spinner, Alert} from 'react-bootstrap'
import {Connection} from '../components/connection'
import {submitInscription} from '../components/inscription'

export function ConnectionModal(props) {
    const [email, setEmail] = useState("")
    const [pwd, setPwd] = useState("")
    const [isLoading, setIsLoading] = useState(false)
  
    const handleEmail = (event) => {
      setEmail(event.target.value)
    }
  
    const handlePwd = (event) => {
      setPwd(event.target.value)
    }

    return (
      <Modal show={props.data.show} onHide={props.data.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Connection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(!props.data.user || props.data.user === "deconnected") && <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Mail</Form.Label>
              <Form.Control type="email" placeholder="Email" onKeyUp={handleEmail.bind(this)}/>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control type="password" placeholder="Mot de passe" onKeyUp={handlePwd.bind(this)}/>
            </Form.Group>
            <div className="text-center pt-3">
              <Button className="mb-3" variant="primary" onClick={() => {Connection(email, pwd, setIsLoading, props.data.handleClose, props.data.handleUser)}} disabled={email.trim() === "" || pwd.trim() === ""}>
              {isLoading && <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="pr-2"
              />}
                {!isLoading && "Se connecter"}
              </Button>
            </div>
          </Form>}
          {props.data.user !== null && props.data.user !== "deconnected" && <div className="text-center"><Alert className="mb-0" variant={props.data.user ? "success" : "danger"}>
                {props.data.user && props.data.user !== "disconnected" ? "Connection réussie" : "L'authentification a échoué"}
            </Alert></div>}
        </Modal.Body>
      </Modal>
    );
  }

  export function InscriptionModal(props) {
    const[firstname, setFirstname] = useState("")
    const[lastname, setLastname] = useState("")
    const[date_naissance, setDate_naissance] = useState("")
    const[email, setEmail] = useState("")
    const[pwd, setPwd] = useState("")
    const[successInscription, setsuccessInscription] = useState(null)
  
    const handleFirstname = (event) => {
      
      setFirstname(event.target.value)
    }
    const handleLastname = (event) => {
      
      setLastname(event.target.value)
    }
    const handleDate_naissance = (event) => {
      
      setDate_naissance(event.target.value)
    }
    const handleEmail = (event) => {
      
      setEmail(event.target.value)
    }
    const handlePwd = (event) => {
      
      setPwd(event.target.value)
    }

    const handleInscription = (v) => {
      
      setsuccessInscription(v)
    }

    return (
      <Modal show={props.data.show} onHide={props.data.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Inscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="nom">
              <Form.Label>Nom</Form.Label>
              <Form.Control type="text" placeholder="Nom" onKeyUp={handleLastname.bind(this)} required/>
            </Form.Group>
            <Form.Group controlId="prenom">
              <Form.Label>Prenom</Form.Label>
              <Form.Control type="text" placeholder="Prenom" onKeyUp={handleFirstname.bind(this)} required/>
            </Form.Group>
            <Form.Group controlId="prenom">
              <Form.Label>Date de naissance</Form.Label>
              <Form.Control type="date" onKeyUp={handleDate_naissance.bind(this)} onChange={handleDate_naissance.bind(this)} required/>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" onKeyUp={handleEmail.bind(this)} required/>
            </Form.Group>
            <Form.Group controlId="pwd">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control type="password" placeholder="Mot de passe" onKeyUp={handlePwd.bind(this)} required/>
            </Form.Group>
            <div className="text-center pt-3">
              <Button className="mb-3" variant="primary" onClick={() => submitInscription({firstname, lastname, date_naissance, email, pwd}, handleInscription, props.data.handleClose)}>
                S'inscrire
              </Button>
            </div>
          </Form>
          {successInscription !== null && <div className="text-center"><Alert className="mb-0" variant={successInscription ? "success" : "danger"}>
                {successInscription ? "Inscription réussie, vous pouvez maintenant vous connecter" : "L'inscription a échoué"}
            </Alert></div>}
        </Modal.Body>
      </Modal>
    );
  }

  export function SubscriptionModal(defV, handleFirstname, handleLastname, handleDate_naissance, handleEmail, handlePwd, handleSub, handleSubscription, successSubscription) {
    return(
      <>
      <Form>
        <Form.Group controlId="nom">
          <Form.Label>Nom</Form.Label>
          <Form.Control type="text" placeholder="Nom" onKeyUp={handleLastname.bind(this)} required/>
        </Form.Group>
        <Form.Group controlId="prenom">
          <Form.Label>Prenom</Form.Label>
          <Form.Control type="text" placeholder="prenom" onKeyUp={handleFirstname.bind(this)} required/>
        </Form.Group>
        <Form.Group controlId="prenom">
          <Form.Label>Date de naissance</Form.Label>
          <Form.Control type="date" onKeyUp={handleDate_naissance.bind(this)} onChange={handleDate_naissance.bind(this)} required/>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="name@example.com" onKeyUp={handleEmail.bind(this)} required/>
        </Form.Group>
        <Form.Group controlId="pwd">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control type="password" placeholder="Mot de passe" onKeyUp={handlePwd.bind(this)} required/>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label>Abonnement</Form.Label>
          <Form.Control as="select" defaultValue={defV} onChange={handleSub.bind(this)}>
            <option value="1">Sans abonnement</option>
            <option value="2">Abonnement simple 12 mois sans engagement</option>
            <option value="3">Abonnement simple sans engagement</option>
            <option value="4">Abonnement résident 8 mois sans engagement</option>
            <option value="5">Abonnement résident sans engagement</option>
          </Form.Control>
        </Form.Group>
        <div className="text-center pt-3">
          <Button className="mb-3" variant="primary" onClick={handleSubscription}>
            Souscrire
          </Button>
        </div>
      </Form>
      {successSubscription !== null && <div className="text-center"><Alert className="mb-0" variant={successSubscription ? "success" : "danger"}>
      {successSubscription ? "Souscription réussie, vous pouvez maintenant vous connecter" : "La souscription a échoué"}
      </Alert></div>}
      </>
    );
  }
  
  export function DetailsModal(props) {
    let defV = 1
    if(props.infos.type === 0) defV = 1
    else if(props.infos.type === 1) defV = 2
    else defV = 4

    const[firstname, setFirstname] = useState("")
    const[lastname, setLastname] = useState("")
    const[date_naissance, setDate_naissance] = useState("")
    const[email, setEmail] = useState("")
    const[pwd, setPwd] = useState("")
    const[id_abonnement, setAbonnement] = useState(defV)
    const[successSubscription, setSuccessSubscription] = useState(null)
  
    const handleFirstname = (event) => {
      
      setFirstname(event.target.value)
    }
    const handleLastname = (event) => {
      
      setLastname(event.target.value)
    }
    const handleDate_naissance = (event) => {
      
      setDate_naissance(event.target.value)
    }
    const handleEmail = (event) => {
      
      setEmail(event.target.value)
    }
    const handlePwd = (event) => {
      
      setPwd(event.target.value)
    }
    const handleSuccessSubscription = (v) => {
      
      setSuccessSubscription(v)
    }
    const handleAbonnement = (event) => {
      
      setAbonnement(event.target.value)
    }
    const [subModal, setSubModal] = useState(false)
    const handleSubscriptionModal = () => {
      setSubModal(true)
    }
  
    const handleSubscription = () => {
      submitInscription({firstname, lastname, date_naissance, email, pwd, id_abonnement}, handleSuccessSubscription, props.infos.handleClose)
    }
  
    return (
      <Modal show={props.infos.show} onHide={props.infos.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sans abonnement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {subModal && SubscriptionModal(defV, handleFirstname, handleLastname, handleDate_naissance, handleEmail, handlePwd, handleAbonnement, handleSubscription, successSubscription)}
          {!subModal && props.infos.text}
          {!subModal && <div className="text-center pt-3">
            <Button variant="success" onClick={handleSubscriptionModal}>
              {props.infos.btnText}
            </Button>
          </div>}
        </Modal.Body>
      </Modal>
      )
    }