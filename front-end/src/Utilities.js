import axios from 'axios'
import { Cookies } from 'react-cookie'

var cookies = new Cookies()

const MONTH = 'Month'
const QUARTER = 'Quarter'
const YEAR = 'Year'
const CURRENT_DATE = new Date()
const CURRENT_MONTH = CURRENT_DATE.getMonth()
const CURRENT_QUARTER = parseInt(CURRENT_MONTH / 3)
const CURRENT_YEAR = CURRENT_DATE.getFullYear()

const monthsOfYear = [
  'All',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const quartersOfYear = ['All', 'First', 'Second', 'Third', 'Fourth']

// Modal types
const [ADD, EDIT] = [0, 1]

var random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

var replicateObject = (base_obj) => {
  let new_obj = {}
  new_obj = Object.assign(new_obj, base_obj)
  return new_obj
}

const baseURL = 'http://127.0.0.1:3000'

var sendRequest = async (api, method, data = null, config = null) => {
  let response
  let new_config
  // set config
  if (!config) new_config = { headers: { Authorization: 'Bearer ' + cookies.get('accessToken') } }
  else {
    new_config = replicateObject(config)
    new_config.headers.Authorization = 'Bearer ' + cookies.get('accessToken')
  }
  console.log(new_config) // test

  switch (method) {
    case 'get':
      response = await axios.get(baseURL + api, new_config)
      break
    case 'delete':
      response = await axios.delete(baseURL + api, new_config)
      break
    case 'head':
      response = await axios.delete(baseURL + api, new_config)
      break
    case 'options':
      response = await axios.delete(baseURL + api, new_config)
      break
    case 'post':
      response = await axios.post(baseURL + api, data, new_config)
      break
    case 'put':
      response = await axios.put(baseURL + api, data, new_config)
      break
    case 'patch':
      response = await axios.patch(baseURL + api, data, new_config)
      break
    default:
      break
  }

  return response
}

export {
  MONTH,
  QUARTER,
  YEAR,
  CURRENT_DATE,
  CURRENT_MONTH,
  CURRENT_QUARTER,
  CURRENT_YEAR,
  monthsOfYear,
  quartersOfYear,
  ADD,
  EDIT,
  cookies,
  random,
  replicateObject,
  sendRequest,
}
