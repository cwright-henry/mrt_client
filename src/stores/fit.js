
import ApiController from '@/services/ApiController'

export default {
	namespaced: true,

	state: {
		strategy: {
			ts: [],
			fit: {}
		},
		sims: {},
		isLoadingTS: false,
		isFittingTS: false,
		isSavingFit: false,
		isLoadingSims: false
	},

	mutations: {
		isLoadingTS(state, status) {
			state.isLoadingTS = status;
		},

		isFittingTS(state, status) {
			state.isFittingTS = status;
		},

		isLoadingSims(state, status) {
			state.isLoadingSims = status;
		},

		isSavingFit(state, status) {
			state.isSavingFit = status;
		},

		setStrategy(state, strategy) {
			state.strategy = strategy;
		},

		updateFit(state, fit) {
			state.strategy.fit = fit;
		},

		setSims(state, sims) {
			state.sims = sims
		},

		setStartDate(state, date) {
			state.strategy.fit.start_date = date;
		},

		setEndDate(state, date) {
			state.strategy.fit.end_date = date;
		}
	},
	
	actions: {
		async loadStrategy({commit, state}, params) {
			try {
				if(params.id !== state.strategy._id) {
					commit('isLoadingTS', true)
					const strategy = await ApiController.loadStrategy(params.id);

					// Default strategy if no strategy is picked
					if(strategy.fit.proctype === 'NONE') {
						commit('isFittingTS', true)
						const fit = await ApiController.fit({
							ts: strategy.ts
						});
						strategy.fit= fit;
					}
					
					commit('setStrategy', strategy)
				}
			}
			finally {
				commit('isFittingTS', false)
				commit('isLoadingTS', false)
			}
		},

		async setStrategy({commit, state}, strategy) {
			try {
				if(strategy._id !== state.strategy._id) {
					commit('isFittingTS', true)
					// Default strategy if no strategy is picked
					if(strategy.fit.proctype === 'NONE') {
						const fit = await ApiController.fit({
							ts: strategy.ts
						});
						strategy.fit= fit;
					}
				}
				commit('setStrategy', strategy)
			}
			finally {
				commit('isFittingTS', false)
			}
		},

		async reset({commit, state}) {
			commit('isFittingTS', true)
			try {
				const fit = await ApiController.fit({
					ts: state.strategy.ts
				});
				commit('setStartDate', null)
				commit('setEndDate', null)
				commit('updateFit', fit)
			}
			finally {
				commit('isFittingTS', false)
			}
		},

		async fit({commit, state}) {
			commit('isFittingTS', true)
			try {
				const fit = await ApiController.fit({
					ts: state.strategy.ts,
					start_date: state.strategy.fit.start_date,
					end_date: state.strategy.fit.end_date
				});
				commit('updateFit', fit)
			}
			finally {
				commit('isFittingTS', false)
			}
		},

		async save({commit, state}) {
			commit('isSavingFit', true)
			try {
				return await ApiController.saveOUFit({
					id: state.strategy._id,
					fit: state.strategy.fit
				});
			}
			finally {
				commit('isSavingFit', false)
			}
		},

		async loadSims({commit, state}, params) {
			commit('isLoadingSims', true)
			try {
				const payload = {
					kappa: params.kappa || state.strategy.fit.kappa,
					theta: params.theta || state.strategy.fit.theta,
					sigma: params.sigma || state.strategy.fit.sigma,
					x_0: params.value,
					x_0_date: params.date
				}
				const sims = await ApiController.scenarios(payload);

				commit('setSims', sims)
			}
			finally {
				commit('isLoadingSims', false)
			}
		}
	}
}