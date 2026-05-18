import request from "./request"

export function userLogin(data: object){
  return request.post(`/api/login`,data)
}