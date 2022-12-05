import axios from 'axios';
import { getLs, baseUrl } from '.';
axios.defaults.baseURL = `${baseUrl}`;
axios.defaults.headers.common['Api-Token'] = getLs('admin_api') || '';
axios.defaults.headers.common['X-Requested-With'] = `XMLHttpRequest`;
//const Api = axios.create();
const Api=''
export default Api;