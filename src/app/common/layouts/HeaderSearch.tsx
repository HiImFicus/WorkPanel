import {
	ActionIcon,
	Autocomplete,
	Burger,
	createStyles,
	Group,
	Header,
	useMantineColorScheme,
} from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
	header: {
		paddingLeft: theme.spacing.md,
		paddingRight: theme.spacing.md,
	},

	inner: {
		height: 56,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},

	links: {
		[theme.fn.smallerThan("md")]: {
			display: "none",
		},
	},

	search: {
		[theme.fn.smallerThan("xs")]: {
			display: "none",
		},
	},

	link: {
		display: "block",
		lineHeight: 1,
		padding: "8px 12px",
		borderRadius: theme.radius.sm,
		textDecoration: "none",
		color:
			theme.colorScheme === "dark"
				? theme.colors.dark[0]
				: theme.colors.gray[7],
		fontSize: theme.fontSizes.sm,
		fontWeight: 500,

		"&:hover": {
			backgroundColor:
				theme.colorScheme === "dark"
					? theme.colors.dark[6]
					: theme.colors.gray[0],
		},
	},
}));

interface HeaderSearchProps {
	links: { link: string; label: string }[];
	navbarState: boolean;
	navbarToggle: () => void;
}

export function HeaderSearch({
	links,
	navbarState,
	navbarToggle,
}: HeaderSearchProps) {
	const { classes } = useStyles();
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const dark = colorScheme === "dark";

	const items = links.map((link) => (
		<a
			key={link.label}
			href={link.link}
			className={classes.link}
			onClick={(event) => event.preventDefault()}
		>
			{link.label}
		</a>
	));

	return (
		<Header height={56} className={classes.header} mb={10}>
			<div className={classes.inner}>
				<Group>
					<Burger opened={navbarState} onClick={navbarToggle} size="sm" />
					<ActionIcon
						variant="outline"
						color={dark ? "yellow" : "blue"}
						onClick={() => toggleColorScheme()}
						title="Toggle color scheme"
					>
						{dark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
					</ActionIcon>
				</Group>

				<Group>
					<Group ml={50} spacing={5} className={classes.links}>
						{items}
					</Group>
					<Autocomplete
						className={classes.search}
						placeholder="Search"
						data={[
							"React",
							"Angular",
							"Vue",
							"Next.js",
							"Riot.js",
							"Svelte",
							"Blitz.js",
						]}
					/>
				</Group>
			</div>
		</Header>
	);
}

export default HeaderSearch;
