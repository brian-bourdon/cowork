import {isEmpty, getCookie, setCookie} from '../util/util';

export function submitInscription(user, handleUser, handleInscription) {
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
    if(user.id_abonnement !== undefined) formData.append('id_abonnement', user.id_abonnement);
    
    fetch('https://cowork-paris.000webhostapp.com/index.php/user',
        {
            body: formData,
            method: "post"
        })
        .then(res=>res.json())
        .then(res => {
        if(res[0] === "User created successfully.") {
            inscription = true
        }
        handleUser(user)
        handleInscription(user)
        })
        .catch(e => {
            handleUser(inscription)
            handleInscription(false)
        })
    }
  }

  export function submitModification(user, handleModification) {
    let formData = new FormData();
    let userUpdate = {}
    for (const k in user) {
        if(user[k].trim() !== "") {
            console.log(user[k])
            userUpdate[k] = user[k]
            formData.append(k, user[k]);
        }
    }
    
    fetch('https://cowork-paris.000webhostapp.com/index.php/user/update/'+getCookie("id"),
        {
            body: formData,
            method: "post"
        })
        .then(res=>res.json())
        .then(res => {
            if(res[0] === "User updated successfully.") {
                console.log("ok")
                for (const key in userUpdate) {
                    setCookie(key, userUpdate[key], 1)
                 }
                 handleModification(userUpdate)
            } else handleModification(false)
        })
        .catch(e => handleModification(false))
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