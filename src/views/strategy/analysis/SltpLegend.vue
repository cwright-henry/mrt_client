<template>
	<ul class="sltp-legend">
		<li :class="[!hasOPT && 'disabled', !showSL && 'hidden']" @click="toggleSL">
			<span :style="{'background-color': slColor}"></span>
			<div>Opt SL</div>
		</li>
		<li :class="[!hasOPT && 'disabled', !showTP && 'hidden']" @click="toggleTP">
			<span :style="{'background-color': tpColor}"></span>
			<div>Opt TP</div>
		</li>
		<li :class="[!hasOPT && 'disabled', !showExtNBC && 'hidden']" @click="toggleExtNBC">
			<span :style="{'background-color': extColor}"></span>
			<div>Opt E[x_0] NBC</div>
		</li>
		<li :class="[!hasOPT && 'disabled', !showMaxEir && 'hidden']" @click="toggleMaxEir">
			<span :style="{'background-color': maxColor}"></span>
			<div>Opt Max EIR</div>
		</li>
		<li :class="[!hasOPT && 'disabled', !showTradPnL && 'hidden']" @click="toggleTradPnL">
			<span :style="{'background-color': tradeColor}"></span>
			<div>Opt Trad P/L Ratio</div>
		</li>
	</ul>
</template>

<script>
import { mapState } from "vuex";
import { OPT } from "@/stores/sltp-types";

export default {
	data() {
		return {
			showSL: true,
			showTP: true,
			showExtNBC: true,
			showMaxEir: true,
			showTradPnL: true,
			hasOPT: false
		};
	},
	created() {
		// Static non-reactive properties
		this.slColor = OPT.SL.color;
		this.tpColor = OPT.TP.color;
		this.extColor = OPT.EXT.color;
		this.maxColor = OPT.MAX.color;
		this.tradeColor = OPT.TRADE.color;
	},
	computed: {
		...mapState("fit", ["strategy"]),
		...mapState("fit/sltp", ["opt", "start"])
	},
	watch: {
		/**
		 * Watch for opt changes as we have to reset the state
		 * of the legend
		 */
		opt() {
			this.hasOPT = this.opt.SL ? true : false;
			this.showSL = true;
			this.showTP = true;
			this.showExtNBC = true;
			this.showMaxEir = true;
			this.showTradPnL = true;
		}
	},
	methods: {
		toggleSL() {
			this.showSL = !this.showSL;
			const chart = this.$parent.$refs.sltpchart.chart;
			chart.get(OPT.SL.id).update({ visible: this.showSL });
			this.checkExtremes();
		},
		toggleTP() {
			this.showTP = !this.showTP;
			const chart = this.$parent.$refs.sltpchart.chart;
			chart.get(OPT.TP.id).update({ visible: this.showTP });
			this.checkExtremes();
		},
		toggleExtNBC() {
			this.showExtNBC = !this.showExtNBC;
			const chart = this.$parent.$refs.sltpchart.chart;
			chart.get(OPT.EXT.id).update({ visible: this.showExtNBC });
			this.checkExtremes();
		},
		toggleMaxEir() {
			this.showMaxEir = !this.showMaxEir;
			const chart = this.$parent.$refs.sltpchart.chart;
			chart.get(OPT.MAX.id).update({ visible: this.showMaxEir });
			chart.yAxis[OPT.MAX.axis].update({ visible: this.showMaxEir });
			this.checkExtremes();
		},
		toggleTradPnL() {
			this.showTradPnL = !this.showTradPnL;
			const chart = this.$parent.$refs.sltpchart.chart;
			chart.get(OPT.TRADE.id).update({ visible: this.showTradPnL });
			chart.yAxis[OPT.TRADE.axis].update({ visible: this.showTradPnL });
			this.checkExtremes();
		},
		checkExtremes() {
			if (
				!this.showSL &&
				!this.showTP &&
				!this.showExtNBC &&
				!this.showMaxEir &&
				!this.showTradPnL
			) {
				const chart = this.$parent.$refs.sltpchart.chart;
				const extremes = chart.xAxis[0].getExtremes();
				chart.xAxis[0].setExtremes(extremes.min, null);
			}
		}
	}
};
</script>


<style lang="less">
ul.sltp-legend {
	list-style: none;
	display: flex;
	padding: 0;
	margin: 0;
	justify-content: center;
	li {
		margin: 0 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 13px;
		cursor: pointer;
		span {
			margin: 0 4px 0 0;
			width: 12px;
			height: 12px;
			border-radius: 50%;
			color: #ffffff;
		}
		i {
			margin: 0 4px 0 0;
		}
		&.hidden {
			color: #757575;
			span {
				background-color: #757575 !important;
			}
		}
		&.disabled {
			color: #757575;
			cursor: default;
			span {
				background-color: #757575 !important;
			}
		}
	}
}
</style>