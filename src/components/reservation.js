import React, { useState, useEffect } from 'react';
import {Form, Button,Modal, Spinner, Alert, FormControl} from 'react-bootstrap'
import axios from 'axios'
import DatePicker, { registerLocale } from "react-datepicker";
import setHours from 'date-fns/setHours'
import setMinutes from 'date-fns/setMinutes'
import fr from "date-fns/locale/fr"; // the locale you want
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

const DateTimePicker = (props) => {
    registerLocale("fr", fr);
    const [startDate, setStartDate] = useState(
      setHours(setMinutes(new Date(), 30), 16)
    );
    const CustomInput = ({ value, onClick }) => (
         <Form.Control type="text" className="example-custom-input" onClick={onClick} value={value}/>
      );
    const handleDate = (date) => {
        setStartDate(date)
        if(props.data.handleDateTimeStart) props.data.handleDateTimeStart(date)
        else if(props.data.handleDateTimeEnd) props.data.handleDateTimeEnd(date)
    }
    return (
      <DatePicker
        locale="fr"
        selected={startDate}
        onChange={date => handleDate(date)}
        customInput={<CustomInput />}
        showTimeSelect
        excludeTimes={[
          setHours(setMinutes(new Date(), 0), 17),
          setHours(setMinutes(new Date(), 30), 18),
          setHours(setMinutes(new Date(), 30), 19),
          setHours(setMinutes(new Date(), 30), 17)
        ]}
        timeCaption="Heure"
        dateFormat="d/MM/yyyy HH:mm"
      />
    );
  };

export function ReservationModal(props) {
    const[type, setType] = useState(1)
    const[isLoading, setIsLoading] = useState(props.data.test)
    const[privativeSpace, setPrivativeSpace] = useState([])
    const[formPrivateSpace, setFormPrivateSpace] = useState(null)
    const[dateTimeStart, setDateTimeStart] = useState(moment(setHours(setMinutes(new Date(), 30), 16)).format('YYYY-MM-DD HH-mm-ss'))
    const[dateTimeEnd, setDateTimeEnd] = useState(moment(setHours(setMinutes(new Date(), 30), 16)).format('YYYY-MM-DD HH-mm-ss'))
    const[reservation, setReservation] = useState(null)

    const handleType = (event) => {
        setType(event.target.value)
    }

    const handleFormPrivateSpace = (event) => {
        setFormPrivateSpace(event.target.value)
    }

    const handleDateTimeStart = (v) => {
        setDateTimeStart(moment(v).format('YYYY-MM-DD HH:mm:ss'))
    }

    const handleDateTimeEnd = (v) => {
        setDateTimeEnd(moment(v).format('YYYY-MM-DD HH:mm:ss'))
    }

    const handleReservation = (v) => {
        setReservation(v)
    }
    
    useEffect(() => {
        axios.get('https://cowork-paris.000webhostapp.com/index.php/PrivativeSpace/'+ props.data.idSpace)
        .then(res => {
            console.log(res.data)
            setIsLoading(false)
            setPrivativeSpace(res.data)
            setFormPrivateSpace([...res.data].shift().id)
        })
        .catch(e => setIsLoading(false))
      }, [props.data.idSpace]);

    return(
        <>
        <Modal show={props.data.show} onHide={props.data.handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{"Réservation "+props.data.nom}</Modal.Title>
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
            {type == 1 && isLoading && <div className="text-center"><Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  variant="primary"
                  role="status"
                  aria-hidden="true"
                  style={{width: "5em", height: "5em"}}
                  /></div>}
            {type == 1 && !isLoading &&
            <>
            <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Espace privatifs</Form.Label>
                <Form.Control as="select" onChange={handleFormPrivateSpace.bind(this)}>
                    {privativeSpace.map(v => <option value={v.id}>{v.nom}</option>)}
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Date et heure de début</Form.Label>
                <Form.Group><DateTimePicker data={{handleDateTimeStart}}/></Form.Group>
            </Form.Group>
            <Form.Group>
                <Form.Label>Date et heure de fin</Form.Label>
                <Form.Group><DateTimePicker data={{handleDateTimeEnd}}/></Form.Group>
            </Form.Group>
            </>
            }
            </Form>
            {reservation !== null && <div className="text-center"><Alert className="mb-0" variant={reservation ? "success" : "danger"}>
                {reservation ? "Réservation réussie !" : "La réservation a échoué !"}
            </Alert></div>}
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button variant="success" onClick={() => Reservation({type, formPrivateSpace, dateTimeStart, dateTimeEnd}, handleReservation)} >
              Réserver
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  const Reservation = (data, handleReservation) => {
      let inscription = false
      if(data) {
        if(data.type === 1) {
            let formData = new FormData();
            formData.append('horaire_debut', data.dateTimeStart);
            formData.append('horaire_fin', data.dateTimeEnd);
            formData.append('id_espace_privatif', data.formPrivateSpace);
            
            fetch('https://cowork-paris.000webhostapp.com/index.php/ReservationPrivateSpace',
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