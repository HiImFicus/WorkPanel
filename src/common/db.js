import Dexie from 'dexie';

// db.isOpen
// db.open
// db.close
const gpuDB = new Dexie('GPUWork');
gpuDB.version(1).stores({
    silicon: '++id, &name',
    makerBrand: '++id, &name',
    series: '++id, [name+silicon]',
    modelNumber: '++id, [name+series]',
    memorySize: '++id, &name',
    formFactor: '++id, &name',
    port: '++id, &name',
    partNumber: '++id, &name',
    record: '++id, [silicon+brand+model+memory+formFactor+ports], *partNumbers',
    stock: '++id, silicon, brand, model, memory, formFactor, ports, *partNumbers, date',
});

//clear every table when refresh
// gpuDB.tables.map((table) => table.clear())
// Dexie.delete('GPUWork');

export { gpuDB };
