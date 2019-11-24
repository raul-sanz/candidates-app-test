import Vue from 'vue'
import axios from 'axios'

let baseURL = 'https://candidates-test-api.herokuapp.com'

  Vue.prototype.$axios = axios.create({
    baseURL
  })
