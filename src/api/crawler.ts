import axios from 'axios'

export function crawlerMatches() {
  return axios.get('/api/crawler/matches')
}