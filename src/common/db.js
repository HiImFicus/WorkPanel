import Dexie from 'dexie';

// db.isOpen
// db.open
// db.close
const gpuDB = new Dexie('GPUWork');
gpuDB.version(1).stores({
    silicon: '++id, &name',
    makerBrand: '++id, &name',
    model: '++id, [name+silicon]',
    memorySize: '++id, &name',
    formFactor: '++id, &name',
    port: '++id, &name',
    partNumber: '++id, &name',
    record: '++id, [silicon+brand+model+memory+formFactor+ports+partNumbers]',
    stock: '++id, silicon, brand, model, memory, formFactor, ports, partNumbers, date, selfState, status, defect',
});

//clear every table when refresh
gpuDB.tables.map((table) => table.clear())
// Dexie.delete('GPUWork');

export { gpuDB };
