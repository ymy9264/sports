import axios from 'axios'

export function userLogin(data: object){
  return axios.post(`/api/login`,data)
}