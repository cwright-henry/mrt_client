<template>
	<div class="mrt-surface-chart">
		<div :id="id"></div>
		<h1>{{title}}</h1>
	</div>
</template>

<script>
import vis from 'vis'

const options = {
	width: '100%',
	height: '200px',
	style: 'bar',
	showPerspective: true,
	showGrid: false,
	showXAxis: false,
	showYAxis: false,
	showZAxis: false,
	showShadow: false,
	keepAspectRatio: true,
	verticalRatio: 0.5
};

export default {
	props: {
		values: {
			type: Object,
			default: () => {
				return {}
			}
		},
		title: {
			type: String,
			default: ''
		},
		id: {
			type: String,
			default: 'graph'
		}
	},
	data() {
		return {
		}
	},
	watch: {
		values(v) {
			let counter = 0;
			const data = new vis.DataSet()
			for(let x in v) {
				for(let y in v[x]) {
					const z = v[x][y];
					data.add({
						id: counter++,
						x: parseFloat(x),
						y: parseFloat(y),
						z: parseFloat(z),
						style: z
					});
				}
			}
			const containerT = document.getElementById(this.id)
			new vis.Graph3d(containerT, data, options)
		}
	}
}
</script>

<style lang="less">
	.mrt-surface-chart {
		min-height:200px;
		background-color: #424242;
	}
</style>
