/* global localStorage */

import axios from 'axios'
import qs from 'qs'

import { getMessageFromRequestErrorObject } from '../utils/api'

export const API_URL = process.env.REACT_APP_BACKEND_URI

function axiosClient () {
  const axiosClient = axios.create({
    baseURL: API_URL,
    timeout: 60000,
    headers: {
      Authorization: localStorage.getItem('auth')
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: 'brackets'})
    }
  })

  if (process.env.NODE_ENV === 'development') {
    axiosClient.interceptors.request.use(request => {
      console.log('Starting Request', request)
      return request
    }, err => {
      console.log('request error', err)
      return Promise.reject(err)
    })

    axiosClient.interceptors.response.use(response => {
      console.log('Response:', response)
      return response
    }, err => {
      console.log('response error', err)
      err.message = getMessageFromRequestErrorObject(err)
      return Promise.reject(err)
    })
  }
  return axiosClient
}

export default axiosClient
