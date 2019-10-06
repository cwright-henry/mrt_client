import Api from './Api'

export default {
	login(credentials) {
		return Api().post('api/login', credentials).then(response => response.data)
	},

	upload(name, data, source) {
		return Api().post('api/upload', {
			name,
			data,
			source
		}).then(response => response.data)
	},

	fit(params) {
		return Api().get('api/fit', {
			params: params
		}).then(response => response.data)
	},

	fitLse(params) {
		return Api().post('api/fit-lse', params)
			.then(response => response.data)
	},

	saveOUFit(params) {
		return Api().post('api/save-ou-Fit', params)
			.then(response => response.data)
	},

	scenarios(payload) {
		return Api().get('api/data-get-scenarios', {
			params: payload
		}).then(response => response.data)
	},

	remove(id) {
		return Api().post('api/remove', {
			id: id
		}).then(response => response.data)
	},

	sltp(payload) {
		return Api().get('api/data-all', {
			params: payload
		}).then(response => response.data)
	},

	list(page, pageSize, overrides) {
		return Api().get('api/list-strategies', {
			params: {
				page,
				pageSize,
				overrides: JSON.stringify(overrides)
			}
		}).then(response => response.data)
	},

	search(nameFilter) {
		return Api().get('/api/search-strategy', {
			params: {
				nameFilter
			}
		}).then(response => response.data)
	},

	loadStrategy(id) {
		return Api().get('api/find-strategy', {
			params: {
				strategyId: id
			}
		}).then(response => response.data)
	},

	getLibrary() {
		return Api().get('/api/get-library').then(response => response.data)
	},

	findSeries(ticker, assetClass) {
		return Api().get('/api/find-timeseries', {
			params: {
				ticker,
				assetClass
			}
		}).then(response => response.data)
	},

	updatePassword(params) {
		return Api().post('api/update-password', params)
			.then(response => response.data)
	},
}