import React from 'react';
import {
	StyleSheet, Image, Text, View,
} from 'react-native';
import card from '../assets/card.png';

const styles = StyleSheet.create({
	contianer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: '500',
	},
	card: {
		width: 330,
		height: 150,
	},
});

function DisplayCredentials() {
	return (
		<View style={styles.contianer}>
			<Text style={styles.title}>{'Here are all your Credentials \n'}</Text>
			<Image style={styles.card} source={card} />
			<Text>{'\nThis is a sample VC card'}</Text>
		</View>
	);
}

export default DisplayCredentials;
