import {setCookie} from '../util/util';
import axios from 'axios'
import moment from 'moment'

export function Connection(email, pwd, setIsLoading, handleUser) {
    setIsLoading(true)
    axios.get('https://cowork-paris.000webhostapp.com/index.php/user/show/'+email)
    .then(res => {
      console.log(res.data)
      //delete res.data["admin"]
      if(res.data.pwd === pwd) {
        console.log("nnnn")
        axios.get('https://cowork-paris.000webhostapp.com/index.php/user/abonnement/'+res.data.id).then(resA => {
          if(resA.data.length === 1) {
            res.data["id_abonnement"] = resA.data[0].id_abonnement
            res.data["created_at"] = resA.data[0].created_at
          }
          else res.data["id_abonnement"] = "null"
          for (const key in res.data) {
            setCookie(key, res.data[key], 1)
          }
          handleUser(res.data)
          setIsLoading(false)
        })
        .catch(e => {
          for (const key in res.data) {
            setCookie(key, res.data[key], 1)
          }
          handleUser(res.data)
          setIsLoading(false)
        })
      }
      else{
        handleUser(false)
        setIsLoading(false)
      }
    }).catch(e => {
      handleUser(false)
      setIsLoading(false)
    })
  }