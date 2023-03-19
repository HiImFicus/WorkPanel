import { useEffect, useState } from "react";

import {
	ActionIcon,
	Button,
	createStyles,
	Grid,
	Group,
	Highlight,
	List,
	Mark,
	MultiSelect,
	RingProgress,
	SegmentedControl,
	Select,
	SimpleGrid,
	Switch,
	Text,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";

import { gpuDB } from "./Database";
import {
	addNewModel,
	addNewPartNumber,
	getAllModels,
	parseModelFromString,
	parsePortsStringToObjectArray,
	stockDefectMap,
	stockSaveFromAdd,
	stockSelfStateBad,
	stockSelfStateGood,
	stockStatusInStock,
	stockStatusOut,
} from "./DBManager";

const selfStateMap = [
	{ label: "still-working", value: stockSelfStateGood },
	{ label: "broken", value: stockSelfStateBad },
];

const statusMap = [
	{ label: "into-stock", value: stockStatusInStock },
	{ label: "out", value: stockStatusOut },
];

const useStyles = createStyles((theme) => ({
	wrapper: {
		backgroundImage: `linear-gradient(-60deg, ${
			theme.colors[theme.primaryColor][4]
		} 0%, ${theme.colors[theme.primaryColor][7]} 100%)`,
		padding: theme.spacing.xl * 1.5,

		[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
			padding: theme.spacing.xl * 0.8,
		},
	},

	text: {
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		color: theme.white,
	},
}));

function Add() {
	const { classes } = useStyles();
	const [defectData, setDefectData] = useState(stockDefectMap);

	const [recordData, setRecordData] = useState([]);
	const [siliconData, setSiliconData] = useState([]);
	const [brandData, setBrandData] = useState([]);
	const [modelData, setModelData] = useState([]);
	const [memoryData, setMemoryData] = useState([]);
	const [formFactorData, setFormFactorData] = useState([]);
	const [portData, setPortData] = useState([]);
	const [partNumberData, setPartNumberData] = useState([]);

	function getNameArrayFromObjectArray(results) {
		if (results) {
			return results.map((item) => {
				if (item.silicon) {
					return { value: item.name, label: item.name, group: item.silicon };
				}
				return { value: item.name, label: item.name };
			});
		}
		return [];
	}

	useEffect(() => {
		async function setDefaultData() {
			setSiliconData(await gpuDB.silicon.toArray(getNameArrayFromObjectArray));
			setBrandData(await gpuDB.makerBrand.toArray(getNameArrayFromObjectArray));
			setMemoryData(
				await gpuDB.memorySize.toArray(getNameArrayFromObjectArray)
			);
			setModelData(await gpuDB.model.toArray(getNameArrayFromObjectArray));
			setFormFactorData(
				await gpuDB.formFactor.toArray(getNameArrayFromObjectArray)
			);
			setPortData(await gpuDB.port.toArray(getNameArrayFromObjectArray));
			setPartNumberData(
				await gpuDB.partNumber.toArray(getNameArrayFromObjectArray)
			);
			setRecordData(
				await gpuDB.record.toArray((records) => {
					if (records) {
						return records.map((record) => {
							return {
								value: `${record.silicon}%${record.brand}%${record.model}%${record.memory}%${record.formFactor}%${record.ports}%${record.partNumbers}`,
								label: `${record.brand}-${record.model}-${record.memory}-${record.formFactor}-${record.ports}-${record.partNumbers}`,
								group: record.silicon,
							};
						});
					}
					return [];
				})
			);
		}

		setDefaultData();
		return () => {
			setSiliconData([]);
			setBrandData([]);
			setModelData([]);
			setMemoryData([]);
			setFormFactorData([]);
			setPortData([]);
			setPartNumberData([]);
			setRecordData([]);
		};
	}, []);

	function createNewPartNumberData(newNumber) {
		const item = { value: newNumber, label: newNumber };
		//upate to db
		addNewPartNumber(newNumber);
		setPartNumberData((current) => [...current, item]);
		return item;
	}

	function createNewModel(newModel) {
		const model = parseModelFromString(newModel);
		if (model) {
			//upate to db
			addNewModel(model.name, model.silicon);
			const item = {
				value: model.name,
				label: model.name,
				group: model.silicon,
			};
			setModelData((current) => [...current, item]);
			return item;
		}
	}

	const form = useForm({
		initialValues: {
			silicon: "",
			brand: "",
			model: "",
			memory: "",
			formFactor: "",
			defect: "",
			date: new Date(),
			selfState: stockSelfStateGood,
			status: stockStatusInStock,
			ports: [
				// { type: '', active: true, key: randomId() }
			],
			partNumbers: [],
		},
		validate: {
			silicon: isNotEmpty("required"),
			brand: isNotEmpty("required"),
			model: isNotEmpty("required"),
			memory: isNotEmpty("required"),
			formFactor: isNotEmpty("required"),
			date: isNotEmpty("required"),
			selfState: isNotEmpty("required"),
			status: isNotEmpty("required"),
		},
	});

	function changeSiliconChangeModelData(silicon) {
		let modelData = getAllModels(getNameArrayFromObjectArray);

		if (silicon) {
			modelData = modelData.then((results) =>
				results.filter((item) => item.group === silicon)
			);
		}

		modelData.then((results) => setModelData(results));
		form.setFieldValue("model", "");
		form.setFieldValue("silicon", silicon);
	}

	const portsFields = form.values.ports.map((item, index) => (
		<Group key={item.key} mt="xs">
			<Select
				placeholder="Pick one"
				data={portData}
				{...form.getInputProps(`ports.${index}.type`)}
				nothingFound="No options"
				clearable
				searchable
			/>
			<Switch
				label="Active"
				{...form.getInputProps(`ports.${index}.active`, { type: "checkbox" })}
			/>
			<ActionIcon
				color="red"
				onClick={() => form.removeListItem("ports", index)}
			>
				<IconTrash size={16} />
			</ActionIcon>
		</Group>
	));

	const circleSize = 120;
	const circleThickness = 10;

	function setValueByTemplate(templateString) {
		if (!templateString) {
			form.reset();
			return;
		}
		const template = templateString.split("%");
		if (template.length === 7) {
			form.setValues({
				silicon: template[0],
				brand: template[1],
				model: template[2],
				memory: template[3],
				formFactor: template[4],
				ports: parsePortsStringToObjectArray(template[5]),
				partNumbers: template[6].split(",").map((item) => item.trim()),
			});
		} else {
			form.reset();
		}
	}

	async function save() {
		try {
			//check form data

			stockSaveFromAdd(form.values).then((newId) => console.log(newId));
		} catch (error) {
			throw error;
		}
	}

	return (
		<form
			onSubmit={form.onSubmit(() => {
				save();
			})}
		>
			<Grid grow>
				<Grid.Col span={12} className={classes.wrapper}>
					<Grid className={classes.text} align="center" justify="space-between">
						<Grid.Col span={5}>
							<List className={classes.text}>
								<List.Item>2/28/2023:</List.Item>
								<List.Item>
									<Highlight highlight={["40", "can work", "non-working"]}>
										40 can work
									</Highlight>
								</List.Item>
								<List.Item>40 non-working</List.Item>
							</List>
						</Grid.Col>
						<Grid.Col span={5}>
							<List className={classes.text}>
								<List.Item>
									Last Record: <Mark color="red">Rx 430</Mark>, 1.
								</List.Item>
								<List.Item>Number:</List.Item>
							</List>
						</Grid.Col>
						<Grid.Col span={2}>
							<RingProgress
								size={circleSize}
								thickness={circleThickness}
								label={
									<Text
										size="xs"
										align="center"
										px="xs"
										sx={{ pointerEvents: "none" }}
									>
										Total: 500
									</Text>
								}
								sections={[
									{ value: 40, color: "cyan", tooltip: "Documents - 40 Gb" },
									{ value: 25, color: "orange", tooltip: "Apps - 25 Gb" },
									{ value: 15, color: "grape", tooltip: "Other - 15 Gb" },
								]}
							/>
						</Grid.Col>
					</Grid>
				</Grid.Col>
				<Grid.Col span={12}>
					<Select
						label="RECORD TEMPLATE"
						placeholder="Pick one"
						data={recordData}
						clearable
						searchable
						onChange={setValueByTemplate}
					/>
				</Grid.Col>
				<Grid.Col span={6}>
					<Select
						label="SILICON"
						placeholder="Pick one"
						data={siliconData}
						{...form.getInputProps("silicon")}
						onChange={changeSiliconChangeModelData}
						clearable
					/>
				</Grid.Col>
				<Grid.Col span={6}>
					<Select
						label="BRAND"
						placeholder="Pick one"
						data={brandData}
						{...form.getInputProps("brand")}
						clearable
						searchable
					/>
				</Grid.Col>
				<Grid.Col span={12}>
					<Select
						label="MODEL CODE"
						placeholder="Pick one"
						data={modelData}
						{...form.getInputProps("model")}
						clearable
						searchable
						creatable
						getCreateLabel={(query) =>
							`+ Create ${query}, Format: Silicon: Model Code`
						}
						onCreate={createNewModel}
					/>
				</Grid.Col>
				<Grid.Col span={6}>
					<Select
						label="MEMORY"
						placeholder="Pick one"
						data={memoryData}
						{...form.getInputProps("memory")}
						clearable
						searchable
					/>
				</Grid.Col>
				<Grid.Col span={6}>
					<Select
						label="FORM FACTOR"
						placeholder="Pick one"
						data={formFactorData}
						{...form.getInputProps("formFactor")}
						clearable
					/>
				</Grid.Col>
				<Grid.Col span={6}>
					<DatePickerInput
						placeholder="Pick date"
						label="TEST DATE"
						labelFormat="MM/YYYY"
						{...form.getInputProps("date")}
					/>
				</Grid.Col>
				<Grid.Col span={6}>
					<Grid>
						<Grid.Col span={6}>
							{form.errors.selfState ? (
								<Text fz="sm" fw={500} c="red">
									STATE*
								</Text>
							) : (
								<Text fz="sm" fw={500}>
									STATE
								</Text>
							)}
							<SegmentedControl
								fullWidth
								data={selfStateMap}
								{...form.getInputProps("selfState")}
							/>
						</Grid.Col>
						<Grid.Col span={6}>
							{form.errors.status ? (
								<Text fz="sm" fw={500} c="red">
									STATUS*
								</Text>
							) : (
								<Text fz="sm" fw={500}>
									STATUS
								</Text>
							)}
							<SegmentedControl
								fullWidth
								data={statusMap}
								{...form.getInputProps("status")}
							/>
						</Grid.Col>
					</Grid>
				</Grid.Col>
				<Grid.Col span={12}>
					{/* <Group position="center" mt="md"> */}
					<Group mt="md">
						<Button
							onClick={() =>
								form.insertListItem("ports", {
									type: "",
									active: true,
									key: randomId(),
								})
							}
						>
							Add Port
						</Button>
					</Group>
					<SimpleGrid
						cols={2}
						spacing="lg"
						breakpoints={[{ maxWidth: "xs", cols: 1, spacing: "sm" }]}
					>
						{portsFields}
					</SimpleGrid>
				</Grid.Col>

				<Grid.Col span={12}>
					<MultiSelect
						label="PART #"
						data={partNumberData}
						placeholder="Select #"
						searchable
						creatable
						getCreateLabel={(query) => `+ Create ${query}`}
						onCreate={createNewPartNumberData}
						{...form.getInputProps("partNumbers")}
					/>
				</Grid.Col>

				<Grid.Col span={12}>
					<MultiSelect
						label="DEFECT"
						data={defectData}
						placeholder=""
						searchable
						creatable
						getCreateLabel={(query) => `+ Create ${query}`}
						onCreate={(query) => {
							const item = { value: query, label: query };
							setDefectData((current) => [...current, item]);
							return item;
						}}
						{...form.getInputProps("defect")}
					/>
				</Grid.Col>

				<Grid.Col span={4}>
					<Group position="center" mt="xl">
						<Button type="submit" size="md">
							Sumbit
						</Button>
					</Group>
				</Grid.Col>
			</Grid>
		</form>
	);
}

export default Add;
