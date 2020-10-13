import React, { useState, useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import jwtDecode from 'jwt-decode';

import {
	Text, View, StyleSheet, Dimensions, Platform, ToastAndroid, AlertIOS,
} from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import Constants from 'expo-constants';
import axios from 'axios';

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

	const getSignedCredentials = (callbackURL) => {
		/* eslint-disable no-case-declarations */
		// get Offer Response Token (simulated) (its supposed to come from some external wallet sdk)
		const responseToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpbnRlcmFjdGlvblRva2VuIjp7ImNhbG'
		+ 'xiYWNrVVJMIjoiaHR0cHM6Ly9rdWRvcy1pc3N1ZXItYmFja2VuZC5hZmZpbml0eS1wcm9qZWN'
		+ '0Lm9yZy9rdWRvc19vZmZlcmluZy8iLCJzZWxlY3RlZENyZWRlbnRpYWxzIjpbeyJ0eXBlIjoi'
		+ 'VGVzdERlbmlzQ3JlZCJ9XX0sImV4cCI6MTU4NDUxODk4MTE0OSwidHlwIjoiY3JlZGVudGlhb'
		+ 'E9mZmVyUmVzcG9uc2UiLCJqdGkiOiIxZjIyMTVjMjc5ZDczZWY5IiwiYXVkIjoiZGlkOmpvbG'
		+ '86ZjU1OTI2NWI2YzFiZWNkNTYxMDljNTYyMzQzNWZhNzk3YWQ0MzA4YTRhNjg2ZjhlZGE3MDl'
		+ 'mMzM4N2QzMDNlNiIsImlzcyI6ImRpZDpqb2xvOmY1NTkyNjViNmMxYmVjZDU2MTA5YzU2MjM0'
		+ 'MzVmYTc5N2FkNDMwOGE0YTY4NmY4ZWRhNzA5ZjMzODdkMzAzZTYja2V5cy0xIn0.5c144a384'
		+ 'f5fb69501e92c8251eea4f065f02b19c9af39f9e0cffd66c400462a460f1e03955a55af9b'
		+ 'df600459628ed7d11da9cafc255c4e9a89b4baea4e083f';

		const input = {
			responseToken,
		};

		axios.post(callbackURL, input)
			.then((postResponse) => {
				if (postResponse.data) {
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
			.then((postResponse) => {
				console.log(7);
				console.log(postResponse.data);
				if (postResponse.data) {
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
			.then((response) => {
				const decoded = jwtDecode(response.data.token);
				const { purpose } = response.data;
				const { callbackURL } = decoded.interactionToken;

				if (purpose === 'offer') {
					getSignedCredentials(callbackURL);
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
			console.log(tokenUrl);
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
