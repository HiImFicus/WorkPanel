import { useMemo, useState } from "react";
import {
	Column,
	TableInstance,
	TableState,
	usePagination,
	useSortBy,
	useTable,
} from "react-table";

import {
	Group,
	NumberInput,
	Pagination,
	ScrollArea,
	Table,
} from "@mantine/core";
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
	const [currentPage, setCurrentPage] = useState(0);

	const columns: Column<any>[] = useMemo(() => column, []);
	const defaultPageSize = 10;

	const tableInstance: TableInstance = useTable(
		{
			columns,
			data: data ?? [],
			initialState: {
				pageIndex: currentPage,
				pageSize: defaultPageSize,
				sortBy: [],
				filters: [],
				hiddenColumns: [],
				expanded: {},
				selectedRowIds: {},
			} as Partial<TableState<object>>,
		},
		useSortBy,
		usePagination
	);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		page,
		prepareRow,
		nextPage,
		previousPage,
		pageCount,
		gotoPage,
		setPageSize,
	} = tableInstance;

	// tableInstance.state.pageIndex = 10;
	const onPageChange = (page: number) => {
		gotoPage(page);
		setCurrentPage(page);
	};
	const onNextBoth = () => {
		setCurrentPage(currentPage + 1);
		nextPage();
	};

	const onPreviousBoth = () => {
		setCurrentPage(currentPage - 1);
		previousPage();
	};

	return (
		<ScrollArea
			h="100vh"
			onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
		>
			<Table {...getTableProps()} miw={700}>
				<thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<th {...column.getHeaderProps(column.getSortByToggleProps())}>
									{column.render("Header")}
									<span>
										{column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
									</span>
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{page.map((row: any) => {
						prepareRow(row);
						return (
							<tr {...row.getRowProps()}>
								{row.cells.map((cell: any) => {
									return (
										<td {...cell.getCellProps()}>{cell.render("Cell")}</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</Table>
			<Pagination.Root
				total={pageCount}
				onFirstPage={() => onPageChange(0)}
				onLastPage={() => onPageChange(pageCount - 1)}
				onNextPage={() => onNextBoth()}
				onPreviousPage={() => onPreviousBoth()}
				onChange={(page: number) => onPageChange(page - 1)}
				value={currentPage + 1}
				siblings={3}
			>
				<Group spacing={5} position="center">
					<NumberInput
						defaultValue={defaultPageSize}
						placeholder="Pagesize"
						max={100}
						min={10}
						onChange={(pageSize: number) => {
							if (pageSize >= 10 && pageSize <= 100) {
								setPageSize(pageSize);
							}
						}}
					/>
					<Pagination.First />
					<Pagination.Previous />
					<Pagination.Items />
					<Pagination.Next />
					<Pagination.Last />
				</Group>
			</Pagination.Root>
		</ScrollArea>
	);
}
