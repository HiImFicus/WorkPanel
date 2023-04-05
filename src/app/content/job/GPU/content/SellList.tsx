import { useLiveQuery } from "dexie-react-hooks";
import React, { useContext } from "react";

import {
	Accordion,
	Badge,
	createStyles,
	Flex,
	rem,
	Table,
	Text,
} from "@mantine/core";

import { Stock } from "../database/Database";
import { dataServiceContext } from "../database/DataserviceContext";

const useStyles = createStyles((theme) => ({
	header: {
		position: "sticky",
		top: 0,
		backgroundColor:
			theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
		boxShadow: theme.shadows.sm,

		"&::after": {
			content: '""',
			position: "absolute",
			borderBottom: `${rem(1)} solid ${
				theme.colorScheme === "dark"
					? theme.colors.dark[3]
					: theme.colors.gray[2]
			}`,
		},
	},
}));

interface eBayList {
	Action: string;
	CustomLabel: string;
	Category: 27386;
	StoreCategory: 39280041014;
	title: string;
	Subtitle: string | null;
	Relationship: string | null;
	RelationshipDetails: string | null;
	ConditionID: 2500;
	ConditionDescription: "Tested 100% Performance, and 100% Working for All Display Ports, Ready for Resale";
	Brand: string;
	ChipsetManufacturer: string;
	ChipsetGPUModel: string;
	MemorySize: string;
	MemoryType: string;
	CompatibleSlot: string;
	Connectors: string;
	PowerCableRequirement: string | null;
	Features: "Multiple Monitor Support";
	MPN: string;
	APIs: string | null;
	CoolingComponentIncluded: string | null;
	CountryRegionofManufacture: string | null;
	CaliforniaProp65Warning: string | null;
	ItemHeight: string | null;
	ItemLength: string | null;
	ItemWidth: string | null;
	ManufacturerWarranty: string | null;
	PicURL: string;
	GalleryType: string | null;
	Description: string;
	Format: "FixedPrice";
	Duration: "GTC";
	StartPrice: string;
	BuyItNowPrice: string | null;
	Quantity: number;
	PayPalAccepted: 1;
}

