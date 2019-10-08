import moment from 'moment'

import ApiController from '@/services/ApiController'
import { HORIZON_TYPES } from './horizontypes'
import { closestNeighbour, seedGen } from '@/utils'

const DEFAULT_SIM_HORIZON = { value: "756", text: "3 years" };
const DEFAULT_ANIMATION_TIME = 2;

export default {
	namespaced: true,

	state: {
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
		isLoadingSims: false
	},

	mutations: {
		/**
		 * Set the sims and set the selected one to the first
		 */
		setSims(state, sims) {
			state.selectedSim = sims[0].id
			state.sims = sims
		},
		setSelectedSim(state, simId) {
			state.selectedSim = simId
		},
		/**
		 * Cycle through the sims
		 */
		setNextSim(state) {
			let currentindex = state.sims.findIndex(elm => elm.id === state.selectedSim)
			if (currentindex < state.sims.length - 1) {
				state.selectedSim = state.sims[currentindex + 1].id
			}
			else {
				state.selectedSim = state.sims[0].id
			}
		},
		/**
		 * Used to freeze controls as we generate new sims
		 */
		isLoadingSims(state, status) {
			state.isLoadingSims = status;
		},
		/**
		 * The forcast horizon
		 */
		setSimHorizon(state, horizon) {
			state.simHorizon = horizon;
		},
		/**
		 * Animation time
		 */
		setAnimationTime(state, animationTime) {
			state.simAnimationTime = animationTime;
		},
		/**
		 * Create a new seed to generate a completely new set of sims
		 */
		setSimSeed(state) {
			state.simSeed = seedGen()
		},
		/**
		 * As the slider moves we save the position
		 */
		setSimStart(state, start) {
			state.simStart.value = start.value;
			state.simStart.date = start.date;
		}
	},

	actions: {
		async loadSims({ commit, state, rootState, rootGetters }) {
			commit('isLoadingSims', true)

			try {

				const payload = {
					proctype: rootState.fit.strategy.fit.proctype,
					kappa: rootGetters['fit/kappa'],
					sigma: rootGetters['fit/sigma'],
					theta: rootGetters['fit/theta'],
					nbeta: rootGetters['fit/beta'],
					x_0: state.simStart.value,
					x_0_date: state.simStart.date,
					seed: state.simSeed
				}

				// Extract Saturday and Sunday when calculating sims
				const tsData = rootState.fit.strategy.ts.data
				const point = closestNeighbour(tsData, payload.x_0_date)
				const index = tsData.findIndex(elm => elm[0] === point[0])
				let numberOfDays = tsData.length - index;						// Mark is giving one more than asked for
				for (let i = index, len = tsData.length; i < len; i++) {	// If weekends exists skip these when asking for sims
					if (moment.utc(tsData[i][0]).day() === 6 ||			// Ignore Saturday
						moment.utc(tsData[i][0]).day() === 0) {		// Ignore Sunday
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

		reset({ state, rootGetters }) {
			state.selectedSim = null;
			state.sims = [];
			state.simSeed = seedGen()
			state.simHorizon = DEFAULT_SIM_HORIZON;
			state.simAnimationTime = DEFAULT_ANIMATION_TIME;
			const lastPoint = rootGetters['fit/tsEnd'];
			state.simStart.date = lastPoint[0]
			state.simStart.value = lastPoint[1]
		},
		
		resetForFit({state}) {
			state.selectedSim = null;
			state.sims = [];
			state.simSeed = seedGen()
		}
	}
}