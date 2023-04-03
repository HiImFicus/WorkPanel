import { useLiveQuery } from "dexie-react-hooks";
import csvDownload from "json-to-csv-export";
import Papa from "papaparse";
import { useCallback, useContext, useState } from "react";
import { Link } from "react-router-dom";

import {
	Box,
	Button,
	FileButton,
	Group,
	LoadingOverlay,
	Modal,
	Stack,
	Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDatabaseImport, IconFileExport, IconX } from "@tabler/icons-react";

import { ReactTable } from "../../../../common/data/ReactTable";
import { getCurrentDate } from "../../../../common/Helps";
import { dataServiceContext } from "../database/DataserviceContext";

const List: React.FC = () => {
	const dataService = useContext(dataServiceContext);
	const [disableExport, setDisableExport] = useState(true);
	const [visible, setVisible] = useState(false);
	const [openedDelete, { open, close }] = useDisclosure(false);
	const [selectDeleteId, setSelectDeleteId] = useState(null);

	const columns = [
		{
			Header: "ID",
			accessor: "id",
			sortable: true,
			Cell: ({ value }) => (
				<Link to={"/gpu/" + value}>
					<Button variant="light" color="indigo">
						{value}
					</Button>
				</Link>
			),
		},
		{
			Header: "silicon",
			accessor: "silicon",
			sortable: true,
		},
		{
			Header: "brand",
			accessor: "brand",
			sortable: true,
		},
		{
			Header: "model",
			accessor: "model",
			sortable: true,
		},
		{
			Header: "memory",
			accessor: "memory",
			sortable: true,
		},
		{
			Header: "formFactor",
			accessor: "formFactor",
			sortable: true,
		},
		{
			Header: "ports",
			accessor: "ports",
			sortable: true,
		},
		{
			Header: "partNumbers",
			accessor: "partNumbers",
			sortable: true,
		},
		{
			Header: "date",
			accessor: "date",
			sortable: true,
		},
		{
			Header: "state",
			accessor: "state",
			sortable: true,
		},
		{
			Header: "status",
			accessor: "status",
			sortable: true,
		},
		{
			Header: "defect",
			accessor: "defect",
			sortable: true,
		},
		{
			Header: "Action",
			Cell: ({ row }) => (
				<Button
					size="10"
					compact
					color="red"
					onClick={() => {
						setSelectDeleteId(row.original.id);
						open();
					}}
				>
					<IconX />
				</Button>
			),
		},
	];

	function onDelete() {
		if (selectDeleteId) {
			dataService?.removeStock(selectDeleteId).then(() => close());
		}
	}

	const data = useLiveQuery(() => {
		return dataService?.getStocks().then((result) => {
			if (result.length > 0 && disableExport) {
				setDisableExport(false);
			}
			return result;
		});
	}, []);

	const papaConfig = {
		header: true,
		skipEmptyLines: true,
		chunk: (results: any, parser: any) => {
			// parser.abort();
			parser.pause();
			dataService
				?.bulkAddStockFromImport(results.data)
				.catch((error) => console.log(error.message));
			parser.resume();
		},
		// chunkSize: 10240,
		complete: function () {
			setVisible(false);
		},
	};

	const onBtnImportCSV = useCallback((file: any) => {
		if (file) {
			setVisible(true);
			// Papa.LocalChunkSize = 10240;
			Papa.parse(file, papaConfig);
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
		<Stack>
			<Modal opened={openedDelete} onClose={close} title="Delete" centered>
				<Text>Are you sure you want to Delete id: {selectDeleteId} ?</Text>

				<Button color="dark" onClick={onDelete}>
					Confirm
				</Button>
				<Button color="gray" onClick={close} ml={20}>
					Cancel
				</Button>
			</Modal>
			<Box pos="relative">
				<LoadingOverlay visible={visible} overlayBlur={2} />
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
								leftIcon={<IconDatabaseImport size="1rem" />}
								variant="gradient"
								gradient={{ from: "indigo", to: "cyan" }}
							>
								Import Stocks from CSV file
							</Button>
						)}
					</FileButton>
				</Group>
				<ReactTable data={data ?? []} column={columns} />
			</Box>
		</Stack>
	);
};

export default List;
