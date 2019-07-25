
import ApiController from '@/services/ApiController'
import { objectSorter } from '@/utils'

const sorter = objectSorter('lastUpdate', 'desc')

/**
 * Cache the library as we go. The library cache is used in searching. This way as the controls get
 * destroyed and created we are not hitting the server.
 */
export default {
	namespaced: true,

	state: {
		library: [],
		loading: false
	},

	mutations: {
		setLibrary(state, { library }) {
			state.library = library;
		},

		addLibrary(state, { _id, name, lastUpdate }) {
			state.library.push({
				"_id": _id,
				"name": name,
				"lastUpdate": lastUpdate
			})
			state.library.sort(sorter)
		},

		removeLibrary(state, { id }) {
			state.library = state.library.filter(elm => elm._id !== id)
		},

		setLoading(state, loading) {
			state.loading = loading;
		}
	},

	actions: {
		async load({ commit }) {
			commit('setLoading', true)
			try {
				const library = await ApiController.getLibrary()

				commit('setLibrary', {
					library
				})
			}
			finally {
				commit('setLoading', false)
			}
		}
	}
}