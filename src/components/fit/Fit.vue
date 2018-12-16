<template>
	<component :is="fitProcess" :fit="fit"></component>
</template>

<script>
import OU from '@/components/fit/FitOU'
import NONE from '@/components/fit/FitNone'

export default {
	props: {
		fit: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	components: {
		OU,
		NONE
	},
	computed: {
		fitProcess() {
			return this.fit.proctype;
		}
	}
}
</script>

<style>

</style>
