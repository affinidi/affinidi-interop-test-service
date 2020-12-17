import jwtDecode from 'jwt-decode';
import axios from 'axios';
import SDKService from './sdkService';
// import DBService from './dbService';

// const tableName = 'credentials';

export default class APIService {
	static getToken = async (tokenUrl) => {
		try {
			const response = await axios.get(tokenUrl);
			const decoded = jwtDecode(response.data.token);
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
		const input = {
			responseToken,
		};
		try {
			const response = await axios.post(callbackURL, input);
			if (response.data) {
				const { signedCredentials } = response.data;
				// console.log(signedCredentials);

				const status = await SDKService.saveCredentials(signedCredentials);
				console.log(status);
				// DBService.storeCredential(tableName, vc);
				return status;
			}
			return false;
		} catch (error) {
			if (error.response) console.log(error.response.data);
			else if (error.request) console.log(error.request);
			else console.log(error.message);
		}
		return false;
	}

	static getPresentationChallenge = (callbackURL, vp) => {
		const input = {
			vp,
		};

		axios.post(callbackURL, input)
			.then((response) => {
				if (response.data) {
					return true;
				}
				return false;
			}).catch((error) => {
				if (error.response) console.log(error.response.data);
				else if (error.request) console.log(error.request);
				else console.log(error.message);
			});
	};
}
