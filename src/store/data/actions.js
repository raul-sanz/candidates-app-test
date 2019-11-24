import Vue from 'vue'

export function getCandidates ( context) {
  return Vue.prototype.$axios.get('/users')
}
