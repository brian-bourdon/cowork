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
    const [startDate, setStartDate] = useState(null);
    const [excludeTime, setExcludeTime] = useState([]);

    const[minTime, setMinTime] = useState(null)
    const[maxTime, setMaxTime] = useState(null)
    const CustomInput = ({ value, onClick }) => (
         <Form.Control type="text" className="example-custom-input" onClick={onClick} value={value} style={{borderColor: (props.data.typeRes === "1" || props.data.typeRes === "2") ? (!props.data.isLoading ? (props.data.disponible.status ? "green" : "red") : null) : null, borderWidth:  (props.data.typeRes === "1" || props.data.typeRes === "2") && !props.data.isLoading && "2px"}}/>
      );
    const handleDate = (date) => {
        setStartDate(date)
        if(props.data.handleDateTimeStart) props.data.handleDateTimeStart(date)
        else if(props.data.handleDateTimeEnd) props.data.handleDateTimeEnd(date)
        props.data.setIsLoading(true)
    }
    useEffect(() => {
        if(!startDate) {
            console.log(props.data.dateTimeStart)
            let date
            props.data.type === "start" ? date = setHours(setMinutes(new Date(), 0), moment(new Date(props.data.dateTimeStart)).format("H")) : date = setHours(setMinutes(new Date(), 0), moment(new Date(props.data.dateTimeEnd)).format("H"))
            setStartDate(date)

            const semaine = ["lundi","mardi","mercredi","jeudi"]
            const weekend = ["samedi","dimanche"]
            if(props.data.typeSelect === "1" || props.data.typeSelect === "2") {
                if(semaine.includes(moment(new Date()).format("dddd"))) {
                    setMinTime(setHours(setMinutes(new Date(), 0), props.data.horaireSpace.horaire_semaine_start.split(":")[0]))
                    setMaxTime(setHours(setMinutes(new Date(), 0), props.data.horaireSpace.horaire_semaine_end.split(':')[0]))
                }
                else if(weekend.includes(moment(new Date()).format("dddd"))) {
                    setMinTime(setHours(setMinutes(new Date(), 0), props.data.horaireSpace.horaire_weekend_start.split(":")[0]))
                    setMaxTime(setHours(setMinutes(new Date(), 0), props.data.horaireSpace.horaire_weekend_end.split(':')[0]))
                }
                else {
                    setMinTime(setHours(setMinutes(new Date(), 0), props.data.horaireSpace.horaire_vendredi_start.split(":")[0]))
                    setMaxTime(setHours(setMinutes(new Date(), 0), props.data.horaireSpace.horaire_vendredi_end.split(':')[0]))
                }
            }
            else { // Meal
                setMinTime(setHours(setMinutes(new Date(), 0), 12))
                setMaxTime(setHours(setMinutes(new Date(), 0), 14))
            }
        }
        if((startDate || props.data.reservation) && (moment(new Date(props.data.dateTimeStart)).format("YYYY-MM-DD") === moment(new Date(props.data.dateTimeEnd)).format("YYYY-MM-DD"))) {
            console.log(props.data.type)
            let uri
            props.data.typeSelect === "1" ? uri = "ReservationPrivateSpace/reservationByPrivateSpace/" : uri = "ReservationEquipment/reservationByEquipment/"
            axios.get('https://cowork-paris.000webhostapp.com/index.php/'+ uri + props.data.formSelect+"/"+moment(new Date(startDate)).format("YYYY-MM-DD"))
            .then(res => {
                console.log(res.data)
                let tmp = []
                let tmp2
                let tmp3
                for (const el of res.data) {
                    console.log(el["horaire_debut"])
                    if(props.data.type === "start") {
                        tmp2 = Number(moment(new Date(el["horaire_debut"])).format("H"))
                        tmp3 = Number(moment(new Date(el["horaire_fin"])).format("H"))
                    } else {
                        tmp2 = Number(moment(new Date(el["horaire_debut"])).format("H")) + 1
                        tmp3 = Number(moment(new Date(el["horaire_fin"])).format("H")) + 1
                    }

                    for(let i = tmp2; i < tmp3; i++) {
                        tmp.push(setHours(setMinutes(new Date(), 0), i))
                    }
                }
                setExcludeTime(tmp)
            })
            .catch(e => null)
        }
    }, [startDate, props.data.formSelect, props.data.reservation])
    
    return (
      <DatePicker
        locale="fr"
        selected={startDate}
        onChange={date => handleDate(date)}
        customInput={<CustomInput />}
        showTimeSelect
        timeIntervals={60}
        timeFormat="HH:mm"
        // Max et min en fonction des horaires d'ouvertures du space
        minTime={minTime}
        maxTime={maxTime}
        excludeTimes={excludeTime}
        // Construire un tableau d'excludes times pour les horaires non disponibles
        timeCaption="Heure"
        dateFormat="d/MM/yyyy HH:mm"
      />
    );
  };

