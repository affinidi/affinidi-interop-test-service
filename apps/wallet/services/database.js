import { openDatabase } from 'expo-sqlite';

const dbName = 'credentials.db';
const db = openDatabase(dbName);

export default class Database {
	static createTable = (tableName) => {
		db.transaction((tx) => {
			console.log(`Creating Table ${tableName} (if doesn't exist already)`);
			tx.executeSql(
				`CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, credential TEXT, createdAt INTEGER)`,
			);
		});
	}

	static dropTable = (tableName) => {
		db.transaction((tx) => {
			tx.executeSql(`DROP TABLE IF EXISTS ${tableName}`, null,
				() => console.log(`Dropped Table ${tableName}`),
				(txObj, error) => console.log('Error ', error));
		});
	}

	static truncateTable = (tableName) => {
		db.transaction((tx) => {
			tx.executeSql(`DELETE FROM ${tableName}`, null,
				() => console.log(`Truncated Table ${tableName}`),
				(txObj, error) => console.log('Error ', error));
		});
	}

	static getAllCredentials = async (tableName) => new Promise((resolve, reject) => {
		db.transaction((tx) => {
			tx.executeSql(`SELECT * FROM ${tableName}`, null,
				(txObj, { rows: { _array } }) => resolve(_array),
				(txObj, error) => reject(error));
		});
	})

	static getCredentialsById = async (tableName, id) => new Promise((resolve, reject) => {
		db.transaction((tx) => {
			tx.executeSql(`SELECT credential FROM ${tableName} WHERE id = ?`, [id],
				(txObj, { rows: { _array } }) => {
					// console.log(_array);
					resolve(_array);
				},
				(txObj, error) => reject(error));
		});
	})

	static storeCredential = (tableName, vc) => {
		db.transaction((tx) => {
			const createdAt = new Date().toDateString();
			tx.executeSql(`INSERT INTO ${tableName} (credential, createdAt) values (?, ?)`, [JSON.stringify(vc), createdAt],
				(txObj, resultSet) => console.log('stored the VC at id: ', resultSet.insertId),
				(txObj, error) => console.log('Error', error));
		});
	}
}
