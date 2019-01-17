import axios from 'axios'
import store from '../store'
import {EventBus} from '../events'

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
      //
      // Network Error
      //
      if(!error.response) {
        EventBus.$emit('api-error', 'Connection to the server has dropped - Network Error');
      }

      // Forbidden reasons
      // 1. DB got rolled and new _id got generated for user
      // Nullify the user token
      if (error.response.status === 403) {
        store.commit('user/setToken', null);
        EventBus.$emit('api-auth', 'Please login again to update your security token');
      }

      // General Server error
      // 1. Server gone down - proxt error
      // 2. This is also generated on server when a error on the code happens
      // Need to distinguish between 1 and 2
      if (error.response.status === 500) {
        EventBus.$emit('api-error', 'Server is temporaily unavailable. Please try again later');  
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
}