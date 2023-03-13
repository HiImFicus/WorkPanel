import { Accordion, Button, Group } from '@mantine/core';

import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { gpuDB } from '../../../common/db';
import { useLiveQuery } from 'dexie-react-hooks';
import Papa from "papaparse";


//todo
// const uniqueCardsList = [];
// const countCardsList = [];
// const totalCards = [];
// const date = [];

function Overview() {
    // const [uniqueModelData, setUniqueModelData] = useState([]);
    const stocks = useLiveQuery(
        () => gpuDB.stock.toArray()
    );

    const allModels = stocks?.map(stock => stock.model);
    const totalReports = [{
        total: stocks?.length,
        canWork: stocks?.filter(stock => stock.selfState === "still-work").length,
        broken: stocks?.filter(stock => stock.selfState === "broken").length,
        inStock: stocks?.filter(stock => stock.status === "in" && stock.selfState === "still-work").length,
        out: stocks?.filter(stock => stock.status === "out").length,
    }]

    const [totalReportsColumns, setTotalReportsColumns] = useState([
        { field: 'total', filter: true },
        { field: 'canWork', filter: true },
        { field: 'broken', filter: true },
        { field: 'inStock', filter: true },
        { field: 'out' },
    ]);

    const uniqueModel = allModels?.filter((item, index) => allModels.indexOf(item) === index);
    const uniqueModelStockReports = uniqueModel?.map(model => {
        return {
            name: model,
            total: stocks?.filter(stock => stock.model === model).length,
            canWork: stocks?.filter(stock => stock.model === model && stock.selfState === "still-work").length,
            broken: stocks?.filter(stock => stock.model === model && stock.selfState === "broken").length,
            inStock: stocks?.filter(stock => stock.model === model && stock.status === "in" && stock.selfState === "still-work").length,
            out: stocks?.filter(stock => stock.model === model && stock.status === "out").length,
        }
    });

    const defaultColDef = useMemo(() => ({
        sortable: true
    }));

    const [uniqueModelStockReportsColumns, setUniqueModelStockReportsColumns] = useState([
        { field: 'name', filter: true },
        { field: 'total', filter: true },
        { field: 'canWork', filter: true },
        { field: 'broken', filter: true },
        { field: 'inStock', filter: true },
        { field: 'out', filter: true },
    ]);

    const allDate = stocks?.map(stock => stock.date);
    const uniqueDate = allDate?.filter((item, index) => allDate.indexOf(item) === index)
    const dateReport = uniqueDate?.map(date => {
        return {
            name: date,
            total: stocks?.filter(stock => stock.date === date).length,
            canWork: stocks?.filter(stock => stock.date === date && stock.selfState === "still-work").length,
            broken: stocks?.filter(stock => stock.date === date && stock.selfState === "broken").length,
            inStock: stocks?.filter(stock => stock.date === date && stock.status === "in" && stock.selfState === "still-work").length,
            out: stocks?.filter(stock => stock.date === date && stock.status === "out").length,
        }
    })

    const [dateReportColumns, setDateReportColumns] = useState([
        { field: 'name', filter: true },
        { field: 'total', filter: true },
        { field: 'canWork', filter: true },
        { field: 'broken', filter: true },
        { field: 'inStock', filter: true },
        { field: 'out', filter: true },
    ]);

    const [reportUrl, setReportUrl] = useState("");
    function getReportUrl() {
        if (totalReports && uniqueModelStockReports && dateReport && stocks) {
            const spreadSymbol = "\r\n\r\n-,-,-,-,-,-,-,-,-,-,-,-\r\n\r\n"
            const blob = new Blob([
                Papa.unparse(totalReports), spreadSymbol,
                Papa.unparse(uniqueModelStockReports), spreadSymbol,
                Papa.unparse(dateReport), spreadSymbol,
                Papa.unparse(stocks)
            ], { type: 'text/csv;charset=utf-8,' })
            return URL.createObjectURL(blob);
        }
    }

    useEffect(() => {
        setReportUrl(getReportUrl())
        return () => {
            setReportUrl("")
        }
    }, [])

    return (
        <>
            <Group position="center">
                <Button component="a" href={reportUrl} download="GPUReports.csv">
                    Export all reports.
                </Button>
            </Group>
            <Accordion defaultValue="report1">
                <Accordion.Item value="report1">
                    <Accordion.Control>Total Report</Accordion.Control>
                    <Accordion.Panel>
                        {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
                        <div className="ag-theme-alpine" style={{ width: 1000, height: 200 }}>
                            <AgGridReact
                                // ref={gridRef} // Ref for accessing Grid's API
                                rowData={totalReports} // Row Data for Rows
                                columnDefs={totalReportsColumns} // Column Defs for Columns
                                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                            // rowSelection='multiple' // Options - allows click selection of rows
                            />
                        </div>
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="report2">
                    <Accordion.Control>Report by Model</Accordion.Control>
                    <Accordion.Panel>
                        <div className="ag-theme-alpine" style={{ width: 1000, height: 500 }}>
                            <AgGridReact
                                // ref={gridRef} // Ref for accessing Grid's API
                                rowData={uniqueModelStockReports} // Row Data for Rows
                                columnDefs={uniqueModelStockReportsColumns} // Column Defs for Columns
                                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                                defaultColDef={defaultColDef} // Default Column Properties

                            // rowSelection='multiple' // Options - allows click selection of rows
                            />
                        </div>
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="report3">
                    <Accordion.Control>Report by Date</Accordion.Control>
                    <Accordion.Panel>
                        <div className="ag-theme-alpine" style={{ width: 1000, height: 500 }}>
                            <AgGridReact
                                // ref={gridRef} // Ref for accessing Grid's API
                                rowData={dateReport} // Row Data for Rows
                                columnDefs={dateReportColumns} // Column Defs for Columns
                                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                                defaultColDef={defaultColDef} // Default Column Properties

                            // rowSelection='multiple' // Options - allows click selection of rows
                            />
                        </div>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>

        </>
    );
}

export default Overview
