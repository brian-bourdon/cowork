import {isEmpty, getCookie, setCookie} from '../util/util';

export function submitInscription(user, handleInscription, handleClose) {
    console.log(user)
    let inscription = false
    if(validUser(user)) {
      console.log(JSON.stringify({
        firstname: user.firstname,
        lastname: user.lastname,
        date_naissance: user.date_naissance,
        email: user.email,
        pwd: user.pwd
    }))
    let formData = new FormData();
    formData.append('firstname', user.firstname);
    formData.append('lastname', user.lastname);
    formData.append('date_naissance', user.date_naissance);
    formData.append('email', user.email);
    formData.append('pwd', user.pwd);
    if(user.id_abonnement !== undefined && user.id_abonnement !== "1") { // 1 ou "1"
      formData.append('id_abonnement', user.id_abonnement);
      formData.append('id', user.id); // surement inutile
    }
    
    fetch('https://cowork-paris.000webhostapp.com/index.php/user',
        {
            body: formData,
            method: "post"
        })
        .then(res=>res.json())
        .then(res => {
          console.log(res)
        if(res[0] === "User created successfully.") {
            inscription = true
            handleInscription(true)
            //handleClose()
        }
        })
        .catch(e => {
            handleInscription(false)
        })
    }
  }

  export function submitModification(user, real_user, handleModification, handleSuccessSubscription) {
    //console.log(real_user)
    let formData = new FormData();
    let userUpdate = {}
    for (const k in user) {
        if(user[k].trim() !== "") {
            console.log(user[k])
            userUpdate[k] = user[k]
            formData.append(k, user[k]);
        }
    }
    fetch('https://cowork-paris.000webhostapp.com/index.php/user/update/'+real_user.id,
        {
            body: formData,
            method: "post"
        })
        .then(res=>res.json())
        .then(res => {
            if(res[0] === "User updated successfully.") {
                console.log(real_user)
                for (const key in userUpdate) {
                    setCookie(key, userUpdate[key], 1)
                 }
                 handleModification({...userUpdate, id: real_user.id, id_abonnement: real_user.id_abonnement})
                 handleSuccessSubscription(true)
            } else {
              handleSuccessSubscription(false)
              handleModification(false)
            }
        })
        .catch(e => {
          handleSuccessSubscription(false)
          handleModification(false)
        })
  }

  export function updateUser(user, real_user, handleUser, setUpdatedUser, handleSpace, setExpired) {
    let formData = new FormData();
    let userUpdate = real_user
    for (const k in user) {
        if(user[k].trim() !== "") {
            console.log(user[k])
            userUpdate[k] = user[k]
            formData.append(k, user[k]);
        }
    }
    fetch('https://cowork-paris.000webhostapp.com/index.php/user/update/'+userUpdate.id,
        {
            body: formData,
            method: "post"
        })
        .then(res=>res.json())
        .then(res => {
            if(res[0] === "User updated successfully.") {
                console.log("ok")
                for (const key in user) {
                    setCookie(key, user[key], 1)
                 }
                 setCookie("id_abonnement", user.id_abonnement)
                 let now = new Date()
                 setCookie("created_at", now)
                 console.log(userUpdate)
                 handleUser({...userUpdate, created_at: now})
                 handleSpace(null)
                 setUpdatedUser(true)
                 setExpired(false)
            } else {
              handleUser(false)
              handleSpace(null)
              setUpdatedUser(false)
            }
        })
        .catch(e => {
          handleUser(false)
          handleSpace(null)
          setUpdatedUser(false)
        })
  }

  export function validUser(user) {
    const attributes = ["firstname", "lastname", "date_naissance", "email", "pwd", "id_abonnement"]
    let i = 0
    if(!isEmpty(user)) {
      for (const k in user) {
        if(attributes.includes(k)) {
          if(user[k] !== undefined && user[k] !== null && (typeof user[k] === "string" ? user[k].trim() !== "": true)) i++
          else return false
        }
        else return false
      }
      if(attributes.length === i) return true
      else if(attributes.length-1 === i && !("id_abonnement" in user)) return true
      else return false
    }
  }