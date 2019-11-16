<template>
	<v-dialog v-model="dialog" width="900" :fullscreen="$vuetify.breakpoint.mdAndDown">
		<v-card class="sltp-surface-dialog">
			<v-toolbar dense>
				<v-icon>blur_on</v-icon>
				<v-toolbar-title>{{title}} Surface Chart</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-btn icon @click.stop="dialog=false">
					<v-icon>close</v-icon>
				</v-btn>
			</v-toolbar>
			<div class="chartContainer">
				<div id="main-surface-chart"></div>
			</div>
			<div class="sltp-control">
				<div>
					<div>
						<v-btn small fab color="#0091EA" @click="panUp">
							<v-icon>arrow_upward</v-icon>
						</v-btn>
					</div>
					<div>
						<v-btn small fab color="#0091EA" @click="panLeft">
							<v-icon>arrow_back</v-icon>
						</v-btn>
						<v-btn small fab color="#0091EA" @click="panDown">
							<v-icon>arrow_downward</v-icon>
						</v-btn>
						<v-btn small fab color="#0091EA" @click="panRight">
							<v-icon>arrow_forward</v-icon>
						</v-btn>
					</div>
				</div>
				<div>
					<v-btn small fab color="#0091EA" @click="zoomOut">
						<v-icon>remove</v-icon>
					</v-btn>
					<v-btn small fab color="#0091EA" @click="zoomIn">
						<v-icon>add</v-icon>
					</v-btn>
				</div>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
import vis from "vis-graph3d";

const HORZ_INC = 0.5;

const VERT_INC = (0.5 * Math.PI) / 5;
const VERT_MIN = 0;
const VERT_MAX = 0.5 * Math.PI;

const DIST_MIN = 0.71;
const DIST_MAX = 5;
const DIST_INC = (DIST_MAX - DIST_MIN) / 10;

const options = {
	width: "600px",
	height: "600px",
	style: "surface",
	showPerspective: true,
	showGrid: true,
	showShadow: false,
	keepAspectRatio: true,
	verticalRatio: 0.5,
	tooltip: true,
	gridColor: "#fff",
	axisColor: "#fff"
};

export default {
	props: {
		show: {
			type: Boolean,
			default: false
		},
		data: {
			type: Object,
			default: () => {
				return {};
			}
		},
		title: {
			type: String,
			default: ""
		},
		attach: {
			type: String,
			default: "body"
		}
	},
	data() {
		return {
			graph: null,
			horizontal: 1.0,
			vertical: 0.5,
			distance: 1.7
		};
	},
	computed: {
		dialog: {
			get() {
				return this.show;
			},
			set(value) {
				if (!value) {
					this.reset();
					this.$emit("close");
				}
			}
		}
	},
	watch: {
		data() {
			this.graph.setData(this.data);
			setTimeout(() => {
				this.graph.redraw();
			}, 0);
		},
		horizontal() {
			this.graph.setCameraPosition({ horizontal: this.horizontal });
		},
		vertical() {
			this.graph.setCameraPosition({ vertical: this.vertical });
		},
		distance() {
			this.graph.setCameraPosition({ distance: this.distance });
		}
	},
	mounted() {
		const containerT = document.getElementById("main-surface-chart");
		this.graph = new vis.Graph3d(containerT, null, options);
	},
	methods: {
		panLeft() {
			this.horizontal -= HORZ_INC;
		},

		panRight() {
			this.horizontal += HORZ_INC;
		},

		panUp() {
			const vert = this.vertical - VERT_INC;
			if (vert > VERT_MIN && vert < VERT_MAX) {
				this.vertical = vert;
			}
		},

		panDown() {
			const vert = this.vertical + VERT_INC;
			if (vert > VERT_MIN && vert < VERT_MAX) {
				this.vertical = vert;
			}
		},

		zoomIn() {
			const dist = this.distance - DIST_INC;
			if (dist > DIST_MIN && dist < DIST_MAX) {
				this.distance = dist;
			}
		},

		zoomOut() {
			const dist = this.distance + DIST_INC;
			if (dist > DIST_MIN && dist < DIST_MAX) {
				this.distance = dist;
			}
		},

		reset() {
			(this.horizontal = 1.0),
				(this.vertical = 0.5),
				(this.distance = 1.7);
		}
	}
};
</script>

<style lang="less">
.sltp-surface-dialog {
	.chartContainer {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		#main-surface-chart {
			height: 600px;
			width: 600px;
		}
	}
	.sltp-control {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		padding: 0 8px 8px 8px;
		position: absolute;
		bottom: 0;
		width: 100%;
		> div {
			text-align: center;
		}
	}
}
</style>
