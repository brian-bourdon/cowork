import React, { useState, useEffect } from 'react';
import {Table, Form, FormControl, Button, Spinner, Row, Col, Alert, Tabs, Tab, Accordion, Card, ListGroup, ListGroupItem, Jumbotron} from 'react-bootstrap'
import axios from 'axios'
import {upperCaseFirst, setCookie, RealName, endAbonnementToString, formatStringToDate2, getCookie} from '../util/util';
import moment from 'moment';
import {submitModification} from '../components/inscription'
import 'moment/locale/fr';

export function DetailUser(props) {
    const[user, setUser] = useState(null)

    useEffect(() => {
        axios.get('https://cowork-paris.000webhostapp.com/index.php/user/'+props.data.user.id).then(res => setUser(res.data)).catch(err => console.log(err))
     }, [])

    return (
        <>
            {user &&
            <>
                <div className="pb-4"><h3>{upperCaseFirst(user.firstname.toLowerCase()) + " " + upperCaseFirst(user.lastname.toLowerCase())}{/*<Button className="float-right" variant="danger" disabled={user.admin === "true"}>Supprimer</Button>*/}</h3><hr/></div>
                <div className="pb-2"><h5>Informations et réservations</h5></div>
                <CustomerReservations data={{idUser: props.data.user.id, user: props.data.user}}/>
            </>
            }
        </>
    )
}

function CustomerReservations(props) {
    const [privative, setPrivative] = useState([])
  
    const [equipment, setEquipment] = useState([])
  
    const [meal, setMeal] = useState([])
  
    const [events, setEvents] = useState([])
  
    const [activeTab, setActiveTab] = useState("privative")
  
    const [isLoading, setIsLoading] = useState({privative: true, equipment: true, meal: true, events: true})
    const [isDeleted, setIsDeleted] = useState(null)
  
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
      console.log("kkkkkkkkkk")
      if(activeTab === "privative") {
        axios.get('https://cowork-paris.000webhostapp.com/index.php/user/privative/'+props.data.idUser)
        .then(res => {
            console.log(res.data)
            setIsLoading({...isLoading, privative: false})
            setPrivative(res.data)
        })
        .catch(e => setIsLoading({...isLoading, privative: false}))
      }
      if(activeTab === "equipment") {
        axios.get('https://cowork-paris.000webhostapp.com/index.php/user/equipment/'+props.data.idUser)
        .then(res => {
          setIsLoading({...isLoading, equipment: false})
            setEquipment(res.data)
        })
        .catch(e => setIsLoading({...isLoading, equipment: false}))
      }
      if(activeTab === "meal") {
        axios.get('https://cowork-paris.000webhostapp.com/index.php/user/meal/'+props.data.idUser)
        .then(res => {
          setIsLoading({...isLoading, meal: false})
            setMeal(res.data)
        })
        .catch(e => setIsLoading({...isLoading, meal: false}))
      }
      if(activeTab === "events") {
        axios.get('https://cowork-paris.000webhostapp.com/index.php/user/events/'+props.data.idUser)
        .then(res => {
          setIsLoading({...isLoading, events: false})
            setEvents(res.data)
        })
        .catch(e => setIsLoading({...isLoading, events: false}))
      }
    }, [activeTab, isDeleted]);
  
    return (
    <Row>
        <Col lg="6">
            <Tabs defaultActiveKey="privative" id="uncontrolled-tab-example" onSelect={(e) => handleSelect(e)}>
                <Tab eventKey="privative" title="Espaces privatifs" name="privative">
                    <Row>
                        <Col lg="12" className="pt-3">
                        {activeTab === "privative" && isDeleted !== null && <Alert variant={isDeleted ? "success" : "danger"}>
                        {isDeleted ? "Réservation annulée" : "Echec de l'annulation"}
                        </Alert>}
                        {isLoading.privative && <div className="text-center"><Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        variant="primary"
                        role="status"
                        aria-hidden="true"
                        style={{width: "5em", height: "5em"}}
                        /></div>}
                        {!isLoading.privative && activeTab === "privative" && <ListReservations data={{data: privative, setIsDeleted, type: "res_privative", setIsLoading, isLoading}}/>}
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="equipment" title="Matériel" name="equipment">
                    <Row>
                        <Col lg="12" className="pt-3">
                        {activeTab === "equipment" && isDeleted !== null && <Alert variant={isDeleted ? "success" : "danger"}>
                        {isDeleted ? "Réservation annulée" : "Echec de l'annulation"}
                        </Alert>}
                        {isLoading.equipment && <div className="text-center"><Spinner
                            as="span"
                            animation="border"
                            variant="primary"
                            role="status"
                            aria-hidden="true"
                            stye={{width: "5em", height: "5em"}}
                            /></div>}
                        {!isLoading.equipment && activeTab === "equipment" && <ListReservations data={{data: equipment, setIsDeleted, type: "res_equipment", setIsLoading, isLoading}}/>}
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="meal" title="Plateaux repas" name="meal">
                    <Row>
                        <Col lg="12" className="pt-3">
                        {activeTab === "meal" && isDeleted !== null && <Alert variant={isDeleted ? "success" : "danger"}>
                        {isDeleted ? "Réservation annulée" : "Echec de l'annulation"}
                        </Alert>}
                        {isLoading.meal && <div className="text-center"><Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            variant="primary"
                            role="status"
                            aria-hidden="true"
                            style={{width: "5em", height: "5em"}}
                            /></div>}
                        {!isLoading.meal && activeTab === "meal" && <ListReservations data={{data: meal, setIsDeleted, type: "res_meal", setIsLoading, isLoading}}/>}
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="events" title="Evenements" name="events">
                    <Row>
                        <Col lg="12" className="pt-3">
                        {activeTab === "events" && isDeleted !== null && <Alert variant={isDeleted ? "success" : "danger"}>
                        {isDeleted ? "Réservation annulée" : "Echec de l'annulation"}
                        </Alert>}
                        {isLoading.events && <div className="text-center"><Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            variant="primary"
                            role="status"
                            aria-hidden="true"
                            style={{width: "5em", height: "5em"}}
                            /></div>}
                        {!isLoading.events && activeTab === "events" && <ListReservations data={{data: events, setIsDeleted, type: "res_events", setIsLoading, isLoading}}/>}
                        </Col>
                    </Row>
                </Tab>
            </Tabs>
        </Col>
    </Row>
    )
  }


  function ListReservations(props) {
    return (
      <Accordion defaultActiveKey="0">
        {props.data.data.map(v => <DetailsReservation key={v.id} data={{data: v, type: props.data.type, setIsDeleted: props.data.setIsDeleted, setIsLoading: props.data.setIsLoading, isLoading: props.data.isLoading}}/>)}
      </Accordion>
    )
  }

  function Annuler(id, setIsDeleted, type, setIsLoading, isLoading) {
    console.log(type)
    let uri = ""
    if(type === "res_privative") uri = "ReservationPrivateSpace/delete/"
    else if (type === "res_equipment") uri = "ReservationEquipment/delete/"
    else if (type === "res_meal") uri = "ReservationMeal/delete/"
    else if (type === "res_events") uri = "ReservationEvents/delete/"
  
    axios.get("https://cowork-paris.000webhostapp.com/index.php/"+uri+id).then(res => {
      let tmp = {}
      tmp[type] = true
      console.log(tmp)
      setIsDeleted(tmp)
      let tmpLoad = {...isLoading}
      tmpLoad[type] = true
      setIsLoading(tmpLoad)
    }).catch(err => setIsDeleted({}))
  }

