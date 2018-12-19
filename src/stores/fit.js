
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
		isLoadingSims: false,

		// User defined temp data
		startDate: null,
		endDate: null,
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

			// Set the transient start and end dates
			state.startDate = state.strategy.fit.proctype === 'NONE' ? state.strategy.ts[0][0] : state.strategy.fit.start_date;
			state.endDate = state.strategy.fit.proctype === 'NONE' ? state.strategy.ts[state.strategy.ts.length - 1][0] : state.strategy.fit.end_date;
		},

		updateFit(state, fit) {
			state.strategy.fit = fit;
		},

		setSims(state, sims) {
			state.sims = sims
		},

		setDateRange(state, dates) {
			state.endDate = dates.endDate;
			state.startDate = dates.startDate;
		}
	},
	
	actions: {
		async loadStrategy({commit, state}, params) {
			try {
				if(params.id !== state.strategy._id) {
					commit('isLoadingTS', true)
					const strategy = await ApiController.loadStrategy(params.id);
					commit('setStrategy', strategy)

					if(strategy.fit.proctype === 'NONE') {
						commit('isFittingTS', true)
						const fit = await ApiController.fit({
							ts: strategy.ts
						});
						strategy.fit= fit;
						commit('setStrategy', strategy)
					}
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
					commit('setStrategy', strategy)

					if(strategy.fit.proctype === 'NONE') {
						const fit = await ApiController.fit({
							ts: strategy.ts
						});
						strategy.fit= fit;
						commit('setStrategy', strategy)
					}
				}
			}
			finally {
				commit('isFittingTS', false)
			}
		},

		async fit({commit, state}, range) {
			commit('isFittingTS', true)
			try {
				if(state.startDate !== range.startDate || state.endDate !== range.endDate) {
					console.log('fit - fitting')
					const fit = await ApiController.fit({
						ts: state.strategy.ts,
						start_date: range.startDate,
						end_date: range.endDate
					});

					commit('setDateRange', range)
					commit('updateFit', fit)
				}
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