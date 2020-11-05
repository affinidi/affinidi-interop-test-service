import axios from 'axios';

const interopApi = axios.create({
	baseURL: '/interop/v1/'
});

export default interopApi