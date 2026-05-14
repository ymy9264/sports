import axios from 'axios'

export function getPlayers(){
  return axios.get(`/api/players`)
}

export function addPlayer(data: object){
  return axios.post(`/api/players/save`,data)
}

export function updatePlayer(data: object){
    return axios.post(`/api/players/update`,data)
}

export function deletePlayer(id: number){
  return axios.post(`/api/players/delete`,{ id })
}