import moment from 'moment'
import ApiController from '@/services/ApiController'
import { closestNeighbour, tsExtremes, seedGen, getMinMax, mean } from '@/utils'
import { PROCTYPES } from './proctypes'
import { HORIZON_TYPES } from './horizontypes'


const DEFAULT_ACTIVE_TAB = '2';
const DEFAULT_PROCTYPE = 'OU';
const DEFAULT_SIM_HORIZON = { value: "0", text: "Last Date" };
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

		// Original Fit resid's
		originalResids: null,
		originalStartDate: null,
		originalEndDate: null,

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
		isLoadingSims: false,

		// User selected dates
		startDate: null,
		endDate: null,

		// Parameters
		userKappa: null,
		userSigma: null,
		userTheta: null,
		userBeta: null,

		// Sims
		selectedSim: null,
		sims: [],
		simStart: {
			value: null,
			date: null
		},
		simSeed: seedGen(),
		simHorizon: DEFAULT_SIM_HORIZON,
		simAnimationTime: DEFAULT_ANIMATION_TIME,
		simhorizons: HORIZON_TYPES,

		// Min, max of series used for validation -
		// not sure these derived values should here!!
		range: 0,
		avg: 0,

		// SLTP
		opt: {},
		ET: {},
		ER: {},
		EIR: {},
		EPnl: {},
		pblta: {},

		// Notifications
		isLoadingSLTP: false,

		// Slider value on SLTP [value, date]
		userValue: null,
		userDate: null,

		// opt values
		optSLValue: null,
		optTPValue: null,
		optIRValue: null,
		optHorizonValue: null,
		optTradPLValue: null
	},

	getters: {
		findEIR: state => (sl, tp) => {
			return state.EIR[sl][tp]
		},

		findET: state => (sl, tp) => {
			return state.ET[sl][tp]
		},

		findProctype: state => () => {
			return PROCTYPES.find(x => x.value === state.proctype)
		},

		kappa: state => () => {
			if (state.userKappa != null) {
				return state.userKappa;
			}
			return state.strategy.fit.kappa;
		},

		theta: state => () => {
			if (state.userTheta != null) {
				return state.userTheta;
			}
			return state.strategy.fit.theta;
		},

		sigma: state => () => {
			if (state.userSigma != null) {
				return state.userSigma;
			}
			return state.strategy.fit.sigma;
		},

		beta: state => () => {
			if (state.usernBeta != null) {
				return state.usernBeta;
			}
			return state.strategy.fit.nbeta;
		}
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

		setBeta(state, beta) {
			state.userBeta = beta;
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

		setProctype(state, proctype) {
			state.proctype = proctype;
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
			const minMax = getMinMax(state.strategy.ts.data);
			const avg = mean(state.strategy.ts.data);
			const extremes = tsExtremes(state.strategy.ts.data);

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

			// Original Resids
			state.originalStartDate = extremes.min;
			state.originalEndDate = extremes.max;

			// Process Parameters
			state.userKappa = state.strategy.fit.userKappa === undefined ? null : state.strategy.fit.userKappa;
			state.userSigma = state.strategy.fit.userSigma === undefined ? null : state.strategy.fit.userSigma;
			state.userTheta = state.strategy.fit.userTheta === undefined ? null : state.strategy.fit.userTheta;
			state.userBeta = state.strategy.fit.usernBeta === undefined ? null : state.strategy.fit.usernBeta;
			state.range = minMax[1] - minMax[0];
			state.avg = avg;

			// Sims
			const startSim = closestNeighbour(state.strategy.ts.data, state.startDate)
			state.selectedSim = null;
			state.simStart.value = startSim[1];
			state.simStart.date = startSim[0];
			state.simHorizon = DEFAULT_SIM_HORIZON;
			state.simAnimationTime = DEFAULT_ANIMATION_TIME;

			// SLTP
			state.opt = {};
			state.ET = {};
			state.ER = {};
			state.EIR = {};
			state.EPnl = {};
			state.pblta = {};

			// Notifications
			state.isLoadingSLTP = false;

			// User data
			state.userValue = extremes.maxValue;
			state.userDate = extremes.max;

			// Opt Values
			state.optSLValue = null;
			state.optTPValue = null;
			state.optIRValue = null;
			state.optHorizonValue = null;
			state.optTradPLValue = null;
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
			if (currentindex < state.sims.length - 1) {
				state.selectedSim = state.sims[currentindex + 1].id
			}
			else {
				state.selectedSim = state.sims[0].id
			}
		},

		// Freeze the object so that Vue does not try to attach listeners
		setSltpData(state, data) {
			state.opt = Object.freeze({
				SL: Object.freeze(data.opt.SL),
				TP: Object.freeze(data.opt.TP),
				Ext: Object.freeze(data.opt.Ext),
				maxVal: Object.freeze(data.opt.maxVal),
				tradePL: Object.freeze(data.opt.tradePL)
			});
			state.ET = Object.freeze(data.ET)
			state.ER = Object.freeze(data.ER)
			state.EIR = Object.freeze(data.EIR)
			state.EPnl = Object.freeze(data.EPnl)
			state.pblta = Object.freeze(data.pblta)
		},

		isLoadingSLTP(state, status) {
			state.isLoadingSLTP = status;
		},

		setOptSLValue(state, value) {
			state.optSLValue = value;
		},

		setOptTPValue(state, value) {
			state.optTPValue = value;
		},

		setOptIRValue(state, value) {
			state.optIRValue = value;
		},

		setOptHorizonValue(state, value) {
			state.optHorizonValue = value;
		},

		setOptTradPLValue(state, value) {
			state.optTradPLValue = value;
		}
	},

	actions: {
		async loadStrategy({ commit, state }, params) {
			commit('isLoadingStrategy', true)

			try {
				const strategy = await ApiController.loadStrategy(params.id);
				commit('setStrategy', strategy)
				commit('isFittingTS', true)
				const originalResids = await ApiController.fit({
					proctype: state.proctype,
					strategyId: state.strategy._id,
					start_date: state.originalStartDate,
					end_date: state.originalEndDate
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
			}
			finally {
				commit('isFittingTS', false)
				commit('isLoadingStrategy', false)
			}
		},

		async setStrategy({ commit, state }, strategy) {
			commit('isLoadingStrategy', true)
			try {
				commit('setStrategy', strategy)
				commit('isFittingTS', true)
				const originalResids = await ApiController.fit({
					proctype: state.proctype,
					strategyId: state.strategy._id,
					start_date: state.originalStartDate,
					end_date: state.originalEndDate
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
			}
			finally {
				commit('isFittingTS', false)
				commit('isLoadingStrategy', false)
			}
		},
		async setProcType({ commit, dispatch, state }, proctype) {
			commit('isFittingTS', true)
			commit('resetUserParams')
			const originalResids = await ApiController.fit({
				proctype,
				strategyId: state.strategy._id,
				start_date: state.originalStartDate,
				end_date: state.originalEndDate
			});
			commit('setOriginalResids', originalResids.resid)
			commit('setProctype', proctype)
			dispatch('fit')
		},

		async fit({ commit, state }) {
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
		},

		async loadSims({ commit, state }) {
			commit('isLoadingSims', true)
			try {

				const payload = {
					proctype: state.proctype,
					kappa: state.userKappa !== null ? state.userKappa : state.strategy.fit.kappa,
					sigma: state.userSigma !== null ? state.userSigma : state.strategy.fit.sigma,
					theta: state.userTheta !== null ? state.userTheta : state.strategy.fit.theta,
					nbeta: state.userBeta !== null ? state.userBeta : state.strategy.fit.nbeta,
					x_0: state.simStart.value,
					x_0_date: state.simStart.date,
					nsteps: '-1',
					seed: state.simSeed
				}

				// Extract Saturday and Sunday when calculating sims
				const point = closestNeighbour(state.strategy.ts.data, payload.x_0_date)
				const index = state.strategy.ts.data.findIndex(elm => elm[0] === point[0])
				let numberOfDays = state.strategy.ts.data.length - index;						// Mark is giving one more than asked for
				for (let i = index, len = state.strategy.ts.data.length; i < len; i++) {	// If weekends exists skip these when asking for sims
					if (moment.utc(state.strategy.ts.data[i][0]).day() === 6 ||			// Ignore Saturday
						moment.utc(state.strategy.ts.data[i][0]).day() === 0) {		// Ignore Sunday
						numberOfDays--;
					}
				}

				payload.nsteps = numberOfDays + parseInt(state.simHorizon.value)

				const sims = await ApiController.scenarios(payload);

				commit('setSims', sims)
			}
			finally {
				commit('isLoadingSims', false)
			}
		},

		async loadSltp({ commit, state }) {
			commit('isLoadingSLTP', true)
			try {
				const payload = {
					proctype: state.strategy.fit.proctype,
					kappa: state.strategy.fit.kappa,
					sigma: state.strategy.fit.sigma,
					theta: state.strategy.fit.theta,
					carry: 0.1,
					x_0: state.userValue,
					trans_oneway_stdev: 0.05
				}
				const data = await ApiController.sltp(payload);

				commit('setSltpData', {
					opt: {
						SL: data['opt']['opt SL'],
						TP: data['opt']['opt TP'],
						Ext: data['opt']['E[x_0] NBC'],
						maxVal: data['opt']['max val'],
						tradePL: data['opt']['trad P/L ratio']
					},
					ER: data['ER'],
					ET: data['ET'],
					EIR: data['EIR'],
					EPnl: data['EPnL'],
					pblta: data['pblta']
				});
			}
			finally {
				commit('isLoadingSLTP', false)
			}
		}
	}
}