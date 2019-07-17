<template>
	<div class="mrt-drop-menu">
		<p>Import Options</p>
		<v-radio-group v-model="type">
			<v-radio
				color="yellow"
				:value="item.value"
				:label="item.title"
				v-for="item in filteredImports"
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
			default: "LibrarySearch"
		}
	},
	data() {
		return {
			importTypes: [
				{ title: "Commodity", value: "CommoditySearch", hidden: true },
				{ title: "Crypto", value: "CryptoSearch", hidden: true },
				{ title: "CSV File", value: "CSV", hidden: false },
				{ title: "Currency", value: "CurrencySearch", hidden: true },
				{ title: "Equity", value: "TickerSearch", hidden: true },
				{ title: "Index", value: "IndexSearch", hidden: true },
				{ title: "My Library", value: "LibrarySearch", hidden: false }
			]
		};
	},
	activated() {
		window.addEventListener("keypress", this.isSecretCode, {
			passive: true
		});
	},
	deactivated() {
		window.removeEventListener("keypress", this.isSecretCode, {
			passive: true
		});
	},
	computed: {
		type: {
			get() {
				return this.importDefault;
			},
			set(value) {
				this.$emit("change", value);
			}
		},
		filteredImports() {
			return this.importTypes.filter(elm => !elm.hidden);
		}
	},
	methods: {
		isSecretCode(e) {
			if (e.ctrlKey && this.isOpen) {
				if (e.key === "i") {
					this.importTypes[5].hidden = !this.importTypes[5].hidden;
					if (this.importTypes[5].hidden) {
						this.$emit("change", "LibrarySearch");
					}
				} else if (e.key === "e") {
					this.importTypes[4].hidden = !this.importTypes[4].hidden;
					if (this.importTypes[4].hidden) {
						this.$emit("change", "LibrarySearch");
					}
				} else if (e.key === "u") {
					this.importTypes[3].hidden = !this.importTypes[3].hidden;
					if (this.importTypes[3].hidden) {
						this.$emit("change", "LibrarySearch");
					}
				} else if (e.key === "r") {
					this.importTypes[1].hidden = !this.importTypes[1].hidden;
					if (this.importTypes[1].hidden) {
						this.$emit("change", "LibrarySearch");
					}
				} else if (e.key === "c") {
					this.importTypes[0].hidden = !this.importTypes[0].hidden;
					if (this.importTypes[0].hidden) {
						this.$emit("change", "LibrarySearch");
					}
				}
			}
		}
	}
};
</script>

<style>
</style>
