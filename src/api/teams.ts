import axios from 'axios'

export function getTeams() {
  return axios.get(`/api/teams`)
}

export function addTeam(data: object) {
  return axios.post(`/api/teams/save`, data)
}

export function updateTeam(data: object) {
  return axios.post(`/api/teams/update`, data)
}

export function deleteTeam(id: number) {
  return axios.post(`/api/teams/delete`, { id })
}