const SellList = () => {
	function organizeData(stocks: Stock[]) {
		const data = [];

		// Group by model
		const groupedByModel = stocks.reduce((acc, curr) => {
			const { model, partNumbers, state, status, defect } = curr;
			if (!acc[model]) {
				acc[model] = {
					model: model,
					partNumbers: [],
					partNumbersCount: 0,
					GPU: 0,
					working: 0,
					broken: 0,
					inStock: 0,
					standby: 0,
					defect: 0,
					out: 0,
				};
			}

			const modelData = acc[model];
			modelData.GPU++;
			if (state === "working") {
				modelData.working++;
			} else if (state === "broken") {
				modelData.broken++;
			}

			if (status === "in" && state === "working") {
				modelData.inStock++;
			}

			if (status === "in" && state === "working" && defect === "") {
				modelData.standby++;
			}

			if (defect !== "") {
				modelData.defect++;
			}
			if (status === "out" && state === "working") {
				modelData.out++;
			}
			// Group by part number
			const partNumberObj = modelData.partNumbers.find(
				(p: any) => p.partNumber === partNumbers
			);
			if (!partNumberObj) {
				modelData.partNumbers.push({
					partNumber: partNumbers,
					stocks: [],
					GPU: 0,
					working: 0,
					broken: 0,
					inStock: 0,
					standby: 0,
					defect: 0,
					out: 0,
				});
				modelData.partNumbersCount++;
			}

			const partNumberData = modelData.partNumbers.find(
				(p: any) => p.partNumber === partNumbers
			);
			partNumberData.stocks.push(curr);
			partNumberData.GPU++;
			if (state === "working") {
				partNumberData.working++;
			} else if (state === "broken") {
				partNumberData.broken++;
			}

			if (status === "in" && state === "working") {
				partNumberData.inStock++;
			}

			if (status === "in" && state === "working" && defect === "") {
				partNumberData.standby++;
			}

			if (defect !== "") {
				partNumberData.defect++;
			}
			if (status === "out" && state === "working") {
				partNumberData.out++;
			}

			return acc;
		}, {});

		// Convert to array
		for (const modelData of Object.values(groupedByModel)) {
			data.push(modelData);
		}

		return data;
	}
	const { classes } = useStyles();

	const dataService = useContext(dataServiceContext);
	const stocks = useLiveQuery(() =>
		dataService
			?.getStocksOrderBy("model")
			.then((stocks) => organizeData(stocks))
	);

	const columns = React.useMemo(
		() => [
			{
				Header: "Model",
				accessor: "model",
			},
			{
				Header: "Part Numbers",
				columns: [
					{
						Header: "Part #",
						accessor: "partNumber",
					},
					{
						Header: "Stocks",
						accessor: "stocks",
						Cell: ({ row }) => (
							<div {...row.getToggleRowExpandedProps()}>
								{row.isExpanded ? "👇" : "👉"}
							</div>
						),
					},
					{
						Header: "GPU",
						accessor: "partGPU",
					},
					{
						Header: "working",
						accessor: "partWorking",
					},
					{
						Header: "broken",
						accessor: "partBroken",
					},
					{
						Header: "inStock",
						accessor: "partInStock",
					},
					{
						Header: "standby",
						accessor: "partStandby",
					},
					{
						Header: "defect",
						accessor: "partDefect",
					},
					{
						Header: "out",
						accessor: "partOut",
					},
				],
			},
			{
				Header: "Part # Count",
				accessor: "partNumbersCount",
			},
			{
				Header: "GPU",
				accessor: "GPU",
			},
			{
				Header: "working",
				accessor: "working",
			},
			{
				Header: "broken",
				accessor: "broken",
			},
			{
				Header: "inStock",
				accessor: "inStock",
			},
			{
				Header: "standby",
				accessor: "standby",
			},
			{
				Header: "defect",
				accessor: "defect",
			},
			{
				Header: "out",
				accessor: "out",
			},
		],
		[]
	);

	const rows = stocks?.map((element: any) => (
		<React.Fragment key={element.model}>
			<tr>
				<td>{element.model}</td>
				<td>{element.partNumbersCount}</td>
				<td>{element.GPU}</td>
				<td>{element.working}</td>
				<td>{element.broken}</td>
				<td>{element.inStock}</td>
				<td>{element.standby}</td>
				<td>{element.defect}</td>
				<td>{element.out}</td>
			</tr>
			{element.partNumbers && (
				<tr style={{ textAlign: "center" }}>
					<td colSpan={9}>
						<Accordion defaultValue={element.partNumbers[0].partNumber}>
							{element.partNumbers.map((part: any) => {
								return (
									<Accordion.Item
										value={part.partNumber + element.model}
										key={part.partNumber}
									>
										<Accordion.Control>
											<Flex
												gap="md"
												justify="space-between"
												align="center"
												direction="row"
											>
												<Badge variant="filled">{part.partNumber}</Badge>
												<Badge color="green">{`total: ${part.GPU}`}</Badge>
												<Badge color="orange">{`working: ${part.working}`}</Badge>
												<Badge color="red">{`broken: ${part.broken}`}</Badge>
												<Badge
													color="grape"
													variant="outline"
												>{`inStock: ${part.inStock}`}</Badge>
												<Badge color="cyan" variant="filled">
													{`standby: ${part.standby}`}
												</Badge>
												<Badge color="dark">{`defect: ${part.defect}`}</Badge>
												<Badge color="gray">{`out: ${part.out}`}</Badge>
											</Flex>
										</Accordion.Control>
										<Accordion.Panel>
											<Table>
												<thead>
													<tr>
														<th>Id</th>
														<th>Silicon</th>
														<th>model</th>
														<th>brand</th>
														<th>memory</th>
														<th>formFactor</th>
														<th>ports</th>
														<th>part #</th>
														<th>state</th>
														<th>status</th>
														<th>defect</th>
														<th>date</th>
													</tr>
												</thead>
												<tbody>
													{part.stocks.map((stock: any) => (
														<tr key={stock.id}>
															<td>{stock.id}</td>
															<td>{stock.silicon}</td>
															<td>{stock.model}</td>
															<td>{stock.brand}</td>
															<td>{stock.memory}</td>
															<td>{stock.formFactor}</td>
															<td>{stock.ports}</td>
															<td>{stock.partNumbers}</td>
															<td>{stock.state}</td>
															<td>
																{stock.status === "in" ? (
																	<Badge color="green" variant="filled">
																		<Text tt="uppercase">{stock.status}</Text>
																	</Badge>
																) : (
																	<Badge color="pink" variant="filled">
																		<Text tt="uppercase">{stock.status}</Text>
																	</Badge>
																)}
															</td>
															<td>{stock.defect}</td>
															<td>{stock.date}</td>
														</tr>
													))}
												</tbody>
											</Table>
										</Accordion.Panel>
									</Accordion.Item>
								);
							})}
						</Accordion>
					</td>
				</tr>
			)}
			<tr>
				<td colSpan={9}></td>
			</tr>
		</React.Fragment>
	));

	const report = {
		partNumberCount: 0,
	};
	// console.log(stocks);
	stocks?.map((item: any) => {
		report.partNumberCount += item.partNumbersCount;
	});

	console.log(report);

	return (
		<Table striped highlightOnHover withColumnBorders>
			<thead className={classes.header}>
				<tr>
					<th>Model</th>
					<th>Part # Qty</th>
					<th>Total</th>
					<th>Working</th>
					<th>Broken</th>
					<th>InStock</th>
					<th>Standby</th>
					<th>Defect</th>
					<th>Out</th>
				</tr>
			</thead>
			<tbody>{rows}</tbody>
		</Table>
	);
};

export default SellList;