function intializeDate(type, dateTimeStart, dateTimeEnd, setDateTimeStart, setDateTimeEnd) {
    if((type === "1" || type === "2") && !dateTimeStart && !dateTimeEnd) {
        let start
        let end
        if(moment(new Date()).format('m') !== "0") {

            start = moment(new Date()).add(1, 'hours').format('YYYY-MM-DD HH:00')
            //console.log(start)
            end = moment(new Date()).add(2, 'hours').format('YYYY-MM-DD HH:00')
        }
        else {
            start = moment(new Date()).format('YYYY-MM-DD HH:00')
            end = moment(new Date()).format('YYYY-MM-DD HH:00')
        }
        setDateTimeStart(start)
        setDateTimeEnd(end)
    }
    if(type === "3" && !dateTimeStart) {
        let s
        console.log(moment(new Date()).isBefore(new Date().setHours(12)))
        if(moment(new Date()).isBefore(new Date().setHours(12))) {
            s = moment(new Date()).format('YYYY-MM-DD 12:00')
        }
        else if(moment(new Date()).isSameOrAfter(new Date().setHours(12)) && moment(new Date()).isSameOrBefore(new Date().setHours(14))) {
            if(moment(new Date()).format('m') !== "0") {

                s = moment(new Date()).add(1, 'hours').format('YYYY-MM-DD HH:00')
            }
            else {
                s = moment(new Date()).format('YYYY-MM-DD HH:00')
            }
        }
        else s = moment(new Date().setHours(12)).add(1, 'days').format('YYYY-MM-DD HH:00')
        console.log(s)
        setDateTimeStart(s)
    }
}

