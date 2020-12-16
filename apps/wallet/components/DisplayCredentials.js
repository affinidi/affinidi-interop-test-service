/* eslint-disable react/jsx-one-expression-per-line */
import React, { Component } from 'react';
import {
	StyleSheet, Text, View, ScrollView, Image,
} from 'react-native';
import Constants from 'expo-constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Database from '../services/database';
import logo from '../assets/icon.png';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: Constants.statusBarHeight,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		fontSize: 20,
		paddingTop: 10,
		fontWeight: '500',
		alignSelf: 'center',
	},
	cardContainer: {
		paddingTop: 15,
		paddingBottom: 15,
		marginTop: 20,
		width: 330,
		height: 150,
		shadowColor: 'rgba(0, 0, 0, 0.5)',
		shadowOffset: { x: 0, y: 10 },
		shadowOpacity: 1,
		borderLeftColor: 'grey',
		borderLeftWidth: 10,
		borderRadius: 10,
		alignSelf: 'stretch',
		backgroundColor: 'lightgrey',
	},
	cardContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 10,
		marginLeft: 50,
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginLeft: 5,
		marginRight: 15,
	},
	issuanceDate: {
		fontStyle: 'italic',
		fontSize: 11,
	},
	contentFont: {
		fontSize: 12,
		fontWeight: 'bold',
	},
	logo: {
		width: 50,
		height: 40,
	},
});

const Card = ({ date, title, desc }) => (
	<View style={styles.cardContainer}>

		<View style={styles.cardHeader}>
			<Image style={styles.logo} source={logo} />
			<Text style={styles.issuanceDate}>
				Date Issued: {date}
			</Text>
		</View>

		<View style={styles.cardContent}>
			<View style={{ flexDirection: 'column' }}>
				<Text style={styles.contentFont}>Id: {title}</Text>
				<Text style={styles.contentFont}>Type: {desc}</Text>
			</View>
			<MaterialIcons name="navigate-next" size={40} color="red" />
		</View>
	</View>
);

export default class DisplayCredentials extends Component {
	constructor(props) {
		super(props);

		this.state = {
			credentials: [],
		};

		this.renderCards = this.renderCards.bind(this);
	}

	componentDidMount() {
		this.getResultsFromDB();
	}

	async getResultsFromDB() {
		const results = await Database.getCredentials('credentials');
		this.setState({ credentials: results });
	}

	renderCards() {
		const { credentials } = this.state;
		return credentials.map((row) => {
			const vc = JSON.parse(row.credential);
			vc.rowId = row.id;	// provide unique id
			return (
				<Card
					date={vc.issuanceDate.split('T')[0]}
					title={vc.id}
					desc={vc.type[1]}
				/>
			);
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>{'Here are all your Credentials \n'}</Text>
				<ScrollView>
					{this.renderCards()}
				</ScrollView>
			</View>
		);
	}
}
