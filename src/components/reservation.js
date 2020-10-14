import React, { useState, useEffect } from 'react';
import {Form, Button,Modal, Spinner, Alert, FormControl} from 'react-bootstrap'
import axios from 'axios'
import DatePicker, { registerLocale } from "react-datepicker";
import setHours from 'date-fns/setHours'
import setMinutes from 'date-fns/setMinutes'
import getHours from 'date-fns/setMinutes'
import fr from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

const DateTimePicker = (props) => {
    registerLocale("fr", fr);
    let type = 1
    props.data.type === "start" ? type = 1 : type = 2
    const [startDate, setStartDate] = useState(
      setHours(setMinutes(new Date(), 0), moment(new Date()).format('m') !== "0" ? moment(new Date()).add(type, 'hours').format('H') :  moment(new Date()).format('H'))
    );
    const CustomInput = ({ value, onClick }) => (
         <Form.Control type="text" className="example-custom-input" onClick={onClick} value={value} style={{borderColor: props.data.type === "1" ? (!props.data.isLoadingPrivateDisponible ? (props.data.privateDisponible.status ? "green" : "red") : null) : null, borderWidth:  props.data.type === "1" && !props.data.isLoadingPrivateDisponible && "2px"}}/>
      );
    const handleDate = (date) => {
        setStartDate(date)
        if(props.data.handleDateTimeStart) props.data.handleDateTimeStart(date)
        else if(props.data.handleDateTimeEnd) props.data.handleDateTimeEnd(date)
        props.data.setIsLoadingPrivateDisponible(true)
    }
    return (
      <DatePicker
        locale="fr"
        selected={startDate}
        onChange={date => handleDate(date)}
        customInput={<CustomInput />}
        showTimeSelect
        timeIntervals={60}
        timeFormat="HH:mm"
        //minTime={setHours(setMinutes(new Date(), 0), 9)}
        //maxTime={setHours(setMinutes(new Date(), 0), 17)}
        timeCaption="Heure"
        dateFormat="d/MM/yyyy HH:mm"
      />
    );
  };