function DetailsReservation(props) {
    const[details, setDetails] = useState(null)
    const[isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let uri, field;
        if(props.data.type === "res_privative" ) {
          uri = "PrivativeSpace"
          field = "id_espace_privatif"
        }
        else if(props.data.type === "res_equipment" ) {
          uri = "equipment"
          field = "id_equipment"
        }
        else if(props.data.type === "res_meal" ) {
          uri = "meal"
          field = "id_meal"
        }
        else if(props.data.type === "res_events" ) {
          uri = "events"
          field = "id_events"
        }

        axios.get('https://cowork-paris.000webhostapp.com/index.php/'+uri +'/'+props.data.data[field]).then(res => {
            setDetails(res.data)
            setIsLoading(false)
        }).catch(err => {
            setDetails(null)
            setIsLoading(false)
        })
    }, [props.data.data.length > 0 && props.data.data[0].id])

    return (
        <>
        {<Card>
          <Card.Header>
          <Button variant="danger" className="float-right" onClick={() => Annuler(props.data.data.id, props.data.setIsDeleted, props.data.type, props.data.setIsLoading, props.data.isLoading)}>Annuler</Button>
            <Accordion.Toggle as={Button} variant="link" eventKey={props.data.data.id}>
                {isLoading && ["danger","warning","success"].map((s,i) => <Spinner key={i} animation="grow" as="span" size="sm" variant={s} role="status" aria-hidden="true"/>)}
                {!isLoading && details && details.nom + " | "}
                {(formatStringToDate2(props.data.data.horaire_debut || props.data.data.horaire || props.data.data.id))}
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey={props.data.data.id}>
            <Card.Body>
                {Object.keys(props.data.data).filter(k => k !== "id" && k !== "id_user").map((key,i) => {
                    let res
                    let val
                    if(key.includes("horaire")) val = formatStringToDate2(props.data.data[key])
                    else if(key === "id_espace_privatif" || key === "id_equipment" || key === "id_meal" || key === "id_events") {
                        if(isLoading) val = false
                        else val = details.nom
                    }
                    else val = props.data.data[key]
                    if(val) return <p key={i}>{RealName(props.data.type, key)+": "+val}</p>
                    else return ["danger","warning","success"].map((s,j) => <Spinner key={i+j} animation="grow" as="span" size="sm" variant={s} role="status" aria-hidden="true"/>)
                })}
            </Card.Body>
          </Accordion.Collapse>
        </Card>}
        </>
    )
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
                let textPrelevement = ""
                let textFin = ""
  
                  if(res.data[0].id_abonnement === "2") {
                    text = "Prend fin le " +  moment(new Date(res.data[0].created_at)).add(1, 'years').locale('fr').format('LLLL')
                    if(moment(new Date(res.data[0].created_at)).add(12, 'months').locale('fr').diff(moment(new Date()), 'months') <= 1) textFin = "Votre abonnement expire bientôt, pensez à renouveller !"
                    if(moment(new Date(res.data[0].created_at)).add(12, 'months').locale('fr').diff(moment(new Date()), 'days') <= 0) textFin = "Votre abonnement a expiré !"
                  }
                  else if(res.data[0].id_abonnement === "4") {
                    text = "Prend fin le " +  moment(new Date(res.data[0].created_at)).add(8, 'months').locale('fr').format('LLLL')
                    if(moment(new Date(res.data[0].created_at)).add(8, 'months').locale('fr').diff(moment(new Date()), 'months') <= 1) textFin = "Votre abonnement expire bientôt, pensez à renouveller !"
                    if(moment(new Date(res.data[0].created_at)).add(8, 'months').locale('fr').diff(moment(new Date()), 'days') <= 0) textFin = "Votre abonnement a expiré !"
                  }
                  
                  if(res.data[0].id_abonnement !== "1" && textFin !== "Votre abonnement a expiré !") {
                    let date
                    if(new Date().setDate(new Date(res.data[0].created_at).getDate()) <= new Date()) date = moment(new Date().setDate(new Date(res.data[0].created_at).getDate())).locale('fr').add(1, "months").format("dddd Do MMMM YYYY")
                    else date = moment(new Date().setDate(new Date(res.data[0].created_at).getDate())).locale('fr').format("dddd Do MMMM YYYY") 
                    textPrelevement = "Prochain prélevement le " + date
                  }
                console.log(text)
                setAbonnement({...res.data[0], nom: resA.data.nom, text: text, textPrelevement, textFin})
                setIsLoading({...isLoading, abonnement: false})
              })
              .catch(err => console.log(err))
              } else {
                setAbonnement({id_abonnement: "1", nom: "Sans abonnement", text: "", textPrelevement: "", textFin: ""})
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
                {isDelete !== null && <Alert className="mb-2" variant={isDelete ? "success" : "danger"}>
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

  function ProfileForm(props) {
    console.log(props.user.user)
      const[firstname, setFirstname] = useState(getCookie("firstname"))
      const[lastname, setLastname] = useState(getCookie("lastname"))
      const[date_naissance, setDate_naissance] = useState(getCookie("date_naissance"))
      const[email, setEmail] = useState(getCookie("email"))
      const[pwd, setPwd] = useState(getCookie("pwd"))
      const[successModification, setSuccessModification] = useState(null)
  
      const handleSuccessModification = (v) => {
        setSuccessModification(v)
      }
    
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
                <Button disabled={JSON.stringify({firstname, lastname, date_naissance, email, pwd}) === JSON.stringify({firstname: user.firstname, lastname: user.lastname, date_naissance: user.date_naissance, email: user.email, pwd: user.pwd})} className="mb-3" variant="primary" onClick={() => submitModification({firstname, lastname, date_naissance, email, pwd}, props.user.user, props.user.handleUser, handleSuccessModification)}>
                  Modifier
                </Button>
              </div>
              {successModification !== null && <div className="text-center"><Alert className="mb-0" variant={successModification ? "success" : "danger"}>
              {successModification ? "Modification effectuée(s)" : "La modification a échoué"}
              </Alert></div>}
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
            <p><b>
              {props.data.abonnement.textFin}
              </b>
            </p>
            <p>
              {props.data.abonnement.textPrelevement}
            </p>
            {console.log(props.data.abonnement.textFin)}
            <p>
                {(props.data.abonnement.id_abonnement !== "1" && props.data.abonnement.textFin !== "Votre abonnement a expiré !") && <Button variant="danger" size="lg" onClick={() => Resiliation(props.data.abonnement.id, props.data.setIsDelete, setIsLoadingDelete, props.data.setIsLoading, props.data.isLoading, props.data.user)}>
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
        setCookie("id_abonnement", "null", 1)
        let userForCookie = {...user.user}
        userForCookie["id_abonnement"] = "null"
        userForCookie["created_at"] = "null"
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