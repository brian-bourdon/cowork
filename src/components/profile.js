import React, {useState, useEffect} from 'react';
import {Tabs, Form, Button, Tab, Col, Row, Jumbotron, Accordion, Card, Spinner} from 'react-bootstrap'
import {submitModification} from '../components/inscription'
import { getCookie } from '../util/util'
import axios from 'axios'

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
  //console.log(props.user)
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

function ListReservations(props) {
  return (
    <Accordion defaultActiveKey="0">
      {props.data.map(v => 
      <Card>
        <Card.Header>
          <Accordion.Toggle as={Button} variant="link" eventKey={v.id}>
            {v.horaire_debut || v.horaire || v.id}
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey={v.id}>
          <Card.Body>
            {Object.keys(v).map((key) => <p>{key+": "+v[key]}</p>)}
          </Card.Body>
        </Accordion.Collapse>
      </Card>)
      }
    </Accordion>
  )
}

export function CustomerReservations(props) {
  const [privative, setPrivative] = useState([])

  const [equipment, setEquipment] = useState([])

  const [meal, setMeal] = useState([])

  const [events, setEvents] = useState([])

  const [activeTab, setActiveTab] = useState("privative")

  const [isLoading, setIsLoading] = useState({privative: true, equipment: true, meal: true, events: true})

  const handleSelect = (tab) => {
    switch(tab) {
      case "privative" :
        setIsLoading({...isLoading, equipment: true, meal: true, events: true})
        break;
      case "equipment" :
        setIsLoading({...isLoading, privative: true, meal: true, events: true})
        break;
      case 'meal' :
        setIsLoading({...isLoading, privative: true, equipment: true, events: true})
        break;
      case 'events' :
        setIsLoading({...isLoading, privative: true, equipment: true, meal: true})
        break;
    }
    setActiveTab(tab)
  }

  useEffect(() => {
    if(activeTab === "privative") {
      axios.get('https://cowork-paris.000webhostapp.com/index.php/user/privative/'+props.data.user.id)
      .then(res => {
          console.log(res.data)
          setIsLoading({...isLoading, privative: false})
          setPrivative(res.data)
      })
      .catch(e => setIsLoading({...isLoading, privative: false}))
    }
    if(activeTab === "equipment") {
      axios.get('https://cowork-paris.000webhostapp.com/index.php/user/equipment/'+props.data.user.id)
      .then(res => {
        setIsLoading({...isLoading, equipment: false})
          setEquipment(res.data)
      })
      .catch(e => setIsLoading({...isLoading, equipment: false}))
    }
    if(activeTab === "meal") {
      axios.get('https://cowork-paris.000webhostapp.com/index.php/user/meal/'+props.data.user.id)
      .then(res => {
        setIsLoading({...isLoading, meal: false})
          setMeal(res.data)
      })
      .catch(e => setIsLoading({...isLoading, meal: false}))
    }
    if(activeTab === "events") {
      axios.get('https://cowork-paris.000webhostapp.com/index.php/user/events/'+props.data.user.id)
      .then(res => {
        setIsLoading({...isLoading, events: false})
          setEvents(res.data)
      })
      .catch(e => setIsLoading({...isLoading, events: false}))
    }
  }, [activeTab]);

  return (
    <Tabs defaultActiveKey="privative" id="uncontrolled-tab-example" onSelect={(e) => handleSelect(e)}>
      <Tab eventKey="privative" title="Espaces privatifs" name="privative">
          <Row>
              <Col lg="6" className="pt-3">
                {isLoading.privative && <div className="text-center"><Spinner
                as="span"
                animation="border"
                size="sm"
                variant="primary"
                role="status"
                aria-hidden="true"
                style={{width: "5em", height: "5em"}}
                /></div>}
                {!isLoading.privative && activeTab === "privative" && <ListReservations data={privative}/>}
              </Col>
          </Row>
      </Tab>
      <Tab eventKey="equipment" title="Matériel" name="equipment">
          <Row>
              <Col lg="6" className="pt-3">
                {isLoading.equipment && <div className="text-center"><Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  variant="primary"
                  role="status"
                  aria-hidden="true"
                  style={{width: "5em", height: "5em"}}
                  /></div>}
                {!isLoading.equipment && activeTab === "equipment" && <ListReservations data={equipment}/>}
              </Col>
          </Row>
      </Tab>
      <Tab eventKey="meal" title="Plateaux repas" name="meal">
          <Row>
              <Col lg="6" className="pt-3">
                {isLoading.meal && <div className="text-center"><Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  variant="primary"
                  role="status"
                  aria-hidden="true"
                  style={{width: "5em", height: "5em"}}
                  /></div>}
                {!isLoading.meal && activeTab === "meal" && <ListReservations data={meal}/>}
              </Col>
          </Row>
      </Tab>
      <Tab eventKey="events" title="Evenements" name="events">
          <Row>
              <Col lg="6" className="pt-3">
                {isLoading.events && <div className="text-center"><Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  variant="primary"
                  role="status"
                  aria-hidden="true"
                  style={{width: "5em", height: "5em"}}
                  /></div>}
                {!isLoading.events && activeTab === "events" && <ListReservations data={events}/>}
              </Col>
          </Row>
      </Tab>
    </Tabs>
  )
}

