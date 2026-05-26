import request from "./request"

export function getTeams(page=1,pageSize = 10,keyword='') {
  return request.get(`/api/teams`,{ params:{ page,pageSize,keyword } })
}

export function addTeam(data: object) {
  return request.post(`/api/teams/save`, data)
}

export function updateTeam(data: object) {
  return request.post(`/api/teams/update`, data)
}

export function deleteTeam(id: number) {
  return request.post(`/api/teams/delete`, { id })
}
