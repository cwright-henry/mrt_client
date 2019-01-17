import Api from './Api'

export default {
  login (credentials) {
    return Api().post('api/login', credentials).then(response => response.data)
  },
  
  upload (name, data, source) {
    return Api().post('api/upload', {
      name,
      data,
      source
    }).then(response => response.data)
  },

  fit (params) {
    return Api().post('api/fit', params)
      .then(response => response.data)
  },

  fitLse (params) {
    return Api().post('api/fit-lse', params)
      .then(response => response.data)
  },

  saveOUFit (params) {
    return Api().post('api/save-ou-Fit', params)
      .then(response => response.data)
  },

  scenarios (payload) {
    return Api().get('api/data-get-scenarios',  {
      params: payload
    }).then(response => response.data)
  },

  remove (id) {
    return Api().post('api/remove', {
      id: id
    }).then(response => response.data)
  },

  sltp (payload) {
    return Api().get('api/data-all', {
      params: payload
    }).then(response => response.data)
  },

  list (page, nameFilter, pageSize) {
    return Api().get('api/list-strategies', {
      params: {
        page,
        nameFilter,
        pageSize
      }
    }).then(response => response.data)
  },

  loadStrategy (id) {
    return Api().get('api/find-strategy', {
      params: {
        strategyId: id
      }
    }).then(response => response.data)
  },

  findDict (type) {
    return Api().get('/api/find-dict', {
      params: {
        type
      }
    }).then(response => response.data)
  },

  findSeries (type, source) {
    return Api().get('/api/find-timeseries', {
      params: {
        type,
        source
      }
    }).then(response => response.data)
  }
}