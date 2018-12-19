/**
 * Our library of strategies 
 * 
 * Initial load creates skeleton view and full strategies are loaded as they come into view
 * Provide infinit Scroll for the first N pages (2 or 3)
 * Provide a load more button after that
 * Provide feedback to user of current navigation i.e. total and scrolling progreess, current number in view
 * Remove notice on last page
 * Carefully manage and monitor DOM size
 */
import ApiController from '@/services/ApiController'
import Vue from 'vue'

const PAGE_SIZE = 5
const INFINITE_SCROLL_PAGES = 3

export default {
	namespaced: true,

	state: {
		strategies: [], 					/* Array of strategies */
		total: 0,									/* Total number of strategies */
		page: 1,									/* Current Page */
		pageSize: PAGE_SIZE,			/* The number of items in each page */
		totalPages: 0,						/* Total number of pages */
		hasPrev: false,						/* Has a previous page */
		hasNext: true,						/* Has a next page */
		loading: false,						/* Called for initial search but not infinite search or load more */
		loadingStrategy: false,		/* Flag for loading a ts */
		loadingRm: false,					/* Flag used when removing a stratedgy */
		nameFilter: ''						/* User supplied  strategy name filter */
	},

	getters: {
		isInfiniteScrolling: state => {
			return state.page <= INFINITE_SCROLL_PAGES
		},

		/**
		 * Return a clone of strategy, that way fitting and SLTP can work
		 * on clone without effecting anything
		 */
		findStrategy: state => id => {
			const strategy = state.strategies.find(item => item._id == id);
			return strategy ? JSON.parse(JSON.stringify(strategy)) : undefined;
		}
	},

	mutations: {
		/**
		 * Set the state
		 */
		setPaging(state, data) {
			if(data.isNew) {
				state.strategies = data.strategies
			}
			else {
				state.strategies.push(...data.strategies)
			}
			state.total = data.total
			state.totalPages = data.totalPages
			state.hasPrev = data.hasPrev
			state.hasNext = data.hasNext
			state.nameFilter = data.nameFilter
			state.page = data.page
		},

		setLoading(state, status) {
			state.loading = status
		},

		setLoadingStrategy(state, status) {
			state.loadingStrategy = status
		},

		setLoadingRm(state, status) {
			state.loadingRm = status
		},

		updateStrategy(state, strategy) {
			for(let i = 0; i < state.strategies.length; i++) {
				if(state.strategies[i]._id === strategy._id) {
					Vue.set(state.strategies, i, strategy);
					break;
				}
			}
		},

		addStrategy(state, strategy) {
			state.strategies.unshift(strategy)
			state.total++;
		},

		removeStrategy(state, id) {
			state.strategies = state.strategies.filter(elm => elm._id !== id)
		}
	},

	actions: {
		/**
		 * Load the first page of results, should be called if use enter page filter
		 */
    async load({commit}, payload) {
			commit('setLoading', true)
			try {
				const pageFilter = payload.nameFilter || ''
				const data = await ApiController.list(1, pageFilter, PAGE_SIZE);

				const update = {
					strategies: data.docs,
					total: data.totalDocs,
					totalPages: data.totalPages,
					hasPrev: data.hasPrevPage,
					hasNext: data.hasNextPage,
					nameFilter: pageFilter,
					page: 1,
					isNew: true
				}
				commit('setPaging', update)
			}
			finally {
				commit('setLoading', false)
			}
		},

		/**
		 * load more results taking into account any page filter
		 */
		async loadMore({commit, state}) {
			commit('setLoading', true)
			try {
				const data = await ApiController.list(state.page + 1, state.nameFilter, PAGE_SIZE);
				
				const update = {
					strategies: data.docs,
					total: data.totalDocs,
					totalPages: data.totalPages,
					hasPrev: data.hasPrevPage,
					hasNext: data.hasNextPage,
					nameFilter: state.nameFilter,
					page: state.page + 1,
					isNew: false
				}
				commit('setPaging', update)
			}
			finally {
				commit('setLoading', false)
			}
		},

		/**
		 * Load full strategy
		 */
		async loadStrategy({commit}, payload) {
			commit('setLoadingStrategy', true)
			try {
				const data = await ApiController.loadStrategy(payload.id)
				commit('updateStrategy', data)
			}
			finally {
				commit('setLoadingStrategy', false)
			}
		},

		/**
		 * Remove a strategy
		 */
		async remove({commit}, payload) {
			commit('setLoadingRm', true)
			try {
				await ApiController.remove(payload.id)
				commit('removeStrategy', payload.id)
			}
			finally {
				commit('setLoadingRm', false)
			}
		},

		/**
		 * Upload a new one
		 */
		async upload({commit}, payload) {
			try {
				const strategy = await ApiController.upload(payload.fileName, payload.timeseries, payload.source)
				commit('addStrategy', strategy)
			}
			finally {
				// TODO
			}
		}
  }
}