import jwtDecode from 'jwt-decode';
import axios from 'axios';

import DBService from './dbService';

export default class APIService {
	static getToken = async (tokenUrl) => {
		console.log('apiService # getToken');

		try {
			console.log('tokenUrl: ', tokenUrl);
			const response = await axios.get(tokenUrl);

			console.log('reposne with token');
			console.log(response);

			const decoded = jwtDecode(response.data.token);

			console.log('decoded token');
			console.log(decoded);

			const { purpose } = response.data;
			const { callbackURL } = decoded.interactionToken;

			return {
				token: response.data.token,
				purpose,
				callbackURL,
			};
		} catch (error) {
			if (error.response) console.log(error.response.data);
			else if (error.request) console.log(error.request);
			else console.log(error.message);
		}

		return false;
	}

	static getSignedCredentials = async (callbackURL, responseToken) => {
		console.log('apiService # getSignedCredentials');

		const input = {
			responseToken,
		};
		try {
			const response = await axios.post(callbackURL, input);
			if (response.data) {
				const { signedCredentials } = response.data;
				const types = signedCredentials[0].type;

				// await SDKService.saveCredentials(signedCredentials);
				const rowId = await DBService.storeCredential(signedCredentials[0]);
				await DBService.storeCredentialTypes(rowId, types);
				if (rowId > 0) {
					return true;
				}
			}
			return false;
		} catch (error) {
			if (error.response) console.log(error.response.data);
			else if (error.request) console.log(error.request);
			else console.log(error.message);
		}
		return false;
	}

	static getPresentationChallenge = async (callbackURL, vp) => {
		console.log('apiService # getPresentationChallenge');

		const input = {
			vp,
		};
		try {
			const response = await axios.post(callbackURL, input);

			if (response.data) {
				return true;
			}
			return false;
		} catch (error) {
			if (error.response) console.log(error.response.data);
			else if (error.request) console.log(error.request);
			else console.log(error.message);
		}
		return false;
	};
}
