<template>
	<div class="sltp-fittings">
		<div class="proctype">
			<label>Fit Process</label>
			<div>{{findProctype().text}}</div>
		</div>
		<label>SLTP Parameters</label>
		<div class="parameters">
			<div class="parameter-set">
				<ul>
					<li>
						<label>Kappa</label>
						<div>
							<v-icon v-if="userKappa != null">lock</v-icon>
							<div class="readonly">{{kappa() | number}}</div>
						</div>
					</li>
					<li>
						<label>Sigma</label>
						<div>
							<v-icon v-if="userSigma != null">lock</v-icon>
							<div class="readonly">{{sigma() | number}}</div>
						</div>
					</li>
					<li>
						<label>Theta</label>
						<div>
							<v-icon v-if="userTheta != null">lock</v-icon>
							<div class="readonly">{{theta() | number}}</div>
						</div>
					</li>
					<li v-if="findProctype().value !== 'OU'">
						<label>Beta</label>
						<div>
							<v-icon v-if="userBeta != null">lock</v-icon>
							<div class="readonly">{{beta() | number}}</div>
						</div>
					</li>
					<li>
						<label>Carry</label>
						<div>
							<div class="input">0.1</div>
						</div>
					</li>
					<li>
						<label>
							Transaction Cost
							<span>(STD)</span>
						</label>
						<div>
							<div class="input">0.05</div>
						</div>
					</li>
				</ul>
			</div>
			<div class="parameter-set">
				<ul>
					<li>
						<label>Start Date</label>
						<v-menu
							ref="menu"
							v-model="menu"
							:close-on-content-click="false"
							:nudge-right="40"
							lazy
							transition="scale-transition"
							offset-y
							full-width
							min-width="290px"
						>
							<div slot="activator" class="input">{{formatedDate}}</div>
							<v-date-picker
								ref="picker"
								v-model="date"
								:allowed-dates="allowedDates"
								no-title
								:max="maxDate"
								:min="minDate"
								@change="save"
							></v-date-picker>
						</v-menu>
					</li>
					<li>
						<label>Start Value</label>
						<div class="readonly">{{startValue | number}}</div>
					</li>
				</ul>
			</div>
			<div class="parameter-set">
				<ul>
					<li>
						<label>Max. Information Ratio</label>
						<div class="readonly">{{optIRValue | number}}</div>
					</li>
					<li>
						<label>Optimal Stop Loss</label>
						<div class="readonly">{{optSLValue | number}}</div>
					</li>
					<li>
						<label>Optimal Take Profit</label>
						<div class="readonly">{{optTPValue | number}}</div>
					</li>
					<li>
						<label>Horizon</label>
						<div class="readonly">{{optHorizonValue | number}}</div>
					</li>
					<li>
						<label>Trad. Profit &amp; Loss</label>
						<div class="readonly">{{optTradPLValue | number}}</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import moment from "moment";

/**
 * Helpers for date picker. Only allow dates to be choosen over the range of the series
 * and exclude dates that are not in the array.
 */
const arrToMap = arr => {
	const map = {};
	if (arr) {
		for (let i = 0; i < arr.length; i++) {
			const date = moment(arr[i][0]).format("YYYY-MM-DD");
			map[date] = arr[i]; // Keep the orginal i.e. [timestamp, value]
		}
	}
	return map;
};

const minTSDate = arr => {
	return arr.length > 0
		? moment(arr[0][0]).format("YYYY-MM-DD")
		: new Date().toISOString().substr(0, 10);
};

const maxTSDate = arr => {
	return arr.length > 0
		? moment(arr[arr.length - 1][0]).format("YYYY-MM-DD")
		: new Date().toISOString().substr(0, 10);
};

export default {
	data: () => ({
		menu: false,
		date: null
	}),
	computed: {
		...mapState("fit", [
			"strategy",
			"userKappa",
			"userSigma",
			"userTheta",
			"userBeta",
			"userValue",
			"optIRValue",
			"optSLValue",
			"optTPValue",
			"optHorizonValue",
			"optTradPLValue"
		]),
		...mapGetters("fit", [
			"kappa",
			"sigma",
			"theta",
			"beta",
			"findProctype"
		]),

		minDate() {
			return minTSDate(this.strategy.ts.data);
		},

		maxDate() {
			return maxTSDate(this.strategy.ts.data);
		},

		dateMap() {
			return arrToMap(this.strategy.ts.data);
		},

		startValue() {
			if (this.dateMap[this.date]) return this.dateMap[this.date][1];
		},

		formatedDate() {
			return this.date ? moment(this.date).format("DD MMM YYYY") : "";
		}
	},
	watch: {
		menu(val) {
			val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
		},

		strategy() {
			this.date = maxTSDate(this.strategy.ts.data);
		}
	},
	methods: {
		save(date) {
			this.$refs.menu.save(date);
		},

		allowedDates(val) {
			return this.dateMap[val] !== undefined;
		}
	}
};
</script>

<style lang="less" scoped>
.sltp-fittings {
	.proctype {
		margin: 0 0 12px;
		label {
			text-transform: uppercase;
			color: #e0e0e0;
			font-size: 12px;
			font-weight: 300;
		}
		> div {
			font-size: 18px;
			font-weight: 400;
			color: #ce93d8;
		}
	}
	> label {
		text-transform: uppercase;
		color: #e0e0e0;
		font-size: 12px;
		font-weight: 300;
		margin: 0 0 6px;
		display: inline-block;
	}
	.parameters {
		display: flex;
		.parameter-set {
			margin: 0 80px 0 0;
			ul {
				display: flex;
				flex-direction: column;
				padding: 0;
				list-style: none;
				li {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin: 0 0 4px 0;
					height: 24px;
					.readonly {
						padding: 1px 4px 1px 4px;
						border-radius: 2px;
						width: 100px;
						height: 24px;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						border: 1px solid #757575;
						background-color: #2e2e2e;
						display: flex;
						justify-content: flex-end;
					}
					.input {
						background-color: #e0e0e0;
						padding: 1px 4px 1px 4px;
						border-radius: 2px;
						color: #121212;
						width: 100px;
						height: 24px;
						display: inline-block;
						cursor: pointer;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						text-align: right;
					}
					label {
						color: #e0e0e0;
						margin: 0 12px 0 0;
						font-size: 14px;
						span {
							font-size: 11px;
							font-weight: 300;
						}
					}
					> div {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 0 0 0 12px;
						i {
							font-size: 16px;
							color: #fff9c4;
							margin: 0 5px 0 0;
						}
					}
				}
				li.divider {
					border-left: 1px solid #757575;
					padding: 0 0 0 16px;
				}
			}
		}
	}
}
</style>