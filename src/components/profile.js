import React, {useState, useEffect} from 'react';
import {Tabs, Form, Button, Tab, Col, Row, Jumbotron, Accordion, Card, Spinner, Alert} from 'react-bootstrap'
import {submitModification} from '../components/inscription'
import { getCookie } from '../util/util'
import axios from 'axios'
import moment from 'moment';
import 'moment/locale/fr';
import {deleteCookie} from '../util/util';

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
              <Form.Control type="text" defaultValue={getCookie("lastname")} onKeyUp={handleLastname.bind(this)} required/>
            </Form.Group>
            <Form.Group controlId="prenom">
              <Form.Label className="float-left">Prenom</Form.Label>
              <Form.Control type="text" defaultValue={getCookie("firstname")} onKeyUp={handleFirstname.bind(this)} required/>
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
  const [isLoadingDelete, setIsLoadingDelete] = useState(false)
  console.log(props)
    return(
      <>
        <Jumbotron>
          <h3>{props.data.abonnement.nom}</h3>
          <p>
            {props.data.abonnement.text}
          </p>
          <p>
              {props.data.abonnement.id_abonnement !== "1" && <Button variant="danger" size="lg" onClick={() => Resiliation(props.data.abonnement.id, props.data.setIsDelete, setIsLoadingDelete, props.data.setIsLoading, props.data.isLoading, props.data.user)}>
                {isLoadingDelete && <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="pr-2"
                />}
                {!isLoadingDelete && "Résilier"}
              </Button>}
          </p>
        </Jumbotron>
        </>
    )
}

function Resiliation(idResAbonnement, setIsDelete, setIsLoadingDelete, setIsLoading, isLoading, user) {
  setIsLoadingDelete(true)
  axios.get('https://cowork-paris.000webhostapp.com/index.php/ResAbonnement/delete/'+idResAbonnement).then(res => {
    if(res.data[0] === "Res deleted successfully.") {
      deleteCookie("id_abonnement", "/")
      let userForCookie = {...user.user}
      userForCookie["id_abonnement"] = "null"
      user.handleUser(userForCookie)
      setIsDelete(true)
    }else {
      setIsDelete(false)
    }
    setIsLoadingDelete(false)
    setIsLoading({...isLoading, abonnement: true})
  }
  ).catch(err => console.log(err))
}

export function ProfileTab(props) {
  const [activeTab, setActiveTab] = useState("profile")
  const [abonnement, setAbonnement] = useState(null)
  const [isLoading, setIsLoading] = useState({profile: true, abonnement: true})
  const [isDelete, setIsDelete] = useState(null)

  const handleSelect = (tab) => {
    switch(tab) {
      case "profile" :
        setIsLoading({...isLoading, abonnement: true})
        break;
      case "abonnement" :
        setIsLoading({...isLoading, profile: true})
        break;
    }
    setActiveTab(tab)
  }
  
    useEffect(() => {
      if(activeTab === "abonnement") {
        axios.get('https://cowork-paris.000webhostapp.com/index.php/user/abonnement/'+props.user.user.id)
        .then(
          res => {
            if(res.data.length == 1) {
              axios.get('https://cowork-paris.000webhostapp.com/index.php/abonnement/'+res.data.map(v => v.id_abonnement))
            .then(resA => {
              let text = ""
              if(res.data[0].id_abonnement === "2") {
                text = "Prend fin le " +  moment(new Date(res.data[0].created_at)).add(1, 'years').locale('fr').format('LLLL')
              }
              else if(res.data[0].id_abonnement === "4") {
                text = "Prend fin le " +  moment(new Date(res.data[0].created_at)).add(8, 'months').locale('fr').format('LLLL')
              }
              console.log(text)
              setAbonnement({...res.data[0], nom: resA.data.nom, text: text})
              setIsLoading({...isLoading, abonnement: false})
            })
            .catch(err => console.log(err))
            } else {
              setAbonnement({id_abonnement: "1", nom: "Sans abonnement", text: ""})
              setIsLoading({...isLoading, abonnement: false})
            }
          })
        .catch(err => console.log(err))
      }
   }, [activeTab, isDelete]);

  return(
    <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" onSelect={(e) => handleSelect(e)}>
    <Tab eventKey="profile" title="Profil" name="profile">
        <Row>
            <Col lg="6" className="pt-3">
                <ProfileForm user={props.user}/>
            </Col>
        </Row>
    </Tab>
    <Tab eventKey="abonnement" title="Mon abonnement" name="abonnement">
        <Row>
            <Col lg="6" className="pt-3">
              {isDelete !== null && <Alert className="mb-0" variant={isDelete ? "success" : "danger"}>
              {isDelete ? "L'abonnement a bien été résillié" : "L'abonnement n'a pas pu être résilié"}
              </Alert>}
              {!isLoading.abonnement && <AbonnementTab data={{user: props.user, abonnement, setIsDelete, setIsLoading, isLoading}}/>}
              {isLoading.abonnement && <div className="text-center"><Spinner
              as="span"
              animation="border"
              size="sm"
              variant="primary"
              role="status"
              aria-hidden="true"
              style={{width: "5em", height: "5em"}}
              /></div>}
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

