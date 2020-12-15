import React from 'react';
import {
	StyleSheet, Image, Text, View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/Ionicons';
import Database from '../services/database';
// import { Constants } from 'expo';

// import card from '../assets/card.png';

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
	cardContainer: {
		paddingTop: 15,
		paddingBottom: 15,
		height: 150,
		shadowColor: 'rgba(0, 0, 0, 0.5)',
		shadowOffset: { x: 0, y: 10 },
		shadowOpacity: 1,
		borderLeftColor: 'blue',
		borderLeftWidth: 10,
		borderRadius: 10,
		alignSelf: 'stretch',
		backgroundColor: 'white',
		margin: 15,
	},
	cardContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginLeft: 20,
	},
});

const Card = ({ title, desc }) => (
	<View style={styles.cardContainer}>
		<View style={styles.cardContent}>
			<View style={{ flexDirection: 'column' }}>
				<Text>{title}</Text>
				<Text>{desc}</Text>
			</View>
			<MaterialIcons name="navigate-next" size={40} color="red" />
		</View>
	</View>
);

function renderCards(cards) {
	return cards.map((card) => {
		const vc = JSON.parse(card.credential);
		console.log(vc.type);
		return (
			<Card
				title={vc.id}
				desc={vc.type[1]}
			/>
		);
	});
}

async function DisplayCredentials() {
	// get the credentials
	const results = await Database.getCredentials('credentials');
	// console.log(results);
	console.log(results.length);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{'Here are all your Credentials \n'}</Text>
			{renderCards(results)}
		</View>
	);
}

export default DisplayCredentials;
