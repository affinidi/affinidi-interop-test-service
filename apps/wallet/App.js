import React from 'react';
// eslint-disable-next-line no-unused-vars
import * as encoding from 'text-encoding';
import {
	StyleSheet, Image, Text, View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import logo from './assets/logo.png';

import Scanner from './components/BarcodeScanner';
import DisplayScreen from './components/DisplayCredentials';

const affinidiBlue = '#644791';
const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
	contianer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: '500',
	},
	logo: {
		width: 250,
		height: 60,
	},
});

function HomeScreen() {
	return (
		<View style={styles.contianer}>
			<Image style={styles.logo} source={logo} />
			<Text style={styles.title}>Wallet</Text>
		</View>
	);
}

function App() {
	return (
		<NavigationContainer>
			<Tab.Navigator
				screenOptions={({ route }) => ({
					tabBarIcon: ({ focused, color, size }) => {
						let iconName;

						if (route.name === 'Home') {
							iconName = focused ? 'ios-home' : 'md-home';
						} else if (route.name === 'Scan QR code') {
							iconName = 'qr-code-outline';
						} else if (route.name === 'Credentials') {
							iconName = focused ? 'md-card' : 'ios-card';
						}
						return <Ionicons name={iconName} size={size} color={color} />;
					},
				})}
				tabBarOptions={{
					activeTintColor: affinidiBlue,
					inactiveTintColor: 'gray',
				}}
			>
				<Tab.Screen name="Home" component={HomeScreen} />
				<Tab.Screen name="Scan QR code" component={Scanner} />
				<Tab.Screen name="Credentials" component={DisplayScreen} />
			</Tab.Navigator>
		</NavigationContainer>
	);
}

export default App;
