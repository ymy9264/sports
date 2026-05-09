import axios from 'axios'

export function getTeams(){
  return axios.get(`/api/teams`)}