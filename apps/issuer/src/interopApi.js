import axios from 'axios';

let baseURL = '/interop/v1/'
if (process.env.REACT_APP_ENVIRONMENT === 'local')	baseURL = '/v1/'

const interopApi = axios.create({
	baseURL
});

export default interopApi