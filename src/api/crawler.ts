import request from "./request"

export function crawlerMatches() {
  return request.get('/api/crawler/matches')
}