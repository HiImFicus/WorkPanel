import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import { useLiveQuery } from "dexie-react-hooks";
import Papa from "papaparse";
import { useContext, useMemo, useState } from "react";

import { Accordion, Button, Group } from "@mantine/core";

import {
	Stock,
	stockSelfStateBad,
	stockSelfStateGood,
} from "../database/Database";
import { dataServiceContext } from "../database/DataserviceContext";

//todo
// const uniqueCardsList = [];
// const countCardsList = [];
// const totalCards = [];
// const date = [];

function Overview() {
	const dataService = useContext(dataServiceContext);
	const [reportUrl, setReportUrl] = useState("");
	const [disableExport, setDisableExport] = useState(true);

	const stocks = useLiveQuery(() => dataService?.getStocks());

	const allModels = stocks?.map((stock) => stock.model);
	const uniqueModel = allModels?.filter(
		(item, index) => allModels.indexOf(item) === index
	);
	const allPartNumbers = stocks
		?.map((stock: Stock) => stock.partNumbers.split(","))
		.flatMap((e) => e);
	const uniquePartNumbers = allPartNumbers?.filter(
		(item, index) => item && allPartNumbers.indexOf(item) === index
	);

	const totalReports = [
		{
			total: stocks?.length,
			working: stocks?.filter((stock) => stock.state === stockSelfStateGood)
				.length,
			broken: stocks?.filter((stock) => stock.state === stockSelfStateBad)
				.length,
			inStock: stocks?.filter(
				(stock) => stock.status === "in" && stock.state === stockSelfStateGood
			).length,
			out: stocks?.filter(
				(stock) => stock.status === "out" && stock.state === stockSelfStateGood
			).length,
			PNCount: uniquePartNumbers?.length,
			modelCount: uniqueModel?.length,
		},
	];

	const [totalReportsColumns, setTotalReportsColumns] = useState([
		{ field: "total", headerName: "GPU Total", filter: true },
		{ field: "working", filter: true },
		{ field: "broken", filter: true },
		{ field: "inStock", filter: true },
		{ field: "out" },
		{ field: "PNCount", headerName: "Part # Count" },
		{ field: "modelCount" },
	]);

	const uniqueModelStockReports = uniqueModel?.map((model) => {
		return {
			model: model,
			total: stocks?.filter((stock) => stock.model === model).length,
			working: stocks?.filter(
				(stock) => stock.model === model && stock.state === stockSelfStateGood
			).length,
			broken: stocks?.filter(
				(stock) => stock.model === model && stock.state === stockSelfStateBad
			).length,
			inStock: stocks?.filter(
				(stock) =>
					stock.model === model &&
					stock.status === "in" &&
					stock.state === stockSelfStateGood
			).length,
			standby: stocks?.filter(
				(stock) =>
					stock.model === model &&
					stock.status === "in" &&
					stock.state === stockSelfStateGood &&
					stock.defect === ""
			).length,
			defect: stocks?.filter(
				(stock) => stock.model === model && stock.defect !== ""
			).length,
			out: stocks?.filter(
				(stock) =>
					stock.model === model &&
					stock.status === "out" &&
					stock.state === stockSelfStateGood
			).length,
		};
	});

	const defaultColDef = useMemo(
		() => ({
			sortable: true,
		}),
		[]
	);

	const [uniqueModelStockReportsColumns, setUniqueModelStockReportsColumns] =
		useState([
			{ field: "model", filter: true },
			{ field: "standby", filter: true },
			{ field: "total", filter: true },
			{ field: "working", filter: true },
			{ field: "broken", filter: true },
			{ field: "inStock", filter: true },
			{ field: "defect", filter: true },
			{ field: "out", filter: true },
		]);

	const allDate = stocks?.map((stock) => stock.date);
	const uniqueDate = allDate?.filter(
		(item, index) => allDate.indexOf(item) === index
	);
	const dateReport = uniqueDate?.map((date) => {
		return {
			date: date,
			total: stocks?.filter((stock) => stock.date === date).length,
			working: stocks?.filter(
				(stock) => stock.date === date && stock.state === stockSelfStateGood
			).length,
			broken: stocks?.filter(
				(stock) => stock.date === date && stock.state === stockSelfStateBad
			).length,
			inStock: stocks?.filter(
				(stock) =>
					stock.date === date &&
					stock.status === "in" &&
					stock.state === stockSelfStateGood
			).length,
			out: stocks?.filter(
				(stock) =>
					stock.date === date &&
					stock.status === "out" &&
					stock.state === stockSelfStateGood
			).length,
		};
	});

	const [dateReportColumns, setDateReportColumns] = useState([
		{ field: "date", filter: true },
		{ field: "total", filter: true },
		{ field: "working", filter: true },
		{ field: "broken", filter: true },
		{ field: "inStock", filter: true },
		{ field: "out", filter: true },
	]);

	function getReportUrl() {
		const spreadSymbol = "\r\n\r\n-,-,-,-,-,-,-,-,-,-,-,-\r\n\r\n";
		const data = [
			Papa.unparse(totalReports),
			spreadSymbol,
			Papa.unparse(uniqueModelStockReports ?? []),
			spreadSymbol,
			Papa.unparse(dateReport ?? []),
			spreadSymbol,
			Papa.unparse(stocks ?? []),
		];
		console.log(data);
		const blob = new Blob(data, { type: "text/csv;charset=utf-8," });
		return URL.createObjectURL(blob);
	}

	return (
		<>
			<Group position="center">
				<Button
					onClick={() => {
						setReportUrl(getReportUrl());
						setDisableExport(false);
					}}
				>
					Prepare
				</Button>
				<Button
					disabled={disableExport}
					component="a"
					href={reportUrl}
					download="GPUReports.csv"
				>
					Export all reports.
				</Button>
			</Group>
			<Accordion defaultValue="report1">
				<Accordion.Item value="report1">
					<Accordion.Control>Total Report</Accordion.Control>
					<Accordion.Panel>
						{/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
						<div
							className="ag-theme-alpine"
							style={{ width: 1000, height: 200 }}
						>
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
						<div
							className="ag-theme-alpine"
							style={{ width: 1000, height: 500 }}
						>
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
						<div
							className="ag-theme-alpine"
							style={{ width: 1000, height: 500 }}
						>
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

export default Overview;
