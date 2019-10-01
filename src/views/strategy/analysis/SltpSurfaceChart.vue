<template>
	<div class="mrt-surface-chart" @click="reveal()">
		<h1>{{title}}</h1>
		<div :id="id" class="graph"></div>
	</div>
</template>

<script>
import vis from "vis";

const options = {
	width: "200px",
	height: "200px",
	style: "surface",
	showPerspective: false,
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
				return {};
			}
		},
		title: {
			type: String,
			default: ""
		},
		id: {
			type: String,
			default: "graph"
		}
	},
	data() {
		return {
			data: new vis.DataSet(),
			graph: null
		};
	},
	watch: {
		values(v) {
			this.data = new vis.DataSet();
			if (Object.keys(v).length !== 0) {
				let xCount = 0;
				let id = 0;
				for (let x in v) {
					let yCount = 0;
					if (xCount++ % 2 == 0) {
						for (let y in v[x]) {
							if (yCount++ % 2 === 0) {
								this.data.add({
									id: id++,
									x: parseFloat(x),
									y: parseFloat(y),
									z: parseFloat(v[x][y])
								});
							}
						}
					}
				}
				this.graph.setData(this.data);
				this.graph.redraw();
			} else {
				this.data.add({
					x: parseFloat(0),
					y: parseFloat(0),
					z: parseFloat(0)
				});
				this.graph.setData(this.data);
				this.graph.redraw();
			}
		}
	},
	mounted() {
		const containerT = document.getElementById(this.id);
		this.graph = new vis.Graph3d(containerT, null, options);
	},
	methods: {
		reveal() {
			this.$emit("showSurfaceDialog", this.data);
		}
	}
};
</script>

<style lang="less">
.mrt-surface-chart {
	border-radius: 2px;
	border: 1px solid #757575;
	margin: 12px 24px;
	width: 200px;
	h1 {
		background-color: #424242;
		font-weight: 300;
		padding: 4px 8px;
		font-size: 18px;
	}
	.graph {
		position: relative;
		background-color: transparent;
		min-height: 0px;
		cursor: pointer;
		&:before {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: transparent;
			content: "";
			z-index: 999;
		}
	}
}
</style>
