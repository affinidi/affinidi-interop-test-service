import axios from 'axios';

const interopApi = axios.create({
	baseURL: '/api/v1/interop/'
});

export default interopApi