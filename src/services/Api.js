import axios from 'axios'
import store from '../store'
import { EventBus } from '../events'
import { getErrorCode } from '../utils'

export default () => {
	//
	// Calls should now not need pre-flight as they are proxied through server
	//
	const instance = axios.create({
		baseURL: process.env.BASE_URL,
		headers: {
			Authorization: `Bearer ${store.state.user.token}`
		}
	})

	instance.interceptors.response.use(
		function (response) {
			return response;
		},
		function (error) {
			const code = getErrorCode(error);

			// Show these using toast messages
			switch (code) {
				case 'NETWORK_ERROR':
					EventBus.$emit('api-error', 'Connection to the server has dropped - Network Error!');
					break;

				case 'TOKEN_EXPIRED':
					store.commit('user/setToken', null);
					EventBus.$emit('api-auth', 'Your security token has expired! Please login again');
					break;

				case 'UNKNOWN_ERROR':
					EventBus.$emit('api-error', 'Whoops - Unknown error, Bluecrowe team - check logs please!');
					break;
			}

			// Propagate the message down stream for handling and clean up
			return Promise.reject(error);
		}
	);

	return instance;
}