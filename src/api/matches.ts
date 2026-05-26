import request from "./request"

export function getMatches(page=1,pageSize = 10,keyword=''){
  return request.get(`/api/matches`,{ params:{ page,pageSize,keyword } })
}

export function addMatch(data: object){
  return request.post(`/api/matches/save`,data)
}

export function updateMatch(data: object){
    return request.post(`/api/matches/update`,data)
}

export function deleteMatch(id: number){
  return request.post(`/api/matches/delete`,{ id })
}