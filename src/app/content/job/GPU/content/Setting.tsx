import { useContext, useState } from "react";

import { Button, createStyles, Grid, Text, Title } from "@mantine/core";

import { dataServiceContext } from "../database/DataserviceContext";
import GPUDefaultData from "../database/DefaultData";
import ModelConfig from "./ModelConfig";
import NameConfig from "./NameConfig";

//todo
const useStyles = createStyles((theme) => ({
	wrapper: {
		backgroundImage: `linear-gradient(-60deg, ${
			theme.colors[theme.primaryColor][4]
		} 0%, ${theme.colors[theme.primaryColor][7]} 100%)`,
		padding: theme.spacing.xl * 2.5,

		[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
			padding: theme.spacing.xl * 1.5,
		},
		marginBottom: 10,
	},

	title: {
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		color: theme.white,
		lineHeight: 1,
	},

	description: {
		color: theme.colors[theme.primaryColor][0],

		[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
			maxWidth: "100%",
		},
	},
}));

const configTableMap = [
	"silicon",
	"makerBrand",
	"model",
	"memorySize",
	"formFactor",
	"port",
	"partNumber",
];

const configListMap = [
	{ table: "silicon", label: "Silicon", hasDepend: false, span: 6 },
	{ table: "formFactor", label: "Form", hasDepend: false, span: 6 },
	{ table: "makerBrand", label: "Brand", hasDepend: false, span: 6 },
	{ table: "memorySize", label: "Memory", hasDepend: false, span: 6 },
	{ table: "memoryType", label: "Memory Type", hasDepend: false, span: 6 },
	{ table: "port", label: "Port", hasDepend: false, span: 6 },
	{ table: "location", label: "Location", hasDepend: false, span: 6 },
	{ table: "compatibleSlot", label: "C Slot", hasDepend: false, span: 6 },
	{ table: "partNumber", label: "Part #", hasDepend: false, span: 6 },
	{
		table: "model",
		label: "Model",
		hasDepend: true,
		depend: "silicon",
		span: 12,
	},
];

function Setting() {
	const { classes } = useStyles();
	const [hasDefault, setHasDefault] = useState(false);
	const dataService = useContext(dataServiceContext);

	//change model table data.
	function setDefaultData() {
		clearAllSetting();
		const data = GPUDefaultData();
		console.log(data);
		for (const key in data) {
			if (Object.hasOwnProperty.call(data, key)) {
				dataService?.bulkAdd(key, data[key]);
			}
		}
		setHasDefault(true);
	}

	function clearAllSetting() {
		configTableMap.map((table) => {
			dataService?.clearTable(table);
		});
		setHasDefault(false);
	}

	function clearAll() {
		dataService?.clearAll();
		setHasDefault(false);
	}

	return (
		<>
			<div className={classes.wrapper}>
				<div>
					<Title className={classes.title}>Setting of auto complete</Title>
					<Text className={classes.description} mt="sm"></Text>
				</div>
				<div className="">
					<Button.Group>
						{hasDefault ? (
							<Button onClick={setDefaultData} disabled color="indigo">
								Set Default Data
							</Button>
						) : (
							<Button onClick={setDefaultData} color="indigo">
								Set Default Data
							</Button>
						)}
						<Button onClick={clearAllSetting} color="dark">
							Clear All Setting Data
						</Button>
						<Button onClick={clearAll} color="red">
							Clear All Data
						</Button>
					</Button.Group>
				</div>
			</div>
			<Grid>
				{configListMap.map((config) => (
					<Grid.Col span={config.span} key={config.label}>
						{config.hasDepend ? (
							<ModelConfig
								tableName={config.table}
								label={config.label}
								dependTableName={config.depend}
							/>
						) : (
							<NameConfig tableName={config.table} label={config.label} />
						)}
					</Grid.Col>
				))}
			</Grid>
		</>
	);
}

export default Setting;
