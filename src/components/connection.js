import {setCookie} from '../util/util';
import axios from 'axios'

export function Connection(email, pwd, setIsLoading, handleClose, handleUser) {
    setIsLoading(true)
    axios.get('https://cowork-paris.000webhostapp.com/index.php/user/show/'+email)
    .then(res => {
      setIsLoading(false)
      if(res.data.pwd === pwd) {
        for (const key in res.data) {
           setCookie(key, res.data[key], 1)
        }
        handleUser(res.data)
      }
      else(handleUser(false))
    })
  }