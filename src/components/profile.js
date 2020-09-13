import React, {useState} from 'react';
import {Tabs, Form, Button, Tab, Col, Row, Jumbotron} from 'react-bootstrap'
import {submitModification} from '../components/inscription'
import { getCookie } from '../util/util';

function ProfileForm(props) {
    const[firstname, setFirstname] = useState(getCookie("firstname"))
    const[lastname, setLastname] = useState(getCookie("lastname"))
    const[date_naissance, setDate_naissance] = useState(getCookie("date_naissance"))
    const[email, setEmail] = useState(getCookie("email"))
    const[pwd, setPwd] = useState(getCookie("pwd"))
  
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
    const user = { ...props.user.user }
    delete user.id_abonnement

    return (
        <Form>
            <Form.Group controlId="nom">
              <Form.Label className="float-left">Nom:</Form.Label>
              <Form.Control type="text" defaultValue={getCookie("firstname")} onKeyUp={handleFirstname.bind(this)} required/>
            </Form.Group>
            <Form.Group controlId="prenom">
              <Form.Label className="float-left">Prenom</Form.Label>
              <Form.Control type="text" defaultValue={getCookie("lastname")} onKeyUp={handleLastname.bind(this)} required/>
            </Form.Group>
            <Form.Group controlId="prenom">
              <Form.Label className="float-left">Date de naissance</Form.Label>
              <Form.Control type="date" defaultValue={getCookie("date_naissance")} onKeyUp={handleDate_naissance.bind(this)} onChange={handleDate_naissance.bind(this)} required/>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label className="float-left">Email</Form.Label>
              <Form.Control type="email" defaultValue={getCookie("email")} onKeyUp={handleEmail.bind(this)} required/>
            </Form.Group>
            <Form.Group controlId="pwd">
              <Form.Label className="float-left">Mot de passe</Form.Label>
              <Form.Control type="password" defaultValue={getCookie("firstname")} onKeyUp={handlePwd.bind(this)} required/>
            </Form.Group>
            <div className="text-center pt-3">
              <Button disabled={JSON.stringify({firstname, lastname, date_naissance, email, pwd}) === JSON.stringify(user)} className="mb-3" variant="primary" onClick={() => submitModification({firstname, lastname, date_naissance, email, pwd}, props.user.handleUser)}>
                Modifier
              </Button>
            </div>
          </Form>
    )
}

function AbonnementTab(props) {
    let abonnement = ""
    if(props.user.user.id_abonnement === null) abonnement = "Aucun abonnement en cours"
    else if(props.user.user.id_abonnement === "1") abonnement = "Abonnement simple 12 mois sans engagement"
    else if(props.user.user.id_abonnement === "2") abonnement = "Abonnement simple sans engagement"
    else if(props.user.user.id_abonnement === "3") abonnement = "Abonnement résident 8 mois sans engagement"
    else if(props.user.user.id_abonnement === "4") abonnement = "Abonnement résident sans engagement"
    return(
        <Jumbotron>
        <h1>{abonnement}</h1>
        <p>
            This is a simple hero unit, a simple jumbotron-style component for calling
            extra attention to featured content or information.
        </p>
        <p>
            <Button variant="danger" size="lg">Résilier</Button>
        </p>
        </Jumbotron>
 
        
    )
}

export function ProfileTab(props) {
    console.log(props.user)
    return(
        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
        <Tab eventKey="profile" title="Profil">
            <Row>
                <Col lg="6" className="pt-3">
                    <ProfileForm user={props.user}/>
                </Col>
            </Row>
        </Tab>
        <Tab eventKey="abonnement" title="Mon abonnement">
            <Row>
                <Col lg="6" className="pt-3">
                    <AbonnementTab user={props.user}/>
                </Col>
            </Row>
        </Tab>
      </Tabs>
    )
  }