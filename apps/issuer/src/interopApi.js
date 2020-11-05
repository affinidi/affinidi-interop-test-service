import axios from 'axios';

const interopApi = axios.create({
	baseURL: '/v1/'
});

export default interopApi