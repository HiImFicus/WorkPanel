import { useLiveQuery } from "dexie-react-hooks";
import { useContext, useEffect, useState } from "react";

import {
	ActionIcon,
	Affix,
	Button,
	createStyles,
	Grid,
	Group,
	List,
	MultiSelect,
	Notification,
	rem,
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

import {
	Stock,
	stockDefectMap,
	stockSelfStateBad,
	stockSelfStateGood,
	stockStatusInStock,
	stockStatusOut,
} from "../database/Database";
import { dataServiceContext } from "../database/DataserviceContext";

const selfStateMap = [
	{ label: "working", value: stockSelfStateGood },
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
	},

	text: {
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		color: theme.white,
	},
}));

function Add() {
	const { classes } = useStyles();
	const [defectData, setDefectData] = useState(stockDefectMap);

	const [recordData, setRecordData] = useState<
		{ value: string; label: string; group: string }[]
	>([]);
	const [siliconData, setSiliconData] = useState<
		{ value: string; label: string }[]
	>([]);
	const [brandData, setBrandData] = useState<
		{ value: string; label: string }[]
	>([]);
	const [modelData, setModelData] = useState<
		{ value: string; label: string }[]
	>([]);
	const [memoryData, setMemoryData] = useState<
		{ value: string; label: string }[]
	>([]);
	const [formFactorData, setFormFactorData] = useState<
		{ value: string; label: string }[]
	>([]);
	const [portData, setPortData] = useState<{ value: string; label: string }[]>(
		[]
	);
	const [partNumberData, setPartNumberData] = useState<
		{ value: string; label: string }[]
	>([]);
	const dataService = useContext(dataServiceContext);

	const [notification, setNotification] = useState({
		open: false,
		message: "",
		title: "",
		color: "blue",
	});

	const handleNotification = (
		message: string,
		title = "Default notification",
		color = "blue"
	) => {
		setNotification({ open: true, message, title, color });
		// setTimeout(() => {
		// 	setNotification({ open: false, message: "", color });
		// }, 3000);
	};

	function getNameArrayFromObjectArray(results: any[]): any[] {
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
		dataService?.getSilicons().then((results) => {
			setSiliconData(getNameArrayFromObjectArray(results));
		});
		dataService?.getBrands().then((results) => {
			setBrandData(getNameArrayFromObjectArray(results));
		});
		dataService?.getMemorySizes().then((results) => {
			setMemoryData(getNameArrayFromObjectArray(results));
		});
		dataService?.getModels().then((results) => {
			setModelData(getNameArrayFromObjectArray(results));
		});
		dataService?.getFormFactors().then((results) => {
			setFormFactorData(getNameArrayFromObjectArray(results));
		});
		dataService?.getPorts().then((results) => {
			setPortData(getNameArrayFromObjectArray(results));
		});
		dataService?.getPartNumbers().then((results) => {
			setPartNumberData(getNameArrayFromObjectArray(results));
		});
		dataService?.getRecords().then((records) => {
			if (records) {
				setRecordData(
					records.map((record) => {
						return {
							value: `${record.silicon}%${record.brand}%${record.model}%${record.memory}%${record.formFactor}%${record.ports}%${record.partNumbers}`,
							label: `${record.brand}-${record.model}-${record.memory}-${record.formFactor}-${record.ports}-${record.partNumbers}`,
							group: record.silicon,
						};
					})
				);
			}
		});
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

	function createNewPartNumberData(newNumber: string) {
		const item = { value: newNumber, label: newNumber };
		//add to db
		dataService?.addPartNumber({ name: newNumber });
		setPartNumberData((current) => [...current, item]);
		return item;
	}

	function createNewModel(newModel: string) {
		const model = dataService?.parseModelFromString(newModel);
		if (model) {
			//upate to db
			dataService?.addModel(model);
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
			defect: [],
			date: new Date(),
			state: stockSelfStateGood,
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
			state: isNotEmpty("required"),
			status: isNotEmpty("required"),
		},
	});

	function changeSiliconChangeModelData(silicon: string) {
		form.setFieldValue("model", "");
		form.setFieldValue("silicon", silicon);
	}

	const portsFields = form.values.ports.map(
		(item: { type: string; active: boolean; key: string }, index) => (
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
		)
	);

	function parsePortsStringToObjectArray(string: string) {
		const portsObjectArray: any[] = [];
		if (string) {
			const ports = string.split(",");
			ports.map((port) => {
				const parePort = port.split("x");
				if (parePort.length === 2) {
					let n = 0;
					while (n < parseInt(parePort[0].trim())) {
						portsObjectArray.push({
							type: parePort[1].trim(),
							active: true,
							key: randomId(),
						});
						n++;
					}
				} else {
					portsObjectArray.push({
						type: parePort[0].trim(),
						active: true,
						key: randomId(),
					});
				}
			});
		}
		return portsObjectArray;
	}

	function setValueByTemplate(templateString: string) {
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
		//check form data
		const modelFromDatabase = await dataService?.getModelByName(
			form.values.model
		);
		if (!modelFromDatabase) {
			form.setFieldError("model", "Can not find model");
			return;
		}
		if (modelFromDatabase.silicon !== form.values.silicon) {
			form.setFieldError("model", "This model does not belong current silicon");
			return;
		}

		if (form.isValid()) {
			dataService
				?.stockSaveFromAdd(form.values)
				.then((newId) =>
					handleNotification(
						`${form.values.silicon}: ${form.values.model}, saved.`,
						`Saved successfully, id is ${newId}.`
					)
				);
		}
	}

	const lastThreeData = useLiveQuery(() => {
		return dataService?.getLastThreeStocks();
	}, []);

	const lastThreeStocks = lastThreeData?.map((stock: Stock, index) => (
		<List.Item key={stock.id}>
			{stock.id}-{stock.brand}-{stock.model}-{stock.memory}-{stock.formFactor}-
			{stock.ports}-{stock.partNumbers}
		</List.Item>
	));

	return (
		<form
			onSubmit={form.onSubmit(() => {
				save();
			})}
		>
			<Grid grow>
				<Grid.Col span={12} className={classes.wrapper}>
					<List className={classes.text}>{lastThreeStocks}</List>
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
						valueFormat="M/D/YYYY"
						{...form.getInputProps("date")}
					/>
				</Grid.Col>
				<Grid.Col span={6}>
					<Grid>
						<Grid.Col span={6}>
							{form.errors.state ? (
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
								{...form.getInputProps("state")}
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
						<Button variant="outline" onClick={() => form.reset()}>
							Reset to initial values
						</Button>
					</Group>
				</Grid.Col>
			</Grid>
			{notification.open && (
				<Affix position={{ bottom: rem(20), right: rem(20) }}>
					<Notification
						onClose={() =>
							setNotification({
								open: false,
								message: "",
								title: "",
								color: "blue",
							})
						}
						color={notification.color}
						withCloseButton
						title={notification.title}
					>
						{notification.message}
					</Notification>
				</Affix>
			)}
		</form>
	);
}

export default Add;
