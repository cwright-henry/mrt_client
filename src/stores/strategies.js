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
		strategies: [], 					/* Array of strategies on view */
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
		 * Set strategy list. 
		 * 
		 * 1. New strategies overrite existing list
		 * 2. Uploaded get added to top of the list
		 * 3. More get pushed to the back of the list using the infinite scroll and one is
		 * 		removed then add one.
		 */
		updateList(state, data) {
			// A new list
			if(data.hasOwnProperty('isNew')) {
				state.strategies = data.strategies
			}
			else if(data.hasOwnProperty('isUpload')) {
				// Add the new one to top of list
				state.strategies.unshift(data.strategy)
				// If there is more to view then pop last one
				// to preserve infinit scroll
				if(state.hasNext) {
					state.strategies.pop();
				}
			}
			// Infinit scroll - just push on to end of list
			else {
				state.strategies.push(...data.strategies)
			}
		},

		/**
		 * Set the paging after updates, check for the
		 * existence of the property
		 */
		setPaging(state, data) {
			if(data.hasOwnProperty('total')) {
				state.total = data.total	
			}
			if(data.hasOwnProperty('totalPages')) {
				state.totalPages = data.totalPages	
			}
			if(data.hasOwnProperty('hasPrev')) {
				state.hasPrev = data.hasPrev	
			}
			if(data.hasOwnProperty('hasNext')) {
				state.hasNext = data.hasNext	
			}
			if(data.hasOwnProperty('nameFilter')) {
				state.nameFilter = data.nameFilter	
			}
			if(data.hasOwnProperty('page')) {
				state.page = data.page	
			}
		},

		/**
		 * Loading indicators
		 */
		setLoading(state, status) {
			state.loading = status
		},

		setLoadingStrategy(state, status) {
			state.loadingStrategy = status
		},

		setLoadingRm(state, status) {
			state.loadingRm = status
		},

		/**
		 * Find an existing strategy and update it. Have to use
		 * Vue.set on the index for vue to react to updates
		 */
		updateStrategy(state, strategy) {
			for(let i = 0; i < state.strategies.length; i++) {
				if(state.strategies[i]._id === strategy._id) {
					Vue.set(state.strategies, i, strategy);
					break;
				}
			}
		},

		/**
		 * Remove a strategy by filering out and letting view detect
		 * the update
		 */
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

				commit('updateList', {
					strategies: data.docs,
					isNew: true
				})
				commit('setPaging', {
					total: data.totalDocs,
					totalPages: data.totalPages,
					hasPrev: data.hasPrevPage,
					hasNext: data.hasNextPage,
					nameFilter: pageFilter,
					page: 2, // Set the next page to load
				})
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
				let data = await ApiController.list(state.page, state.nameFilter, PAGE_SIZE);
				
				commit('updateList', {
					strategies: data.docs
				})
				commit('setPaging', {
					total: data.totalDocs,
					totalPages: data.totalPages,
					hasPrev: data.hasPrevPage,
					hasNext: data.hasNextPage,
					page: state.page + 1 // Set the next page to load. Remember that state cannot mutated directly here
				})
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
		 * Remove a strategy. Need to take care of infinte scroll
		 */
		async remove({commit, state}, payload) {
			commit('setLoadingRm', true)
			try {
				await ApiController.remove(payload.id)
				commit('removeStrategy', payload.id)
				if(state.hasNext) {
					const data = await ApiController.list(state.strategies.length + 1, state.nameFilter, 1);

					commit('updateList', {
						strategies: data.docs
					})

					commit('setPaging', {
						total: data.totalDocs,
						totalPages: data.totalPages,
						hasPrev: data.hasPrevPage,
						hasNext: data.hasNextPage
					})
				}
				else {
					commit('setPaging', {
						total: state.total - 1
					})
				}
			}
			finally {
				commit('setLoadingRm', false)
			}
		},

		/**
		 * Upload a new one.
		 */
		async upload({commit, state}, payload) {
			try {
				const strategy = await ApiController.upload(payload.fileName, payload.data, payload.source)
				commit('setPaging', {
					total: state.total + 1
				})
				commit('updateList', {
					strategy: strategy,
					isUpload: true
				})

				return strategy;
			}
			finally {
				// TODO
			}
		}
  }
}