import Api from '@/services/ApiController'

/**
 * Token consists of [HEADER].[PAYLOAD].[SIGNATURE]
 * 
 * PAYLOAD:
 * email
 * issued at timestamp in seconds
 * time in which the token will expire as seconds
 * 
 * {sub: "example@mail.com", iat: 1522326732, exp: 1522328532}
 * 
 * @param {*} token 
 */
const isValidToken = (token) => {
	if (!token || token.split('.').length < 3) {
    return false
  }
  const data = JSON.parse(atob(token.split('.')[1]))
  const exp = new Date(data.exp * 1000) // JS deals with dates in milliseconds since epoch
	const now = new Date()
  return now < exp
}

const STORAGE_KEY = 'mrt-user-store'

export default {
	namespaced: true,

	state: {
		user: null,
		token: null,
		loading: false
	},

	getters: {
		isAuthenticated(state) {
			return isValidToken(state.token);
		},

		isInitialized(state) {
			return state.token !== null;
		},

		fullName(state) {
			return `${state.user.firstName} ${state.user.lastName}`
		},

		email(state) {
			return state.user.email
		}
	},

	mutations: {
		initialize(state) {
			if(localStorage.getItem(STORAGE_KEY)) {
				let item = JSON.parse(localStorage.getItem(STORAGE_KEY));
				state.user = item.user;
				state.token = item.token;
			}
		},

		setUser(state, user) {
			state.user = user;
		},

		setToken(state, token) {
			state.token = token;
		},

		setLoading(state, loading) {
			state.loading = loading;
		}
	},

	actions: {
		async login ({commit}, payload) {
			try {
				commit('setLoading', true);
				const data = await Api.login({email: payload.email, password: payload.password});
				localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
				commit('setUser', data.user);
				commit('setToken', data.token);
				commit('setLoading', false);
			}
			catch(e) {
				console.log(e)
				commit('setLoading', false);
				throw e;
			}
		},

		logout ({commit}) {
			commit('setToken', null);
			localStorage.setItem(STORAGE_KEY, '');
		}
	}
}

