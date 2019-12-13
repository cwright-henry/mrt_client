<template>
	<div class="mrt-drop-menu">
		<h1>Import Options</h1>
		<v-radio-group v-model="type">
			<v-radio
				color="#ffeb3b"
				:value="item.value"
				:label="item.title"
				v-for="item in importTypes"
				:key="item.value"
			></v-radio>
		</v-radio-group>
	</div>
</template>

<script>
export default {
	props: {
		isOpen: {
			type: Boolean,
			default: false
		},
		importDefault: {
			type: String,
			default: "CSVSearch"
		}
	},
	data() {
		return {
			importTypes: [
				{ title: "CSV File", value: "CSVSearch", hidden: true },
				{ title: "My Library", value: "LibrarySearch", hidden: true }
			]
		};
	},
	computed: {
		type: {
			get() {
				return this.importDefault;
			},
			set(value) {
				this.$emit("change", value);
			}
		}
	}
};
</script>

<style lang="less">
.mrt-drop-menu {
	h1 {
		font-weight: 300;
		font-size: 16px;
		color: #e0e0e0;
	}
}
</style>
