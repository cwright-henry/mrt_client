<template>
	<v-layout row wrap>
		<v-flex :class="breakpoints">
			<div class="mrt-key">Start Date</div>
			<div class="mrt-value"></div>
		</v-flex>
		<v-flex :class="breakpoints">
			<div class="mrt-key">End Date</div>
			<div class="mrt-value"></div>
		</v-flex>
		<v-flex :class="breakpoints">
			<div class="mrt-key">min</div>
			<div class="mrt-value"></div>
		</v-flex>
		<v-flex :class="breakpoints">
			<div class="mrt-key">Max</div>
			<div class="mrt-value"></div>
		</v-flex>
		<v-flex :class="breakpoints">
			<div class="mrt-key">Std</div>
			<div class="mrt-value"></div>
		</v-flex>
		<v-flex :class="breakpoints">
			<div class="mrt-key">Sig. Level</div>
			<div class="mrt-value">{{sig_lev}}</div>
		</v-flex>
	</v-layout>
</template>

<script>
export default {
	props: {
		kappa: {
			type: Number,
			default: null
		},
		sigma: {
			type: Number,
			default: null
		},
		theta: {
			type: Number,
			default: null
		},
		adf_stat: {
			type: Number,
			default: null
		},
		p_val: {
			type: Number,
			default: null
		},
		sig_lev: {
			type: String,
			default: ""
		},
		readonly: {
			type: Boolean,
			default: true
		},
		breakpoints: {
			type: String,
			default: "lg1 md2 xs4"
		}
	}
};
</script>

<style scoped>
.mrt-key {
	color: var(--light-gray);
	font-size: 13px;
	margin: 0 0 2px 2px;
}
.mrt-value {
	background-color: rgba(0, 0, 0, 0.1);
	border-radius: 2px;
	padding: 4px 8px;
	height: 32px;
	color: #fff;
	border: 1px solid rgba(0, 0, 0, 0.1);
}
.mrt-input {
	background-color: rgba(0, 0, 0, 0.1);
	border-radius: 2px;
	border: 1px solid #c0c0c0;
	padding: 4px 8px;
	height: 32px;
	width: 100%;
	overflow: hidden;
}
</style>
