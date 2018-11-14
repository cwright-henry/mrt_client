/**
 * Our library of timeseries
 */
import ApiController from '@/services/ApiController'

export default {
	namespaced: true,

	state: {
		series: [],
		loading: false,
		page: 1,
		nameFilter: '',
		totalPages: 1,
		totalSeries: 0,
		limit: 10
	},

	getters: {
		startOffset: state => {
			return state.totalSeries == 0 ? 0 : state.page * state.limit - state.limit + 1;
		},

		endOffset: state => {
			const upperLimit = state.page * state.limit;
			const total = state.totalSeries

			if(total < state.limit) {
				return total
			}

			if(upperLimit > total) {
				return total
			}

			return upperLimit;
		},

		find: state => id => {
			const series = state.series.filter((item) => {
				return item._id == id
			});
			return series ? series[0] : null
		}
	},

	mutations: {
		setSeries(state, series) {
			state.series = series
		},

		setLoading(state, loading) {
			state.loading = loading
		},

		setTotalSeries(state, total) {
			state.totalSeries = total
		},

		setTotalPages(state, total) {
			state.totalPages = total
		},

		setLimit(state, limit) {
			state.limit = limit
		},

		setPage(state, page) {
			state.page = page
		},

		updateSeries(state, payload) {
			for(let ts of state.series) {
				if(ts._id === payload.id) {
					ts.ts = payload.ts
				}
			}
		}
	},

	actions: {
    async load({commit, state}, payload) {
			commit('setLoading', true)
			const pageNumber = payload.page || state.page
			const pageFilter = payload.nameFilter || state.nameFilter
			const data = await ApiController.list(pageNumber, pageFilter, state.limit);
			
			commit('setSeries', data.docs)
			commit('setTotalSeries', data.totalDocs);
			commit('setTotalPages', data.totalPages);
			commit('setPage', parseInt(data.page));
			commit('setLoading', false)
		},

		async findTs({commit}, payload) {
			const data =  await ApiController.findTs(payload.id);
			const update = {
				id: payload.id,
				ts: data.ts
			}
			commit('updateSeries', update)
			return data;
		},

		async remove({commit}, payload) {
			commit('setLoading', true)
			await ApiController.remove(payload.id)
			

			commit('setLoading', false)
		}
  }
}