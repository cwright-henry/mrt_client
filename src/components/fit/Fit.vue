<template>
	<component :is="fitProcess" :fit="fit"></component>
</template>

<script>
import OU from "@/components/fit/FitOU";
import HypOU from "@/components/fit/FitHypOU";
import NONE from "@/components/fit/FitNone";
import LOADING from "@/components/fit/FitLoading";

export default {
	props: {
		fit: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	components: {
		OU,
		HypOU,
		NONE,
		LOADING
	},
	computed: {
		fitProcess() {
			return this.fit.proctype ? this.fit.proctype : "LOADING";
		}
	}
};
</script>

<style>
</style>
