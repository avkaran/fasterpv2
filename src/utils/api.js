import axios from 'axios';
import { baseUrl } from './index';

const Api = axios.create({
  baseURL: `${baseUrl}`,
  headers: {
	"X-Requested-With": "XMLHttpRequest",
  }
});


export default Api;