import moment from "moment";

const ONE_YEAR = 1000 * 60 * 60 * 24 * 365;
const DATE_FORMAT = "DD MMM YYYY";

/**
 * Helper class to create timeseries and expose tooltip to Highcharts
 */
export default class {
	constructor(config) {
		this._config = config;
		this._minDate = 0;
		this._maxDate = 0;
		this._sl = [];
		this._tp = [];
		this._ext = [];
		this._maxVal = [];
		this._tradePL = [];
		this._buckets = [];
	}

	/**
	 * All Opt data should have the same length so this formaulae is
	 * using opt.SL as the key series to create a sorted map of value's and dates
	 */
	build(startDate, { SL = {}, TP = {}, Ext = {}, maxVal = {}, tradePL = {} }) {
		const map = {}
		this.reset()

		//  Create a sorted map of rounded out dates
		for (const key in SL) {
			const date = moment.utc(startDate + key * ONE_YEAR).format(DATE_FORMAT);
			map[key] = moment.utc(date, DATE_FORMAT).valueOf()
		}
		const sortedMap = Object.entries(map).sort((a, b) => a[0] - b[0]);

		// Set min/max date
		this._minDate = sortedMap[0][1];
		this._maxDate = sortedMap[sortedMap.length - 1][1];

		// Create the timeseries and buckets
		for (const [key, value] of sortedMap) {
			this._sl.push([value, SL[key]]);
			this._tp.push([value, TP[key]]);
			this._ext.push([value, Ext[key]]);
			this._maxVal.push([value, maxVal[key]]);
			this._tradePL.push([value, tradePL[key]]);

			this._buckets.push([value, [
				{
					name: this._config.SL.name,
					color: this._config.SL.color,
					value: SL[key]
				},
				{
					name: this._config.TP.name,
					color: this._config.TP.color,
					value: TP[key]
				},
				{
					name: this._config.EXT.name,
					color: this._config.EXT.color,
					value: Ext[key]
				},
				{
					name: this._config.MAX.name,
					color: this._config.MAX.color,
					value: maxVal[key]
				},
				{
					name: this._config.TRADE.name,
					color: this._config.TRADE.color,
					value: tradePL[key]
				}
			]]);
		}
	}

	get sl() {
		return this._sl;
	}

	get tp() {
		return this._tp;
	}

	get ext() {
		return this._ext
	}

	get maxVal() {
		return this._maxVal;
	}

	get tradePL() {
		return this._tradePL;
	}

	get horizon() {
		return this._maxDate;
	}

	/**
	 * Get a bucket of tooltips give a point on the graph. If x is outside range
	 * returns undefined.
	 */
	getTooltip(x) {
		if (x >= this._minDate && x <= this._maxDate) {

			for (let i = 0; i < this._buckets.length - 1; i++) {
				var current = this._buckets[i];
				var next = this._buckets[i + 1];
				if (current[0] <= x && x < next[0]) {
					return current[1]
				}
			}

			return this._buckets[this._buckets.length - 1][1]
		}

		return undefined;
	}

	reset() {
		this._minDate = 0;
		this._maxDate = 0;
		this._sl = [];
		this._tp = [];
		this._ext = [];
		this._maxVal = [];
		this._tradePL = [];
		this._buckets = [];
	}
}