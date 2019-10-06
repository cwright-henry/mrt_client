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
							<v-menu
								left
								v-model="carryMenu"
								offset-y
								:close-on-content-click="false"
								origin="top right"
								transition="scale-transition"
							>
								<div slot="activator" class="input">{{actualCarry | number}}</div>
								<div class="mrt-text-field">
									<v-text-field
										v-model="carry"
										:loading="isLoadingSLTP"
										:disabled="isLoadingSLTP"
										:error-messages="carryErrors"
										label="Carry"
										color="#2196F3"
										background-color="#424242"
										outline
										maxlength="10"
										ref="carryInput"
										placeholder="Input Carry"
										@keyup.enter="setCarry"
									></v-text-field>
									<div class="mrt-text-field--actions" @click="resetCarry">
										<v-btn flat icon color="white">
											<v-icon>clear</v-icon>
										</v-btn>
										<div class="mrt-text-field--actions__text">Reset</div>
									</div>
								</div>
							</v-menu>
						</div>
					</li>
					<li>
						<label>
							Transaction Cost
							<span>(STD)</span>
						</label>
						<div>
							<v-menu
								left
								v-model="transactionCostMenu"
								offset-y
								:close-on-content-click="false"
								origin="top right"
								transition="scale-transition"
							>
								<div slot="activator" class="input">{{actualTransactionCost | number}}</div>
								<div class="mrt-text-field">
									<v-text-field
										v-model="transactionCost"
										:loading="isLoadingSLTP"
										:disabled="isLoadingSLTP"
										:error-messages="transactionCostErrors"
										label="Transcation Cost"
										color="#2196F3"
										background-color="#424242"
										outline
										maxlength="10"
										ref="carryInput"
										placeholder="Input Transaction Cost"
										@keyup.enter="setTransactionCost"
									></v-text-field>
									<div class="mrt-text-field--actions" @click="resetTransactionCost">
										<v-btn flat icon color="white">
											<v-icon>clear</v-icon>
										</v-btn>
										<div class="mrt-text-field--actions__text">Reset</div>
									</div>
								</div>
							</v-menu>
						</div>
					</li>
				</ul>
			</div>
			<div class="parameter-set">
				<ul>
					<li>
						<label>Start Date</label>
						<v-menu
							ref="dateMenu"
							v-model="dateMenu"
							:close-on-content-click="false"
							:nudge-right="40"
							lazy
							transition="scale-transition"
							offset-y
							origin="top left"
							full-width
							min-width="290px"
						>
							<div slot="activator" class="input">{{formatedDate}}</div>
							<v-date-picker
								ref="picker"
								v-model="date"
								:allowed-dates="allowedDates"
								no-title
								color="#2196F3"
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
 * Check that user input is a number
 */
const isNumber = /^(-)?(\d+)?((\.)?(\d+)?)?$/;

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
		carryMenu: false,
		carry: 0.1,
		carryErrors: [],
		actualCarry: 0.1,

		transactionCostMenu: false,
		transactionCost: 0.05,
		transactionCostErrors: [],
		actualTransactionCost: 0.05,

		dateMenu: false,
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
			"optTradPLValue",
			"isLoadingSLTP"
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
		dateMenu(val) {
			val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
		},

		strategy() {
			this.date = maxTSDate(this.strategy.ts.data);
		},

		carry(value) {
			this.carryErrors = [];
			if (value !== "" && value !== null) {
				if (!isNumber.test(value)) {
					this.carryErrors.push("Not a number!");
					return;
				}
			}
		},

		transactionCost(value) {
			this.transactionCostErrors = [];
			if (value !== "" && value !== null) {
				if (!isNumber.test(value)) {
					this.transactionCostErrors.push("Not a number!");
					return;
				}
			}
		}
	},
	methods: {
		save(date) {
			this.$refs.dateMenu.save(date);
		},

		allowedDates(val) {
			return this.dateMap[val] !== undefined;
		},

		setCarry() {
			this.carryMenu = false;
			this.actualCarry = this.carry;
		},

		resetCarry() {
			this.carry = 0.1;
			this.carryMenu = false;
		},

		setTransactionCost() {
			this.transactionCostMenu = false;
			this.actualTransactionCost = this.transactionCost;
		},

		resetTransactionCost() {
			this.transactionCost = 0.05;
			this.transactionCostMenu = false;
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
			color: #fff9c4;
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
		color: #fff9c4;
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