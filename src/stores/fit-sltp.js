import ApiController from '@/services/ApiController'


const DEFAULT_CARRY = 0.1;
const DEFAULT_TRANSACTION_COST = 0.05;

const longOrShort = (kappa, sigma, theta, x_0) => {
	const sigmaD = sigma / Math.sqrt(2.0 * kappa);
	const x_0_stdev = (x_0 - theta) / sigmaD;

	return x_0_stdev <= 0 ? 'long' : 'short';
}

const closestNeighbour = (arr, value) => {
	return arr.reduce((prev, curr) => {
		return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
	});
}

const findNearest = (matrix, x, y) => {
	const first = closestNeighbour(Object.keys(matrix), x);
	const second = closestNeighbour(Object.keys(matrix[first]), y);
	return matrix[first][second];
}

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

		// Optimal Values
		opt: {},

		// Matrix values
		ET: {},
		ER: {},
		EIR: {},
		EPnl: {},
		pblta: {},

		// Slider Values
		slValue: null,
		tpValue: null,

		// Slider Range
		slRange: [],
		tpRange: [],

		// Matrix Values
		ETValue: null,
		ERValue: null,
		EIRValue: null,
		EPnLValue: null,
		pbltaValue: null,

		// Strategy type
		position: '',

		// Notifications
		isLoadingSLTP: false
	},

	mutations: {
		setSltpData(state, data) {
			// Optimal Data
			state.opt = Object.freeze({
				SL: Object.freeze(data.opt.SL),
				TP: Object.freeze(data.opt.TP),
				Ext: Object.freeze(data.opt.Ext),
				maxVal: Object.freeze(data.opt.maxVal),
				tradePL: Object.freeze(data.opt.tradePL)
			});

			// Matrix data
			state.ET = Object.freeze(data.ET);
			state.ER = Object.freeze(data.ER);
			state.EIR = Object.freeze(data.EIR);
			state.EPnl = Object.freeze(data.EPnl);
			state.pblta = Object.freeze(data.pblta);

			// Toggle based on short or long position
			if (state.position === 'short') {
				// Slider Ranges
				const slKeys = Object.keys(state.EIR)
				const tpKeys = Object.keys(state.EIR[slKeys[0]])
				state.slRange = [slKeys[0], slKeys[slKeys.length - 1]];
				state.tpRange = [tpKeys[0], tpKeys[tpKeys.length - 1]];

				// Slider values
				state.slValue = state.slRange[1];
				state.tpValue = state.tpRange[0];

				// Matrix values
				state.ETValue = findNearest(state.ET, state.slValue, state.tpValue) * 365;
				state.ERValue = findNearest(state.EIR, state.slValue, state.tpValue)
				state.EIRValue = findNearest(state.EIR, state.slValue, state.tpValue)
				state.EPnLValue = findNearest(state.EPnl, state.slValue, state.tpValue)
				state.pbltaValue = findNearest(state.pblta, state.slValue, state.tpValue)
			}
			else {
				// Slider Ranges
				const tpKeys = Object.keys(state.EIR)
				const slKeys = Object.keys(state.EIR[tpKeys[0]])
				state.tpRange = [tpKeys[0], tpKeys[tpKeys.length - 1]];
				state.slRange = [slKeys[0], slKeys[slKeys.length - 1]];

				// Slider values
				state.tpValue = state.tpRange[1];
				state.slValue = state.slRange[0];

				// Matrix values
				state.ETValue = findNearest(state.ET, state.tpValue, state.tslValue) * 365;
				state.ERValue = findNearest(state.EIR, state.tpValue, state.slValue)
				state.EIRValue = findNearest(state.EIR, state.tpValue, state.slValue)
				state.EPnLValue = findNearest(state.EPnl, state.tpValue, state.slValue)
				state.pbltaValue = findNearest(state.pblta, state.tpValue, state.slValue)
			}
		},
		isLoadingSLTP(state, status) {
			state.isLoadingSLTP = status;
		},
		setSLValue(state, value) {
			state.slValue = value;
			if (state.position === 'short') {
				state.ETValue = findNearest(state.ET, state.slValue, state.tpValue) * 365;
				state.ERValue = findNearest(state.EIR, state.slValue, state.tpValue)
				state.EIRValue = findNearest(state.EIR, state.slValue, state.tpValue)
				state.EPnLValue = findNearest(state.EPnl, state.slValue, state.tpValue)
				state.pbltaValue = findNearest(state.pblta, state.slValue, state.tpValue)
			}
			else {
				state.ETValue = findNearest(state.ET, state.tpValue, state.tslValue) * 365;
				state.ERValue = findNearest(state.EIR, state.tpValue, state.slValue)
				state.EIRValue = findNearest(state.EIR, state.tpValue, state.slValue)
				state.EPnLValue = findNearest(state.EPnl, state.tpValue, state.slValue)
				state.pbltaValue = findNearest(state.pblta, state.tpValue, state.slValue)
			}
		},
		setTPValue(state, value) {
			state.tpValue = value;
			if (state.position === 'short') {
				state.ETValue = findNearest(state.ET, state.slValue, state.tpValue) * 365;
				state.ERValue = findNearest(state.EIR, state.slValue, state.tpValue)
				state.EIRValue = findNearest(state.EIR, state.slValue, state.tpValue)
				state.EPnLValue = findNearest(state.EPnl, state.slValue, state.tpValue)
				state.pbltaValue = findNearest(state.pblta, state.slValue, state.tpValue)
			}
			else {
				state.ETValue = findNearest(state.ET, state.tpValue, state.tslValue) * 365;
				state.ERValue = findNearest(state.EIR, state.tpValue, state.slValue)
				state.EIRValue = findNearest(state.EIR, state.tpValue, state.slValue)
				state.EPnLValue = findNearest(state.EPnl, state.tpValue, state.slValue)
				state.pbltaValue = findNearest(state.pblta, state.tpValue, state.slValue)
			}
		},
		setCarry(state, value) {
			state.carry = value;
		},
		setTransactionCost(state, value) {
			state.transactionCost = value;
		},
		setStart(state, value) {
			state.start.date = value[0]
			state.start.value = value[1]
		},
		setPosition(state, value) {
			state.position = value;
		}
	},

	actions: {
		async generate({ commit, state, rootState, rootGetters }) {
			commit('isLoadingSLTP', true);

			const kappa = rootGetters['fit/kappa'];
			const sigma = rootGetters['fit/sigma'];
			const theta = rootGetters['fit/theta'];
			const x_0 = state.start.value;

			try {
				const payload = {
					proctype: rootState.fit.strategy.fit.proctype,
					kappa,
					sigma,
					theta,
					carry: state.carry,
					x_0,
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

		setStart({ commit, rootGetters }, value) {
			const kappa = rootGetters['fit/kappa'];
			const sigma = rootGetters['fit/sigma'];
			const theta = rootGetters['fit/theta'];
			const x_0 = value[1];

			commit('setPosition', longOrShort(kappa, sigma, theta, x_0));
			commit('setStart', value)
		},

		reset({ state, dispatch, rootGetters }) {
			const lastPoint = rootGetters['fit/tsEnd'];
			dispatch('setStart', lastPoint)
			state.carry = DEFAULT_CARRY;
			state.transactionCost = DEFAULT_TRANSACTION_COST;
			state.opt = {};
			state.ET = {};
			state.ER = {};
			state.EIR = {};
			state.EPnl = {};
			state.pblta = {};

			// Slider values
			state.slValue = null
			state.tpValue = null

			// Slider Range
			state.slRange = []
			state.tpRange = []

			// Matrix Values
			state.ETValue = null
			state.ERValue = null
			state.EIRValue = null
			state.EPnLValue = null
			state.pbltaValue = null
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

			state.slValue = null
			state.tpValue = null

			// Slider Range
			state.slRange = []
			state.tpRange = []

			// Matrix Values
			state.ETValue = null
			state.ERValue = null
			state.EIRValue = null
			state.EPnLValue = null
			state.pbltaValue = null
		}
	}
}
