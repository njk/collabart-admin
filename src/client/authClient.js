/* global localStorage */

import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK, AUTH_GET_PERMISSIONS } from 'react-admin'
import decodeJwt from 'jwt-decode'

import axiosClient from '../config/axios'

export default async (type, params) => {
  if (type === AUTH_LOGIN) {
    try {
      const { username, password } = params
      const response = await axiosClient().post('/authentication', {strategy: 'local', email: username, password})
      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.statusText)
      }
      const decodedToken = decodeJwt(response.data.accessToken)
      localStorage.setItem('auth', 'bearer ' + response.data.accessToken)

      const resUser = await axiosClient().get(`/users/${decodedToken.userId}`)
      localStorage.setItem('role', resUser.data.permissions)

      return response.data.user
    } catch (err) {
      console.log(err)
      if (err.response) throw new Error(err.response.statusText)
      else throw new Error('Unknown error')
    }
  }
  if (type === AUTH_LOGOUT) {
    localStorage.removeItem('auth')
    localStorage.removeItem('role')
  }
  if (type === AUTH_ERROR) {
    const { status } = params
    if (status === 401 || status === 403) {
      localStorage.removeItem('auth')
      localStorage.removeItem('role')
      return Promise.reject()
    }
    return Promise.resolve()
  }
  if (type === AUTH_CHECK) {
    const { resource } = params
    if (resource === 'users') {

    }
    return localStorage.getItem('auth') ? Promise.resolve() : Promise.reject({ redirectTo: '/login' })
  }
  if (type === AUTH_GET_PERMISSIONS) {
    const role = localStorage.getItem('role')
    return role ? Promise.resolve(role) : Promise.reject()
  }
  return Promise.resolve()
}
