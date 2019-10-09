import ApiController from '@/services/ApiController'

const DEFAULT_CARRY = 0.1;
const DEFAULT_TRANSACTION_COST = 0.05;

export default {
	namespaced: true,

	state: {
		// Input Params
		start: {
			date: null,
			value: null,
		},
		carry: DEFAULT_CARRY,
		transactionCost: DEFAULT_TRANSACTION_COST,

		// SLTP output data
		opt: {},
		ET: {},
		ER: {},
		EIR: {},
		EPnl: {},
		pblta: {},

		// opt values
		optSLValue: null,
		optTPValue: null,
		optIRValue: null,
		optHorizonValue: null,
		optTradPLValue: null,

		// Notifications
		isLoadingSLTP: false
	},

	getters: {
		findEIR: state => (sl, tp) => {
			return state.EIR[sl][tp]
		},

		findET: state => (sl, tp) => {
			return state.ET[sl][tp]
		}
	},

	mutations: {
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

			console.log(data.opt.TP)
			state.optSLValue = data.opt.SL['2.0'];
			state.optTPValue = data.opt.TP['2.0']
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
		},
		setStart(state, value) {
			state.start.date = value[0]
			state.start.value = value[1]
		},
		setCarry(state, value) {
			state.carry = value;
		},
		setTransactionCost(state, value) {
			state.transactionCost = value;
		}
	},

	actions: {
		async generate({ commit, state, rootState, rootGetters }) {
			commit('isLoadingSLTP', true)
			try {
				const payload = {
					proctype: rootState.fit.strategy.fit.proctype,
					kappa: rootGetters['fit/kappa'],
					sigma: rootGetters['fit/sigma'],
					theta: rootGetters['fit/theta'],
					carry: state.carry,
					x_0: state.start.value,
					trans_oneway_stdev: state.transactionCost
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
		},

		reset({ state, rootGetters }) {
			const lastPoint = rootGetters['fit/tsEnd'];
			state.start.date = lastPoint[0];
			state.start.value = lastPoint[1];
			state.carry = DEFAULT_CARRY;
			state.transactionCost = DEFAULT_TRANSACTION_COST;
			state.opt = {};
			state.ET = {};
			state.ER = {};
			state.EIR = {};
			state.EPnl = {};
			state.pblta = {};
			state.optSLValue = null;
			state.optTPValue = null;
			state.optIRValue = null;
			state.optHorizonValue = null;
			state.optTradPLValue = null;
			state.isLoadingSLTP = false;
		},

		/**
		 * Invalidate the results of the last fit
		 */
		resetForFit({ state }) {
			state.opt = {};
			state.ET = {};
			state.ER = {};
			state.EIR = {};
			state.EPnl = {};
			state.pblta = {};
			state.optSLValue = null;
			state.optTPValue = null;
			state.optIRValue = null;
			state.optHorizonValue = null;
			state.optTradPLValue = null;
			state.isLoadingSLTP = false;
		}
	}
}
