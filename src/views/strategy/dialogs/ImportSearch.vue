<template>
	<v-autocomplete
		prepend-icon="search"
		:loading="loading"
		:items="library"
		v-model="selected"
		@keyup.native.enter="loadExternal"
		@click:clear="reset"
		:error-messages="errorMessages"
		:disabled="disabled"
		clearable
		return-object
		item-text="name"
		item-value="id"
		hide-details
		hide-no-data
		label="Search your library"
		color="blue lighten-2"
		box
	>
		<template slot="item" slot-scope="{ item }">
			<v-icon left class="mr-1" color="#AEEA00">insert_chart</v-icon>
			<v-list-tile-content>
				<v-list-tile-title v-text="item.name"></v-list-tile-title>
				<v-list-tile-sub-title>Last modified {{item.lastUpdate | date}}</v-list-tile-sub-title>
			</v-list-tile-content>
		</template>
	</v-autocomplete>
</template>

<script>
import ApiController from "@/services/ApiController";
import { getErrorCode } from "@/utils";
import { mapState } from "vuex";

const LIBRARY = "Library";
const EQUITY = "Equity";
const INDEX = "Index";
const COMMODITY = "Cmdty";
const CURRENCY = "Curncy";
const CRYPTO = "Crypto";

const getAssetClass = term => {
	const termUpper = term.toUpperCase();
	if (termUpper === EQUITY.toUpperCase()) {
		return EQUITY;
	}
	if (termUpper === INDEX.toUpperCase()) {
		return INDEX;
	}
	if (termUpper === COMMODITY.toUpperCase()) {
		return COMMODITY;
	}
	if (termUpper === CURRENCY.toUpperCase()) {
		return CURRENCY;
	}
	if (termUpper === CRYPTO.toUpperCase()) {
		return CRYPTO;
	}

	return null;
};

export default {
	props: {
		clear: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			disabled: false,
			loading: false,
			selected: "",
			errorMessages: null
		};
	},
	watch: {
		selected(val) {
			val && this.loadLibrary(val._id);
		},
		clear() {
			this.selected = "";
		}
	},
	computed: {
		...mapState("library", ["library"])
	},
	activated() {
		this.selected = "";
	},
	methods: {
		loadExternal(e) {
			const term = e.target.value;
			if (term) {
				const terms = term.split("@", 2);

				if (terms.length === 2 && terms[0] && terms[1]) {
					const ticker = terms[0].trim();
					let assetClass = terms[1].trim();
					assetClass = getAssetClass(assetClass);
					if (assetClass) {
						this.load(ticker, assetClass);
					} else {
						this.errorMessages = `Unable to find data`;
						setTimeout(() => {
							this.errorMessages = null;
						}, 1500);
					}
				}
			}
		},

		loadLibrary(id) {
			if (id) {
				this.load(id, LIBRARY);
			}
		},

		async load(ticker, assetClass) {
			try {
				this.loading = true;
				this.disabled = true;
				let series = await ApiController.findSeries(ticker, assetClass);
				this.$emit("loaded", {
					series:
						assetClass === LIBRARY ? series.ts.data : series.data,
					errors: [],
					name: series.name,
					source: "assetClass"
				});
			} catch (error) {
				this.$emit("clear");
				const code = getErrorCode(error);
				if (code === "UNKNOWN_TICKER") {
					this.errorMessages = `Unable to find data`;
					setTimeout(() => {
						this.errorMessages = null;
					}, 1500);
				}
			} finally {
				this.loading = false;
				this.disabled = false;
			}
		},

		reset() {
			this.$emit("clear");
		}
	}
};
</script>
