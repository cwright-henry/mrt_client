import Api from './Api'

export default {
  login (credentials) {
    return Api().post('api/login', credentials).then(response => response.data)
  },
  
  upload (name, ts, source) {
    return Api().post('api/upload', {
      name,
      ts,
      source
    }).then(response => response.data)
  },

  fit (params) {
    return Api().post('api/fit', params)
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
    return Api().get('api/list', {
      params: {
        page,
        nameFilter,
        pageSize
      }
    }).then(response => response.data)
  },

  find (id) {
    return Api().get('api/find', {
      params: {
        id: id
      }
    }).then(response => response.data)
  },

  loadStrategy (id) {
    return Api().get('api/findTs', {
      params: {
        timeseriesId: id
      }
    }).then(response => response.data)
  },

  loadAv (ticker) {
    return Api().get('/api/alphavantage', {
      params: {
        ticker: ticker
      }
    }).then(response => response.data)
  },

  loadInvest (curr_id, startDate, endDate) {
    return Api().get('/api/investing', {
      params: {
        curr_id: curr_id,
        startDate: startDate,
        endDate: endDate
      }
    }).then(response => response.data)
  }
}