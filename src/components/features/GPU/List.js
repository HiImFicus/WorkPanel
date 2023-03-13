import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { gpuDB } from '../../../common/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { FileButton, Button, Group } from '@mantine/core';
import Papa from "papaparse";
import { createStockByOldData } from './DBManager';



// import { useState } from 'react';

function List() {
    const stocks = useLiveQuery(
        () => gpuDB.stock.toArray()
    );

    const gridRef = useRef(); // Optional - for accessing Grid's API
    // Each Column Definition results in one Column.
    const [columnDefs, setColumnDefs] = useState([
        { field: 'silicon', filter: true },
        { field: 'brand', filter: true },
        { field: 'model', filter: true },
        { field: 'memory', filter: true },
        { field: 'formFactor' },
        { field: 'ports', filter: true },
        { field: 'partNumbers', filter: true },
        { field: 'date', filter: true },
        { field: 'selfState', filter: true },
        { field: 'status', filter: true },
        { field: 'defect' },
    ]);

    //todo learn
    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo(() => ({
        sortable: true
    }));

    // Example of consuming Grid Event
    const cellClickedListener = useCallback(event => {
        console.log('cellClicked', event);
    }, []);

    // Example using Grid's API
    // const buttonListener = useCallback(e => {
    //     gridRef.current.api.deselectAll();
    // }, []);

    const onBtnExport = useCallback(() => {
        gridRef.current.api.exportDataAsCsv();
    }, []);

    const onBtnImportCSV = useCallback((file) => {
        if (file) {
            Papa.LocalChunkSize = 1024;
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                step: function (results, parser) {
                    parser.pause()
                    //todo use queue to bulk add recod by chunk.
                    // console.log("Row parse data:", results.data.map(everyRow => createStockByOldData(everyRow)));
                    createStockByOldData(results.data);
                    // parser.abort()
                    parser.resume()
                },
                // complete: function (results) {
                //     stockBulkSave(results.data.map(everyRow => createStockByOldData(everyRow)));
                // }
            });
        }
    }, [])

    return (
        <>
            <div>

                {/* Example using Grid's API */}
                <Button onClick={onBtnExport}>
                    Download CSV export file
                </Button>
                <Group position="center">
                    <FileButton onChange={onBtnImportCSV} accept=".csv">
                        {(props) => <Button {...props}>Import Stocks from CSV file</Button>}
                    </FileButton>
                </Group>

                {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
                <div className="ag-theme-alpine" style={{ width: 1000, height: 500 }}>

                    <AgGridReact
                        ref={gridRef} // Ref for accessing Grid's API

                        rowData={stocks} // Row Data for Rows

                        columnDefs={columnDefs} // Column Defs for Columns
                        defaultColDef={defaultColDef} // Default Column Properties

                        animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                        rowSelection='multiple' // Options - allows click selection of rows

                        onCellClicked={cellClickedListener} // Optional - registering for Grid Event
                    />
                </div>
            </div>
        </>
    );
}

export default List
