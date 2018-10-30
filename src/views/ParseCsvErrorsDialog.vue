<template>
	<v-dialog v-model="dialog" scrollable max-width="300px">
		<v-card>
			<v-card-title>Parsing Errors</v-card-title>
			<v-divider></v-divider>
			<v-card-text style="height: 300px;">
				<v-list dense>
					<v-list-tile>
						<v-list-tile-title class="mrt-upload--error header">
							<div>Line</div>
							<div>Date</div>
							<div>Value</div>
						</v-list-tile-title>
					</v-list-tile>
					<v-list-tile v-for="(item, i) in errors" :key="i">
						<v-list-tile-title class="mrt-upload--error">
							<div>{{ item.line | number }}</div>
							<div>{{ item.date }}</div>
							<div>{{ item.value }}</div>
						</v-list-tile-title>
					</v-list-tile>
				</v-list>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions>
				<v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	props: {
		show: {
			type: Boolean,
			default: false
		},
		errors: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	computed: {
		dialog: {
      get () {
        return this.show
      },
      set (value) {
        if (!value) {
          this.$emit('close')
        }
      }
		}
	},
	methods: {
	}
}
</script>

<style scoped lang="less">
.mrt-upload--error {
	display:flex;
	> div {
		min-width:20px;
		margin: 0 8px 0 0
	}
	> div:nth-child(1) {
		width:40px;
	}
	> div:nth-child(2) {
		width:70px
	}
}
</style>
