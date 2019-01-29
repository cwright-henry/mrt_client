import ApiController from '@/services/ApiController'
import moment from 'moment'
import { EventBus } from '@/events.js';
import {closestNeighbour, tsExtremes, seedGen} from '@/utils/sorting'
import {getMinMax, mean} from '@/utils/stats'

/**
 * All data related to OU fitting. All components
 * associated with OU fitting commit thier modifications here and
 * all interested components watch for change using mapState utility
 */
const DEFAULT_SIM_HORIZON = { value: '780', text: '3 Years' };
const DEFAULT_ANIMATION_TIME = 2;

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
		isLoadingStrategy: false,
		isFittingTS: false,
		isSavingFit: false,
		isLoadingSims: false,

		// User selected dates
		startDate: null,
		endDate: null,

		// User Parameters
		userKappa: null,
		userSigma: null,
		userTheta: null,

		// User sims
		selectedSim: null,
		simStart: {
			value: null,
			date: null
		},
		simHorizon: DEFAULT_SIM_HORIZON,
		simSeed: 123456789,
		simSliderValue: null,
		simAnimationTime: DEFAULT_ANIMATION_TIME,

		// Min, max of series used for validation -
		// not sure these derived values should here!!
		range: 0,
		avg: 0
	},

	mutations: {
		isLoadingStrategy(state, status) {
			state.isLoadingStrategy = status;
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

		setSimStart(state, start) {
			state.simStart.value = start.value;
			state.simStart.date = start.date;
		},

		resetSimStart(state) {
			const extremes = tsExtremes(state.strategy.ts.data)
			state.simStart.value = extremes.maxValue;
			state.simStart.date = extremes.max;
		},

		setSimHorizon(state, horizon) {
			state.simHorizon = horizon;
		},

		resetSimHorizon(state) {
			state.simHorizon = DEFAULT_SIM_HORIZON;
		},

		setAnimationTime(state, animationTime) {
			state.simAnimationTime = animationTime;
		},

		resetAnimationTime(state) {
			state.simAnimationTime = DEFAULT_ANIMATION_TIME;
		},

		genSimSeed(state) {
			state.simSeed = seedGen();
		},

		setStartDate(state, date) {
			state.startDate = date;
		},

		setEndDate(state, date) {
			state.endDate = date;
		},

		setStrategy(state, strategy) {
			state.strategy = strategy;

			// min/max and avg for validation of Sigma and Theta
			const minMax = getMinMax(state.strategy.ts.data)
			const avg = mean(state.strategy.ts.data)
			const extremes = tsExtremes(state.strategy.ts.data)


			// Reset the transient data

			// Dates on graph
			state.startDate = state.strategy.fit.proctype === 'NONE' ? extremes.min : state.strategy.fit.start_date;
			state.endDate = state.strategy.fit.proctype === 'NONE' ? extremes.max : state.strategy.fit.end_date;

			// Parameters
			state.userKappa = null;
			state.userSigma = null;
			state.userTheta = null;
			state.range = minMax[1] - minMax[0];
			state.avg = avg;

			// Sims
			state.selectedSim = null;
			state.simStart.value = extremes.maxValue;
			state.simStart.date = extremes.max;
			state.simHorizon = DEFAULT_SIM_HORIZON;
			state.simSeed = seedGen();
			state.simSliderValue = state.endDate;
			state.simAnimationTime = DEFAULT_ANIMATION_TIME;
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
		}
	},
	
	actions: {
		async loadStrategy({commit, dispatch, state}, params) {
			commit('isLoadingStrategy', true)

			try {
				if(params.id !== state.strategy._id) {
					const strategy = await ApiController.loadStrategy(params.id);
					commit('setStrategy', strategy)

					if(strategy.fit.proctype === 'NONE') {
						commit('isFittingTS', true)
						const fit = await ApiController.fit({
							strategyId: state.strategy._id,
							start_date: state.startDate,
							end_date: state.endDate
						});
						
						commit('updateFit', fit)
					}
					await dispatch('loadSims')
				}
			}
			finally {
				commit('isFittingTS', false)
				commit('isLoadingStrategy', false)
			}
		},

		async setStrategy({commit, dispatch, state}, strategy) {
			commit('isLoadingStrategy', true)
			try {
				if(strategy._id !== state.strategy._id) {
					commit('setStrategy', strategy)

					if(strategy.fit.proctype === 'NONE') {
						commit('isFittingTS', true)
						const fit = await ApiController.fit({
							strategyId: state.strategy._id,
							start_date: state.startDate,
							end_date: state.endDate
						});
						commit('updateFit', fit)
					}

					await dispatch('loadSims')
				}
			}
			finally {
				commit('isFittingTS', false)
				commit('isLoadingStrategy', false)
			}
		},

		async fit({commit, state}) {
			commit('isFittingTS', true)
			try {
				const payload = {
					strategyId: state.strategy._id,
					start_date: state.startDate,
					end_date: state.endDate
				}

				if(state.userKappa !== '') {
					payload.kappa = state.userKappa;
				}
				if(state.userSigma !== null) {
					payload.sigma = state.userSigma;
				}
				if(state.userTheta !== null) {
					payload.theta = state.userTheta;
				}

				const fit = await ApiController.fit(payload);
				commit('updateFit', fit)
			}
			catch(error) {
				EventBus.$emit('api-error', 'Fit.fit ' + error.response.data.msg);  
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

		async loadSims({commit, state}) {
			commit('isLoadingSims', true)
			try {

				const payload = {
					kappa: state.userKappa !== null ? state.userKappa : state.strategy.fit.kappa,
					sigma: state.userSigma !== null ? state.userSigma : state.strategy.fit.sigma,
					theta: state.userTheta !== null ? state.userTheta : state.strategy.fit.theta,
					x_0: state.simStart.value,
					x_0_date: state.simStart.date,
					nsteps: state.simHorizon.value,
					seed: state.simSeed
				}

				/* Special case to match end of series */
				if(payload.nsteps === '-1') {
					const point = closestNeighbour(state.strategy.ts.data, payload.x_0_date)
					const index = state.strategy.ts.data.findIndex(elm => elm[0] === point[0])
					let diff = state.strategy.ts.data.length - index ;											// Mark is giving one more than asked for
					for(let i = index, len = state.strategy.ts.data.length; i < len; i++) {	// If weekends exists skip these when asking for sims
						if(moment.utc(state.strategy.ts.data[i][0]).day() === 6 ||						// Ignore Saturday
								moment.utc(state.strategy.ts.data[i][0]).day() === 0) {						// Ignore Sunday
							diff--;
						}
					}
					payload.nsteps = parseInt(diff)
				}

				const sims = await ApiController.scenarios(payload);
				
				commit('setSims', sims)
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