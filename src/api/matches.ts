import request from "./request"

export function getMatches(){
  return request.get(`/api/matches`)
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