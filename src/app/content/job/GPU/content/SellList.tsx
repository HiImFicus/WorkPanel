import { useLiveQuery } from "dexie-react-hooks";
import React, { useContext } from "react";

import { Accordion, Badge, Flex, Table } from "@mantine/core";

import { Stock } from "../database/Database";
import { dataServiceContext } from "../database/DataserviceContext";

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

	const dataService = useContext(dataServiceContext);
	const stocks = useLiveQuery(() =>
		dataService?.getStocks().then((stocks) => organizeData(stocks))
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

	// GPU: 0,
	// working: 0,
	// broken: 0,
	// inStock: 0,
	// standby: 0,
	// defect: 0,
	// out: 0,

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
				<tr>
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
											<table>
												<thead>
													<tr>
														<th>Id</th>
														<th>Slicon</th>
														<th>brand</th>
														<th>memory</th>
														<th>formFactor</th>
														<th>ports</th>
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
															<td>{stock.brand}</td>
															<td>{stock.memory}</td>
															<td>{stock.formFactor}</td>
															<td>{stock.ports}</td>
															<td>{stock.state}</td>
															<td>{stock.status}</td>
															<td>{stock.defect}</td>
															<td>{stock.date}</td>
														</tr>
													))}
												</tbody>
											</table>
										</Accordion.Panel>
									</Accordion.Item>
								);
							})}
						</Accordion>
					</td>
				</tr>
			)}
		</React.Fragment>
	));

	return (
		<Table striped highlightOnHover withColumnBorders>
			<thead>
				<tr>
					<th>model</th>
					<th>partNumbersCount</th>
					<th>total</th>
					<th>working</th>
					<th>broken</th>
					<th>inStock</th>
					<th>standby</th>
					<th>defect</th>
					<th>out</th>
				</tr>
			</thead>
			<tbody>{rows}</tbody>
		</Table>
	);
};

export default SellList;
