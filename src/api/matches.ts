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

export function deleteMatch(id: number){
  return axios.post(`/api/matches/delete`,{ id })
}