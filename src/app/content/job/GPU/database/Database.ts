import Dexie, { Table } from "dexie";

import {
	arrayToString,
	getDateString,
	stringArrayTrimValueToString,
} from "../../../../common/Helps";

//clear every table when refresh

const stockFieldsFromFile = [
	"id",
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
];
const stockFieldsRunTime = [
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
];
const recordFields = [
	"silicon",
	"brand",
	"model",
	"memory",
	"formFactor",
	"ports",
	"partNumbers",
];

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

	createStockFromFile(data: any): Stock {
		let newStock: any = {};
		stockFieldsFromFile.map((field) => {
			if (field === "ports" || field === "partNumbers") {
				newStock[field] = stringArrayTrimValueToString(data[field]);
			} else if (field === "state" && !newStock["state"] && data["selfState"]) {
				//* Compatible with old data
				if (data["selfState"] != stockSelfStateBad) {
					newStock["state"] = stockSelfStateGood;
				} else {
					newStock["state"] = data["selfState"];
				}
			} else if (field === "status") {
				newStock[field] = data["status"].toLowerCase();
			} else if (field === "defect") {
				newStock[field] = stringArrayTrimValueToString(
					data[field]
				).toLowerCase();
			} else if (field === "id") {
				newStock[field] = Number(data[field]);
			} else {
				newStock[field] = data[field];
			}
		}, data);

		return newStock;
	}

	createStockFromForm(data: any): Stock {
		let newStock: any = {};
		stockFieldsRunTime.map((field) => {
			newStock[field] = data[field];
		}, data);

		if (newStock.date instanceof Date) {
			newStock.date = getDateString(newStock.date);
		}
		if (Array.isArray(newStock.defect)) {
			newStock.defect = arrayToString(newStock.defect);
		}

		if (Array.isArray(newStock.ports)) {
			newStock.ports = this.parsePortsObjectToString(newStock.ports);
		}
		if (Array.isArray(newStock.partNumbers)) {
			newStock.partNumbers = arrayToString(newStock.partNumbers);
		}

		return newStock;
	}

	createRecordByData(data: any): Record {
		let record: any = {};
		recordFields.map((field) => {
			record[field] = data[field];
		}, data);

		return record;
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

	parsePortsObjectToString(portsObject: any[]) {
		let ports: any = {};
		portsObject.map((port) => {
			if (port.type) {
				// return `${port.type}: ${port.active}`;
				if (ports[port.type]) {
					ports[port.type] = ports[port.type] + 1;
				} else {
					ports[port.type] = 1;
				}
			}
		});

		let portsArray = [];
		for (const port in ports) {
			if (Object.hasOwnProperty.call(ports, port)) {
				if (ports[port] < 2) {
					portsArray.push(port);
				} else {
					portsArray.push(`${ports[port]} x ${port}`);
				}
			}
		}

		return portsArray.join(",");
	}
}

export { Database };

export type Silicon = {
	name: string;
};

export type MakerBrand = {
	name: string;
};

export type MemorySize = {
	name: string;
};

export type FormFactor = {
	name: string;
};

export type Port = {
	name: string;
};

export type PartNumber = {
	name: string;
};

export type Model = {
	name: string;
	silicon: string;
};

export type Record = {
	silicon: string;
	brand: string;
	model: string;
	memory: string;
	formFactor: string;
	ports: string;
	partNumbers: string;
};

export type Stock = {
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

export const stockSelfStateGood = "working";
export const stockSelfStateBad = "broken";
export const stockStatusInStock = "in";
export const stockStatusOut = "out";
export const stockSamePortsMultipleSymbol = "x";
export const stockSamePortsMultipleSymbolExpress = ` ${stockSamePortsMultipleSymbol} `;
export const stockDefectMap = [
	{ value: "bad port", label: "Bad Port" },
	{ value: "bad fan", label: "Bad Fan" },
	{ value: "noisy fan", label: "Noisy Fan" },
	{ value: "no profile", label: "No Profile" },
];
