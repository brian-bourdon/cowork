import React from 'react';
import {useState, useEffect} from 'react'
import './App.css';
import {Container, Row, Col, Spinner} from 'react-bootstrap'
import {InscriptionModal, ConnectionModal} from './components/modal'
import {Cards, CardsSpace} from './components/cards'
import {Header} from './components/header'
import {Footer} from './components/footer'
import {text_abonnement_residant, text_sans_abonnment, text_abonnment_simple, getCookie} from './util/util'
import {ProfileTab} from './components/profile'
import {validUser} from './components/inscription';
import axios from 'axios'

function App() {
  let userCookie = null
  if(validUser({firstname: getCookie("firstname"), lastname: getCookie("lastname"), date_naissance: getCookie("date_naissance"), email: getCookie("email"), pwd: getCookie("pwd"), id_abonnement: getCookie("id_abonnement")})) {
    userCookie = {firstname: getCookie("firstname"), lastname: getCookie("lastname"), date_naissance: getCookie("date_naissance"), email: getCookie("email"), pwd: getCookie("pwd"), id_abonnement: getCookie("id_abonnement") === "null" ? null : getCookie("id_abonnmenent")}
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

  const handleSpace = (v) => {
    if(home && getCookie("id")) setSpace(v)
  }
  const handleProfile = (v) => {
    showProfile(v)
    showHome(!v)
  };

  const handleUser = (v) => {
    if(v !== {} && v && v !== user) {
      setUser(v)
    }
  }

  useEffect(() => {
    document.title = "Co'work"
    axios.get('https://cowork-paris.000webhostapp.com/index.php/space').then(res => handleSpace(res.data)).catch(err => console.log(err))

 }, []);
  console.log(user)
  return (
    <div className="App">
      <Container fluid className="pl-0 pr-0">
        <InscriptionModal data={{show: showI, handleClose: handleCloseI, handleUser: handleUser}} />
        {ConnectionModal(showC, handleCloseC, handleUser, user)}
          {Header(handleShowI, handleShowC, handleUser, handleProfile)}
          <main className="p-3">
            <Row className={"justify-content-lg-center"}>
              {home && !getCookie("id") && <><Col lg="auto">
                <Cards infos={{text:text_sans_abonnment, title:"Sans abonnement", subtitle:"Payez le temps passé sur place, les consommations sont incluses et à volonté !", type: 1}}/>
              </Col>
              <Col lg="auto">
                <Cards infos={{text:text_abonnment_simple, title:"Abonnement simple", subtitle:"Bénéficiez de tarifs préférentiels !", type: 2}}/>
              </Col>
              <Col lg="auto">
                <Cards infos={{text:text_abonnement_residant, title:"Abonnement résident", subtitle:"Devenez membre résident !", type: 3}}/>
              </Col></>}
              <Col lg="8">
                <Row>
              {home && getCookie("id") && space && space.map(s => 
              <Col lg="4 pb-3">
                <CardsSpace data={{title: s.nom}}/>
              </Col>)}
              </Row>
              </Col>
              {home && getCookie("id") && !space && <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="pr-2"
              />}
            </Row>
            {profile && getCookie("id") && 
            <Row>
              <Col lg="12">
                <ProfileTab user={{handleUser: handleUser, user: user}}/>
              </Col>
            </Row>}
          </main>
          <Footer/>
      </Container>
    </div>
  );
}

export default App;
