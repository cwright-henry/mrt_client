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
      // Forbidden reasons
      // 1. DB got rolled and new _id got generated for user
      if (error.response.status === 403) {
        EventBus.$emit('server-logout', 'Please login again to update your security token');
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
}