import { useLiveQuery } from "dexie-react-hooks";
import csvDownload from "json-to-csv-export";
import Papa from "papaparse";
import { useCallback, useContext, useState } from "react";

import { Button, FileButton, Group } from "@mantine/core";
import { IconFileExport, IconFileImport } from "@tabler/icons-react";

import { ReactTable } from "../../../../common/data/ReactTable";
import { getCurrentDate } from "../../../../common/Helps";
import { dataServiceContext } from "../database/DataserviceContext";

const List: React.FC = () => {
	const dataService = useContext(dataServiceContext);
	const [disableExport, setDisableExport] = useState(true);

	const columns = [
		{
			Header: "ID",
			accessor: "id",
		},
		{
			Header: "silicon",
			accessor: "silicon",
		},
		{
			Header: "brand",
			accessor: "brand",
		},
		{
			Header: "model",
			accessor: "model",
		},
		{
			Header: "memory",
			accessor: "memory",
		},
		{
			Header: "formFactor",
			accessor: "formFactor",
		},
		{
			Header: "ports",
			accessor: "ports",
		},
		{
			Header: "partNumbers",
			accessor: "partNumbers",
		},
		{
			Header: "date",
			accessor: "date",
		},
		{
			Header: "state",
			accessor: "state",
		},
		{
			Header: "status",
			accessor: "status",
		},
		{
			Header: "defect",
			accessor: "defect",
		},
	];

	const data = useLiveQuery(() => {
		return dataService?.getStocks().then((result) => {
			setDisableExport(false);
			return result;
		});
	}, []);

	const onBtnImportCSV = useCallback((file: any) => {
		if (file) {
			Papa.LocalChunkSize = 1024;
			Papa.parse(file, {
				header: true,
				skipEmptyLines: true,
				step: function (results, parser) {
					parser.pause();
					//todo use queue to bulk add recod by chunk.
					// console.log("Row parse data:", results.data.map(everyRow => createStockByOldData(everyRow)));
					// createStockByOldData(results.data);
					// parser.abort()
					parser.resume();
				},
				// complete: function (results) {
				//     stockBulkSave(results.data.map(everyRow => createStockByOldData(everyRow)));
				// }
			});
		}
	}, []);

	function getExportMetaData() {
		return {
			data: data ?? [],
			filename: "GPU_list_" + getCurrentDate(),
			delimiter: ",",
		};
	}

	return (
		<>
			<Group position="center" sx={{ padding: 15 }}>
				<Button
					leftIcon={<IconFileExport size="1rem" />}
					variant="gradient"
					gradient={{ from: "orange", to: "red" }}
					disabled={disableExport}
					onClick={() => csvDownload(getExportMetaData())}
				>
					Export Data
				</Button>
				<FileButton onChange={onBtnImportCSV} accept=".csv">
					{(props) => (
						<Button
							{...props}
							leftIcon={<IconFileImport size="1rem" />}
							variant="gradient"
							gradient={{ from: "indigo", to: "cyan" }}
						>
							Import Stocks from CSV file
						</Button>
					)}
				</FileButton>
			</Group>
			<ReactTable data={data ?? []} column={columns} />
		</>
	);
};

export default List;
