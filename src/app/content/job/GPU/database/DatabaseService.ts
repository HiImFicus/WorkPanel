import Dexie, { DexieError } from "dexie";

import {
	Database,
	FormFactor,
	MakerBrand,
	MemorySize,
	Model,
	PartNumber,
	Port,
	Record,
	Silicon,
	Stock,
	stockSamePortsMultipleSymbolExpress,
} from "./Database";

class DatabaseServie {
	private database: Database;

	constructor() {
		this.database = new Database();
	}

	getDatabase() {
		return this.database;
	}

	bulkAdd(table: string, data: any): void {
		this.database.instance.table(table).bulkAdd(data);
	}

	clearTable(table: string): void {
		this.database.instance.table(table).clear();
	}

	clearAll() {
		this.database.clearAllTables();
	}

	//* silicon
	addSilicon(silison: Silicon) {
		return this.database.getSilisonTable().add(silison);
	}

	async bulkAddSilicon(silisons: Silicon[]) {
		return await this.database.getSilisonTable().bulkAdd(silisons);
	}

	async updateSilicon(id: number, silicon: Silicon) {
		return await this.database.getSilisonTable().update(id, silicon);
	}

	async removeSilicon(id: number) {
		return await this.database.getSilisonTable().delete(id);
	}

	async getSilicons() {
		return await this.database.getSilisonTable().toArray();
	}

	//* brand
	addBrand(brnad: MakerBrand) {
		return this.database.getMakerBrandTable().add(brnad);
	}

	async bulkAddBrand(brnad: MakerBrand[]) {
		return await this.database.getMakerBrandTable().bulkAdd(brnad);
	}

	async updateBrand(id: number, brnad: MakerBrand) {
		return await this.database.getMakerBrandTable().update(id, brnad);
	}

	async removeBrand(id: number) {
		return await this.database.getMakerBrandTable().delete(id);
	}

	async getBrands() {
		return await this.database.getMakerBrandTable().toArray();
	}

	//* model
	async addModel(model: Model) {
		return this.database.getModelTable().add(model);
	}

	async bulkAddModel(models: Model[]) {
		return await this.database.getModelTable().bulkAdd(models);
	}

	async updateModel(id: number, model: Model) {
		return await this.database.getModelTable().update(id, model);
	}

	async removeModel(id: number) {
		return await this.database.getModelTable().delete(id);
	}

	async getModels() {
		return await this.database.getModelTable().toArray();
	}

	async getModelByName(modelName: string): Promise<Model> {
		return await this.database
			.getModelTable()
			.where("name")
			.equalsIgnoreCase(modelName)
			.first();
	}

	parseModelFromString(string: string) {
		const parseArray = string.split(":");
		if (parseArray.length === 2) {
			const modelName = parseArray[1].trim();
			const silicon = parseArray[0].trim();

			return { name: modelName, silicon: silicon };
		}

		return null;
	}

	//* memorySize
	async addMemorySize(memorySize: MemorySize) {
		return this.database.getMemorySizeTable().add(memorySize);
	}

	async bulkAddMemorySize(memorySizes: MemorySize[]) {
		return await this.database.getMemorySizeTable().bulkAdd(memorySizes);
	}

	async updateMemorySize(id: number, memorySize: MemorySize) {
		return await this.database.getMemorySizeTable().update(id, memorySize);
	}

	async removeMemorySize(id: number) {
		return await this.database.getMemorySizeTable().delete(id);
	}

	async getMemorySizes() {
		return await this.database.getMemorySizeTable().toArray();
	}

	//* FormFactor
	async addFormFactor(formFactor: FormFactor) {
		return this.database.getFormFactorTable().add(formFactor);
	}

	async bulkAddFormFactor(formFactors: FormFactor[]) {
		return await this.database.getFormFactorTable().bulkAdd(formFactors);
	}

	async updateFormFactor(id: number, formFactor: FormFactor) {
		return await this.database.getFormFactorTable().update(id, formFactor);
	}

	async removeFormFactor(id: number) {
		return await this.database.getFormFactorTable().delete(id);
	}

	async getFormFactors() {
		return await this.database.getFormFactorTable().toArray();
	}

	//* Port
	async addPort(port: Port) {
		return this.database.getPortTable().add(port);
	}

	async bulkAddPort(ports: Port[]) {
		return await this.database.getPortTable().bulkAdd(ports);
	}

