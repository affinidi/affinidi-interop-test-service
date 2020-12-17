import React, { useState, useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';

import {
	Text, View, StyleSheet, Dimensions, Platform, ToastAndroid, Alert, LogBox,
} from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import Constants from 'expo-constants';

// import DBService from '../services/dbService';
import APIService from '../services/apiService';
import SDKService from '../services/sdkService';

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

// DBService.createTable(tableName);

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

	const handleCredentialOffer = async (token, callbackURL) => {
		const responseToken = await SDKService.getOfferResponseToken(token);
		if (responseToken) {
			const status = APIService.getSignedCredentials(callbackURL, responseToken);

			if (status) {
				navigation.navigate('Credentials');
			}
		}
	};

	const handlePresentationSharing = async (token, callbackURL) => {
		const records = await SDKService.getCredentials(token);

		if (records.length > 0) {
			const vc = JSON.parse(records[0].credential);
			const vp = await SDKService.createPresentationFromChallenge(token, vc);
			const status = APIService.getPresentationChallenge(callbackURL, vp);

			if (status) {
				const msg = 'Congratulations, your request for this service is approved!';

				if (Platform.OS === 'android') {
					ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.BOTTOM);
				} else {
					Alert.alert(msg);
				}
				navigation.navigate('Home');
			}
		}
	};

	const handleBarCodeScanned = async ({ data }) => {
		setScanned(true);
		const msg = 'Barcode Scanned!';

		if (Platform.OS === 'android') {
			ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.BOTTOM);
		} else {
			Alert.alert(msg);
		}

		if (data.includes('tokenUrl')) {
			const { tokenUrl } = JSON.parse(data);
			const { purpose, callbackURL, token } = await APIService.getToken(tokenUrl);

			console.log(purpose, callbackURL);
			if (purpose === 'offer') {
				handleCredentialOffer(token, callbackURL);
			} else if (purpose === 'request') {
				handlePresentationSharing(token, callbackURL);
			}
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
