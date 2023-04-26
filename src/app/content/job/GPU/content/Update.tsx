import { useLiveQuery } from "dexie-react-hooks";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
	ActionIcon,
	Affix,
	Avatar,
	Box,
	Button,
	Grid,
	Group,
	LoadingOverlay,
	MultiSelect,
	Notification,
	NumberInput,
	Popover,
	rem,
	SegmentedControl,
	Select,
	SimpleGrid,
	Switch,
	Text,
	TextInput,
	Image
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { randomId, useDisclosure } from "@mantine/hooks";
import { IconPhotoSearch, IconTrash } from "@tabler/icons-react";

import {
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

export default function Update() {
	const { id } = useParams();

	if (!id) {
		throwNotFound();
	}

	function validateID(params: { id: string | undefined }) {
		const id = Number(params.id);
		return isNaN(id);
	}

	if (validateID({ id })) {
		throwNotFound();
	}

	function throwNotFound() {
		const error = new Error("Not Found");
		error.name = "404 Not Found";
		throw error;
	}

	const [visible, setVisible] = useState(true);

	const dataService = useContext(dataServiceContext);

	const form = useForm({
		initialValues: {
			silicon: "",
			brand: "",
			model: "",
			memory: "",
			memoryType: "",
			compatibleSlot: "",
			formFactor: "",
			defect: [],
			date: new Date(),
			state: "",
			status: "",
			ports: [],
			partNumbers: [],
			location: "",
			picUrl: "",
			price: 0,
		},
		validate: {
			silicon: isNotEmpty("required"),
			brand: isNotEmpty("required"),
			model: isNotEmpty("required"),
			memory: isNotEmpty("required"),
			memoryType: isNotEmpty("required"),
			compatibleSlot: isNotEmpty("required"),
			formFactor: isNotEmpty("required"),
			date: isNotEmpty("required"),
			state: isNotEmpty("required"),
			status: isNotEmpty("required"),
		},
	});

	function parsePortsStringToObjectArray(string: string): any[] {
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

	const stock = useLiveQuery(() =>
		dataService?.getStocksById(Number(id)).then((result) => {
			if (!result) {
				throwNotFound();
			}

			form.setValues(result);
			if (typeof result.defect === "string") {
				form.setFieldValue("defect", result.defect.split(","));
			}
			form.setFieldValue("date", new Date(result.date));
			form.setFieldValue("state", result.state);
			form.setFieldValue("status", result.status);

			if (typeof result.ports === "string") {
				form.setFieldValue(
					"ports",
					parsePortsStringToObjectArray(result.ports)
				);
			}

			if (typeof result.partNumbers === "string") {
				form.setFieldValue("partNumbers", result.partNumbers.split(","));
			}

			form.setFieldValue("price", Number(result.price));
			setImgUrl(result.picUrl)


			setVisible(false);
			return result;
		})
	);

	const [defectData, setDefectData] = useState(stockDefectMap);

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
	const [locationData, setLocationData] = useState<
		{ value: string; label: string }[]
	>([]);

	const [memoryTypeData, setMemoryTypeData] = useState<
		{ value: string; label: string }[]
	>([]);

	const [compatibleSlotData, setCompatibleSlotData] = useState<
		{ value: string; label: string }[]
	>([]);

	const [imgOpened, { close, open }] = useDisclosure(false);
	const [imgUrl, setImgUrl] = useState("")

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
		dataService?.getLocations().then((results) => {
			setLocationData(getNameArrayFromObjectArray(results));
		});
		dataService?.getMemoryTypes().then((results) => {
			setMemoryTypeData(getNameArrayFromObjectArray(results));
		});
		dataService?.getCompatibleSlots().then((results) => {
			setCompatibleSlotData(getNameArrayFromObjectArray(results));
		});
		return () => {
			setSiliconData([]);
			setBrandData([]);
			setModelData([]);
			setMemoryData([]);
			setFormFactorData([]);
			setPortData([]);
			setPartNumberData([]);
			setLocationData([]);
			setMemoryTypeData([]);
			setCompatibleSlotData([]);
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
		const silicon = form.values.silicon;
		if (!silicon) {
			form.setFieldError("silicon", "Silion can not be blank.");
			return
		}

		if (newModel) {
			//upate to db
			dataService?.addModel({ name: newModel, silicon: silicon });
			const item = {
				value: newModel,
				label: newModel,
				group: silicon,
			};
			setModelData((current) => [...current, item]);
			return item;
		}
	}

	function changeSiliconChangeModelData(silicon: string) {
		form.setFieldValue("model", "");
		form.setFieldValue("silicon", silicon);
	}

	const portsFields = form.values.ports?.map(
		(item: { type: string; active: boolean; key: string }, index: number) => (
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
					{...form.getInputProps(`ports.${index}.active`, {
						type: "checkbox",
					})}
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
			const newData = {...form.values}
			if (form.values.location === null) {
				newData.location = ""	
			}
			dataService?.updateStock(stock?.id, newData).then((updated) => {
				if (updated) {
					handleNotification(
						`${form.values.silicon}: ${form.values.model}, saved.`,
						`Update successfully.`
					);
				}
			});
		}
	}

	return (
		<Box pos="relative">
			<LoadingOverlay visible={visible} overlayBlur={2} />
			<form
				onSubmit={form.onSubmit(() => {
					save();
				})}
			>
				<Grid grow>
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
								`+ Create ${query}, Format: Model Code`
							}
							onCreate={createNewModel}
						/>
					</Grid.Col>
					<Grid.Col span={3}>
						<Select
							label="MEMORY"
							placeholder="Pick one"
							data={memoryData}
							{...form.getInputProps("memory")}
							clearable
							searchable
						/>
					</Grid.Col>
					<Grid.Col span={3}>
						<Select
							label="MEMORY TYPE"
							placeholder="Pick one"
							data={memoryTypeData}
							{...form.getInputProps("memoryType")}
							clearable
							searchable
						/>
					</Grid.Col>
					<Grid.Col span={3}>
						<Select
							label="COMPATIBLE SLOT"
							placeholder="Pick one"
							data={compatibleSlotData}
							{...form.getInputProps("compatibleSlot")}
							clearable
							searchable
						/>
					</Grid.Col>
					<Grid.Col span={3}>
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

					<Grid.Col span={6}>
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

					<Grid.Col span={6}>
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
					<Grid.Col span={3}>
						<Select
							label="Location"
							placeholder="Pick one"
							data={locationData}
							{...form.getInputProps("location")}
							clearable
							searchable
						/>
					</Grid.Col>
					<Grid.Col span={6}>
						<TextInput
						label="PIC URL"
						placeholder="Pick one"
						{...form.getInputProps("picUrl")}
						onChange={(event) => {
							setImgUrl(event.currentTarget.value);
							form.setFieldValue('picUrl', event.currentTarget.value)
						}}
						rightSection={
							<Popover position="bottom" withArrow shadow="md" opened={imgOpened}>
								<Popover.Target>
								<div onMouseEnter={open} onMouseLeave={close}>
									<IconPhotoSearch size="1rem" style={{ display: 'block', opacity: 0.5 }} />
								</div>
								</Popover.Target>
								<Popover.Dropdown>
								<Image
									radius="md"
									fit="contain"
									width={500} height={500}
									src={imgUrl}
      							/>
								</Popover.Dropdown>
						  </Popover>
						  }
					/>
					</Grid.Col>
					<Grid.Col span={3}>
						<NumberInput
							label="PRICE"
							step={0.01}
							precision={2}
							{...form.getInputProps("price")}
						/>
					</Grid.Col>

					<Grid.Col span={12}>
						<Avatar color="cyan" radius="xl">
							{stock?.id}
						</Avatar>
						<Group position="center" mt="xl">
							<Button type="submit" size="md">
								Update
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
		</Box>
	);
}
