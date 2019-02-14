
import ApiController from '@/services/ApiController'
import {objectSorter} from '@/utils'

const sorter = objectSorter('name')

/**
 * Cache fixed dictionary and update library as we go. This way as the controls get
 * destroyed and created we are not hitting the server.
 */
export default {
	namespaced: true,

	state: {
		library: [],
		indexes: [],
		currencies: [],
		commodities: [],
		cryptos: [],
		loading: false
	},

	mutations: {
		setDictionary(state, {library, indexes, currencies, commodities, cryptos}) {
			state.library = library;
			state.indexes = indexes;
			state.currencies = currencies;
			state.commodities = commodities;
			state.cryptos = cryptos;
		},

		addLibrary(state, {_id, name}) {
			state.library.push({
				"_id": _id,
				"name" : name
			})
			state.library.sort(sorter)
		},

		removeLibrary(state, {id}) {
			state.library = state.library.filter(elm => elm._id !== id)
		},

		setLoading(state, loading) {
			state.loading = loading;
		}
	},
	
	actions: {
		async load({commit}) {
			commit('setLoading', true)
			try {
				const library = await ApiController.findDict('library')
				const commodities = await ApiController.findDict('Cmdty')
				const cryptos = await ApiController.findDict('Crypto')
				const currencies = await ApiController.findDict('Curncy')
				const indexes = await ApiController.findDict('Index')
				commit('setDictionary', {
					library,
					commodities,
					cryptos,
					currencies,
					indexes
				})
			}
			finally {
				commit('setLoading', false)
			}
		}
	}
}