export function ReservationModal(props) {
    const[type, setType] = useState("1")
    const[isLoadingSpace, setIsLoadingSpace] = useState(true)
    const[isLoadingEquipment, setIsLoadingEquipment] = useState(true)
    const[privativeSpace, setPrivativeSpace] = useState([]) // Tous pour pouvoir créer le select
    const[equipment, setEquipment] = useState([])
    const[formPrivateSpace, setFormPrivateSpace] = useState(null) // Celui selectionné dans le select
    const[formEquipment, setFormEquipment] = useState(null)
    const[meal, setMeal] = useState([])
    const[formMeal, setFormMeal] = useState(null)
    const[isLoadingMeal, setIsLoadingMeal] = useState(true)
    // Changer jour quand 23h01
    const[dateTimeStart, setDateTimeStart] = useState(moment(new Date()).format('m') !== "0" ? moment(new Date()).add(1, 'hours').format('YYYY-MM-DD HH:00') : moment(new Date()).format('YYYY-MM-DD HH:00'))
    const[dateTimeEnd, setDateTimeEnd] = useState(moment(new Date()).format('m') !== "0" ? moment(new Date()).add(2, 'hours').format('YYYY-MM-DD HH:00') : moment(new Date()).format('YYYY-MM-DD HH:00'))
    const[reservation, setReservation] = useState(null)
    const[privateDisponible, setPrivateDisponible] = useState(null)
    const[isLoadingPrivateDisponible, setIsLoadingPrivateDisponible] = useState(true)

    const handleType = (event) => {
        if(event.target.value === "1" || event.target.value === "2") setIsLoadingSpace(true)
        if(event.target.value === "2") setIsLoadingEquipment(true)
        if(event.target.value === "3") setIsLoadingMeal(true)
        handleReservation(null)
        setType(event.target.value)
        if(event.target.value === "1" ) setIsLoadingPrivateDisponible(true) // Plus tard enlever le if
    }

    const handleFormPrivateSpace = (event) => {
        setIsLoadingPrivateDisponible(true)
        setFormPrivateSpace(event.target.value)
    }

    const handleFormEquipment = (event) => {
        setFormEquipment(event.target.value)
    }

    const handleFormMeal = (event) => {
        setFormMeal(event.target.value)
    }

    const handleDateTimeStart = (v) => {
        setDateTimeStart(moment(v).format('YYYY-MM-DD HH:mm'))
        //console.log("debut "+moment(v).format('YYYY-MM-DD HH:mm'))
    }

    const handleDateTimeEnd = (v) => {
        setDateTimeEnd(moment(v).format('YYYY-MM-DD HH:mm'))
        //console.log("fin "+moment(v).format('YYYY-MM-DD HH:mm'))
    }

    const handleReservation = (v) => {
        setIsLoadingPrivateDisponible(true)
        setReservation(v)
    }
    
    useEffect(() => {
        console.log("use_effect")
        if(type === "1" || (type === "2" && isLoadingSpace)) {
            axios.get('https://cowork-paris.000webhostapp.com/index.php/PrivativeSpace/'+ props.data.idSpace)
            .then(res => {
                console.log(res.data)
                setIsLoadingSpace(false)
                setPrivativeSpace(res.data)
                setFormPrivateSpace([...res.data].shift().id)
            })
            .catch(e => setIsLoadingSpace(false))
        }
        if(type === "2" && isLoadingEquipment) {
            axios.get('https://cowork-paris.000webhostapp.com/index.php/Equipment/'+ props.data.idSpace)
            .then(res => {
                console.log(res.data)
                setIsLoadingEquipment(false)
                setEquipment(res.data)
                setFormEquipment([...res.data].shift().id)
            })
            .catch(e => setIsLoadingEquipment(false))
        }
        if(type === "3" && isLoadingMeal) {
            axios.get('https://cowork-paris.000webhostapp.com/index.php/Meal/'+ props.data.idSpace)
            .then(res => {
                console.log(res.data)
                setIsLoadingMeal(false)
                setMeal(res.data)
                setFormMeal([...res.data].shift().id)
            })
            .catch(e => setIsLoadingMeal(false))
        }
        if(type === "1" && isLoadingPrivateDisponible && formPrivateSpace) {
            console.log("ok")
            console.log(formPrivateSpace)
            console.log(isLoadingPrivateDisponible)
            axios.get('https://cowork-paris.000webhostapp.com/index.php/ReservationPrivateSpace/disponible/'+formPrivateSpace+"/"+dateTimeStart.replace(" ", "+")+"/"+dateTimeEnd.replace(" ", "+"))
            .then(res => {
                console.log(res.data)
                setPrivateDisponible(res.data)
                setIsLoadingPrivateDisponible(false)
            })
            .catch(e => setIsLoadingPrivateDisponible(false))
        }

      }, [props.data.idSpace, isLoadingPrivateDisponible, formPrivateSpace, type]);

    return(
        <>
        <Modal show={props.data.show} onHide={props.data.handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{"Réservation " + props.data.nom}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
          <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Type</Form.Label>
                <Form.Control as="select" defaultValue={type} onChange={handleType.bind(this)}>
                <option value="1">Espace privatif</option>
                <option value="2">Prêts de matériels</option>
                <option value="3">Commandes de plateaux repas</option>
                </Form.Control>
            </Form.Group>
            {(type === "1") && !isLoadingSpace &&
            <>
            <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Espace privatifs</Form.Label>
                <Form.Control as="select" onChange={handleFormPrivateSpace.bind(this)}>
                    {privativeSpace.map(v => <option key={v.id} value={v.id}>{v.nom}</option>)}
                </Form.Control>
            </Form.Group>
            </>}
            {type === "2" && !isLoadingEquipment &&  <Form.Group controlId="exampleForm.ControlSelect2">
                <Form.Label>Equipements</Form.Label>
                <Form.Control as="select" onChange={handleFormEquipment.bind(this)}>
                    {equipment.map(v => <option value={v.id}>{v.nom}</option>)}
                </Form.Control>
            </Form.Group>
            }
            {((type === "1" && !isLoadingSpace) || (type === "2" && !isLoadingSpace && !isLoadingEquipment)) && <>
            <Form.Group>
                <Form.Label>Date et heure de début</Form.Label>
                <Form.Group><DateTimePicker data={{handleDateTimeStart, type: "start", setIsLoadingPrivateDisponible, privateDisponible, isLoadingPrivateDisponible, type: type}} /></Form.Group>
            </Form.Group>
            <Form.Group>
                <Form.Label>Date et heure de fin</Form.Label>
                <Form.Group><DateTimePicker data={{handleDateTimeEnd, type: "end", setIsLoadingPrivateDisponible, privateDisponible, isLoadingPrivateDisponible, type: type}} /></Form.Group>
            </Form.Group>
            </>}
            {type === "3" && !isLoadingMeal && 
            <>
            <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Plateaux repas</Form.Label>
                <Form.Control as="select" onChange={handleFormMeal.bind(this)}>
                    {meal.map(v => <option value={v.id}>{v.nom}</option>)}
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Date et heure</Form.Label>
                <Form.Group><DateTimePicker data={{handleDateTimeStart, type: "start", setIsLoadingPrivateDisponible, type: type}}/></Form.Group>
            </Form.Group>
            </>
            }
            {(isLoadingSpace || (type === "2" && isLoadingEquipment) || (type === "3" && isLoadingMeal)) && <div className="text-center"><Spinner
                as="span"
                animation="border"
                size="sm"
                variant="primary"
                role="status"
                aria-hidden="true"
                style={{width: "5em", height: "5em"}}
                /></div>
            }
            </Form>
            {type === "1" && !isLoadingPrivateDisponible && <div className="text-center pb-3"><Alert className="mb-0" variant={privateDisponible.status ? "info" : "danger"}>
                {privateDisponible.msg}
            </Alert></div>}
            {reservation !== null && <div className="text-center"><Alert className="mb-0" variant={reservation ? "success" : "danger"}>
                {reservation ? "Réservation réussie !" : "La réservation a échoué !"}
            </Alert></div>}
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            {(type === "1" && !isLoadingPrivateDisponible || type !== "1") && <Button variant="success" onClick={() => Reservation({type, formPrivateSpace, dateTimeStart, dateTimeEnd}, handleReservation, props.data.user)} disabled={!privateDisponible.status}>
              Réserver
            </Button>}
            {type === "1" && isLoadingPrivateDisponible && <Spinner as="span" animation="border" size="sm" variant="primary" role="status" aria-hidden="true" />}
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  const Reservation = (data, handleReservation, user) => {
      let inscription = false
      let url = false
      if(data) {
        let formData = new FormData();
        if(data.type === "1") {
            url = "https://cowork-paris.000webhostapp.com/index.php/ReservationPrivateSpace"
            formData.append('horaire_debut', data.dateTimeStart);
            formData.append('horaire_fin', data.dateTimeEnd);
            formData.append('id_espace_privatif', data.formPrivateSpace);
            formData.append('id_user', user.id);
        }
        if(data.type === "2") {
            url = "https://cowork-paris.000webhostapp.com/index.php/ReservationEquipment"
            formData.append('horaire_debut', data.dateTimeStart);
            formData.append('horaire_fin', data.dateTimeEnd);
            formData.append('id_equipment', data.formPrivateSpace);
            formData.append('id_user', user.id);
        }
        if(data.type === "3") {
            url = "https://cowork-paris.000webhostapp.com/index.php/ReservationMeal"
            formData.append('horaire', data.dateTimeStart);
            formData.append('id_meal', data.formPrivateSpace);
            formData.append('id_user', user.id);
        }
        if(url) {
            fetch(url,
                {
                    body: formData,
                    method: "post"
                })
                .then(res=>res.json())
                .then(res => {
                if(res[0] === "Reservation created successfully.") {
                    inscription = true
                }
                handleReservation(inscription)
                })
                .catch(e => {
                    handleReservation(inscription)
                })
            }
        }
    }