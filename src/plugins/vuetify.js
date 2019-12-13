import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
	icons: {
		iconfont: 'mdi', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4'
	},
	theme: {
		dark: true,
		primary: '#AB47BC',
		secondary: colors.green.lighten1,
		error: colors.red.lighten1,
		highlight: colors.blue.accent4,
		fab: '#00E676',
	}
});
