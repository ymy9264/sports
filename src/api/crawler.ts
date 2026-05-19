import request from "./request"

export function crawlerMatches() {
  return request.get('/api/dataCrawler/matches')
}