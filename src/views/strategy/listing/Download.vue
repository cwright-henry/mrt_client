<template>
	<v-menu
		origin="top right"
		transition="scale-transition"
		:close-on-content-click="false"
		:nudge-width="0"
		offset-y
		left
		v-model="downloadMenu"
	>
		<template v-slot:activator="{ on }">
			<v-icon class="mr-4" v-on="on" color="#64b5f6">mdi-file-download-outline</v-icon>
		</template>
		<div class="mrt-ctb--action">
			<h1 class="text-truncate mb-2">Download {{strategy.name}}</h1>
			<p>This action will download in CSV format {{strategy.name}} from the MRT system.</p>
			<div class="text-xs-right mr-1">
				<v-btn
					color="#2196F3"
					:loading="downloading"
					:disabled="downloading"
					left
					small
					@click="downloadTS()"
				>Download CSV</v-btn>
			</div>
		</div>
	</v-menu>
</template>

<script>
import moment from "moment";

const download = function(content, fileName, mimeType) {
	var a = document.createElement("a");
	mimeType = mimeType || "application/octet-stream";

	if (navigator.msSaveBlob) {
		// IE10
		navigator.msSaveBlob(
			new Blob([content], {
				type: mimeType
			}),
			fileName
		);
	} else if (URL && "download" in a) {
		//html5 A[download]
		a.href = URL.createObjectURL(
			new Blob([content], {
				type: mimeType
			})
		);
		a.setAttribute("download", fileName);
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	} else {
		location.href =
			"data:application/octet-stream," + encodeURIComponent(content); // only this mime type is supported
	}
};

export default {
	props: {
		strategy: {
			type: Object,
			default: () => {
				return {
					ts: {},
					fit: {}
				};
			}
		}
	},
	data() {
		return {
			downloadMenu: false,
			downloading: false
		};
	},
	methods: {
		downloadTS() {
			this.downloading = true;
			let csvContent = "";
			for (let i = 0; i < this.strategy.ts.data.length; i++) {
				const entry = this.strategy.ts.data[i];
				const date = moment(entry[0]).format("YYYY-MM-DD");
				const value = entry[1];
				csvContent += date + "," + value;

				if (this.strategy.ts.data.length - 1 !== i) csvContent += "\n";
			}

			download(
				csvContent,
				`${this.strategy.name}.csv`,
				"text/csv;encoding:utf-8"
			);
			this.downloading = false;
			this.downloadMenu = false;
		}
	}
};
</script>