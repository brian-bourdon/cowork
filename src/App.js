import React from 'react';
import {useState, useEffect} from 'react'
import './App.css';
import {Container, Row, Col, Spinner, CardDeck, Alert} from 'react-bootstrap'
import {InscriptionModal, ConnectionModal, TicketModal} from './components/modal'
import {Cards, CardsSpace} from './components/cards'
import {Header} from './components/header'
import {Footer} from './components/footer'
import {text_abonnement_residant, text_sans_abonnment, text_abonnment_simple, getCookie} from './util/util'
import {ProfileTab, CustomerReservations, DetailUser} from './components/profile'
import {validUser} from './components/inscription';
import {ReservationModal} from './components/reservation';
import {EvenemenentWrapper} from './components/evenement';
import axios from 'axios'
import moment from 'moment'

function App() {
  // Ne voir les space que si abonné, pouvoir reserver que si abonné, afficher une cards pour s'abonner dans le home si c'est pas le cas
  let userCookie = null
  if(validUser({firstname: getCookie("firstname"), lastname: getCookie("lastname"), date_naissance: getCookie("date_naissance"), email: getCookie("email"), pwd: getCookie("pwd"), id_abonnement: getCookie('id_abonnement')})) {
    userCookie = {id: getCookie("id"), firstname: getCookie("firstname"), lastname: getCookie("lastname"), date_naissance: getCookie("date_naissance"), email: getCookie("email"), pwd: getCookie("pwd"), id_abonnement: getCookie('id_abonnement')}
    if(getCookie("created_at")) userCookie["created_at"] = getCookie("created_at")
  }

  const [showI, setShowI] = useState(false);
  const handleCloseI = () => setShowI(false);
  const handleShowI = () => {
    setShowI(true)
  };

  const [showC, setShowC] = useState(false);
  const handleCloseC = () => setShowC(false);
  const handleShowC = () => setShowC(true);
  const [showD, setShowD] = useState(false);
  const handleShowD = () => setShowD(true);
  const handleCloseD = () => setShowD(false);

  const [profile, showProfile] = useState(false);

  const [user, setUser] = useState(userCookie);
  const [home, showHome] = useState(true)
  const [space, setSpace] = useState(null)

  const [showReservation, setReservation] = useState(false)
  const handleCloseR = () => setReservation(false);
  const [nomSpace, setNomSpace] = useState("")
  const [idSpace, setIdSpace] = useState("")

  const [updatedUser, setUpdatedUser] = useState(null)

  const [customerReservations, showCustomerReservations] = useState(false);
  const [evenement, showEvenement] = useState(false);
  const [expired, setExpired] = useState(false);
 
  const handleEvenements = () => {
    showEvenement(true)
    profile && showProfile(false)
    home && showHome(false)
    customerReservations && showCustomerReservations(false)
  }

  const handleReservation = (v, nom, id) => {
    setNomSpace(nom)
    setIdSpace(id)
    setReservation(v)
  }
  const handleHome = (v) => {
    setSpace(null)
    showHome(v)
    showCustomerReservations(!v)
    showEvenement(!v)
    showProfile(!v)
    setUpdatedUser(null)
  }
  const handleSpace = (v) => {
    setSpace(v)
  }
  const handleProfile = (v) => {
    showProfile(v)
    showHome(!v)
    showCustomerReservations(!v)
    showEvenement(!v)
  }

  const handleCustomerReservations = (v) => {
    showCustomerReservations(v)
    showProfile(!v)
    showHome(!v)
    showEvenement(!v)
  }

  const handleUser = (v) => {
    if(v === null) setSpace(null)
    if(v !== {}) { // && !== false
      console.log(user)
      console.log(v)
      setUser(v)
    }
  }
  useEffect(() => {
    document.title = "Co'work"
    console.log(home)
    console.log(expired)
    if(home && user) axios.get('https://cowork-paris.000webhostapp.com/index.php/space').then(res => handleSpace(res.data)).catch(err => console.log(err))
    if(getCookie("id_abonnement") === "2" || getCookie("id_abonnement") === "4") {
      console.log(moment(new Date(getCookie("created_at"))).add(8, 'months').locale('fr').diff(moment(new Date()), 'days') <= 0)
      let tmpnb
      if(getCookie("id_abonnement") === "2") tmpnb = 12
      else tmpnb = 8
      if(moment(new Date(getCookie("created_at"))).add(tmpnb, 'months').locale('fr').diff(moment(new Date()), 'days') <= 0) setExpired(true)
    }
 }, [user, home]);
 
  return (
    <div className="App">
      <Container fluid className="pl-0 pr-0">
        {showReservation && <ReservationModal data={{show: showReservation, handleClose: handleCloseR, nom: nomSpace, idSpace: idSpace, test: true, user: user}}/>}
        {showI && <InscriptionModal data={{show: showI, handleClose: handleCloseI, handleUser: handleUser}} />}
        {showC && <ConnectionModal data={{show: showC, handleClose: handleCloseC, handleUser: handleUser, user: user}}/>}
        {showD && <TicketModal data={{show: showD, handleClose: handleCloseD, user}} />}
          <Header data={{handleShowI, handleShowC, handleUser, handleProfile, handleHome, handleCustomerReservations, handleEvenements, user, expired}}/>
          <main className="p-3">
            <Row className={"justify-content-lg-center"}>
              <Col lg="12">
                {home && user && updatedUser !== null && <div className="text-center pb-3"><Alert className="mb-0" variant={updatedUser ? "info" : "danger"}>
                {updatedUser ? "Souscription réussie !" : "La souscription a échouée"}
                </Alert></div>}
              </Col>
              {home && !user &&
              <>
                <Col lg="auto">
                  <Alert className="mt-2 mb-5" variant="primary">
                    <Alert.Heading>Bienvenue sur CO'Work !</Alert.Heading>
                    <p>
                      Co'Work propose six espaces de travail collaboratif à Paris (Bastille,
                      République, Odéon, Place d'Italie, Ternes et Beaubourg).
                      Pour quelques euros de l’heure, venez rencontrez d'autres utilisateurs, vous détendre, organiser un rendez-vous,
                      travailler, accéder à Internet ou profiter de boissons chaudes et froides à volonté. Des
                      animations et des événements liés aux cultures innovantes rythment aussi la vie des différents espaces. 
                    </p>
                    <hr />
                    <p className="mb-0">
                      Accessible sans réservation ou abonnement en payant sur place.
                      Nous vous proposons les abonnements pour profiter au mieux des services, cliquez ci-dessous pour connaires les détails (services, tarifs...)
                    </p>
                  </Alert>
                  <CardDeck>
                    <Cards infos={{setExpired, text:text_sans_abonnment, title:"Sans abonnement", subtitle:"Payez le temps passé sur place, les consommations sont incluses et à volonté !", type: 0, connected: false, user: null, handleUser: null, setUpdatedUser: null, handleSpace: null}}/>
                    <Cards infos={{setExpired, text:text_abonnment_simple, title:"Abonnement simple", subtitle:"Rejoignez la communauté CO'WORK et bénéficiez de tarifs préférentiels !", type: 1, connected: false, user: null, handleUser: null, setUpdatedUser: null, handleSpace: null}}/>
                    <Cards infos={{setExpired, text:text_abonnement_residant, title:"Abonnement résident", subtitle:"Rejoignez la communauté CO'WORK et devenez membre résident !", type: 2,  connected: false, user: null, handleUser: null, setUpdatedUser: null, handleSpace: null}}/>
                  </CardDeck>
                </Col>
              </>}
              {home && user && (user.id_abonnement === "1" || user.id_abonnement === "null" || expired)  &&
              <>
                <Col lg="auto">
                <Alert variant="warning">Vous n'avez aucun abonnement en cours, abonnez vous pour profiter au mieux des services CO'Work</Alert>
                  <CardDeck>
                    <Cards infos={{setExpired, text:text_abonnment_simple, title:"Abonnement simple", subtitle:"Rejoignez la communauté CO'WORK et bénéficiez de tarifs préférentiels !", type: 1, connected: true, user: user, handleUser, setUpdatedUser, handleSpace}}/>
                    <Cards infos={{setExpired, text:text_abonnement_residant, title:"Abonnement résident", subtitle:"Rejoignez la communauté CO'WORK et devenez membre résident !", type: 2, connected: true, user: user, handleUser, setUpdatedUser, handleSpace}}/>
                  </CardDeck>
                </Col>
              </>}
              <Col lg="8">
                {home && user && user.id_abonnement !== "null" && user.id_abonnement !== "1" && !space && <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  variant="primary"
                  role="status"
                  aria-hidden="true"
                  style={{width: "5em", height: "5em"}}
                  />}
                <Row>
                <CardDeck>
                  <Row>
                  {home && user && user.id_abonnement !== "null" && user.id_abonnement !== "1" && !expired && space && space.map(s => 
                    <Col lg="4 pb-3">
                      <CardsSpace key={s.id} data={{title: s.nom, id: s.id, handleReservation: handleReservation}}/>
                    </Col>)}
                    </Row>
                </CardDeck>
                </Row>
              </Col>
              
            </Row>
            {profile && user && 
            <Row>
              <Col lg="12">
                <ProfileTab user={{handleUser: handleUser, user: user}}/>
              </Col>
            </Row>}
            {customerReservations && user && 
            <Row>
              <Col lg="12">
              <DetailUser data={{user}}/>
              </Col>
            </Row>}
            {evenement && user && 
            <Row>
              <Col lg="auto">
                <EvenemenentWrapper data={{evenement, user}}/>
              </Col>
            </Row>
            }
          </main>
          <Footer data={{handleShowD}}/>
      </Container>
    </div>
  );
}

export default App;
