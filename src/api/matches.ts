import axios from 'axios'

export function getMatches(){
  return axios.get(`/api/matches`)
}

export function addMatch(data: object){
  return axios.post(`/api/matches/save`,data)
}

export function updateMatch(data: object){
    return axios.post(`/api/matches/update`,data)
}