import Dexie from "dexie";

import { isObjectEmpty } from "../../common/Helps";

interface Database {
	name: string;
	tables: { name: string; fields: string[] }[];
	version: number;
	instance?: Dexie;
}

class DatabaseManager {
	databases: Database[] = [];

	addDatabase(database: Database) {
		this.databases.push(database);
	}

	getDatabase(databaseName: string) {
		return this.databases.filter(
			(database) => database.name === databaseName
		)[0];
	}

	removeDatabase(databaseName: string) {
		this.databases = this.databases.filter((database) => {
			if (database.name === databaseName) {
				if (database.instance) {
					if (database.instance.isOpen()) {
						database.instance.close();
					}
					Dexie.delete(database.name);
				}
				return false;
			}
			return true;
		}, databaseName);
	}

	private constructor() {}

	getDM() {
		return new DatabaseManager();
	}

	setUp() {
		this.databases.map((database) => {
			if (!database.instance) {
				database.instance = new Dexie(database.name);
				let scheme: any = {};
				database.tables.map((table) => {
					scheme[table.name] = table.fields;
				});
				if (!isObjectEmpty(scheme)) {
					database.instance.version(database.version).stores(scheme);
				}
			}
		});
	}
}

// db.isOpen
// db.open
// // db.close
// const gpuDB = new Dexie("GPUWork");
// gpuDB.version(1).stores({
// 	silicon: "++id, &name",
// 	makerBrand: "++id, &name",
// 	model: "++id, &name, silicon",
// 	memorySize: "++id, &name",
// 	formFactor: "++id, &name",
// 	port: "++id, &name",
// 	partNumber: "++id, &name",
// 	record: "++id, &[silicon+brand+model+memory+formFactor+ports+partNumbers]",
// 	stock:
// 		"++id, silicon, brand, model, memory, formFactor, ports, partNumbers, date, selfState, status, defect",
// });

//clear every table when refresh
// gpuDB.tables.map((table) => table.clear())
// Dexie.delete('GPUWork');

// export { gpuDB };
