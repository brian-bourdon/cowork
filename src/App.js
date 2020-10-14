import React from 'react';
import {useState, useEffect} from 'react'
import './App.css';
import {Container, Row, Col, Spinner, CardDeck} from 'react-bootstrap'
import {InscriptionModal, ConnectionModal} from './components/modal'
import {Cards, CardsSpace} from './components/cards'
import {Header} from './components/header'
import {Footer} from './components/footer'
import {text_abonnement_residant, text_sans_abonnment, text_abonnment_simple, getCookie} from './util/util'
import {ProfileTab, CustomerReservations} from './components/profile'
import {validUser} from './components/inscription';
import {ReservationModal} from './components/reservation';
import {EvenemenentWrapper} from './components/evenement';
import axios from 'axios'


function App() {
  let userCookie = null
  if(validUser({firstname: getCookie("firstname"), lastname: getCookie("lastname"), date_naissance: getCookie("date_naissance"), email: getCookie("email"), pwd: getCookie("pwd")})) {
    userCookie = {id: getCookie("id"), firstname: getCookie("firstname"), lastname: getCookie("lastname"), date_naissance: getCookie("date_naissance"), email: getCookie("email"), pwd: getCookie("pwd")}
  }

  const [showI, setShowI] = useState(false);
  const handleCloseI = () => setShowI(false);
  const handleShowI = () => {
    setShowI(true)
  };

  const [showC, setShowC] = useState(false);
  const handleCloseC = () => setShowC(false);
  const handleShowC = () => setShowC(true);

  const [profile, showProfile] = useState(false);

  const [user, setUser] = useState(userCookie);
  const [home, showHome] = useState(true)
  const [space, setSpace] = useState(null)

  const [showReservation, setReservation] = useState(false)
  const handleCloseR = () => setReservation(false);
  const [nomSpace, setNomSpace] = useState("")
  const [idSpace, setIdSpace] = useState("")

  const [customerReservations, showCustomerReservations] = useState(false);
  const [evenement, showEvenement] = useState(false);

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
    if(v !== {} && v !== user) {
      console.log(v)
      setUser(v)
    }
  }
  
  useEffect(() => {
    document.title = "Co'work"
    console.log(home)
    console.log(user)
    if(home && user) axios.get('https://cowork-paris.000webhostapp.com/index.php/space').then(res => handleSpace(res.data)).catch(err => console.log(err))
 }, [user, home]);
 
  return (
    <div className="App">
      <Container fluid className="pl-0 pr-0">
        {showReservation && <ReservationModal data={{show: showReservation, handleClose: handleCloseR, nom: nomSpace, idSpace: idSpace, test: true, user: user}}/>}
        {showI && <InscriptionModal data={{show: showI, handleClose: handleCloseI, handleUser: handleUser}} />}
        {showC && <ConnectionModal data={{show: showC, handleClose: handleCloseC, handleUser: handleUser, user: user}}/>}
          <Header data={{handleShowI, handleShowC, handleUser, handleProfile, handleHome, handleCustomerReservations, handleEvenements}}/>
          <main className="p-3">
            <Row className={"justify-content-lg-center"}>
              {home && !getCookie("id") && 
              <>
                <Col lg="auto">
                  <CardDeck>
                    <Cards infos={{text:text_sans_abonnment, title:"Sans abonnement", subtitle:"Payez le temps passé sur place, les consommations sont incluses et à volonté !", type: 0}}/>
                    <Cards infos={{text:text_abonnment_simple, title:"Abonnement simple", subtitle:"Bénéficiez de tarifs préférentiels !", type: 1}}/>
                    <Cards infos={{text:text_abonnement_residant, title:"Abonnement résident", subtitle:"Devenez membre résident !", type: 2}}/>
                  </CardDeck>
                </Col>
              </>}
              <Col lg="8">
                {home && getCookie("id") && !space && <Spinner
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
                  {home && getCookie("id") && space && space.map(s => 
                    <Col lg="4 pb-3">
                      <CardsSpace key={s.id} data={{title: s.nom, id: s.id, handleReservation: handleReservation}}/>
                    </Col>)}
                    </Row>
                </CardDeck>
                  {/* TODO: Replace by card deck */}
                </Row>
              </Col>
              
            </Row>
            {profile && getCookie("id") && 
            <Row>
              <Col lg="12">
                <ProfileTab user={{handleUser: handleUser, user: user}}/>
              </Col>
            </Row>}
            {customerReservations && getCookie("id") && 
            <Row>
              <Col lg="12">
                <CustomerReservations data={{user}}/>
              </Col>
            </Row>}
            {evenement && getCookie("id") && 
            <Row>
              <Col lg="auto">
                <EvenemenentWrapper data={{evenement, user}}/>
              </Col>
            </Row>
            }
          </main>
          <Footer/>
      </Container>
    </div>
  );
}

export default App;
