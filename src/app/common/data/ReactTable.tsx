// import "react-table/react-table.css";

import { useMemo, useState } from "react";
import { Column, usePagination, useTable } from "react-table";

import { ScrollArea, Table } from "@mantine/core";
import { createStyles, rem } from "@mantine/styles";

const useStyles = createStyles((theme) => ({
	header: {
		position: "sticky",
		top: 0,
		backgroundColor:
			theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
		transition: "box-shadow 150ms ease",

		"&::after": {
			content: '""',
			position: "absolute",
			left: 0,
			right: 0,
			bottom: 0,
			borderBottom: `${rem(1)} solid ${
				theme.colorScheme === "dark"
					? theme.colors.dark[3]
					: theme.colors.gray[2]
			}`,
		},
	},

	scrolled: {
		boxShadow: theme.shadows.sm,
	},
}));

interface ReactTableProps {
	data: any[];
	column: { Header: string; accessor: string }[];
}

export function ReactTable({ data, column }: ReactTableProps) {
	const { classes, cx } = useStyles();
	const [scrolled, setScrolled] = useState(false);

	const columns: Column<any>[] = useMemo(() => column, []);
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		page,
		nextPage,
		previousPage,
		canNextPage,
		canPreviousPage,
		pageOptions,
		state,
		prepareRow,
	} = useTable(
		{ columns, data: data ?? [], initialState: { pageIndex: 0, pageSize: 10 } },
		usePagination
	);
	const { pageIndex } = state;

	return (
		<ScrollArea
			h={300}
			onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
		>
			<Table {...getTableProps()} miw={700}>
				<thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<th {...column.getHeaderProps()}>{column.render("Header")}</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{page.map((row) => {
						prepareRow(row);
						return (
							<tr {...row.getRowProps()}>
								{row.cells.map((cell) => {
									return (
										<td {...cell.getCellProps()}>{cell.render("Cell")}</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</Table>
			<div>
				<button onClick={() => previousPage()} disabled={!canPreviousPage}>
					Previous
				</button>
				<span>
					Page{" "}
					<strong>
						{pageIndex + 1} of {pageOptions.length}
					</strong>{" "}
				</span>
				<button onClick={() => nextPage()} disabled={!canNextPage}>
					Next
				</button>
			</div>
		</ScrollArea>
	);
}