export function ReservationModal(props) {
    const[type, setType] = useState("1")
    const[isLoadingSpace, setIsLoadingSpace] = useState(true)
    const[isLoadingEquipment, setIsLoadingEquipment] = useState(true)
    const[privativeSpace, setPrivativeSpace] = useState([]) // Tous, pour pouvoir créer le select
    const[equipment, setEquipment] = useState([])
    const[formPrivateSpace, setFormPrivateSpace] = useState(null) // Celui selectionné dans le select
    const[formEquipment, setFormEquipment] = useState(null)
    const[meal, setMeal] = useState([])
    const[formMeal, setFormMeal] = useState(null)
    const[isLoadingMeal, setIsLoadingMeal] = useState(true)



    const[dateTimeStart, setDateTimeStart] = useState(null)
    const[dateTimeEnd, setDateTimeEnd] = useState(null)
    const[reservation, setReservation] = useState(null)
    const[privateDisponible, setPrivateDisponible] = useState(null)
    const[isLoadingPrivateDisponible, setIsLoadingPrivateDisponible] = useState(true)

    const[equipmentDisponible, setEquipmentDisponible] = useState(null)
    const[isLoadingEquipmentDisponible, setIsLoadingEquipmentDisponible] = useState(true)

    const[horaireSpace, setHoraireSpace] = useState(null)
    const[isLoadingHoraireSpace, setIsLoadingHoraireSpace] = useState(true)

    const handleType = (event) => {
        if(event.target.value === "1" || event.target.value === "2") setIsLoadingSpace(true)
        if(event.target.value === "2") setIsLoadingEquipment(true)
        if(event.target.value === "3") setIsLoadingMeal(true)
        handleReservation(null)
        setType(event.target.value)
        if(event.target.value === "1" ) setIsLoadingPrivateDisponible(true) // Plus tard enlever le if
        intializeDate(type, dateTimeStart, dateTimeEnd, setDateTimeStart, setDateTimeEnd)
    }

    const handleFormPrivateSpace = (event) => {
        setIsLoadingPrivateDisponible(true)
        setFormPrivateSpace(event.target.value)
    }

    const handleFormEquipment = (event) => {
        setIsLoadingEquipmentDisponible(true)
        setFormEquipment(event.target.value)
    }

    const handleFormMeal = (event) => {
        setFormMeal(event.target.value)
    }

    const handleDateTimeStart = (v) => {
        console.log(v)
        setDateTimeStart(moment(v).format('YYYY-MM-DD HH:mm'))
    }

    const handleDateTimeEnd = (v) => {
        setDateTimeEnd(moment(v).format('YYYY-MM-DD HH:mm'))
    }

    const handleReservation = (v) => {
        type === "1" ? setIsLoadingPrivateDisponible(true) : setIsLoadingEquipmentDisponible(true)
        setReservation(v)
    }
    
    useEffect(() => {
        // Changer jour quand 23h01
        intializeDate(type, dateTimeStart, dateTimeEnd, setDateTimeStart, setDateTimeEnd)

        console.log("use_effect")
        if((type === "1" || type === "2" && dateTimeStart && dateTimeEnd) || (type === "3" && dateTimeStart)) {
            if(type === "1" || (type === "2" && isLoadingSpace)) {
                axios.get('https://cowork-paris.000webhostapp.com/index.php/PrivativeSpace/space/'+ props.data.idSpace)
                .then(res => {
                    console.log(res.data)
                    setIsLoadingSpace(false)
                    setPrivativeSpace(res.data)
                    if(!formPrivateSpace) setFormPrivateSpace([...res.data].shift().id)
                })
                .catch(e => setIsLoadingSpace(false))
            }
            if(type === "2" && isLoadingEquipment) {
                axios.get('https://cowork-paris.000webhostapp.com/index.php/Equipment/space/'+ props.data.idSpace)
                .then(res => {
                    console.log(res.data)
                    setIsLoadingEquipment(false)
                    setEquipment(res.data)
                    if(!formEquipment) setFormEquipment([...res.data].shift().id)
                })
                .catch(e => setIsLoadingEquipment(false))
            }
            if(type === "3" && isLoadingMeal) {
                axios.get('https://cowork-paris.000webhostapp.com/index.php/Meal/space/'+ props.data.idSpace)
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
            if(type === "2" && isLoadingEquipmentDisponible && formEquipment) {
                console.log("ok")
                console.log(formEquipment)
                console.log(isLoadingEquipmentDisponible)
                axios.get('https://cowork-paris.000webhostapp.com/index.php/ReservationEquipment/disponible/'+formEquipment+"/"+dateTimeStart.replace(" ", "+")+"/"+dateTimeEnd.replace(" ", "+"))
                .then(res => {
                    console.log(res.data)
                    setEquipmentDisponible(res.data)
                    setIsLoadingEquipmentDisponible(false)
                })
                .catch(e => setIsLoadingEquipmentDisponible(false))
            }
            if(isLoadingHoraireSpace) {
                axios.get('https://cowork-paris.000webhostapp.com/index.php/Space/horaires/'+props.data.idSpace)
                    .then(res => {
                        console.log(res.data)
                        setHoraireSpace(res.data)
                        setIsLoadingHoraireSpace(false)
                    })
                    .catch(e => setIsLoadingHoraireSpace(false))
            }
        }

    }, [props.data.idSpace, isLoadingPrivateDisponible, formPrivateSpace, type, formEquipment, isLoadingEquipmentDisponible, dateTimeStart, dateTimeEnd]);

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
            {((type === "1" && !isLoadingSpace && !isLoadingHoraireSpace && formPrivateSpace) || (type === "2" && !isLoadingSpace && !isLoadingEquipment && formEquipment)) && dateTimeStart && dateTimeEnd && <>
            <Form.Group>
                <Form.Label>Date et heure de début</Form.Label>
                <Form.Group><DateTimePicker data={{handleDateTimeStart, type: "start", setIsLoading: type === "1" ? setIsLoadingPrivateDisponible : setIsLoadingEquipmentDisponible, disponible: type === "1" ? privateDisponible: equipmentDisponible, isLoading: type === "1" ? isLoadingPrivateDisponible : isLoadingEquipmentDisponible, typeRes: type, horaireSpace, formSelect: type === "1" ? formPrivateSpace : formEquipment, dateTimeStart, dateTimeEnd, reservation, typeSelect: type}} /></Form.Group>
            </Form.Group>
            <Form.Group>
                <Form.Label>Date et heure de fin</Form.Label>
                <Form.Group><DateTimePicker data={{handleDateTimeEnd, type: "end", setIsLoading: type === "1" ? setIsLoadingPrivateDisponible : setIsLoadingEquipmentDisponible, disponible: type === "1" ? privateDisponible: equipmentDisponible, isLoading: type === "1" ? isLoadingPrivateDisponible : isLoadingEquipmentDisponible, typeRes: type, horaireSpace, formSelect: type === "1" ? formPrivateSpace : formEquipment, dateTimeStart, dateTimeEnd, reservation, typeSelect: type}} /></Form.Group>
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
                <Form.Group><DateTimePicker data={{handleDateTimeStart, type: "start", setIsLoading: setIsLoadingPrivateDisponible, typeRes: type, horaireSpace, dateTimeStart}}/></Form.Group>
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
            {type === "2" && !isLoadingEquipmentDisponible && <div className="text-center pb-3"><Alert className="mb-0" variant={equipmentDisponible.status ? "info" : "danger"}>
                {equipmentDisponible.msg}
            </Alert></div>}
            {reservation !== null && <div className="text-center"><Alert className="mb-0" variant={reservation ? "success" : "danger"}>
                {reservation ? "Réservation réussie !" : "La réservation a échoué !"}
            </Alert></div>}
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            {(type === "1" && !isLoadingPrivateDisponible || type === "2" && !isLoadingEquipmentDisponible || type === "3") && <Button variant="success" onClick={() => Reservation({type, form: type === "1" ? formPrivateSpace : type === "2" ? formEquipment : formMeal, dateTimeStart, dateTimeEnd}, handleReservation, props.data.user)} disabled={(type === "1" && !privateDisponible.status) || (type === "2" && !equipmentDisponible.status)}>
              Réserver
            </Button>}
            {((type === "1" && isLoadingPrivateDisponible) || (type === "2" && isLoadingEquipmentDisponible)) && <Spinner as="span" animation="border" size="sm" variant="primary" role="status" aria-hidden="true" />}
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
            formData.append('id_espace_privatif', data.form);
            formData.append('id_user', user.id);
        }
        if(data.type === "2") {
            url = "https://cowork-paris.000webhostapp.com/index.php/ReservationEquipment"
            formData.append('horaire_debut', data.dateTimeStart);
            formData.append('horaire_fin', data.dateTimeEnd);
            formData.append('id_equipment', data.form);
            formData.append('id_user', user.id);
        }
        if(data.type === "3") {
            url = "https://cowork-paris.000webhostapp.com/index.php/ReservationMeal"
            formData.append('horaire', data.dateTimeStart);
            formData.append('id_meal', data.form);
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