	async updatePort(id: number, port: Port) {
		return await this.database.getPortTable().update(id, port);
	}

	async removePort(id: number) {
		return await this.database.getPortTable().delete(id);
	}

	async getPorts() {
		return await this.database.getPortTable().toArray();
	}

	//* PartNumber
	async addPartNumber(partNumber: PartNumber) {
		return this.database.getPartNumberTable().add(partNumber);
	}

	async bulkAddPartNumber(partNumbers: PartNumber[]) {
		return await this.database.getPartNumberTable().bulkAdd(partNumbers);
	}

	async updatePartNumber(id: number, partNumber: PartNumber) {
		return await this.database.getPartNumberTable().update(id, partNumber);
	}

	async removePartNumber(id: number) {
		return await this.database.getPartNumberTable().delete(id);
	}

	async getPartNumbers() {
		return await this.database.getPartNumberTable().toArray();
	}

	//* Record
	async addRecord(record: Record) {
		return this.database.getRecordTable().add(record);
	}

	async bulkAddRecord(records: Record[]) {
		return await this.database.getRecordTable().bulkAdd(records);
	}

	async updateRecord(id: number, record: Record) {
		return await this.database.getRecordTable().update(id, record);
	}

	async removeRecord(id: number) {
		return await this.database.getRecordTable().delete(id);
	}

	async getRecords() {
		return await this.database.getRecordTable().toArray();
	}

	//* Stock
	async addStock(stock: Stock) {
		return await this.database.getStockTable().add(stock);
	}

	async stockSaveFromAdd(stockData: any) {
		const newStock = this.database.createStockFromForm(stockData);

		const record = this.database.createRecordByData(newStock);
		this.addRecord(record).catch((reason) =>
			this.hanldeDuplicateDataIntertError(reason, "record")
		);

		return this.addStock(newStock);
	}

	async bulkUpdateStockFromImport(data: any[]) {
		const listData = data
			.filter(
				(every) =>
					every["*C:MPN"] &&
					every["CustomLabel"] &&
					every["*Title"] &&
					every["*C:Memory Type"] &&
					every["C:Compatible Slot"] &&
					every["PicURL"] &&
					every["*StartPrice"]
			)
			.map((every) => {
				return {
					partNumber: every["*C:MPN"],
					location: every["CustomLabel"].split("_")[1],
					title: every["*Title"],
					memoryType: every["*C:Memory Type"],
					compatibleSlot: every["C:Compatible Slot"],
					picUrl: every["PicURL"],
					price: every["*StartPrice"],
				};
			});

		// console.log(listData);
		listData.map((every) => {
			this.database
				.getCompatibleSlotTable()
				.add({ name: every["compatibleSlot"] })
				.catch((reason) =>
					this.hanldeDuplicateDataIntertError(reason, "compatibleSlot")
				);
			this.database
				.getMemoryTypeTable()
				.add({ name: every["memoryType"] })
				.catch((reason) =>
					this.hanldeDuplicateDataIntertError(reason, "memory type")
				);
			this.database
				.getTitleTable()
				.add({ name: every["title"] })
				.catch((reason) =>
					this.hanldeDuplicateDataIntertError(reason, "title")
				);
			this.database
				.getLocationTable()
				.add({ name: every["location"] })
				.catch((reason) =>
					this.hanldeDuplicateDataIntertError(reason, "location")
				);

			this.database
				.getStockTable()
				.where("partNumbers")
				.startsWithIgnoreCase(every["partNumber"])
				.modify({
					memoryType: every["memoryType"],
					compatibleSlot: every["compatibleSlot"],
					location: every["location"],
					title: every["title"],
					picUrl: every["picUrl"],
					price: Number(every["price"]),
				});
		});
	}

	async bulkAddStockFromImport(stocksData: any[]) {
		const stocks = stocksData.map((every) => {
			const stock = this.database.createStockFromFile(every);
			this.saveRecordAndSettingData(stock);
			return stock;
		});

		await this.bulkAddStock(stocks).then(function (lastKey) {
			console.log(`Added ${lastKey} stocks.`);
		});
	}

	hanldeDuplicateDataIntertError(error: DexieError, dataName: string): null {
		if (error.name === "ConstraintError") {
			//log console.log(`Duplicate ${dataName} insertion has been prevented`);
		} else {
			throw error;
		}

		return null;
	}

