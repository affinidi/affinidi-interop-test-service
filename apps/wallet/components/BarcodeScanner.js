import React, { useState, useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import jwtDecode from 'jwt-decode';

import {
	Text, View, StyleSheet, Dimensions, Platform, ToastAndroid, Alert, LogBox,
} from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import Constants from 'expo-constants';
import axios from 'axios';

import SDKService from '../services/sdk.service';
import Database from '../services/database';

const tableName = 'credentials';
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

Database.createTable(tableName);

LogBox.ignoreAllLogs();

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
			.then(async (response) => {
				if (response.data) {
					const vc = response.data.signedCredentials[0];
					Database.storeCredential(tableName, vc);
					navigation.navigate('Credentials');
				}
			}).catch((error) => {
				if (error.response) console.log(error.response.data);
				else if (error.request) console.log(error.request);
				else console.log(error.message);
			});
	};

	const getPresentationChallenge = (callbackURL, vp) => {
		const input = {
			vp,
		};

		axios.post(callbackURL, input)
			.then((response) => {
				if (response.data) {
					const msg = 'Congratulations, your request for this service is approved!';
					console.log(msg);
					if (Platform.OS === 'android') {
						ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.BOTTOM);
					} else {
						Alert.alert(msg);
					}
					navigation.navigate('Home');
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
					const result = await Database.getCredentialsById(tableName, 1);
					const vc = JSON.parse(result[0].credential);
					const vp = await SDKService.createPresentationFromChallenge(response.data.token, vc);
					getPresentationChallenge(callbackURL, vp);
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
		console.log(msg);
		if (Platform.OS === 'android') {
			ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.BOTTOM);
		} else {
			Alert.alert(msg);
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
