import '@babel/polyfill'
import 'intersection-observer'
import Vue from 'vue'
import {EventBus} from './events'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'animate.css/animate.css'

import Highcharts from 'highcharts'
import HighchartsVue from 'highcharts-vue'
import stockInit from 'highcharts/modules/stock'
import boost from 'highcharts/modules/boost'
import theme from './components/charts/theme'

import fullscreen from 'vue-fullscreen'
Vue.use(fullscreen)

stockInit(Highcharts)
boost(Highcharts)

Highcharts.createElement('link', {
	href: 'https://fonts.googleapis.com/css?family=Unica+One',
	rel: 'stylesheet',
	type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

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

Vue.filter('number', function (value) {
	if(value !== null && !isNaN(value)) {
		let precision = 0;

		let t = Math.abs(value);
		if(t < 10) {
			precision = 3;
		}
		else if(t < 100) {
			precision = 2;
		}
		else if (t < 1000) {
			precision = 1;
		}
		else if (t < 10000) {
			precision = 0;
		}
		else {
			return new Intl.NumberFormat(navigator.language, {maximumFractionDigits: 2, minimumFractionDigits: 2}).format((value / 1000).toFixed(2)) + 'k';
		}

		return new Intl.NumberFormat(navigator.language, {maximumFractionDigits: precision, minimumFractionDigits: precision}).format(value);
	}
	return ''
});

Vue.filter('date', function (value) {
	if(value)
		return new Intl.DateTimeFormat(navigator.language, options).format(value);
	return ''
});

Vue.filter('date-short', function (value) {
	if(value)
		return new Intl.DateTimeFormat(navigator.language, optionsCompact).format(value);
	return ''
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
  render: h => h(App)
}).$mount('#app')
