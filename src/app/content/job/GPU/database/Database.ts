import Dexie, { Table } from "dexie";

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

interface databaseScheme {
	[tableName: string]: string;
}
class Database {
	name: string = "GPUWork";
	static tables: { name: string; fields: string[] }[] = [
		{
			name: "silicon",
			fields: ["++id", "&name"],
		},
		{
			name: "makerBrand",
			fields: ["++id", "&name"],
		},
		{
			name: "model",
			fields: ["++id", "&name", "silicon"],
		},
		{
			name: "memorySize",
			fields: ["++id", "&name"],
		},
		{
			name: "formFactor",
			fields: ["++id", "&name"],
		},
		{
			name: "port",
			fields: ["++id", "&name"],
		},
		{
			name: "partNumber",
			fields: ["++id", "&name"],
		},
		{
			name: "record",
			fields: [
				"++id",
				"&[silicon+brand+model+memory+formFactor+ports+partNumbers]",
			],
		},
		{
			name: "stock",
			fields: [
				"++id",
				"silicon",
				"brand",
				"model",
				"memory",
				"formFactor",
				"ports",
				"partNumbers",
				"date",
				"state",
				"status",
				"defect",
			],
		},
	];
	version: number = 1;
	instance: Dexie;

	constructor() {
		this.instance = new Dexie(this.name);
		const scheme = Database.getScheme();
		//todo check indexDB.
		this.instance.version(this.version).stores(scheme);
	}

	static getScheme(): databaseScheme {
		let scheme: databaseScheme = {};
		Database.tables.forEach(
			(table) => (scheme[table.name] = table.fields.join(", "))
		);

		return scheme;
	}

	// db.isOpen
	// db.open
	// db.close

	clearAllTables() {
		this.instance.tables.forEach((table) => table.clear());
	}

	delete() {
		Dexie.delete(this.instance.name);
	}

	getSilisonTable() {
		return this.instance.table("silicon");
	}

	getMakerBrandTable() {
		return this.instance.table("makerBrand");
	}

	getModelTable() {
		return this.instance.table("model");
	}

	getMemorySizeTable() {
		return this.instance.table("memorySize");
	}

	getFormFactorTable() {
		return this.instance.table("formFactor");
	}

	getPortTable() {
		return this.instance.table("port");
	}

	getPartNumberTable() {
		return this.instance.table("partNumber");
	}

	getRecordTable() {
		return this.instance.table("record");
	}

	getStockTable(): Table {
		return this.instance.table("stock");
	}
}

export { Database };

export type silicon = {
	name: string;
};

export type makerBrand = {
	name: string;
};

export type memorySize = {
	name: string;
};

export type formFactor = {
	name: string;
};

export type port = {
	name: string;
};

export type partNumber = {
	name: string;
};

export type model = {
	name: string;
	silicon: string;
};

export type record = {
	silicon: string;
	brand: string;
	model: string;
	memory: string;
	formFactor: string;
	ports: string;
	partNumbers: string;
};

export type stock = {
	silicon: string;
	brand: string;
	model: string;
	memory: string;
	formFactor: string;
	ports: string;
	partNumbers: string;
	date: string;
	state: string;
	status: string;
	defect: string;
};
