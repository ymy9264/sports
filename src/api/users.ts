import request from "./request"

export function getUsers() {
  return request.get(`/api/users`)
}

export function addUser(data: object) {
  return request.post(`/api/users/save`, data)
}

export function updateUser(data: object) {
  return request.post(`/api/users/update`, data)
}

export function deleteUser(id: number) {
  return request.post(`/api/users/delete`, { id })
}

export function toggleUserStatus(id: number) {
  return request.post(`/api/users/toggle`, { id })
}