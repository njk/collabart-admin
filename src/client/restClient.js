import {
  GET_MANY,
  GET_MANY_REFERENCE,
  GET_LIST,
  GET_ONE,
  CREATE,
  UPDATE,
  DELETE,
  DELETE_MANY
} from 'react-admin'
import diff from 'object-diff'
import axiosClient from '../config/axios'

function getIdKey ({resource, options}) {
  return (options[resource] && options[resource].id) || options.id || 'id'
}

export default (options = {}) => {
  const usePatch = !!options.usePatch
  const mapRequest = (type, resource, params) => {
    const idKey = getIdKey({resource, options})
    let query = {}
    switch (type) {
      case GET_MANY:
        let ids = params.ids || []
        query[idKey] = {$in: ids}
        query['$limit'] = ids.length
        return axiosClient().get(`/${resource}`, {
          params: query
        })
      case GET_MANY_REFERENCE:
        if (params.target && params.id) {
          query[params.target] = params.id
        }
      // eslint-disable-next-line no-fallthrough
      case GET_LIST:
        const {page, perPage} = params.pagination || {}
        const {field, order} = params.sort || {}
        const sortKey = `$sort[${field === 'id' ? idKey : field}]`
        let sortVal = order === 'DESC' ? -1 : 1
        if (perPage && page) {
          query['$limit'] = perPage
          query['$skip'] = perPage * (page - 1)
        }
        if (order) {
          query[sortKey] = JSON.stringify(sortVal)
        }
        Object.assign(query, params.filter)
        return axiosClient().get(`/${resource}`, {
          params: query
        })
      case GET_ONE:
        return axiosClient().get(`/${resource}/${params.id}`)
      case UPDATE:
        if (params.data.createdAt) {
          delete params.data.createdAt
        }
        if (usePatch) {
          const data = params.previousData ? diff(params.previousData, params.data) : params.data
          return axiosClient().patch(`/${resource}/${params.id}`, data, {params: {kind: params.data.kind}})
        }
        return axiosClient().put(`/${resource}/${params.id}`, params.data, {params: {kind: params.data.kind}})
      case CREATE:
        return axiosClient().post(`/${resource}`, params.data)
      case DELETE:
        return axiosClient().delete(`/${resource}/${params.id}`)
      case DELETE_MANY:
        return axiosClient().delete(`/${resource}`, {params: { _id: {$in: params.ids} }})
      default:
        throw new Error(`Unsupported FeathersJS restClient action type ${type}`)
    }
  }

  const mapResponse = (response, type, resource, params) => {
    const idKey = getIdKey({resource, options})
    switch (type) {
      case GET_ONE:
      case UPDATE:
      case DELETE:
        return {data: {...response, id: response[idKey]}}
      case DELETE_MANY:
        let deletedIds = []
        response.forEach(item => {
          deletedIds.push(item._id)
        })
        return {data: deletedIds}
      case CREATE:
        return {data: {...params.data, ...response, id: response[idKey]}}
      case GET_MANY_REFERENCE: // fix GET_MANY_REFERENCE missing id
      case GET_MANY: // fix GET_MANY missing id
      case GET_LIST:
        response.data = response.data.map(item => {
          if (idKey !== 'id') {
            item.id = item[idKey]
          }
          return item
        })
        return response
      default:
        return response
    }
  }

  return (type, resource, params) =>
    mapRequest(type, resource, params)
      .then(response => mapResponse(response.data, type, resource, params))
      .catch((err) => {
        if (err.response) {
          err.status = err.response.status
        }

        throw err
      })
}
