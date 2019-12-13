import 'intersection-observer'
import Vue from 'vue'
import { EventBus } from './events'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'animate.css/animate.css'
import vuetify from './plugins/vuetify';

import Highcharts from 'highcharts'
import HighchartsVue from 'highcharts-vue'
import stockInit from 'highcharts/modules/stock'
import boost from 'highcharts/modules/boost'
import dragPanes from 'highcharts/modules/drag-panes'
import theme from './components/charts/theme'

import fullscreen from 'vue-fullscreen'
Vue.use(fullscreen)

stockInit(Highcharts)
dragPanes(Highcharts)
boost(Highcharts)

Highcharts.createElement('link', {
	href: 'https://fonts.googleapis.com/css?family=Unica+One',
	rel: 'stylesheet',
	type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);


Highcharts.setOptions({
	global: {
		useUTC: true
	}
});

Vue.config.productionTip = false
Vue.use(HighchartsVue)
Highcharts.setOptions(theme);

const options = {
	year: 'numeric', month: 'short', day: 'numeric',
	hour: 'numeric', minute: 'numeric', second: 'numeric',
	hour12: false,
	timeZone: 'UTC',
	timeZoneName: 'short'
};

const optionsCompact = {
	year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'
};

Vue.filter('number', function (value, precision) {
	if (value !== null && !isNaN(value)) {
		precision = precision !== undefined ? precision : 3;
		return new Intl.NumberFormat(navigator.language, { maximumFractionDigits: precision, minimumFractionDigits: precision }).format(value);
	}
	return ''
});

Vue.filter('date', function (value) {
	if (value)
		return new Intl.DateTimeFormat(navigator.language, options).format(value);
	return ''
});

Vue.filter('date-short', function (value) {
	if (value && !isNaN(value))
		return new Intl.DateTimeFormat(navigator.language, optionsCompact).format(value);
	return value;
});

Vue.config.errorHandler = function (err, vm, info) {
	EventBus.$emit('api-error', `Vue Error - ${err} - ${info}`);
}

window.onerror = function (msg, url, line, col, error) {
	EventBus.$emit('api-error', `Window Error - ${msg} - ${line} - ${col} - ${error}`);
}

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app')