	saveRecordAndSettingData(stock: Stock) {
		const record = this.database.createRecordByData(stock);
		this.addRecord(record).catch((reason) =>
			this.hanldeDuplicateDataIntertError(reason, "record")
		);

		this.addSilicon({ name: stock.silicon }).catch((reason) =>
			this.hanldeDuplicateDataIntertError(reason, "silicon")
		);

		this.addBrand({ name: stock.brand }).catch((reason) =>
			this.hanldeDuplicateDataIntertError(reason, "brand")
		);

		this.addModel({ name: stock.model, silicon: stock.silicon }).catch(
			(reason) => this.hanldeDuplicateDataIntertError(reason, "model")
		);

		this.addMemorySize({ name: stock.memory }).catch((reason) =>
			this.hanldeDuplicateDataIntertError(reason, "memory size")
		);

		this.addFormFactor({ name: stock.formFactor }).catch((reason) =>
			this.hanldeDuplicateDataIntertError(reason, "form factor")
		);

		if (stock.memoryType) {
			this.database
				.getMemoryTypeTable()
				.add({ name: stock.memoryType })
				.catch((reason) =>
					this.hanldeDuplicateDataIntertError(reason, "memory type")
				);
		}

		if (stock.compatibleSlot) {
			this.database
				.getCompatibleSlotTable()
				.add({ name: stock.compatibleSlot })
				.catch((reason) =>
					this.hanldeDuplicateDataIntertError(reason, "compatibleSlot")
				);
		}

		if (stock.title) {
			this.database
				.getTitleTable()
				.add({ name: stock.title })
				.catch((reason) =>
					this.hanldeDuplicateDataIntertError(reason, "title")
				);
		}

		if (stock.location) {
			this.database
				.getLocationTable()
				.add({ name: stock.location })
				.catch((reason) =>
					this.hanldeDuplicateDataIntertError(reason, "location")
				);
		}

		if (stock.ports) {
			stock.ports.split(",").map((everyPort) => {
				let port = everyPort;
				if (everyPort.includes(stockSamePortsMultipleSymbolExpress)) {
					port = everyPort.split(stockSamePortsMultipleSymbolExpress)[1];
				}
				this.addPort({ name: port }).catch((reason) =>
					this.hanldeDuplicateDataIntertError(reason, "port")
				);
			});
		}

		if (stock.partNumbers) {
			stock.partNumbers.split(",").map((everyPartNumber) => {
				this.addPartNumber({ name: everyPartNumber }).catch((reason) =>
					this.hanldeDuplicateDataIntertError(reason, "partNumber")
				);
			});
		}
	}

	async bulkAddStock(stocks: Stock[]) {
		return await this.database.getStockTable().bulkAdd(stocks);
	}

	async updateStock(id: number, data: any) {
		const stock = this.database.createStockFromForm(data);
		return await this.database.getStockTable().update(id, stock);
	}

	async removeStock(id: number) {
		return await this.database.getStockTable().delete(id);
	}

	// async getStocks() {
	// 	const sortedData = await this.database
	// 		.getStockTable()
	// 		.orderBy("id")
	// 		.toArray();
	// 	sortedData.sort((a, b) => Number(a.id) - Number(b.id));
	// 	return sortedData;
	// }

	async getStocks() {
		return await this.database.getStockTable().toArray();
	}

	async getStocksOrderBy(orderBy: string = "id") {
		return await this.database
			.getStockTable()
			.orderBy(orderBy)
			.sortBy("silicon");
	}

	async getStocksByWhere(where: string, value: string) {
		return await this.database
			.getStockTable()
			.where(where)
			.equalsIgnoreCase(value)
			.toArray();
	}

	async getStocksById(id: number) {
		return await this.database.getStockTable().where("id").equals(id).first();
	}

	async getLastThreeStocks() {
		return await this.database
			.getStockTable()
			.orderBy("id")
			.reverse()
			.limit(3)
			.toArray();
	}

	async getLocations() {
		return this.database.getLocationTable().toArray();
	}

	async getMemoryTypes() {
		return await this.database.getMemoryTypeTable().toArray();
	}

	async getCompatibleSlots() {
		return await this.database.getCompatibleSlotTable().toArray();
	}

	async getTitles() {
		return await this.database.getTitleTable().toArray();
	}
}

export { DatabaseServie };
