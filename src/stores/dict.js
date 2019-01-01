
import ApiController from '@/services/ApiController'

/**
 * Not sure about this - soooo...
 */
export default {
	namespaced: true,

	state: {
		library: [],
		indexes: [],
		currencies: [],
		commodities: [],
		cryptos: [],
		tickers: [],
		loading: false
	},

	mutations: {
		setLibrary(state, library) {
			state.library = library;
		},

		setLoading(state, loading) {
			state.loading = loading;
		}
	},
	
	actions: {
		async load({commit}) {
			commit('loading', true)
			try {
				const library = await ApiController.findDict('library')
				commit('setLibrary', library)
			}
			finally {
				commit('loading', false)
			}
		}
	}
}