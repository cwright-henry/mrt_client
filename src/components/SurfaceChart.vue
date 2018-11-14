<template>
	<v-card height="256">
		<h1>{{title}}</h1>
		
		<div :id="id"></div>
	</v-card>
</template>

<script>
import vis from 'vis'

const options = {
	width: '100%',
	height: '200px',
	style: 'surface',
	showPerspective: false,
	showGrid: true,
	showShadow: false,
	keepAspectRatio: true,
	verticalRatio: 0.5,
	axisColor: '#eee'
	// xLabel: 'stoploss',
	// yLabel: 'takeprofit',
	// zLabel: 'Ex(T)'
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

<style>

</style>
