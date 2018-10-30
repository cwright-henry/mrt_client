import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import Highcharts from 'highcharts'
import HighchartsVue from 'highcharts-vue'
import stockInit from 'highcharts/modules/stock'
import theme from './components/charts/theme'

stockInit(Highcharts)

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
	if(value && !isNaN(value)) {
		return new Intl.NumberFormat().format(value);
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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
