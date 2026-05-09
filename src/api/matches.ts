import axios from 'axios'

export function getMatches(){
  return axios.get(`/api/matches`)
}