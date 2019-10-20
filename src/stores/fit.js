import ApiController from '@/services/ApiController'
import { tsExtremes, seedGen, getMinMax, mean } from '@/utils'
import { PROCTYPES } from './proctypes'
import sims from './fit-sims'
import sltp from './fit-sltp'


const DEFAULT_ACTIVE_TAB = '1';
const DEFAULT_PROCTYPE = 'OU';

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

		// Original Fit resid's
		originalResids: null,

		// Active Tab
		activeTab: DEFAULT_ACTIVE_TAB,

		// Show both selection and full
		showFull: true,

		// proctype
		proctype: DEFAULT_PROCTYPE,
		proctypes: PROCTYPES,

		// Notifications
		isLoadingStrategy: false,
		isFittingTS: false,
		isSavingFit: false,

		// User selected dates
		startDate: null,
		endDate: null,

		// Parameters
		userKappa: null,
		userSigma: null,
		userTheta: null,
		userBeta: null,

		// Min, max of series used for validation -
		// not sure these derived values should here!!
		range: 0,
		avg: 0,
	},

	getters: {
		findProctype: state => {
			return PROCTYPES.find(x => x.value === state.proctype)
		},

		kappa: state => {
			if (state.userKappa != null) {
				return state.userKappa;
			}
			return state.strategy.fit.kappa;
		},

		theta: state => {
			if (state.userTheta != null) {
				return state.userTheta;
			}
			return state.strategy.fit.theta;
		},

		sigma: state => {
			if (state.userSigma != null) {
				return state.userSigma;
			}
			return state.strategy.fit.sigma;
		},

		beta: state => {
			if (state.usernBeta != null) {
				return state.usernBeta;
			}
			return state.strategy.fit.nbeta;
		},

		tsStart: state => {
			return state.strategy.ts.data[0];
		},

		tsEnd: state => {
			return state.strategy.ts.data[state.strategy.ts.data.length - 1];
		}
	},

	mutations: {
		isLoadingStrategy(state, status) {
			state.isLoadingStrategy = status;
		},

		isFittingTS(state, status) {
			state.isFittingTS = status;
		},

		isSavingFit(state, status) {
			state.isSavingFit = status;
		},

		setActiveTab(state, tab) {
			state.activeTab = tab;
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

		setSimSeed(state) {
			state.simSeed = seedGen()
		},

		setProctype(state, proctype) {
			state.proctype = proctype;
		},

		setStartDate(state, date) {
			state.startDate = date;
		},

		setEndDate(state, date) {
			state.endDate = date;
		},

		setOriginalResids(state, data) {
			state.originalResids = data;
		},

		setShowFull(state, value) {
			state.showFull = value
		},

		setStrategy(state, strategy) {
			state.strategy = strategy;

			// min/max and avg for validation of Sigma and Theta
			const tsData = state.strategy.ts.data
			const minMax = getMinMax(tsData);
			const avg = mean(tsData);
			const extremes = tsExtremes(tsData);

			//
			// Reset the transient data
			//

			// Active Tab
			state.activeTab = DEFAULT_ACTIVE_TAB;

			// SHow Full vs Selection
			state.showFull = true;

			// Proctype
			state.proctype = state.strategy.fit.proctype === 'NONE' ? DEFAULT_PROCTYPE : state.strategy.fit.proctype;

			// Dates on graph
			state.startDate = state.strategy.fit.proctype === 'NONE' ? extremes.min : state.strategy.fit.start_date;
			state.endDate = state.strategy.fit.proctype === 'NONE' ? extremes.max : state.strategy.fit.end_date;

			// Process Parameters
			state.userKappa = state.strategy.fit.userKappa === undefined ? null : state.strategy.fit.userKappa;
			state.userSigma = state.strategy.fit.userSigma === undefined ? null : state.strategy.fit.userSigma;
			state.userTheta = state.strategy.fit.userTheta === undefined ? null : state.strategy.fit.userTheta;
			state.userBeta = state.strategy.fit.usernBeta === undefined ? null : state.strategy.fit.usernBeta;
			state.range = minMax[1] - minMax[0];
			state.avg = avg;
		},

		resetUserParams(state) {
			state.userKappa = null;
			state.userSigma = null;
			state.userTheta = null;
			state.userBeta = null;
		},

		setStrategyName(state, name) {
			state.strategy.name = name;
		},

		updateFit(state, fit) {
			state.strategy.fit = fit;
		}
	},

	actions: {
		async loadStrategy({ commit, state, dispatch, getters }, params) {
			commit('isLoadingStrategy', true)

			try {
				const strategy = await ApiController.loadStrategy(params.id);
				commit('setStrategy', strategy)
				commit('isFittingTS', true)
				const originalResids = await ApiController.fit({
					proctype: state.proctype,
					strategyId: state.strategy._id,
					start_date: getters.tsStart[0],
					end_date: getters.tsEnd[0]
				});
				commit('setOriginalResids', originalResids.resid)

				if (strategy.fit.proctype === 'NONE') {
					const fit = await ApiController.fit({
						proctype: state.proctype,
						strategyId: state.strategy._id,
						start_date: state.startDate,
						end_date: state.endDate
					});

					commit('updateFit', fit)
				}

				dispatch('sims/reset');
				dispatch('sltp/reset');
			}
			finally {
				commit('isFittingTS', false)
				commit('isLoadingStrategy', false)
			}
		},

		async setStrategy({ commit, state, dispatch, getters }, strategy) {
			commit('isLoadingStrategy', true)
			try {
				commit('setStrategy', strategy)
				commit('isFittingTS', true)
				const originalResids = await ApiController.fit({
					proctype: state.proctype,
					strategyId: state.strategy._id,
					start_date: getters.tsStart[0],
					end_date: getters.tsEnd[0]
				});
				commit('setOriginalResids', originalResids.resid)

				if (strategy.fit.proctype === 'NONE') {
					commit('isFittingTS', true)
					const fit = await ApiController.fit({
						proctype: state.proctype,
						strategyId: state.strategy._id,
						start_date: state.startDate,
						end_date: state.endDate
					});
					commit('updateFit', fit)
					commit('setOriginalResids', fit.resid)
				}

				dispatch('sims/reset');
				dispatch('sltp/reset');
			}
			finally {
				commit('isFittingTS', false)
				commit('isLoadingStrategy', false)
			}
		},

		async setProcType({ commit, dispatch, state, getters }, proctype) {
			commit('isFittingTS', true)
			commit('resetUserParams')
			const originalResids = await ApiController.fit({
				proctype,
				strategyId: state.strategy._id,
				start_date: getters.tsStart[0],
				end_date: getters.tsEnd[0]
			});
			commit('setOriginalResids', originalResids.resid)
			commit('setProctype', proctype)
			dispatch('fit')
		},

		async fit({ commit, state, dispatch }) {
			commit('isFittingTS', true)
			try {
				const payload = {
					proctype: state.proctype,
					strategyId: state.strategy._id,
					start_date: state.startDate,
					end_date: state.endDate
				}

				if (state.userKappa !== null) {
					payload.kappa = state.userKappa;
				}
				if (state.userSigma !== null) {
					payload.sigma = state.userSigma;
				}
				if (state.userTheta !== null) {
					payload.theta = state.userTheta;
				}
				if (state.userBeta !== null) {
					payload.nbeta = state.userBeta;
				}

				const fit = await ApiController.fit(payload);
				commit('updateFit', fit)
				dispatch('sims/resetForFit');
				dispatch('sltp/resetForFit');
			}
			finally {
				commit('isFittingTS', false)
			}
		},

		async save({ commit, state }) {
			commit('isSavingFit', true)
			try {
				if (state.userKappa !== null) {
					state.strategy.fit.userKappa = state.userKappa;
				}
				if (state.userSigma !== null) {
					state.strategy.fit.userSigma = state.userSigma;
				}
				if (state.userTheta !== null) {
					state.strategy.fit.userTheta = state.userTheta;
				}
				if (state.userBeta !== null) {
					state.strategy.fit.usernBeta = state.userBeta;
				}
				if (state.proctype !== state.strategy.fit.proctype) {
					state.strategy.fit.proctype = state.proctype;
				}
				return await ApiController.saveOUFit({
					name: state.strategy.name,
					id: state.strategy._id,
					fit: state.strategy.fit
				});
			}
			finally {
				commit('isSavingFit', false)
			}
		}
	},

	modules: {
		sims: sims,
		sltp: sltp
	}
}