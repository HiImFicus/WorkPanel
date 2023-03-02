import { Accordion } from '@mantine/core';
import { useState, useRef, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { gpuDB } from '../../../common/db';
import { useLiveQuery } from 'dexie-react-hooks';


// import { useState } from 'react';

//todo
// const uniqueCardsList = [];
// const countCardsList = [];
// const totalCards = [];
// const date = [];

function Overview() {
    const stocks = useLiveQuery(
        () => gpuDB.stock.toArray()
    );

    console.log(stocks);
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
        { field: 'date' },
        { field: 'selfState' },
        { field: 'status' },
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
    const buttonListener = useCallback(e => {
        gridRef.current.api.deselectAll();
    }, []);


    return (
        <>
            <div>

                {/* Example using Grid's API */}
                <button onClick={buttonListener}>Push Me</button>

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
            <Accordion defaultValue="report1">
                <Accordion.Item value="report1">
                    <Accordion.Control>report1</Accordion.Control>
                    <Accordion.Panel>
                        listReport
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="report2">
                    <Accordion.Control>report2</Accordion.Control>
                    <Accordion.Panel>
                        report2
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="report3">
                    <Accordion.Control>Report3</Accordion.Control>
                    <Accordion.Panel>
                        test
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>

        </>
    );
}

export default Overview
