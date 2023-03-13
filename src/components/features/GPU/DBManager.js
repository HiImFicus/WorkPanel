import { randomId } from "@mantine/hooks";
import { gpuDB } from "../../../common/db";
import { isNumeric, arrayToString } from "../../../common/Helps";

// scheme:
//     silicon: '++id, &name',
//     makerBrand: '++id, &name',
//     model: '++id, &name, silicon',
//     memorySize: '++id, &name',
//     formFactor: '++id, &name',
//     port: '++id, &name',
//     partNumber: '++id, &name',
//     record: '++id, [silicon+brand+model+memory+formFactor+ports+partNumbers]',
//     stock: '++id, silicon, brand, model, memory, formFactor, ports, partNumbers, date, selfState, status, defect',

export const stockDefectMap = [
    { value: 'Bad Port', label: 'Bad Port' },
    { value: 'Bad Fan', label: 'Bad Fan' },
    { value: 'Noisy Fan', label: 'Noisy Fan' },
];
export const stockSelfStateGood = "still-work";
export const stockSelfStateBad = "broken";
export const stockStatusInStock = "in";
export const stockStatusOut = "out";
export const stockSamePortsMultipleSymbol = "x"
export const stockSamePortsMultipleSymbolExpress = ` ${stockSamePortsMultipleSymbol} `
const stockFields = [
    "silicon",
    "brand",
    "model",
    "memory",
    "formFactor",
    "ports",
    "partNumbers",
    "date",
    "selfState",
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

function createStockByData(data) {
    let newStock = {};
    stockFields.map(field => {
        newStock[field] = data[field]
    }, data)

    return newStock;
}

function createRecordByData(data) {
    let record = {};
    recordFields.map(field => {
        record[field] = data[field]
    }, data)

    return record;
}

export function createStockByOldData(rawData) {
    let data = { ...rawData };
    //todo add insert config data
    data["date"] = data["DATE"];
    data["silicon"] = data["SILICON"];
    data["brand"] = data["BRAND"];
    data["memory"] = data["MEMORY"];
    data["formFactor"] = data["FORM FACTOR"];
    data["selfState"] = stockSelfStateGood;
    data["defect"] = data["DEFECT"];

    if (!data["BRAND"]) {
        data["brand"] = data["silicon"];
    }

    if (data["WS"]) {
        const firstParse = data["WS"].split(" ");
        if (data["silicon"] === "AMD") {
            if (firstParse.length >= 2) {
                data["model"] = data["WS"]
            } else {
                data["model"] = "FirePro " + data["WS"].match(/[a-zA-Z]+|[0-9]+/g).join(" ");
            }
        } else {
            if (firstParse.length >= 2) {
                if (firstParse[0] === "TESLA") {
                    data["model"] = data["WS"];
                } else {
                    data["model"] = "Quadro " + data["WS"];
                }
            } else {
                data["model"] = "Quadro " + data["WS"].match(/[a-zA-Z]+|[0-9]+/g).join(" ");
            }
        }
    } else {
        const firstParse = data["GEFORCE/RADEON"].split(" ");
        if (data["silicon"] === "AMD") {
            if (firstParse.length >= 2) {
                data["model"] = "Radeon " + data["GEFORCE/RADEON"]
            } else {
                data["model"] = "Radeon " + data["GEFORCE/RADEON"].match(/[a-zA-Z]+|[0-9]+/g).join(" ");
            }
        } else {
            if (firstParse.length >= 2) {
                if (firstParse[0] === "GF") {
                    data["model"] = data["GEFORCE/RADEON"].replace('GF', 'GeFore')
                } else {
                    data["model"] = "GeFore " + data["GEFORCE/RADEON"]
                }
            } else {
                data["model"] = "GeFore " + data["GEFORCE/RADEON"].match(/[a-zA-Z]+|[0-9]+/g).join(" ");
            }
        }
    }

    function parseSameTypePorts(string) {
        let trimString = string.trim();
        if (trimString) {
            let splitStringByLetterAndNumber = trimString.match(/[a-zA-Z]+|[0-9]+/g).filter(ele => ele !== 'X' || ele !== 'x');
            if (splitStringByLetterAndNumber.length >= 2 && isNumeric(splitStringByLetterAndNumber[0])) {
                const number = splitStringByLetterAndNumber.shift();
                return number + stockSamePortsMultipleSymbolExpress + splitStringByLetterAndNumber.join("-");
            }
        }

        return string;
    }
    data["ports"] = data["PORTS"].split(",").map(ele => parseSameTypePorts(ele));

    function parsePartNumber(string, brand) {
        if (string) {
            let partnumber = string.trim().replace("#", "");
            if (brand === "DELL" && partnumber.length === 5) {
                partnumber = "CN-0" + partnumber
            }

            return partnumber;
        }

        return string;
    }
    data["partNumbers"] = data["PART #"].split(",").map(ele => parsePartNumber(ele, data["brand"]), data);

    data["status"] = data["STATUS"]?.toLowerCase();

    if (data["STATUS"] && [stockStatusInStock, stockStatusOut].includes(data["STATUS"].toLowerCase())) {
        data["status"] = data["STATUS"]?.toLowerCase();
    } else {
        data["status"] = stockStatusInStock;
    }

    // return createStockByData(data)
    const stock = createStockByData(data);
    checkAndSaveStockForOldData(stock);

    return stock;
}

async function checkAndSaveStockForOldData(stock) {
    stock.ports = arrayToString(stock.ports);
    stock.partNumbers = arrayToString(stock.partNumbers);
    const record = createRecordByData(stock)

    const hasRecord = await gpuDB.record.get({
        "brand": record.brand,
        "formFactor": record.formFactor,
        "memory": record.memory,
        "model": record.model,
        "partNumbers": record.partNumbers,
        "ports": record.ports,
        "silicon": record.silicon,
    });

    await gpuDB.transaction('rw', [gpuDB.record, gpuDB.stock], async () => {
        if (!hasRecord) {
            await gpuDB.record.add(record).catch(function callback(error) {
                if (error.name === "ConstraintError") {
                    console.log("prevent same record insert");
                } else {
                    throw (error)
                }
            });
        }

        await gpuDB.stock.add(stock);
    });
}

async function stockBulkSave(stocks) {
    await gpuDB.transaction('rw', [gpuDB.stock], async () => {
        await gpuDB.stock.bulkAdd(stocks);
    });
}

export async function stockSaveFromAdd(stockData) {
    const newStock = createStockByData(stockData);
    newStock.ports = parsePortsObjectToString(newStock.ports);
    newStock.partNumbers = arrayToString(newStock.partNumbers);

    const record = createRecordByData(newStock)
    const hasRecord = await gpuDB.record.where('[silicon+brand+model+memory+formFactor+ports+partNumbers]')
        .equals([
            record.silicon, record.brand,
            record.model, record.memory,
            record.formFactor, record.ports, record.partNumbers
        ]).count();

    let saveId = null
    await gpuDB.transaction('rw', [gpuDB.record, gpuDB.stock], async () => {
        if (!hasRecord) {
            await gpuDB.record.add(record)
        }
        newStock.date = getDateString(newStock.date)
        newStock.defect = arrayToString(newStock.defect)
        saveId = await gpuDB.stock.add(newStock);
    });

    return saveId
}

export async function addNewPartNumber(number) {
    await gpuDB.partNumber.add({ name: number });
}

export async function addNewModel(model, silicon) {
    await gpuDB.model.add({ name: model, silicon: silicon });
}

export function parseModelFromString(string) {
    const parseArray = string.split(":");
    if (parseArray.length === 2) {
        const modelName = parseArray[1].trim();
        const silicon = parseArray[0].trim();

        return { name: modelName, silicon: silicon }
    }

    return null;
}

export async function getAllModels(callback) {
    return await gpuDB.model.toArray(callback)
}

export function parsePortsStringToObjectArray(string) {
    const portsObjectArray = [];
    if (string) {
        const ports = string.split(",")
        ports.map((port) => {
            const parePort = port.split("x");
            if (parePort.length === 2) {
                let n = 0;
                while (n < parseInt(parePort[0].trim())) {
                    portsObjectArray.push({ type: parePort[1].trim(), active: true, key: randomId() });
                    n++;
                }
            } else {
                portsObjectArray.push({ type: parePort[0].trim(), active: true, key: randomId() });
            }
        });

    }
    return portsObjectArray;
}

function parsePortsObjectToString(portsObject) {
    let ports = {};
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
                portsArray.push(port)
            } else {
                portsArray.push(`${ports[port]} x ${port}`)
            }
        }
    }

    return portsArray.join(",");
}

function getDateString(date) {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}
