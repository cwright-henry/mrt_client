<template>
	<v-layout row wrap>
		<v-flex :class="breakpoints">
			<div class="mrt-key">Kappa</div>
			<div v-if="readonly" class="mrt-value">{{kappa | number}}</div>
			<div v-else class="mrt-input">
				<input type="text" :value="kappa | number" @input="change('update:kappa', $event.target.value)">
			</div>
		</v-flex>
		<v-flex :class="breakpoints">
			<div class="mrt-key">Sigma</div>
			<div v-if="readonly" class="mrt-value">{{sigma | number}}</div>
			<div v-else class="mrt-input">
				<input type="text" :value="sigma | number" @input="change('update:sigma', $event.target.value)">
			</div>
		</v-flex>
		<v-flex :class="breakpoints">
			<div class="mrt-key">Theta</div>
			<div v-if="readonly" class="mrt-value">{{theta | number}}</div>
			<div v-else class="mrt-input">
				<input type="text" :value="theta | number" @input="change('update:theta', $event.target.value)">
			</div>
		</v-flex>
		<v-flex :class="breakpoints">
			<div class="mrt-key">ADF stat</div>
			<div v-if="readonly" class="mrt-value">{{adf_stat | number}}</div>
			<div v-else class="mrt-input">
				<input type="text" :value="adf_stat | number" @input="change('update:adf_stat', $event.target.value)">
			</div>
		</v-flex>
		<v-flex :class="breakpoints">
			<div class="mrt-key">P value</div>
			<div v-if="readonly" class="mrt-value">{{p_val | number}}</div>
			<div v-else class="mrt-input">
				<input type="text" :value="p_val | number" @input="change('update:p_val', $event.target.value)">
			</div>
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
			default:null
		},
		sigma: {
			type: Number,
			default:null
		},
		theta: {
			type: Number,
			default:null
		},
		adf_stat: {
			type: Number,
			default:null
		},
		p_val: {
			type: Number,
			default:null
		},
		sig_lev: {
			type: String,
			default:''
		},
		readonly: {
			type: Boolean,
			default: true
		},
		breakpoints: {
			type: String,
			default: 'lg1 md2 xs4'
		}
	},
	methods: {
		change(type, value) {
			let v = parseFloat(value)
			this.$emit(type, v)
		}
	}
}
</script>

<style scoped>
	.mrt-key {
		color:var(--light-gray);
		font-size:13px;
		margin: 0 0 2px 2px;
	}
	.mrt-value {
		background-color: rgba(0, 0, 0, 0.1);
		border-radius:2px;
		padding:4px 8px;
		height:32px;
		color:#fff;
		border:1px solid rgba(0, 0, 0, 0.1);
	}
	.mrt-input {
		background-color: rgba(0, 0, 0, 0.1);
		border-radius:2px;
		border:1px solid #c0c0c0;
		padding:4px 8px;
		height:32px;
		width:100%;
		overflow: hidden;
	}
</style>
