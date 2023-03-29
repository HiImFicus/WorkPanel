import {
	Database,
	formFactor,
	makerBrand,
	memorySize,
	Model,
	partNumber,
	port,
	Record,
	silicon,
	Stock,
} from "./Database";

class DatabaseServie {
	private database: Database;

	constructor() {
		this.database = new Database();
	}

	//* silicon
	async addSilicon(silison: silicon) {
		return await this.database.getSilisonTable().add(silison);
	}

	async bulkAddSilicon(silisons: silicon[]) {
		return await this.database.getSilisonTable().bulkAdd(silisons);
	}

	async updateSilicon(id: number, silicon: silicon) {
		return await this.database.getSilisonTable().update(id, silicon);
	}

	async removeSilicon(id: number) {
		return await this.database.getSilisonTable().delete(id);
	}

	async getSilicons() {
		return await this.database.getSilisonTable().toArray();
	}

	//* brand
	async addBrand(brnad: makerBrand) {
		return await this.database.getMakerBrandTable().add(brnad);
	}

	async bulkAddBrand(brnad: makerBrand[]) {
		return await this.database.getMakerBrandTable().bulkAdd(brnad);
	}

	async updateBrand(id: number, brnad: makerBrand) {
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
		return await this.database.getModelTable().add(model);
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

	//* memorySize
	async addMemorySize(memorySize: memorySize) {
		return await this.database.getMemorySizeTable().add(memorySize);
	}

	async bulkAddMemorySize(memorySizes: memorySize[]) {
		return await this.database.getMemorySizeTable().bulkAdd(memorySizes);
	}

	async updateMemorySize(id: number, memorySize: memorySize) {
		return await this.database.getMemorySizeTable().update(id, memorySize);
	}

	async removeMemorySize(id: number) {
		return await this.database.getMemorySizeTable().delete(id);
	}

	async getMemorySizes() {
		return await this.database.getMemorySizeTable().toArray();
	}

	//* FormFactor
	async addFormFactor(formFactor: formFactor) {
		return await this.database.getFormFactorTable().add(formFactor);
	}

	async bulkAddFormFactor(formFactors: formFactor[]) {
		return await this.database.getFormFactorTable().bulkAdd(formFactors);
	}

	async updateFormFactor(id: number, formFactor: formFactor) {
		return await this.database.getFormFactorTable().update(id, formFactor);
	}

	async removeFormFactor(id: number) {
		return await this.database.getFormFactorTable().delete(id);
	}

	async getFormFactors() {
		return await this.database.getFormFactorTable().toArray();
	}

	//* Port
	async addPort(port: port) {
		return await this.database.getPortTable().add(port);
	}

	async bulkAddPort(ports: port[]) {
		return await this.database.getPortTable().bulkAdd(ports);
	}

	async updatePort(id: number, port: port) {
		return await this.database.getPortTable().update(id, port);
	}

	async removePort(id: number) {
		return await this.database.getPortTable().delete(id);
	}

	async getPorts() {
		return await this.database.getPortTable().toArray();
	}

	//* PartNumber
	async addPartNumber(partNumber: partNumber) {
		return await this.database.getPartNumberTable().add(partNumber);
	}

	async bulkAddPartNumber(partNumbers: partNumber[]) {
		return await this.database.getPartNumberTable().bulkAdd(partNumbers);
	}

	async updatePartNumber(id: number, partNumber: partNumber) {
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
		return await this.database.getRecordTable().add(record);
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

	async bulkAddStock(stocks: Stock[]) {
		return await this.database.getStockTable().bulkAdd(stocks);
	}

	async updateStock(id: number, stock: Stock) {
		return await this.database.getStockTable().update(id, stock);
	}

	async removeStock(id: number) {
		return await this.database.getStockTable().delete(id);
	}

	async getStocks() {
		return await this.database.getStockTable().toArray();
	}

	async getStocksByWhere(where: string, values: string) {
		return await this.database
			.getStockTable()
			.where(where)
			.startsWithIgnoreCase(values)
			.toArray();
	}
}

export { DatabaseServie };
