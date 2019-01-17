import ApiController from '@/services/ApiController'
import { EventBus } from '@/events.js';
import {closestNeighbour} from '@/utils/sorting'

/**
 * All data related to OU fitting. All components
 * associated with OU fitting commit thier modifications here and
 * all interested components watch for change using mapState utility
 */
export default {
	namespaced: true,

	state: {
		// Server data
		strategy: {
			ts: {
				data: []
			},
			fit: {}
		},
		sims: [],

		// Notifications
		isLoadingTS: false,
		isFittingTS: false,
		isSavingFit: false,
		isLoadingSims: false,

		// User data
		startDate: null,
		endDate: null,
		userKappa: null,
		userSigma: null,
		userTheta: null,
		selectedSim: null,
		simValue: null,
		simDate: null,
		simHorizon: { value: '780', text: '3 Years' },
		simSeed: 123456789,
		simSliderValue: null
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

		setKappa(state, kappa) {
			state.userKappa = kappa;
		},

		setSigma(state, sigma) {
			state.userSigma = sigma;
		},

		setTheta(state, theta) {
			state.userTheta = theta;
		},

		setSimValue(state, value) {
			state.simValue = value;
		},

		setSimDate(state, date) {
			state.simDate = date;
		},

		setSimHorizon(state, horizon) {
			state.horizon = horizon;
		},

		setSimSeed(state, seed) {
			state.simSeed = seed;
		},

		setStrategy(state, strategy) {
			state.strategy = strategy;

			// Reset the transient data
			state.startDate = state.strategy.fit.proctype === 'NONE' ? state.strategy.ts.data[0][0] : state.strategy.fit.start_date;
			state.endDate = state.strategy.fit.proctype === 'NONE' ? state.strategy.ts.data[state.strategy.ts.data.length - 1][0] : state.strategy.fit.end_date;
			state.userKappa = null;
			state.userSigma = null;
			state.userTheta = null;
			state.selectedSim = null;
			state.simValue = null;
			state.simDate = null;
			state.simHorizon = { value: '780', text: '3 Years' };
			state.simSeed = 123456789;
			state.simSliderValue = state.endDate;
		},

		setStrategyName(state, name) {
			state.strategy.name = name;
		},

		updateFit(state, fit) {
			state.strategy.fit = fit;
		},

		setSims(state, sims) {
			state.selectedSim = sims[0].id
			state.sims = sims
		},

		setSelectedSim(state, simId) {
			state.selectedSim = simId
		},

		setNextSim(state) {
			let currentindex = state.sims.findIndex(elm => elm.id === state.selectedSim)
			if(currentindex < state.sims.length - 1) {
				state.selectedSim = state.sims[currentindex + 1].id
			}
			else {
				state.selectedSim = state.sims[0].id
			}
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
							ts: strategy.ts.data,
							start_date: state.startDate,
							end_date: state.endDate
						});
						
						commit('updateFit', fit)
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
							ts: strategy.ts.data,
							start_date: state.startDate,
							end_date: state.endDate
						});
						commit('updateFit', fit)
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
					const fit = await ApiController.fit({
						ts: state.strategy.ts.data,
						start_date: range.startDate,
						end_date: range.endDate,
						kappa: state.userKappa,
						sigma: state.userSigma,
						theta: state.userTheta
					});

					commit('setDateRange', range)
					commit('updateFit', fit)
				}
			}
			catch(error) {
				EventBus.$emit('api-error', 'Fit.fit ' + error.response.data.msg);  
			}
			finally {
				commit('isFittingTS', false)
			}
		},

		async fixFit({commit, state}, params) {
			commit('isFittingTS', true)
			try {
				const fit = await ApiController.fit({
					ts: state.strategy.ts.data,
					start_date: state.startDate,
					end_date: state.endDate,
					kappa: params.kappa,
					sigma: params.sigma,
					theta: params.theta
				});

				if(params.kappa) {
					commit('setKappa', params.kappa)	
				}
				if(params.sigma) {
					commit('setSigma', params.sigma)	
				}
				if(params.theta) {
					commit('setTheta', params.theta)	
				}
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
					name: state.strategy.name,
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
					kappa: params.kappa || state.userKappa || state.strategy.fit.kappa,
					sigma: params.sigma || state.userSigma || state.strategy.fit.sigma,
					theta: params.theta || state.userTheta || state.strategy.fit.theta,
					x_0: params.value || state.simValue,
					x_0_date: params.date || state.simDate,
					nsteps: state.simHorizon.value,
					seed: params.seed || state.simSeed
				}

				/* Special case to match end of series */
				if(payload.nsteps === '-1') {
					const point = closestNeighbour(state.strategy.ts.data, payload.x_0_date)
					const index = state.strategy.ts.data.findIndex(elm => elm[0] === point[0])
					payload.nsteps = parseInt((state.strategy.ts.data.length - index) * 1.03895)
				}

				const sims = await ApiController.scenarios(payload);

				commit('setSims', sims)

				if(params.kappa) {
					commit('setKappa', params.kappa)	
				}
				if(params.sigma) {
					commit('setSigma', params.sigma)	
				}
				if(params.theta) {
					commit('setTheta', params.theta)	
				}
				if(params.value) {
					commit('setSimValue', params.value)	
				}
				if(params.date) {
					commit('setSimDate', params.date)	
				}
				if(params.seed) {
					commit('setSimSeed', params.seed)	
				}
			}
			catch(error) {
				EventBus.$emit('api-error', 'Fit.loadSims ' + error.response.data.msg);  
			}
			finally {
				commit('isLoadingSims', false)
			}
		}
	}
}