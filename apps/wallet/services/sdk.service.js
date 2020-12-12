/* eslint-disable semi */
import { AffinityWallet as Wallet } from '@affinidi/wallet-expo-sdk'

const {
	PASSWORD, ENCRYPTED_SEED, STAGING_REGISTRY_URL, API_KEY, API_KEY_HASH,
} = process.env

const commonNetworkOptions = {
	registryUrl: STAGING_REGISTRY_URL,
	apiKey: API_KEY,
	accessApiKey: API_KEY_HASH,
};

export default class SDKService {
	constructor() {
		this._wallet = new Wallet(PASSWORD, ENCRYPTED_SEED, commonNetworkOptions);
	}

	static async getOfferResponseToken(token) {
		console.log('sdk.service#getOfferResponseToken')
		return this._wallet.createCredentialOfferResponseToken(token)
	}
}
