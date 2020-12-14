import React, { useState, useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import jwtDecode from 'jwt-decode';

import {
	Text, View, StyleSheet, Dimensions, Platform, ToastAndroid, AlertIOS,
} from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import Constants from 'expo-constants';
import axios from 'axios';

import SDKService from '../services/sdk.service';

const { width } = Dimensions.get('window');
const qrSize = width * 0.8;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end',
		margin: -40,
	},
	barCodeScanner: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: Constants.statusBarHeight,
		backgroundColor: '#ecf0f1',
		padding: 8,
	},
	permissions: {
		fontSize: width * 0.05,
		marginTop: '50%',
		textAlign: 'center',
		width: '100%',
		color: 'black',
	},
	description: {
		flex: 1,
		fontSize: width * 0.07,
		marginTop: '20%',
		textAlign: 'center',
		width: '70%',
		color: 'white',
	},
	scanAgain: {
		flex: 1,
		marginTop: '75%',
		fontSize: width * 0.05,
		textAlign: 'center',
		width: '100%',
		color: 'darkgrey',
	},
});

export default function BarCodeScreen({ navigation }) {
	const [hasPermission, setHasPermission] = useState(null);
	const [scanned, setScanned] = useState(false);

	useEffect(() => {
		(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === 'granted');
		})();
	}, []);

	const getSignedCredentials = (callbackURL, responseToken) => {
		const input = {
			responseToken,
		};

		axios.post(callbackURL, input)
			.then((response) => {
				// eslint-disable-next-line no-unused-vars
				const vc = response.data.getSignedCredentials[0];
				if (response.data) {
					// show the received credentials as a Card
					navigation.navigate('Credentials');
				}
			}).catch((error) => {
				if (error.response) console.log(error.response.data);
				else if (error.request) console.log(error.request);
				else console.log(error.message);
			});
	};

	const getPresentationChallenge = (callbackURL) => {
		/* eslint-disable no-case-declarations */
		// get VP (simulated) (its supposed to come from some external wallet sdk)
		const vp = {};

		const input = {
			vp,
		};

		axios.post(callbackURL, input)
			.then((response) => {
				if (response.data) {
					console.log('Congratulations, your request for this service is approved!');
				}
			}).catch((error) => {
				if (error.response) console.log(error.response.data);
				else if (error.request) console.log(error.request);
				else console.log(error.message);
			});
	};

	const getToken = (tokenUrl) => {
		axios.get(tokenUrl)
			.then(async (response) => {
				const decoded = jwtDecode(response.data.token);
				const { purpose } = response.data;
				const { callbackURL } = decoded.interactionToken;

				if (purpose === 'offer') {
					const responseToken = await SDKService.getOfferResponseToken(response.data.token);
					if (responseToken) getSignedCredentials(callbackURL, responseToken);
				} else if (purpose === 'request') {
					getPresentationChallenge(callbackURL);
				}
			}).catch((error) => {
				if (error.response) console.log(error.response.data);
				else if (error.request) console.log(error.request);
				else console.log(error.message);
			});
	};

	const handleBarCodeScanned = ({ data }) => {
		setScanned(true);
		const msg = 'Barcode Scanned!';

		if (Platform.OS === 'android') {
			ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.BOTTOM);
		} else {
			AlertIOS.alert(msg);
		}

		if (data.includes('tokenUrl')) {
			const { tokenUrl } = JSON.parse(data);
			getToken(tokenUrl);
		}
	};

	if (hasPermission === null) {
		return <Text style={styles.permissions}>Requesting for camera permission</Text>;
	}
	if (hasPermission === false) {
		return <Text style={styles.permissions}>No access to camera</Text>;
	}

	return (
		<View style={styles.container}>

			<BarCodeScanner
				onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
				style={[StyleSheet.absoluteFillObject, styles.barCodeScanner]}
			>

				<Text style={styles.description}>Scan QR code</Text>

				<BarcodeMask
					width={qrSize}
					height={qrSize}
					edgeColor="#644791"
					outerMaskOpacity={0.4}
					edgeBorderWidth={2}
				/>

			</BarCodeScanner>

			{scanned && (
				<Text onPress={() => setScanned(false)} style={styles.scanAgain}> Tap to Scan Again </Text>
			)}

		</View>
	);
}
