import request from "./request"

export function getPlayers(page=1,pageSize = 12,keyword=''){
  return request.get(`/api/players`,{ params:{ page,pageSize,keyword } })
}

export function addPlayer(data: object){
  return request.post(`/api/players/save`,data)
}

export function updatePlayer(data: object){
    return request.post(`/api/players/update`,data)
}

export function deletePlayer(id: number){
  return request.post(`/api/players/delete`,{ id })
}