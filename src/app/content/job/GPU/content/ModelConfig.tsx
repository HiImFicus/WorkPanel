import { useLiveQuery } from "dexie-react-hooks";
import csvDownload from "json-to-csv-export";
import Papa from "papaparse";
import { useEffect, useState } from "react";

import {
	Button,
	Card,
	Divider,
	FileButton,
	Group,
	Select,
	SimpleGrid,
	Table,
	TextInput,
	Title,
} from "@mantine/core";

// import { gpuDB } from "./database/Database";

interface ModelConfigProps {
	tableName: string;
	dependTableName: string;
	label: string;
}

function ModelConfig({ dependTableName, tableName, label }: ModelConfigProps) {
	const dependTable = gpuDB.table(dependTableName);
	const [selectData, setSelectData] = useState<
		{ value: string; label: string }[]
	>([]);
	const [isAvailable, setIsAvailable] = useState(false);

	useEffect(() => {
		async function getDependData() {
			return await dependTable.toArray();
		}
		getDependData()
			.then((result) => {
				let currentValue: string[] = [];
				let newData: { value: string; label: string }[] = [];
				result.map(
					(element) => {
						if (!currentValue.includes(element.name)) {
							currentValue.push(element.name);
							newData.push({ value: element.name, label: element.name });
						}
					},
					[currentValue, newData]
				);
				return newData;
			})
			.then((result) => {
				setSelectData(result);
				if (result.length) {
					setIsAvailable(true);
				}
			});
		return () => {
			setIsAvailable(false);
			setSelectData([]);
		};
	}, []);

	const table = gpuDB.table(tableName);
	const data = useLiveQuery(async () => table.toArray());
	const [value, setValue] = useState("");
	const [dependValue, setDependValue] = useState("");

	async function addValueToDB() {
		try {
			if (value?.trim() === "" || dependValue?.trim() === "") return;
			//check duplicate
			const count = await table
				.where(`[name+${dependTableName}]`)
				.equals([value, dependValue])
				.count();
			if (count) return;

			let newData = { name: value };
			(newData as any)[dependTableName] = dependValue;
			await table.add(newData);
			console.log("Success saved!");
		} catch (error) {
			throw error;
		}
	}

	async function clearTable() {
		try {
			if (data?.length) {
				await table.clear();
				console.log("Success cleared!");
			}
		} catch (error) {
			throw error;
		}
	}

	function toCVS() {
		if (data?.length) {
			const currentDate = new Date();
			const filename = `Ficus_GPU_Work_Config_${label}_${
				currentDate.getMonth() + 1
			}-${currentDate.getDate()}-${currentDate.getFullYear()}`;
			const dataToConvert = {
				data: data,
				filename: filename,
				delimiter: ",",
			};

			return csvDownload(dataToConvert);
		}
	}

	function handleFile(file: File) {
		if (file) {
			Papa.parse(file, {
				header: true,
				skipEmptyLines: true,
				complete: async function (results) {
					await gpuDB.transaction("rw", [table], async () => {
						await table.clear();
						await table.bulkAdd(results.data);
					});
				},
			});
		}
	}

	async function deleteOne(id?: number) {
		try {
			if (id) {
				await table.delete(id);
				console.log("Success deleted!");
			}
		} catch (error) {
			throw error;
		}
	}

	return (
		<Card shadow="md" p="md" withBorder>
			<Card.Section>
				<Table horizontalSpacing="xl" verticalSpacing="xs" highlightOnHover>
					<caption>
						<Title order={1}>{label} list</Title>
					</caption>
					<thead>
						<tr>
							<th>id</th>
							<th>name</th>
							<th>{dependTableName}</th>
							<th>action</th>
						</tr>
					</thead>
					<tbody>
						{data?.length ? (
							data?.map((element) => (
								<tr key={element.id}>
									<td>{element.id}</td>
									<td>{element.name}</td>
									<td>{element[dependTableName]}</td>
									<td>
										<Button
											compact
											color="red"
											onClick={() => {
												deleteOne(element.id);
											}}
										>
											Remove
										</Button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={4}>No data</td>
							</tr>
						)}
					</tbody>
				</Table>
				<Divider mb={10} />
			</Card.Section>

			{isAvailable && (
				<>
					<SimpleGrid
						cols={2}
						breakpoints={[{ maxWidth: 600, cols: 1, spacing: "sm" }]}
					>
						<div>
							<TextInput
								placeholder="type new one"
								label={label}
								value={value}
								onChange={(event) => setValue(event.currentTarget.value)}
							/>
						</div>
						<div>
							<Select
								label={dependTableName}
								value={dependValue}
								onChange={setDependValue}
								data={selectData}
							/>
						</div>
					</SimpleGrid>
					<Button.Group mt={10}>
						<Button onClick={toCVS}>Download</Button>
						<Group position="center">
							<FileButton onChange={handleFile} accept=".csv">
								{(props) => <Button {...props}>Overwrite by File</Button>}
							</FileButton>
						</Group>
						<Button onClick={addValueToDB}>Add</Button>
						<Button onClick={clearTable} color="dark">
							Clear
						</Button>
					</Button.Group>
				</>
			)}
		</Card>
	);
}

export default ModelConfig;
